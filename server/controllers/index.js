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
import { initialConfig } from '../../config'

export async function render(ctx) {
  const data = {
    title: '微服务治理平台 | 时速云',
    initialState: JSON.stringify({
      config: initialConfig,
    }),
  }
  const htmlName = global.isDebug ? 'index.debug' : 'index'
  await ctx.render(`../${htmlName}`, data)
}
