module.exports = {
  apps: [
    {
      name: 'app',
      script: './bin/www',
      instances: 1,
      autorestart: true,
      watch: true,
      max_memory_restart: '1G',
      ignore_watch: [
        "node_modules",
        "logs"
      ],
      error_file: "./logs/app-err.log",
      out_file: "./logs/app-out.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss", // 给每⾏行行⽇日志标记⼀一个时间
      env: {
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'production',
      }
    },
  ],

  deploy: {
    production: {
      user: 'root',
      host: ['47.100.100.186'],
      ref: 'origin/master',
      repo: 'git@github.com:tomsteven11/myblog.git',
      path: '/usr/local/myProject',
      ssh_options: "StrictHostKeyChecking=no",
      'pre-deploy-local': '',
      'post-deploy': 'npm install && pm2 reload ecosystem.config.js --env production',
      "env": {
        "NODE_ENV": "production"
      },
      'pre-setup': ''
    }
  }
};
