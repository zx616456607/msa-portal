/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * Server index routes
 *
 * @author zhangpc
 * @date 2017-08-15
 */

import { render } from '../controllers'

export default function(Router) {
  const router = new Router()

  // For frontend reload page
  router.get('*', render)

  return router.routes()
}
