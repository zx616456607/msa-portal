/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * Server index controller
 *
 * @author zhangpc
 * @date 2017-08-15
 */

export async function render(ctx) {
  const data = {
    title: '微服务治理平台 | 时速云',
  }
  const htmlName = global.isDebug ? 'index.debug' : 'index'
  await ctx.render(`../${htmlName}`, data)
}
