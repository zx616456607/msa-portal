/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * Server api controller
 *
 * @author zhangpc
 * @date 2017-08-15
 */

export function jwt(ctx) {
  ctx.status = 200
  ctx.body = {
    message: 'success',
  }
}
