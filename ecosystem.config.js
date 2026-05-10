/**
 * PM2 ecosystem configuration.
 * Run: pm2 start ecosystem.config.js --env production
 */
module.exports = {
  apps: [
    {
      name: "siddhartha-portfolio",
      script: "node_modules/next/dist/bin/next",
      args: "start --port 3000",
      cwd: "/var/www/portfolio/current",
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      watch: false,
      max_memory_restart: "512M",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
        HOSTNAME: "127.0.0.1",
      },
      error_file: "/var/log/portfolio/error.log",
      out_file: "/var/log/portfolio/out.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
      merge_logs: true,
      time: true,
    },
  ],
};
