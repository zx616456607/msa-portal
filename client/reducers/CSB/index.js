/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * CSB reducers for redux
 *
 * 2017-12-15
 * @author zhangpc
 */
import { publicInstances, availableInstances, omInstances } from './instance'
const CSB = (state = {
  publicInstances: {},
  availableInstances: {},
  omInstances: {},
}, action) => {
  return {
    publicInstances: publicInstances(state.publicInstances, action),
    availableInstances: availableInstances(state.availableInstances, action),
    omInstances: omInstances(state.omInstances, action),
  }
}

export default CSB
