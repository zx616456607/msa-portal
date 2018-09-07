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
import { title } from '../../config/constants'

export async function render(ctx) {
  const data = {
    title,
    initialState: JSON.stringify({
      config: initialConfig,
    }),
  }
  const htmlName = global.isDebug ? 'index.debug' : 'index'
  await ctx.render(`../${htmlName}`, data)
}
