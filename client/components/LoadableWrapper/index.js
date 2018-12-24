/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * Loadable component wrapper
 * 由于 Code Splitting 会导致热更新失效，所以在开发模式时直接根据 path 引入
 * module，仅在生产环境模式时才使用 Code Splitting
 *
 * 2018-12-17
 * @author zhangpc
 */

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./index.prod')
} else {
  module.exports = require('./index.dev')
}
