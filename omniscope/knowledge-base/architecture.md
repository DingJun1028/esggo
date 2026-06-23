# 架構知識庫

## VPS 架構
- Oracle Cloud VM.Standard.A1.Flex (ARM64, 4 OCPU, 24GB RAM)
- Ubuntu 24.04 LTS
- IP: 161.118.248.180
- SSH 端口: 22（只允許金鑰）

## 服務架構
```
http://161.118.248.180/      → nginx (:80) → esggo-core (:3000)
http://161.118.248.180:8642  → omniagent-gateway (Node.js)
http://161.118.248.180/ws    → WebSocket 雙向同步
```

## 端口配置
- 22: SSH
- 80: Nginx
- 443: HTTPS（待啟用）
- 3000-3010: 應用端口範圍
- 8642: OmniAgent Gateway

## 安全
- SSH: 禁用密碼，只用 key
- UFW: 已啟用
- fail2ban: 監控 sshd
- .env 權限: chmod 600
