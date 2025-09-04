
cat >/usr/local/bin/healthz.py <<'PY'
#!/usr/bin/env python3
from http.server import BaseHTTPRequestHandler, HTTPServer

class Handler(BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path == "/health":
            self.send_response(200)
            self.send_header("Content-Type", "text/plain; charset=utf-8")
            self.end_headers()
            self.wfile.write(b"ok")
        else:
            self.send_response(404)
            self.end_headers()

    # 安靜一點，避免日誌爆量
    def log_message(self, fmt, *args):
        return
PORT = 8888

def main():
    server = HTTPServer(("", PORT), Handler)
    server.serve_forever()

if __name__ == "__main__":
    main()
PY
chmod +x /usr/local/bin/healthz.py

# systemd service
cat >/etc/systemd/system/healthz.service <<'UNIT'
[Unit]
Description=Simple /health HTTP endpoint
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
ExecStart=/usr/bin/python3 /usr/local/bin/healthz.py
Restart=always
RestartSec=2

# 監聽 80 需要權限；直接用 root 最簡單（僅用於健康檢查）
User=root

[Install]
WantedBy=multi-user.target
UNIT

systemctl daemon-reload
systemctl enable --now healthz.service