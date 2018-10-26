/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * actions for dubbo
 *
 * 2018-10-24
 * @author zhouhaitao
 */
import { CALL_API } from '../middleware/api'

export const FETCH_DUBBO_LIST_REQUEST = 'FETCH_DUBBO_LIST_REQUEST'
export const FETCH_DUBBO_LIST_SUCCESS = 'FETCH_DUBBO_LIST_SUCCESS'
export const FETCH_DUBBO_LIST_FAILURE = 'FETCH_DUBBO_LIST_FAILURE'

const fetchDubboList = (clusterId, callback) => {
  return {
    [CALL_API]: {
      types: [ FETCH_DUBBO_LIST_REQUEST,
        FETCH_DUBBO_LIST_SUCCESS,
        FETCH_DUBBO_LIST_FAILURE ],
      endpoint: `/clusters/${clusterId}/daas/dubbo`,
      schema: {},
    },
    callback,
  }
}
export const getDubboList = (clusterId, callback) => dispatch => dispatch(
  fetchDubboList(clusterId, callback))

export const GET_DUBBO_DETAIL_REQUEST = 'GET_DUBBO_DETAIL_REQUEST'
export const GET_DUBBO_DETAIL_SUCCESS = 'GET_DUBBO_DETAIL_SUCCESS'
export const GET_DUBBO_DETAIL_FAILURE = 'GET_DUBBO_DETAIL_FAILURE'

const fetchDubboDetail = (clusterId, name, groupversion, callback) => {
  return {
    [CALL_API]: {
      types: [ GET_DUBBO_DETAIL_REQUEST,
        GET_DUBBO_DETAIL_SUCCESS,
        GET_DUBBO_DETAIL_FAILURE ],
      endpoint: `/clusters/${clusterId}/daas/dubbo/${name}?groupversion=${groupversion}`,
      schema: {},
    },
    callback,
  }
}

export const getDubboDetail = (clusterId, name, groupversion, callback) => {
  return dispatch => {
    return dispatch(fetchDubboDetail(clusterId, name, groupversion, callback))
  }
}
export const SEARCH_DUBBO_CONSUMER_OR_PROVIDER = 'SEARCH_DUBBO_CONSUMER_OR_PROVIDER'
export const searchConsumerOrProvider = (type, keyWord) => {
  return (dispatch, getState) => {
    const { dubboDetail } = getState().dubbo
    const nextDubboDetail = Object.assign({}, dubboDetail)
    const list = nextDubboDetail.data[type]
    if (!list) return
    if (keyWord === '') {
      dispatch({
        type: SEARCH_DUBBO_CONSUMER_OR_PROVIDER,
        payload: dubboDetail.dataBackup,
      })
      return
    }
    const filteredData = list.filter(v => v.podName.indexOf(keyWord) >= 0)
    nextDubboDetail.data[type] = filteredData

    dispatch({
      type: SEARCH_DUBBO_CONSUMER_OR_PROVIDER,
      payload: nextDubboDetail.data,
    })
  }
}

export const FETCH_SUPPLIER_LIST_REQUEST = 'FETCH_SUPPLIER_LIST_REQUEST'
export const FETCH_SUPPLIER_LIST_SUCCESS = 'FETCH_SUPPLIER_LIST_SUCCESS'
export const FETCH_SUPPLIER_LIST_FAILURE = 'FETCH_SUPPLIER_LIST_FAILURE'

const fetchSupplierList = () => {
  return {
    type: FETCH_SUPPLIER_LIST_SUCCESS,
  }
}
export const getSupplierList = () => dispatch => dispatch(fetchSupplierList())

export const FETCH_CONSUMER_LIST_REQUEST = 'FETCH_CONSUMER_LIST_REQUEST'
export const FETCH_CONSUMER_LIST_SUCCESS = 'FETCH_CONSUMER_LIST_SUCCESS'
export const FETCH_CONSUMER_LIST_FAILURE = 'FETCH_CONSUMER_LIST_FAILURE'

const fetchConsumerList = () => {
  return {
    type: FETCH_CONSUMER_LIST_SUCCESS,
  }
}
export const getConsumerList = () => dispatch => dispatch(fetchConsumerList())

