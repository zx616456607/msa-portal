/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * Server api routes
 *
 * @author zhangpc
 * @date 2017-08-15
 */

import { test } from '../controllers/api'
import { API_PREFIX } from '../../client/constants'

export default function(Router) {
  const router = new Router({
    prefix: API_PREFIX,
  })

  router.post('/test', test)

  return router.routes()
}
