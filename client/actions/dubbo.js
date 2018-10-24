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


export const FETCH_DUBBO_LIST_REQUEST = 'FETCH_DUBBO_LIST_REQUEST'
export const FETCH_DUBBO_LIST_SUCCESS = 'FETCH_DUBBO_LIST_SUCCESS'
export const FETCH_DUBBO_LIST_FAILURE = 'FETCH_DUBBO_LIST_FAILURE'

const fetchDubboList = () => {
  return {
    type: FETCH_DUBBO_LIST_SUCCESS,
  }
}
export const getDubboList = () => dispatch => dispatch(fetchDubboList())

export const GET_DUBBO_DETAIL_SUCCESS = 'GET_DUBBO_DETAIL_SUCCESS'

export const getDubboDetail = id => {
  return (dispatch, getState) => {
    const { dubbo } = getState()
    const dubboList = dubbo.dubboList.data
    dispatch({
      type: GET_DUBBO_DETAIL_SUCCESS,
      payload: dubboList.filter(v => v.id === id)[0],
    })
  }
}
