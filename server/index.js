/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

require('babel-register')({
  babelrc: false,
  presets: [ 'es2015' ],
})
require('./server')
