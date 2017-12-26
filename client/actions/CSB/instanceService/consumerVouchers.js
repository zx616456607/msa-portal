/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * Consumer Vouchers aciton
 *
 * 2017-12-25
 * @author zhangcz
 */

import { CALL_API } from '../../../middleware/api'
import { Schemas } from '../../../middleware/schemas'
import { toQuerystring } from '../../../common/utils'
import { API_CONFIG } from '../../../constants'

const { CSB_API_URL } = API_CONFIG

// 创建消费凭证
export const CREATE_CONSUMER_VOUCHER_REQUEST = 'CREATE_CONSUMER_VOUCHER_REQUEST'
export const CREATE_CONSUMER_VOUCHER_SUCCESS = 'CREATE_CONSUMER_VOUCHER_SUCCESS'
export const CREATE_CONSUMER_VOUCHER_FAILURE = 'CREATE_CONSUMER_VOUCHER_FAILURE'

const fetchCreateConsumerVoucher = (instanceID, body) => {
  return {
    [CALL_API]: {
      types: [
        CREATE_CONSUMER_VOUCHER_REQUEST,
        CREATE_CONSUMER_VOUCHER_SUCCESS,
        CREATE_CONSUMER_VOUCHER_FAILURE,
      ],
      endpoint: `${CSB_API_URL}/instances/${instanceID}/evidences`,
      options: {
        method: 'POST',
        body,
      },
      schema: {},
    },
  }
}

export const createConsumerVoucher = (instanceID, body) => {
  return dispatch => dispatch(fetchCreateConsumerVoucher(instanceID, body))
}

// 获取消费凭证列表
export const GET_CONSUMER_VOUCHERS_LIST_REQUEST = 'GET_CONSUMER_VOUCHERS_LIST_REQUEST'
export const GET_CONSUMER_VOUCHERS_LIST_SUCCESS = 'GET_CONSUMER_VOUCHERS_LIST_SUCCESS'
export const GET_CONSUMER_VOUCHERS_LIST_FAILUER = 'GET_CONSUMER_VOUCHERS_LIST_FAILUER'

const fetchGetConsumerVouchersList = (instanceID, query) => {
  let endpoint = `${CSB_API_URL}/instances/${instanceID}/evidences`
  if (query) {
    endpoint += `?${toQuerystring(query)}`
  }
  return {
    instanceID,
    [CALL_API]: {
      types: [
        GET_CONSUMER_VOUCHERS_LIST_REQUEST,
        GET_CONSUMER_VOUCHERS_LIST_SUCCESS,
        GET_CONSUMER_VOUCHERS_LIST_FAILUER,
      ],
      endpoint,
      options: {
        method: 'GET',
      },
      schema: Schemas.CSB_INSTANCE_CONSUMER_VOUCHER_LIST_DATA,
    },
  }
}

export const getConsumerVouchersList = (instanceID, query) => {
  return dispatch => dispatch(fetchGetConsumerVouchersList(instanceID, query))
}
