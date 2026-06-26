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
  ],
};
