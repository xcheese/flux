# DMIT Stock Monitor

本机轻量 DMIT 有货监控。电脑开机且当前用户登录时，LaunchAgent 每 10 分钟检查一次 `https://www.dmit.io/cart.php`。

## 监控范围

- `LAX.AN5.Pro.TINY`
- `LAX.AN5.Pro.Pocket`

只有状态从非有货变为有货时才通知一次。再次缺货后，下一次补货会再次通知。

## 重要边界

DMIT 当前会触发 Cloudflare 人机验证。普通 `curl` / HTTP 抓取拿不到商品页面，所以本工具使用专用 Chrome profile 保存验证状态。

首次使用或验证过期时，需要手动打开专用 Chrome 通过验证。

## 首次设置

```bash
node 90_system/tools/dmit-stock-monitor/check.mjs setup
```

打开页面后完成 Cloudflare 验证，然后关闭这个专用 Chrome 窗口。不要让 setup 窗口长期占用专用 profile，否则定时检查可能无法启动 headless Chrome。

## 手动测试

```bash
node 90_system/tools/dmit-stock-monitor/check.mjs demo-notification
node 90_system/tools/dmit-stock-monitor/check.mjs once
```

`once` 只打印检测结果，不发送有货通知。

## 安装定时任务

```bash
90_system/tools/dmit-stock-monitor/install-launch-agent.sh
```

安装后立即运行一次，并在当前用户登录状态下每 10 分钟运行一次。

## 卸载定时任务

```bash
90_system/tools/dmit-stock-monitor/uninstall-launch-agent.sh
```

运行状态默认保留在：

```text
~/Library/Application Support/FluxDmitStockMonitor
```

如要彻底清理，可手动删除该目录。

## 日志和状态

```text
~/Library/Logs/FluxDmitStockMonitor/dmit-stock-monitor.out.log
~/Library/Logs/FluxDmitStockMonitor/dmit-stock-monitor.err.log
~/Library/Application Support/FluxDmitStockMonitor/state.json
~/Library/Application Support/FluxDmitStockMonitor/last-result.json
~/Library/Application Support/FluxDmitStockMonitor/last.html
```

## 状态判断

- 页面出现 `Just a moment`、`正在进行安全验证`、`cf-turnstile-response` 等 Cloudflare 文案：`blocked`。
- 产品区域包含 `缺货中`、`缺貨中`、`Out of Stock`、`Sold Out`：`out_of_stock`。
- 产品存在，且缺货词消失，并能看到价格证据：`in_stock`。
- 找不到产品或证据不足：`unknown`。
