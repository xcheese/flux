#!/usr/bin/env python3
"""Scoped, reversible personal Codex configuration sync. Python 3.11+; offline."""

import argparse
import copy
from datetime import datetime
import fcntl
import hashlib
import json
import os
from pathlib import Path
import re
import tempfile
import tomllib
import uuid

SKILLS = ("coding-guardrails", "diagnosing-bugs", "code-review", "tdd", "long-goal-execution")
DUPLICATES = (
    "embedded-captions", "faceless-explainer", "figma", "general-video", "hyperframes",
    "hyperframes-animation", "hyperframes-cli", "hyperframes-core", "hyperframes-creative",
    "hyperframes-keyframes", "hyperframes-registry", "media-use", "motion-graphics",
    "music-to-video", "pr-to-video", "product-launch-video", "remotion-to-hyperframes",
    "slideshow", "talking-head-recut", "website-to-video",
)
ABSENT = {"present": False}


class SyncError(Exception):
    pass


def slot(value):
    return {"present": True, "value": copy.deepcopy(value)}


def digest(data):
    return hashlib.sha256(data).hexdigest()


def read_file(path):
    if path.is_symlink():
        raise SyncError(f"Refusing symlink: {path}")
    if not path.exists():
        return None
    if not path.is_file():
        raise SyncError(f"Expected regular file: {path}")
    return {"data": path.read_bytes(), "mode": path.stat().st_mode & 0o777}


def signature(record):
    return None if record is None else {"sha256": digest(record["data"]), "mode": record["mode"]}


def atomic_write(path, data, mode=0o600):
    path.parent.mkdir(parents=True, exist_ok=True)
    if path.is_symlink():
        raise SyncError(f"Refusing symlink: {path}")
    fd, name = tempfile.mkstemp(prefix=".codex-sync-", dir=path.parent)
    try:
        with os.fdopen(fd, "wb") as stream:
            os.fchmod(stream.fileno(), mode)
            stream.write(data)
            stream.flush()
            os.fsync(stream.fileno())
        os.replace(name, path)
    finally:
        if os.path.exists(name):
            os.unlink(name)


def write_json(path, data):
    atomic_write(path, (json.dumps(data, ensure_ascii=False, indent=2) + "\n").encode())


def parse_toml(text):
    try:
        return tomllib.loads(text)
    except tomllib.TOMLDecodeError:
        raise SyncError("Invalid or unsupported TOML layout; configuration was not written.") from None


def config_slots(data, paths):
    values = {}
    for label, table, key in (
        ("approvals_reviewer", data, "approvals_reviewer"),
        ("features.js_repl", data.get("features", {}), "js_repl"),
    ):
        values[label] = slot(table[key]) if key in table else ABSENT.copy()
    entries = data.get("skills", {}).get("config", [])
    for path in paths:
        found = [entry for entry in entries if entry.get("path") == path]
        if len(found) > 1:
            raise SyncError(f"Multiple configuration entries for skill: {path}")
        values["skill:" + path] = slot(found[0]) if found else ABSENT.copy()
    return values


def set_scalar(block, key, value):
    pattern = re.compile(r"(?m)^[ \t]*" + re.escape(key) + r"[ \t]*=[^\n]*(?:\n|$)")
    matches = list(pattern.finditer(block))
    if len(matches) > 1:
        raise SyncError(f"Ambiguous TOML key layout: {key}")
    if not value["present"]:
        return pattern.sub("", block)
    item = value["value"]
    if not isinstance(item, (str, bool)):
        raise SyncError(f"Unsupported managed scalar type: {key}")
    comment = ""
    if matches and "#" in matches[0].group():
        comment = " #" + matches[0].group().split("#", 1)[1].rstrip()
    line = f"{key} = {json.dumps(item, ensure_ascii=False)}{comment}\n"
    if matches:
        return pattern.sub(lambda _: line, block)
    return block.rstrip("\n") + ("\n" if block else "") + line


