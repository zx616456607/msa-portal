/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2018 TenxCloud. All Rights Reserved.
 */

/**
 * CSB Cascading Link Rules aciton
 *
 * 2018-1-18
 * @author zhangcz
 */
import cloneDeep from 'lodash/cloneDeep'
import { CALL_API } from '../../middleware/api'
import { Schemas } from '../../middleware/schemas'
import { toQuerystring } from '../../common/utils'
import { API_CONFIG } from '../../constants'

const { CSB_API_URL } = API_CONFIG

// 获取级联链路规则列表
export const GET_CSB_CASCADING_LINK_RULES_LIST_REQUEST = 'GET_CSB_CASCADING_LINK_RULES_LIST_REQUEST'
export const GET_CSB_CASCADING_LINK_RULES_LIST_SUCCESS = 'GET_CSB_CASCADING_LINK_RULES_LIST_SUCCESS'
export const GET_CSB_CASCADING_LINK_RULES_LIST_FALIURE = 'GET_CSB_CASCADING_LINK_RULES_LIST_FALIURE'

const fetchGetCascadingLinkRulesList = (query = {}) => {
  let endpoint = `${CSB_API_URL}/cascaded-instances-path`
  const _query = cloneDeep(query)
  if (query.page) {
    _query.page = query.page - 1
  }
  endpoint += `?${toQuerystring(_query)}`
  return {
    [CALL_API]: {
      types: [
        GET_CSB_CASCADING_LINK_RULES_LIST_REQUEST,
        GET_CSB_CASCADING_LINK_RULES_LIST_SUCCESS,
        GET_CSB_CASCADING_LINK_RULES_LIST_FALIURE,
      ],
      endpoint,
      schema: Schemas.CSB_CASCADING_LINK_RULE_LIST_DATA,
    },
  }
}

export const getCascadingLinkRulesList = query => {
  return dispatch => dispatch(fetchGetCascadingLinkRulesList(query))
}

// 创建级联链路规则
export const CREATE_CSB_CASCADING_LINK_RULE_REQUEST = 'CREATE_CSB_CASCADING_LINK_RULE_REQUEST'
export const CREATE_CSB_CASCADING_LINK_RULE_SUCCESS = 'CREATE_CSB_CASCADING_LINK_RULE_SUCCESS'
export const CREATE_CSB_CASCADING_LINK_RULE_FALIURE = 'CREATE_CSB_CASCADING_LINK_RULE_FALIURE'

const fetchCreateCsbCascadingLinkRules = body => {
  return {
    [CALL_API]: {
      types: [
        CREATE_CSB_CASCADING_LINK_RULE_REQUEST,
        CREATE_CSB_CASCADING_LINK_RULE_SUCCESS,
        CREATE_CSB_CASCADING_LINK_RULE_FALIURE,
      ],
      endpoint: `${CSB_API_URL}/cascaded-instances-path/request`,
      options: {
        method: 'POST',
        body,
      },
      schema: {},
    },
  }
}

export const createCsbCascadingLinkRule = body => {
  return dispatch => dispatch(fetchCreateCsbCascadingLinkRules(body))
}

// 删除级联链路规则
export const DELETE_CSB_CASCADING_LINK_RULE_REQUEST = 'DELETE_CSB_CASCADING_LINK_RULE_REQUEST'
export const DELETE_CSB_CASCADING_LINK_RULE_SUCCESS = 'DELETE_CSB_CASCADING_LINK_RULE_SUCCESS'
export const DELETE_CSB_CASCADING_LINK_RULE_FALIURE = 'DELETE_CSB_CASCADING_LINK_RULE_FALIURE'

const fetchDeleteCsbCascadingLinkRule = id => {
  return {
    [CALL_API]: {
      types: [
        DELETE_CSB_CASCADING_LINK_RULE_REQUEST,
        DELETE_CSB_CASCADING_LINK_RULE_SUCCESS,
        DELETE_CSB_CASCADING_LINK_RULE_FALIURE,
      ],
      endpoint: `${CSB_API_URL}/cascaded-instances-path/${id}`,
      options: {
        method: 'DELETE',
      },
      schema: {},
    },
  }
}

export const deleteCsbCascadingLinkRule = id => {
  return dispatch => dispatch(fetchDeleteCsbCascadingLinkRule(id))
}
