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
import cloneDeep from 'lodash/cloneDeep'

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
    const _query = cloneDeep(query)
    if (query.page) {
      _query.page = query.page - 1
    }
    endpoint += `?${toQuerystring(_query)}`
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

// 触发更新消费凭证
export const POST_UPDATE_CONSUMER_VOUCJER_REQUEST = 'POST_UPDATE_CONSUMER_VOUCJER_REQUEST'
export const POST_UPDATE_CONSUMER_VOUCJER_SUCCESS = 'POST_UPDATE_CONSUMER_VOUCJER_SUCCESS'
export const POST_UPDATE_CONSUMER_VOUCJER_FAILUER = 'POST_UPDATE_CONSUMER_VOUCJER_FAILUER'

const fetchTriggerUpdateConsumerVoucher = (instanceID, evidenceId, body) => {
  return {
    [CALL_API]: {
      types: [
        POST_UPDATE_CONSUMER_VOUCJER_REQUEST,
        POST_UPDATE_CONSUMER_VOUCJER_SUCCESS,
        POST_UPDATE_CONSUMER_VOUCJER_FAILUER,
      ],
      endpoint: `${CSB_API_URL}/instances/${instanceID}/evidences/${evidenceId}/replacement`,
      options: {
        method: 'POST',
        body,
      },
      schema: Schemas.CSB__INSTANCE_CONSUMER_VOUCHER_UPDATE_DATA,
    },
  }
}

export const triggerUpdateConsumerVoucher = (instanceID, evidenceId, body) => {
  return dispatch => dispatch(fetchTriggerUpdateConsumerVoucher(instanceID, evidenceId, body))
}

// 确认更新消费凭证
export const PUT_UPDATE_CONSUMER_VOUCHER_REQUEST = 'PUT_UPDATE_CONSUMER_VOUCHER_REQUEST'
export const PUT_UPDATE_CONSUMER_VOUCHER_SUCCESS = 'PUT_UPDATE_CONSUMER_VOUCHER_SUCCESS'
export const PUT_UPDATE_CONSUMER_VOUCHER_FAILUER = 'PUT_UPDATE_CONSUMER_VOUCHER_FAILUER'

const fetchConfirmUpdateConsumerVoucher = (instanceID, evidenceId) => {
  return {
    [CALL_API]: {
      types: [
        PUT_UPDATE_CONSUMER_VOUCHER_REQUEST,
        PUT_UPDATE_CONSUMER_VOUCHER_SUCCESS,
        PUT_UPDATE_CONSUMER_VOUCHER_FAILUER,
      ],
      endpoint: `${CSB_API_URL}/instances/${instanceID}/evidences/${evidenceId}/replacement`,
      options: {
        method: 'PUT',
      },
      schema: Schemas.CSB__INSTANCE_CONSUMER_VOUCHER_UPDATE_DATA,
    },
  }
}

export const confirmUpdateConsumerVoucher = (instanceID, evidenceId) => {
  return dispatch => dispatch(fetchConfirmUpdateConsumerVoucher(instanceID, evidenceId))
}

// 编辑消费凭证
export const PUT_EDIT_CONSUMER_VOUCHER_REQUEST = 'PUT_EDIT_CONSUMER_VOUCHER_REQUEST'
export const PUT_EDIT_CONSUMER_VOUCHER_SUCCESS = 'PUT_EDIT_CONSUMER_VOUCHER_SUCCESS'
export const PUT_EDIT_CONSUMER_VOUCHER_FAILUER = 'PUT_EDIT_CONSUMER_VOUCHER_FAILUER'

const fetchEditConsumerVoucher = (instanceID, evidenceId, body) => {
  return {
    [CALL_API]: {
      types: [
        PUT_EDIT_CONSUMER_VOUCHER_REQUEST,
        PUT_EDIT_CONSUMER_VOUCHER_SUCCESS,
        PUT_EDIT_CONSUMER_VOUCHER_FAILUER,
      ],
      endpoint: `${CSB_API_URL}/instances/${instanceID}/evidences/${evidenceId}`,
      options: {
        method: 'PUT',
        body,
      },
      schema: Schemas.CSB__INSTANCE_CONSUMER_VOUCHER_UPDATE_DATA,
    },
  }
}

export const editConsumerVoucher = (instanceID, evidenceId, body) => {
  return dispatch => dispatch(fetchEditConsumerVoucher(instanceID, evidenceId, body))
}

// 删除消费凭证
export const DELETE_CONSUMER_VOUCHER_REQUEST = 'DELETE_CONSUMER_VOUCHER_REQUEST'
export const DELETE_CONSUMER_VOUCHER_SUCCESS = 'DELETE_CONSUMER_VOUCHER_SUCCESS'
export const DELETE_CONSUMER_VOUCHER_FAILUER = 'DELETE_CONSUMER_VOUCHER_FAILUER'

const fetchDeleteConsumerVoucher = (instanceID, evidenceId) => {
  return {
    [CALL_API]: {
      types: [
        DELETE_CONSUMER_VOUCHER_REQUEST,
        DELETE_CONSUMER_VOUCHER_SUCCESS,
        DELETE_CONSUMER_VOUCHER_FAILUER,
      ],
      endpoint: `${CSB_API_URL}/instances/${instanceID}/evidences/${evidenceId}`,
      options: {
        method: 'DELETE',
      },
      schema: {},
    },
  }
}

export const deleteConsumerVoucher = (instanceID, evidenceId) => {
  return dispatch => dispatch(fetchDeleteConsumerVoucher(instanceID, evidenceId))
}
