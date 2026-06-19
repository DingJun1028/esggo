#!/bin/sh

# 使用 envsubst 工具將環境變數注入 Nginx 設定檔模板中
# 並將結果輸出到最終的設定檔位置
envsubst '${PORT}' < /etc/nginx/templates/nginx.conf.template > /etc/nginx/conf.d/default.conf

# 以前景模式啟動 Nginx (這是容器化應用的要求)
nginx -g 'daemon off;'
