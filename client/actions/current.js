/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * Current aciton
 *
 * 2017-08-29
 * @author zhangpc
 */

export const SET_CURRENT = 'SET_CURRENT'

export function setCurrent(current) {
  return {
    current,
    type: SET_CURRENT,
  }
}
