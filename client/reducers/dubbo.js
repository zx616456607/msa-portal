/*
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2018 TenxCloud. All Rights Reserved.
 * ----
 * reducers for dubbo
 *
 * @author zhouhaitao
 * @date 2018-10-15
 */

import * as ActionTypes from '../actions/dubbo'
import isEmpty from 'lodash/isEmpty';
import { formatDate } from '../common/utils';


const supplierListData = [
  {
    containerName: 'asdhjkhjkkjkllkkljfgdlkjgkldfjk',
    containerAddress: 'www.fdsfdsrtkgfdmkhlgrjirwjgfkdmlgdfs.com',
    belong: 'app1',
    status: '0',
    type: '1',
    serviceAddress: 'https://k1lpdq.axshare.com/#g=1&p=%E6%9C%8D%E5%8A%A1%E6%B2%BB%E7%90%86-dubbo%E6%9C%8D%E5%8A%A1%E5%88%97%E8%A1%A8&hi=1',
    id: '234',
  },
  {
    containerName: 'asdhjkhjkkjkllkkljfgdlkjgkldfjk',
    containerAddress: 'www.fdsfdsrtkgfdmkhlgrjirwjgfkdmlgdfs.com',
    belong: 'app1',
    status: '1',
    type: '0',
    serviceAddress: 'https://k1lpdq.axshare.com/#g=1&p=%E6%9C%8D%E5%8A%A1%E6%B2%BB%E7%90%86-dubbo%E6%9C%8D%E5%8A%A1%E5%88%97%E8%A1%A8&hi=1',
    id: '546',
  },
]
const consumerListData = [
  {
    containerName: 'asdhjkhjkkjkllkkljfgdlkjgkldfjk',
    containerAddress: 'www.fdsfdsrtkgfdmkhlgrjirwjgfkdmlgdfs.com',
    belong: 'app1',
    status: '0',
    type: '1',
    serviceAddress: 'https://k1lpdq.axshare.com/#g=1&p=%E6%9C%8D%E5%8A%A1%E6%B2%BB%E7%90%86-dubbo%E6%9C%8D%E5%8A%A1%E5%88%97%E8%A1%A8&hi=1',
    id: '234',
  },
  {
    containerName: 'asdhjkhjkkjkllkkljfgdlkjgkldfjk',
    containerAddress: 'www.fdsfdsrtkgfdmkhlgrjirwjgfkdmlgdfs.com',
    belong: 'app1',
    status: '1',
    type: '0',
    serviceAddress: 'https://k1lpdq.axshare.com/#g=1&p=%E6%9C%8D%E5%8A%A1%E6%B2%BB%E7%90%86-dubbo%E6%9C%8D%E5%8A%A1%E5%88%97%E8%A1%A8&hi=1',
    id: '546',
  },
]

