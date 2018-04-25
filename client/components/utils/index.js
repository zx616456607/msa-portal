/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * Utils functions for components
 *
 * 2017-12-01
 * @author zhangpc
 */

import React from 'react'
import { Spin, Badge, Icon } from 'antd'


export function renderLoading(tip) {
  return <div className="loading">
    <Spin size="large" tip={tip} />
  </div>
}

/**
 * render service status of CSB instance
 *
 * @export
 * @param {number} serviceStatus status of service
 * @return {element} badge element
 */
export function renderCSBInstanceServiceStatus(serviceStatus) {
  let status
  let text
  switch (serviceStatus) {
    case 1:
      text = '已激活'
      status = 'success'
      break
    case 2:
      text = '已停用'
      status = 'error'
      break
    case 4:
      text = '已注销'
      status = 'default'
      break
    default:
      text = '未知'
      status = 'default'
      break
  }
  return <Badge status={status} text={text} />
}

/**
 * render service approve status of CSB instance
 *
 * @export
 * @param {number} serviceStatus status of service
 * @return {element} badge element
 */
export function renderCSBInstanceServiceApproveStatus(serviceStatus) {
  let status
  let text
  switch (serviceStatus) {
    case 1:
      text = '待审批'
      status = 'processing'
      break
    case 2:
      text = '已通过'
      status = 'success'
      break
    case 3:
      text = '已拒绝'
      status = 'error'
      break
    case 4:
      text = '已退订'
      status = 'default'
      break
    default:
      text = '未知'
      status = 'default'
      break
  }
  return <Badge status={status} text={text} />
}
/**
 * render OAuth type
 *
 * @export
 * @param {string} type 'github' | 'google' | 'customer'
 * @return {element} type element
 */
export function renderOAuth2Type(type) {
  switch (type) {
    case 'github':
      return <span><Icon type="github" /> Github</span>
    case 'google':
      return <span><Icon type="google" /> Google</span>
    case 'customer':
    default:
      return <span><Icon type="star-o" /> 自定义</span>
  }
}

/**
 * render CSB instance status
 *
 * @export
 * @param {number} instanceStatus status of instance
 * @return {element} badge element
 */
export function renderCSBInstanceStatus(instanceStatus) {
  let status
  let text
  switch (instanceStatus) {
    case 0:
      text = '停止'
      status = 'error'
      break
    case 1:
      text = '运行中'
      status = 'success'
      break
    case 2:
      text = '启动中'
      status = 'processing'
      break
    case 3:
      text = '停止中'
      status = 'error'
      break
    default:
      text = '未知'
      status = 'default'
      break
  }
  return <Badge status={status} text={text} />
}