def patch_config(text, requested):
    """Surgical edits, checked against the expected complete parsed document.

    Unusual inline/dotted/multiline encodings fail closed instead of rewriting
    the whole personal configuration with a lossy serializer.
    """
    expected = copy.deepcopy(parse_toml(text))
    blocks = re.split(r"(?m)(?=^[ \t]*\[[^\n]+\][ \t]*(?:#[^\n]*)?$)", text)

    def header(block):
        first = block.splitlines()[0] if block else ""
        return re.sub(r"\s+", "", first.split("#", 1)[0])

    for key, value in requested.items():
        if key == "approvals_reviewer":
            blocks[0] = set_scalar(blocks[0], key, value)
            if value["present"]:
                expected[key] = value["value"]
            else:
                expected.pop(key, None)
        elif key == "features.js_repl":
            indices = [i for i, block in enumerate(blocks) if header(block) == "[features]"]
            if not indices and value["present"]:
                blocks.append("[features]\n")
                indices = [len(blocks) - 1]
            if indices:
                blocks[indices[0]] = set_scalar(blocks[indices[0]], "js_repl", value)
            if value["present"]:
                expected.setdefault("features", {})["js_repl"] = value["value"]
            else:
                expected.get("features", {}).pop("js_repl", None)
        elif key.startswith("skill:"):
            path = key[6:]
            indices = []
            for i, block in enumerate(blocks):
                if header(block) == "[[skills.config]]":
                    entry = parse_toml(block)["skills"]["config"][0]
                    if entry.get("path") == path:
                        indices.append(i)
            if len(indices) > 1:
                raise SyncError(f"Multiple skill blocks: {path}")
            if not value["present"]:
                if indices:
                    blocks[indices[0]] = ""
            else:
                entry = value["value"]
                if indices:
                    i = indices[0]
                else:
                    blocks.append("[[skills.config]]\npath = " + json.dumps(path) + "\n")
                    i = len(blocks) - 1
                enabled = slot(entry["enabled"]) if "enabled" in entry else ABSENT
                blocks[i] = set_scalar(blocks[i], "enabled", enabled)
            old_entries = expected.get("skills", {}).get("config", [])
            entries, found = [], False
            for entry in old_entries:
                if entry.get("path") == path:
                    if value["present"]:
                        entries.append(copy.deepcopy(value["value"]))
                    found = True
                else:
                    entries.append(entry)
            if value["present"] and not found:
                entries.append(copy.deepcopy(value["value"]))
            if entries:
                expected.setdefault("skills", {})["config"] = entries
            elif "skills" in expected:
                expected["skills"].pop("config", None)
                if not expected["skills"]:
                    expected.pop("skills")
        else:
            raise SyncError(f"Unknown managed configuration key: {key}")
    result = "".join(block if block.endswith("\n") or not block else block + "\n" for block in blocks)
    actual = parse_toml(result)
    if actual.get("skills") == {} and "skills" not in expected:
        actual.pop("skills")
    if actual != expected:
        raise SyncError("TOML edit would change unrelated content or uses an unsupported layout; no write performed.")
    return result


