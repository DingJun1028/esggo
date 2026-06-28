module.exports = {
  apps: [
    {
      name: 'esggo-core',
      script: 'node',
      args: 'server.mjs',
      cwd: '/var/www/esggo',
      env: {
        NODE_ENV: 'production',
        PORT: '3000',
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
        SITE_URL: 'http://127.0.0.1:3000',
      },
      max_memory_restart: '512M',
      restart_delay: 5000,
      max_restarts: 5,
    },
  ],
};