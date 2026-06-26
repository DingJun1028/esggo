module.exports = {
  apps: [
    {
      name: 'esggo-core',
      script: 'npm',
      args: 'start',
      cwd: '/var/www/esggo',
      env: {
        NODE_ENV: 'production',
        NEXT_TELEMETRY_DISABLED: '1',
      },
      max_memory_restart: '1G',
      restart_delay: 3000,
      max_restarts: 10,
    },
    {
      name: 'omniagent-gateway',
      script: 'node',
      args: 'omni-server.mjs',
      cwd: '/var/www/esggo/omniagent-gateway',
      env: {
        NODE_ENV: 'production',
        PORT: '8642',
      },
      max_memory_restart: '512M',
      restart_delay: 5000,
      max_restarts: 5,
    },
  ],
};
