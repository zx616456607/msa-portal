/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

 /**
 * App webpack dev config
 *
 * https://webpack.js.org/guides/migrating/
 * v0.1 - 2017-08-15
 * @author Zhangpc
 */

const autoprefixer = require('autoprefixer')

module.exports = {
  plugins: [
    autoprefixer({
      browsers: [ 'last 2 versions', 'Firefox ESR', '> 1%', 'ie >= 8', 'iOS >= 8', 'Android >= 4' ],
    }),
  ],
}
