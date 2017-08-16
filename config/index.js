const { env } = process
const config = {
  port: 8989,
  hostname: '0.0.0.0',
  site: '173app.com',
  isSSR: env.SSR || 'open',
  watchServer: false,
  basic: 'zaizaibo:bf74913e-a89a-4a43-ae4f-56b3f3a09801',
  jwtConfig: {
    expiresIn: 1000 * 60 * 30, // 30min
    errorTime: 1000 * 60 * 1.5, // 1.5min
  },
  API_URL: 'http://localhost:9092/api/v1', // for ssr
  log: {
    level: 'debug' || env.LOG_LEVEL,
    ignoreUrlReg: /^\/(favicon\.ico|__webpack_hmr|img\/|public\/)/i,
  },
}

module.exports = config
