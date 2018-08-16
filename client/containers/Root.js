/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * Root container
 *
 * 2017-08-16
 * @author zhangpc
 */

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./Root.prod')
} else {
  module.exports = require('./Root.dev')
}
