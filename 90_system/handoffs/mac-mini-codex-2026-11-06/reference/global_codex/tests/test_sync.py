import importlib.util
import json
import os
from pathlib import Path
import shutil
import subprocess
import sys
import tempfile
import tomllib
import unittest
from unittest.mock import patch

SOURCE = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location("codex_sync", SOURCE / "sync.py")
sync = importlib.util.module_from_spec(spec)
spec.loader.exec_module(sync)


class SyncTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory(prefix="codex-sync-test-")
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        self.source = self.root / "source"
        self.user = self.root / "user"
        self.target = self.user / ".codex"
        self.source.mkdir()
        self.target.mkdir(parents=True)
        (self.source / "AGENTS.md").write_text("new agreed rules\n")
        (self.target / "AGENTS.md").write_text("old agreed rules\n")
        for name in sync.SKILLS:
            folder = self.source / "skills" / name
            folder.mkdir(parents=True)
            (folder / "SKILL.md").write_text(f"---\nname: {name}\ndescription: Test fixture\n---\n")
        resource = self.source / "skills/tdd/agents"
        resource.mkdir()
        (resource / "openai.yaml").write_text("policy:\n  allow_implicit_invocation: true\n")
        for name in sync.DUPLICATES:
            for root in [".agents", ".claude"]:
                folder = self.user / root / "skills" / name
                folder.mkdir(parents=True)
                (folder / "SKILL.md").write_text("same entrypoint\n")
                (folder / "resource.txt").write_text("same resource\n")
        self.config = self.target / "config.toml"
        self.config.write_text('''# personal configuration: preserve this comment
model = "gpt-6-astra"
model_reasoning_effort = "max"
approvals_reviewer = "guardian_subagent" # compatibility name
approval_policy = "on-request"
sandbox_mode = "workspace-write"

[features]
goals = true
js_repl = false
memories = true

[projects."/a user project"]
trust_level = "trusted"
[mcp_servers.example]
command = "existing-tool"
args = ["keep", "these"]
''')
        self.config.chmod(0o600)
        self.original_config = tomllib.loads(self.config.read_text())
        # Preserve the original migration regression suite; content-only behavior
        # is exercised separately below.
        self.tool = sync.Synchronizer(self.source, self.target, self.user, migrate_config=True)

    def tree(self):
        return {str(p.relative_to(self.root)): (p.read_bytes(), p.stat().st_mode & 0o777)
                for p in self.root.rglob("*") if p.is_file()}

    def test_default_check_is_read_only(self):
        for name in ["sync.sh", "sync.py"]:
            shutil.copy2(SOURCE / name, self.source / name)
        before = self.tree()
        result = subprocess.run(["bash", str(self.source / "sync.sh"), "--target-root", str(self.target),
                                 "--user-root", str(self.user)], capture_output=True, text=True)
        self.assertEqual(result.returncode, 2, result.stdout + result.stderr)
        self.assertEqual(json.loads(result.stdout)["status"], "pending")
        self.assertEqual(self.tree(), before)

    def test_content_sync_preserves_config_bytes_and_ignores_duplicate_setup(self):
        tool = sync.Synchronizer(self.source, self.target, self.user)
        self.config.write_text('approval_policy = "never"\nmodel_reasoning_effort = "max"\n')
        shutil.rmtree(self.user / ".agents")
        before = self.config.read_bytes()
        result = tool.apply()
        self.assertEqual(result["changed_config_entries"], 0)
        self.assertEqual(self.config.read_bytes(), before)
        self.assertEqual(tool.apply()["status"], "unchanged")
        tool.rollback(result["backup"])
        self.assertEqual(self.config.read_bytes(), before)
        self.assertEqual((self.target / "AGENTS.md").read_text(), "old agreed rules\n")

    def test_content_sync_never_parses_or_rewrites_config(self):
        tool = sync.Synchronizer(self.source, self.target, self.user)
        self.config.write_text('invalid personal TOML [\n')
        before = self.config.read_bytes()
        result = tool.apply()
        tool.rollback(result["backup"])
        self.assertEqual(self.config.read_bytes(), before)

    def test_content_sync_preserves_legacy_tracking_and_later_config_edits(self):
        self.tool.apply()
        prior = self.tool.state()["config"]
        self.config.write_text(self.config.read_text().replace('"auto_review"', '"user"'))
        before = self.config.read_bytes()
        (self.source / "AGENTS.md").write_text("next rules\n")
        tool = sync.Synchronizer(self.source, self.target, self.user)
        result = tool.apply()
        self.assertEqual(tool.state()["config"], prior)
        tool.rollback(result["backup"])
        self.assertEqual(self.config.read_bytes(), before)
        with self.assertRaises(sync.SyncError):
            self.tool.plan()

    def test_legacy_config_rollback_needs_explicit_mode(self):
        result = self.tool.apply()
        tool = sync.Synchronizer(self.source, self.target, self.user)
        before = self.tree()
        with self.assertRaisesRegex(sync.SyncError, "requires explicit --migrate-config"):
            tool.rollback(result["backup"])
        self.assertEqual(self.tree(), before)

    def test_shell_explicit_python_and_invalid_override(self):
        for name in ["sync.sh", "sync.py"]:
            shutil.copy2(SOURCE / name, self.source / name)
        cmd = ["bash", str(self.source / "sync.sh"), "--target-root", str(self.target), "--user-root", str(self.user)]
        before = self.tree()
        env = dict(os.environ, CODEX_SYNC_PYTHON=sys.executable)
        result = subprocess.run(cmd, env=env, capture_output=True, text=True)
        self.assertEqual(result.returncode, 2, result.stderr)
        env["CODEX_SYNC_PYTHON"] = str(self.root / "missing-python")
        result = subprocess.run(cmd, env=env, capture_output=True, text=True)
        self.assertEqual(result.returncode, 1)
        self.assertIn("Python 3.11+", result.stderr)
        self.assertEqual(self.tree(), before)

    def test_apply_preserves_unrelated_config_and_is_idempotent(self):
        result = self.tool.apply()
        self.assertEqual(result["status"], "applied")
        actual = tomllib.loads(self.config.read_text())
        self.assertEqual(actual["approvals_reviewer"], "auto_review")
        self.assertNotIn("js_repl", actual["features"])
        entries = actual.pop("skills")["config"]
        self.assertEqual(len(entries), 20)
        self.assertTrue(all(entry["enabled"] is False for entry in entries))
        expected = self.original_config.copy()
        expected["approvals_reviewer"] = "auto_review"
        expected["features"] = {"goals": True, "memories": True}
        self.assertEqual(actual, expected)
        self.assertIn("# personal configuration: preserve this comment", self.config.read_text())
        self.assertTrue((self.target / "skills/tdd/agents/openai.yaml").exists())
        self.assertEqual(self.config.stat().st_mode & 0o777, 0o600)
        backup = self.tool.backups / result["backup"]
        self.assertEqual(backup.stat().st_mode & 0o777, 0o700)
        self.assertEqual((backup / "config.toml").stat().st_mode & 0o777, 0o600)
        before = self.tree()
        self.assertEqual(self.tool.apply()["status"], "unchanged")
        self.assertEqual(self.tree(), before)

    def test_later_rule_edit_is_not_overwritten(self):
        self.tool.apply()
        (self.target / "AGENTS.md").write_text("new user decision\n")
        before = self.tree()
        with self.assertRaisesRegex(sync.SyncError, "Edited since last sync"):
            self.tool.apply()
        self.assertEqual(self.tree(), before)

    def test_later_managed_config_edit_blocks_sync(self):
        self.tool.apply()
        self.config.write_text(self.config.read_text().replace('"auto_review"', '"guardian_subagent"'))
        before = self.tree()
        with self.assertRaisesRegex(sync.SyncError, "Configuration edited"):
            self.tool.apply()
        self.assertEqual(self.tree(), before)

    def test_rollback_preserves_later_unrelated_config(self):
        result = self.tool.apply()
        self.config.write_text(self.config.read_text().replace('model_reasoning_effort = "max"', 'model_reasoning_effort = "high"'))
        (self.target / "user-file.txt").write_text("unrelated data")
        self.tool.rollback(result["backup"])
        actual = tomllib.loads(self.config.read_text())
        expected = self.original_config.copy()
        expected["model_reasoning_effort"] = "high"
        self.assertEqual(actual, expected)
        self.assertEqual((self.target / "AGENTS.md").read_text(), "old agreed rules\n")
        self.assertEqual((self.target / "user-file.txt").read_text(), "unrelated data")
        self.assertFalse((self.target / "skills/tdd/SKILL.md").exists())
        self.assertEqual(self.tool.rollback(result["backup"])["status"], "already_rolled_back")

    def test_rollback_rejects_later_edit_before_any_restore(self):
        result = self.tool.apply()
        (self.target / "skills/tdd/SKILL.md").write_text("later user edit")
        before = self.tree()
        with self.assertRaisesRegex(sync.SyncError, "Later edit"):
            self.tool.rollback(result["backup"])
        self.assertEqual(self.tree(), before)

    def test_rollback_rejects_later_managed_config_change(self):
        result = self.tool.apply()
        self.config.write_text(self.config.read_text().replace('"auto_review"', '"user"'))
        before = self.tree()
        with self.assertRaisesRegex(sync.SyncError, "Later edit"):
            self.tool.rollback(result["backup"])
        self.assertEqual(self.tree(), before)

    def test_existing_skill_setting_is_restored_in_place(self):
        path = self.tool.paths[0]
        self.config.write_text(self.config.read_text() + '\n[[skills.config]]\npath = ' + json.dumps(path) + '\nenabled = true\n')
        original = tomllib.loads(self.config.read_text())
        result = self.tool.apply()
        self.tool.rollback(result["backup"])
        self.assertEqual(tomllib.loads(self.config.read_text()), original)

    def test_missing_or_different_retained_resources_prevent_disable(self):
        (self.user / ".agents/skills/hyperframes/resource.txt").write_text("different resource")
        before = self.tree()
        with self.assertRaisesRegex(sync.SyncError, "resources differ"):
            self.tool.apply()
        self.assertEqual(self.tree(), before)

    def test_obsolete_managed_file_removal_and_restore(self):
        self.tool.apply()
        (self.source / "skills/tdd/agents/openai.yaml").unlink()
        result = self.tool.apply()
        self.assertFalse((self.target / "skills/tdd/agents/openai.yaml").exists())
        self.tool.rollback(result["backup"])
        self.assertTrue((self.target / "skills/tdd/agents/openai.yaml").exists())

    def test_partial_write_failure_restores_changed_files(self):
        original = sync.atomic_write
        failed = False

        def fail_once(path, data, mode=0o600):
            nonlocal failed
            if path.resolve() == (self.target / "skills/code-review/SKILL.md").resolve() and not failed:
                failed = True
                raise OSError("injected disk failure")
            return original(path, data, mode)

        with patch.object(sync, "atomic_write", side_effect=fail_once):
            with self.assertRaisesRegex(sync.SyncError, "rolled back"):
                self.tool.apply()
        self.assertEqual((self.target / "AGENTS.md").read_text(), "old agreed rules\n")
        self.assertEqual(tomllib.loads(self.config.read_text()), self.original_config)
        self.assertFalse(self.tool.state_path.exists())

    def test_unsupported_toml_layout_fails_before_writing(self):
        text = self.config.read_text().replace("[features]\ngoals = true\njs_repl = false\nmemories = true", "[features]\ngoals = true\n\"js_repl\" = false\nmemories = true")
        self.config.write_text(text)
        before = self.tree()
        with self.assertRaises(sync.SyncError):
            self.tool.apply()
        self.assertEqual(self.tree(), before)

    def test_shared_skill_files_remain_untouched(self):
        before = {str(p): p.read_bytes() for root in [self.user / ".agents", self.user / ".claude"]
                  for p in root.rglob("*") if p.is_file()}
        self.tool.apply()
        self.assertTrue(all(Path(path).read_bytes() == data for path, data in before.items()))

    def test_retained_skill_must_remain_enabled(self):
        kept = str((self.user / ".agents/skills/hyperframes/SKILL.md").resolve())
        self.config.write_text(self.config.read_text() + '\n[[skills.config]]\npath = ' + json.dumps(kept) + '\nenabled = false\n')
        before = self.tree()
        with self.assertRaisesRegex(sync.SyncError, "explicitly disabled"):
            self.tool.apply()
        self.assertEqual(self.tree(), before)

    def test_matching_manual_sync_updates_the_baseline(self):
        self.tool.apply()
        for root in [self.source, self.target]:
            (root / "AGENTS.md").write_text("agreed new content\n")
        self.tool.apply()
        (self.source / "AGENTS.md").write_text("next authorized revision\n")
        self.tool.apply()
        self.assertEqual((self.target / "AGENTS.md").read_text(), "next authorized revision\n")

    def test_interrupted_apply_is_detected_before_reporting_in_sync(self):
        class ProcessStopped(BaseException):
            pass

        original = sync.write_json

        def stop_before_state(path, data):
            if path == self.tool.state_path:
                raise ProcessStopped()
            return original(path, data)

        with patch.object(sync, "write_json", side_effect=stop_before_state):
            with self.assertRaises(ProcessStopped):
                self.tool.apply()
        # Content may already match, but no completed deployment was recorded.
        with self.assertRaisesRegex(sync.SyncError, "Unfinished"):
            self.tool.plan()
        result = self.tool.apply()
        self.assertEqual(len(result["recovered_backups"]), 1)
        self.assertEqual(self.tool.unfinished_backups(), [])
        self.assertEqual(self.tool.apply()["status"], "unchanged")

    def test_partial_process_interruption_is_recovered(self):
        class ProcessStopped(BaseException):
            pass

        original = sync.atomic_write

        def stop_midway(path, data, mode=0o600):
            if path == self.tool.target / "skills/code-review/SKILL.md":
                raise ProcessStopped()
            return original(path, data, mode)

        with patch.object(sync, "atomic_write", side_effect=stop_midway):
            with self.assertRaises(ProcessStopped):
                self.tool.apply()
        result = self.tool.apply()
        self.assertEqual(len(result["recovered_backups"]), 1)
        self.assertEqual((self.target / "AGENTS.md").read_text(), "new agreed rules\n")
        self.assertEqual(self.tool.unfinished_backups(), [])

    def test_interruption_recovery_preserves_subsequent_user_edit(self):
        class ProcessStopped(BaseException):
            pass

        original = sync.write_json

        def stop_before_state(path, data):
            if path == self.tool.state_path:
                raise ProcessStopped()
            return original(path, data)

        with patch.object(sync, "write_json", side_effect=stop_before_state):
            with self.assertRaises(ProcessStopped):
                self.tool.apply()
        (self.target / "AGENTS.md").write_text("later user decision")
        before = self.tree()
        with self.assertRaisesRegex(sync.SyncError, "Later edit"):
            self.tool.apply()
        self.assertEqual(self.tree(), before)

    def test_later_sync_and_rollback_keep_independent_edits(self):
        first = self.tool.apply()
        (self.source / "AGENTS.md").write_text("second batch\n")
        second = self.tool.apply()
        self.config.write_text(self.config.read_text().replace('model_reasoning_effort = "max"', 'model_reasoning_effort = "high"'))
        with self.assertRaisesRegex(sync.SyncError, "latest batch"):
            self.tool.rollback(first["backup"])
        self.tool.rollback(second["backup"])
        self.assertEqual((self.target / "AGENTS.md").read_text(), "new agreed rules\n")
        self.tool.rollback(first["backup"])
        self.assertEqual((self.target / "AGENTS.md").read_text(), "old agreed rules\n")
        self.assertEqual(tomllib.loads(self.config.read_text())["model_reasoning_effort"], "high")

    def test_invalid_skill_directory_is_rejected_before_backup(self):
        shutil.rmtree(self.source / "skills/tdd")
        (self.source / "skills/tdd").write_text("a file cannot replace a skill directory")
        before = self.tree()
        with self.assertRaises(sync.SyncError):
            self.tool.apply()
        self.assertEqual(self.tree(), before)

    def test_concurrent_unrelated_config_change_is_preserved(self):
        original = sync.atomic_write
        injected = False

        def edit_config_after_rule_write(path, data, mode=0o600):
            nonlocal injected
            result = original(path, data, mode)
            if path == self.tool.target / "AGENTS.md" and not injected:
                injected = True
                self.config.write_text(self.config.read_text().replace('model_reasoning_effort = "max"', 'model_reasoning_effort = "high"'))
            return result

        with patch.object(sync, "atomic_write", side_effect=edit_config_after_rule_write):
            with self.assertRaisesRegex(sync.SyncError, "rolled back"):
                self.tool.apply()
        self.assertEqual((self.target / "AGENTS.md").read_text(), "old agreed rules\n")
        self.assertEqual(tomllib.loads(self.config.read_text())["model_reasoning_effort"], "high")

    def test_corrupted_backup_is_rejected_without_restoring_anything(self):
        result = self.tool.apply()
        (self.tool.backups / result["backup"] / "files/AGENTS.md").write_text("corrupt backup")
        before = self.tree()
        with self.assertRaisesRegex(sync.SyncError, "checksum"):
            self.tool.rollback(result["backup"])
        self.assertEqual(self.tree(), before)


if __name__ == "__main__":
    unittest.main()