class Synchronizer:
    def __init__(self, source, target, user_root, migrate_config=False):
        self.source = Path(source).resolve()
        self.target = Path(target).resolve()
        self.user_root = Path(user_root).resolve()
        self.migrate_config = migrate_config
        self.state_path = self.target / "global_codex_sync_state.json"
        self.backups = self.target / "backups/global_codex"
        self.paths = [str(self.user_root / ".claude/skills" / name / "SKILL.md") for name in DUPLICATES]

    def safe_path(self, relative):
        path = Path(relative)
        if path.is_absolute() or ".." in path.parts or not (
            relative == "AGENTS.md" or len(path.parts) >= 3 and path.parts[:2] in [("skills", name) for name in SKILLS]
        ):
            raise SyncError(f"Unmanaged path: {relative}")
        result = self.target / path
        for parent in [result, *result.parents]:
            if parent == self.target:
                break
            if parent.is_symlink():
                raise SyncError(f"Symlink in managed destination: {parent}")
        return result

    def managed_files(self, root, required=False):
        files = {}
        for name in ["AGENTS.md", *(f"skills/{skill}" for skill in SKILLS)]:
            path = root / name
            if path.is_symlink():
                raise SyncError(f"Managed source/destination must be physical: {path}")
            if path.exists() and (not path.is_file() if name == "AGENTS.md" else not path.is_dir()):
                raise SyncError(f"Invalid managed file/directory type: {path}")
            if required and (not path.exists() or path.is_dir() and not (path / "SKILL.md").is_file()):
                raise SyncError(f"Missing managed source: {path}")
            paths = sorted(path.rglob("*")) if path.is_dir() else [path]
            for child in paths:
                if child.is_symlink():
                    raise SyncError(f"Symlink inside managed skill: {child}")
                if child.is_file():
                    files[str(child.relative_to(root))] = read_file(child)
        return files

    def state(self):
        record = read_file(self.state_path)
        return json.loads(record["data"]) if record else None

    def unfinished_backups(self):
        pending = []
        paths = sorted(self.backups.glob("sync-*/manifest.json"),
                       key=lambda path: path.stat().st_mtime_ns, reverse=True)
        for path in paths:
            record = read_file(path)
            manifest = json.loads(record["data"])
            if manifest.get("target") == str(self.target) and manifest.get("status") == "prepared":
                pending.append(path.parent.name)
        return pending

    def duplicate_preflight(self, current, config):
        for name, path in zip(DUPLICATES, self.paths):
            kept = self.user_root / ".agents/skills" / name
            legacy = Path(path).parent
            if not (kept / "SKILL.md").is_file():
                raise SyncError(f"Retained skill is missing: {kept}")
            kept_entries = [entry for entry in config.get("skills", {}).get("config", [])
                            if entry.get("path") == str(kept / "SKILL.md")]
            if any(entry.get("enabled") is False for entry in kept_entries):
                raise SyncError(f"Retained skill is explicitly disabled: {kept}")
            value = current["skill:" + path]
            if value["present"] and value["value"].get("enabled") is False:
                continue
            def tree(folder):
                if not folder.is_dir():
                    raise SyncError(f"Duplicate skill directory is missing: {folder}")
                return {str(p.relative_to(folder)): digest(p.read_bytes()) for p in folder.rglob("*") if p.is_file()}
            if tree(kept) != tree(legacy):
                raise SyncError(f"Duplicate resources differ; inspect before first disabling: {name}")

    def plan(self):
        pending = self.unfinished_backups()
        if pending:
            raise SyncError("Unfinished sync batch: " + ", ".join(pending)
                            + "; --apply will attempt a protected rollback before retrying.")
        desired = self.managed_files(self.source, required=True)
        current = self.managed_files(self.target)
        state = self.state()
        prior = state["files"] if state else {}
        # Content sync does not read, validate or mutate personal configuration.
        # Preserve legacy tracking so a later explicit migration still detects edits.
        config_file, text = None, ""
        values = copy.deepcopy(state.get("config", {})) if state else {}
        wanted = copy.deepcopy(values)
        if self.migrate_config:
            config_file = read_file(self.target / "config.toml")
            text = config_file["data"].decode() if config_file else ""
            config = parse_toml(text)
            values = config_slots(config, self.paths)
            reviewer = values["approvals_reviewer"]
            if not reviewer["present"] or reviewer["value"] not in ("guardian_subagent", "auto_review"):
                raise SyncError("Automatic review was not already configured; refusing to change the approval policy.")
            self.duplicate_preflight(values, config)
            wanted = copy.deepcopy(values)
            wanted["approvals_reviewer"] = slot("auto_review")
            wanted["features.js_repl"] = ABSENT.copy()
            for path in self.paths:
                old = wanted["skill:" + path]
                entry = old["value"] if old["present"] else {"path": path}
                entry["enabled"] = False
                wanted["skill:" + path] = slot(entry)
        conflicts = []
        for name in current.keys() - desired.keys() - prior.keys():
            conflicts.append(f"Unmanaged file in managed skill: {name}")
        for name, old in prior.items():
            if signature(current.get(name)) not in (old, signature(desired.get(name))):
                conflicts.append(f"Edited since last sync: {name}")
        if state and self.migrate_config:
            for key, old in state["config"].items():
                if values.get(key) not in (old, wanted.get(key)):
                    conflicts.append(f"Configuration edited since last sync: {key}")
        if conflicts:
            raise SyncError("\n".join(conflicts))
        # Validate every destination before preparing a backup or changing any file.
        for name in current.keys() | desired.keys() | prior.keys():
            self.safe_path(name)
        changes = {name: {"before": signature(current.get(name)), "after": signature(desired.get(name))}
                   for name in sorted(current.keys() | desired.keys() | prior.keys())
                   if signature(current.get(name)) != signature(desired.get(name))}
        changed_values = {key: value for key, value in wanted.items() if value != values[key]}
        edited = patch_config(text, changed_values) if changed_values else text
        return {"desired": desired, "current": current, "state": state, "changes": changes,
                "config_file": config_file, "config_text": edited, "before_values": values,
                "wanted": wanted, "changed_values": changed_values}

    def apply(self):
        recovered = self.unfinished_backups()
        for backup_id in recovered:
            self.rollback(backup_id)
        plan = self.plan()
        desired_signatures = {name: signature(record) for name, record in plan["desired"].items()}
        if (not plan["changes"] and not plan["changed_values"] and plan["state"]
                and plan["state"]["files"] == desired_signatures and plan["state"]["config"] == plan["wanted"]):
            return {"status": "unchanged", "changed_files": 0, "changed_config_entries": 0,
                    "recovered_backups": recovered}
        backup_id = "sync-" + datetime.now().astimezone().strftime("%Y%m%dT%H%M%S%z-") + uuid.uuid4().hex[:8]
        backup = self.backups / backup_id
        backup.mkdir(parents=True, mode=0o700)
        self.backups.chmod(0o700)
        manifest = {"version": 1, "id": backup_id, "target": str(self.target),
                    "state_before": plan["state"], "files": plan["changes"],
                    "config_before": {key: plan["before_values"][key] for key in plan["changed_values"]},
                    "config_after": plan["changed_values"], "status": "prepared"}
        for name, change in plan["changes"].items():
            if change["before"]:
                atomic_write(backup / "files" / name, plan["current"][name]["data"])
        if plan["config_file"]:
            atomic_write(backup / "config.toml", plan["config_file"]["data"])
        write_json(backup / "manifest.json", manifest)
        try:
            for name, change in plan["changes"].items():
                path = self.safe_path(name)
                if signature(read_file(path)) != change["before"]:
                    raise SyncError(f"Changed during sync: {name}")
                if change["after"]:
                    record = plan["desired"][name]
                    atomic_write(path, record["data"], record["mode"])
                else:
                    path.unlink()
            if plan["changed_values"]:
                path = self.target / "config.toml"
                if signature(read_file(path)) != signature(plan["config_file"]):
                    raise SyncError("Configuration changed during sync.")
                atomic_write(path, plan["config_text"].encode(), plan["config_file"]["mode"] if plan["config_file"] else 0o600)
            write_json(self.state_path, {"version": 1, "last_backup": backup_id,
                       "files": {name: signature(record) for name, record in plan["desired"].items()}, "config": plan["wanted"]})
            manifest["status"] = "applied"
            write_json(backup / "manifest.json", manifest)
        except Exception:
            try:
                self.rollback(backup_id)
            except Exception:
                raise SyncError(f"Apply interrupted; inspect and roll back backup {backup_id}. Later edits were not overwritten.") from None
            raise SyncError(f"Apply failed and this batch was rolled back: {backup_id}") from None
        return {"status": "applied", "backup": backup_id, "changed_files": len(plan["changes"]),
                "changed_config_entries": len(plan["changed_values"]), "recovered_backups": recovered}

    def rollback(self, backup_id):
        if not re.fullmatch(r"sync-[A-Za-z0-9+_-]+", backup_id):
            raise SyncError("Invalid sync backup ID.")
        backup = self.backups / backup_id
        record = read_file(backup / "manifest.json")
        if not record:
            raise SyncError("Sync backup not found.")
        manifest = json.loads(record["data"])
        if manifest["target"] != str(self.target):
            raise SyncError("Backup belongs to another destination.")
        state = self.state()
        if manifest.get("status") == "rolled_back":
            return {"status": "already_rolled_back", "backup": backup_id}
        if manifest["config_before"] and not self.migrate_config:
            raise SyncError("This legacy batch changes configuration; rollback requires explicit --migrate-config.")
        if state != manifest["state_before"] and (not state or state.get("last_backup") != backup_id):
            raise SyncError("A later sync exists; roll back the latest batch first.")
        restore = {}
        for name, change in manifest["files"].items():
            path = self.safe_path(name)
            actual = signature(read_file(path))
            if actual not in (change["before"], change["after"]):
                raise SyncError(f"Later edit prevents rollback: {name}")
            if actual != change["before"]:
                data = (backup / "files" / name).read_bytes() if change["before"] else None
                if data is not None and digest(data) != change["before"]["sha256"]:
                    raise SyncError(f"Backup checksum mismatch: {name}")
                restore[name] = {"change": change, "data": data, "actual": actual}
        config, text, values = None, "", {}
        if manifest["config_before"]:
            config = read_file(self.target / "config.toml")
            text = config["data"].decode() if config else ""
            values = config_slots(parse_toml(text), self.paths)
        requested = {}
        for key, before in manifest["config_before"].items():
            if values[key] not in (before, manifest["config_after"][key]):
                raise SyncError(f"Later edit prevents configuration rollback: {key}")
            if values[key] != before:
                requested[key] = before
        edited = patch_config(text, requested) if requested else text
        for name, item in restore.items():
            path = self.safe_path(name)
            if signature(read_file(path)) != item["actual"]:
                raise SyncError(f"Changed during rollback: {name}")
            if item["data"] is None:
                path.unlink()
            else:
                atomic_write(path, item["data"], item["change"]["before"]["mode"])
        if requested:
            path = self.target / "config.toml"
            if signature(read_file(path)) != signature(config):
                raise SyncError("Configuration changed during rollback.")
            atomic_write(path, edited.encode(), config["mode"] if config else 0o600)
        if manifest["state_before"] is None:
            if self.state_path.exists():
                self.state_path.unlink()
        else:
            write_json(self.state_path, manifest["state_before"])
        manifest["status"] = "rolled_back"
        write_json(backup / "manifest.json", manifest)
        return {"status": "rolled_back", "backup": backup_id}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    action = parser.add_mutually_exclusive_group()
    action.add_argument("--check", action="store_true", help="Read-only inspection (default); exit 2 for pending changes")
    action.add_argument("--apply", action="store_true", help="Apply scoped changes with a private backup")
    action.add_argument("--rollback", metavar="BACKUP_ID", help="Restore only changes from this batch")
    parser.add_argument("--migrate-config", action="store_true",
                        help="Explicitly include legacy approval-name and duplicate-skill configuration migration")
    parser.add_argument("--target-root", type=Path, default=Path(os.environ.get("CODEX_HOME", str(Path.home() / ".codex"))))
    parser.add_argument("--user-root", type=Path, default=Path.home(), help="Directory containing .agents and .claude; useful for isolated tests")
    args = parser.parse_args()
    sync = Synchronizer(Path(__file__).parent, args.target_root, args.user_root, args.migrate_config)
    try:
        if not args.apply and not args.rollback:
            plan = sync.plan()
            pending = bool(plan["changes"] or plan["changed_values"])
            print(json.dumps({"status": "pending" if pending else "in_sync", "files": list(plan["changes"]),
                              "config_entries": list(plan["changed_values"])}, ensure_ascii=False))
            return 2 if pending else 0
        sync.target.mkdir(parents=True, exist_ok=True)
        lock_path = sync.target / ".global_codex_sync.lock"
        if lock_path.is_symlink():
            raise SyncError("Refusing symlink lock file.")
        with os.fdopen(os.open(lock_path, os.O_CREAT | os.O_RDWR, 0o600), "w") as lock:
            fcntl.flock(lock, fcntl.LOCK_EX | fcntl.LOCK_NB)
            result = sync.rollback(args.rollback) if args.rollback else sync.apply()
        print(json.dumps(result, ensure_ascii=False))
        return 0
    except (SyncError, OSError, ValueError, KeyError, TypeError) as exc:
        print(json.dumps({"status": "error", "message": str(exc)}, ensure_ascii=False))
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
