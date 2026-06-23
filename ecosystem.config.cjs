module.exports = {
  apps: [
    {
      name: "esggo-core",
      cwd: "/var/www/esggo",
      script: "node_modules/next/dist/bin/next",
      args: "start",
      node_args: "-r dotenv/config",
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
      error_file: "./logs/esggo-error.log",
      out_file: "./logs/esggo-out.log",
      merge_logs: true,
    },
  ],
};