const dubboList = (state = {}, action) => {
  const { type } = action
  switch (type) {
    case ActionTypes.FETCH_DUBBO_LIST_REQUEST:
      return {
        ...state,
        isFetching: true,
      }
    case ActionTypes.FETCH_DUBBO_LIST_SUCCESS:
      return {
        ...state,
        isFetching: false,
        total: action.response.result.data.total,
        data: action.response.result.data.items || [],
      }
    case ActionTypes.FETCH_DUBBO_LIST_FAILURE:
      return {
        ...state,
        isFetching: false,
      }
    default:
      return state
  }
}
const dubboDetail = (state = {}, action) => {
  const { type } = action
  switch (type) {
    case ActionTypes.GET_DUBBO_DETAIL_REQUEST:
      return {
        ...state,
        isFetching: true,
      }
    case ActionTypes.GET_DUBBO_DETAIL_SUCCESS:
      return {
        ...state,
        data: action.response.result.data,
        dataBackup: action.response.result.data,
      }
    case ActionTypes.GET_DUBBO_DETAIL_FAILURE:
      return {
        ...state,
        isFetching: false,
      }
    case ActionTypes.SEARCH_DUBBO_CONSUMER_OR_PROVIDER:
      return {
        ...state,
        data: action.payload,
        isFetching: false,
      }
    default:
      return state
  }
}
const supplierList = (state = {}, action) => {
  const { type } = action
  switch (type) {
    case ActionTypes.FETCH_SUPPLIER_LIST_REQUEST:
      return {
        ...state,
        isFetching: true,
      }
    case ActionTypes.FETCH_SUPPLIER_LIST_SUCCESS:
      return {
        ...state,
        isFetching: false,
        data: supplierListData || [],
        dataBackup: supplierListData || [],
      }
    case ActionTypes.FETCH_SUPPLIER_LIST_FAILURE:
      return {
        ...state,
        isFetching: false,
      }
    default:
      return state
  }
}
const consumerList = (state = {}, action) => {
  const { type } = action
  switch (type) {
    case ActionTypes.FETCH_CONSUMER_LIST_REQUEST:
      return {
        ...state,
        isFetching: true,
      }
    case ActionTypes.FETCH_CONSUMER_LIST_SUCCESS:
      return {
        ...state,
        isFetching: false,
        data: supplierListData || [],
        dataBackup: consumerListData || [],
      }
    case ActionTypes.FETCH_CONSUMER_LIST_FAILURE:
      return {
        ...state,
        isFetching: false,
      }
    default:
      return state
  }
}
const formatInstanceMonitor = data => {
  if (isEmpty(data)) {
    return data
  }
  data.forEach(item => {
    const { container_name, metrics } = item
    // bizcharts 图例显示有问题，去掉服务名称后的数字（dsb-server-3375465363-1x4v5 => dsb-server-1x4v5）
    let name = container_name.split('-')
    name.splice(-2, 1)
    name = name.join('-')
    metrics.forEach(metric => {
      metric.container_name = name
      metric.timestamp = formatDate(metric.timestamp, 'MM-DD HH:mm:ss')
    })
  })
  return data
}
const dubboInstanceMonitor = (state = {}, action) => {
  const { type, metricType } = action
  switch (type) {
    case ActionTypes.GET_DUBBO_INSTANCE_MONITOR_REQUEST:
      return {
        ...state,
        [metricType]: Object.assign({}, state[metricType], {
          isFetching: true,
          data: [],
        }),
      }
    case ActionTypes.GET_DUBBO_INSTANCE_MONITOR_SUCCESS:
      return {
        ...state,
        [metricType]: Object.assign({}, state[metricType], {
          isFetching: false,
          data: formatInstanceMonitor(action.response.result.data),
        }),
      }
    case ActionTypes.GET_DUBBO_INSTANCE_MONITOR_FAILURE:
      return {
        ...state,
        [metricType]: {
          isFetching: false,
          data: [],
        },
      }
    default:
      return state
  }
}
const dubboInstanceRealTimeMonitor = (state = {}, action) => {
  const { type, metricType } = action
  switch (type) {
    case ActionTypes.GET_DUBBO_INSTANCE_REALTIME_MONITOR_REQUEST:
      return {
        ...state,
        [metricType]: Object.assign({}, state[metricType], {
          isFetching: true,
          data: [],
        }),
      }
    case ActionTypes.GET_DUBBO_INSTANCE_REALTIME_MONITOR_SUCCESS:
      return {
        ...state,
        [metricType]: Object.assign({}, state[metricType], {
          isFetching: false,
          data: formatInstanceMonitor(action.response.result.data),
        }),
      }
    case ActionTypes.GET_DUBBO_INSTANCE_REALTIME_MONITOR_FAILURE:
      return {
        ...state,
        [metricType]: {
          isFetching: false,
          data: [],
        },
      }
    default:
      return state
  }
}
const dubboInstanceLogs = (state = {}, action) => {
  const { type, serviceName } = action
  switch (type) {
    case ActionTypes.GET_DUBBO_INSTANCE_LOGS_REQUEST:
      return {
        ...state,
        [serviceName]: {
          isFetching: true,
        },
      }
    case ActionTypes.GET_DUBBO_INSTANCE_LOGS_SUCCESS:
      return {
        ...state,
        [serviceName]: {
          isFetching: false,
          data: action.response.result.data || [],
        },
      }
    case ActionTypes.GET_DUBBO_INSTANCE_LOGS_FALIURE:
      return {
        ...state,
        [serviceName]: {
          isFetching: false,
          data: [],
        },
      }
    default:
      return state
  }
}

const dubbo = (state = {
  dubboList: {
    isFetching: false,
    data: [],
  },
  dubboDetail: {
    isFetching: false,
    data: '',
    dataBackup: '',
  },
  supplierList: {
    data: [],
    dataBackup: [],
    isFetching: false,
  },
  consumerList: {
    data: [],
    dataBackup: [],
    isFetching: false,
  },
}, action) => ({
  dubboList: dubboList(state.dubboList, action),
  dubboDetail: dubboDetail(state.dubboDetail, action),
  supplierList: supplierList(state.supplierList, action),
  consumerList: consumerList(state.consumerList, action),
  dubboInstanceMonitor: dubboInstanceMonitor(state.dubboInstanceMonitor, action),
  dubboInstanceRealTimeMonitor: dubboInstanceRealTimeMonitor(
    state.dubboInstanceRealTimeMonitor, action),
  dubboInstanceLogs: dubboInstanceLogs(state.dubboInstanceLogs, action),
})

export default dubbo
