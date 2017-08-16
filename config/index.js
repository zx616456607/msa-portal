const { env } = process
const config = {
  port: 8989,
  hostname: '0.0.0.0',
  site: 'tenxcloud.com',
  jwtConfig: {
    expiresIn: 1000 * 60 * 30, // 30min
    errorTime: 1000 * 60 * 1.5, // 1.5min
  },
  log: {
    level: 'debug' || env.LOG_LEVEL,
    ignoreUrlReg: /^\/(favicon\.ico|__webpack_hmr|img\/|public\/)/i,
  },
}

module.exports = config
