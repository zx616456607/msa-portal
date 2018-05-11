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

export function formatWSMessage(message) {
  const { type } = message
  let notifyType = 'warning'
  let msg = ''
  switch (type) {
    // error
    case 'service_already_exist':
      msg = '同名同版本号的服务已经存在'
      notifyType = 'warning'
      break
    case 'service_already_exist_in_instance':
      msg = '同名同版本号的服务已经存在'
      notifyType = 'warning'
      break
    case 'service_group_not_exist_in_instance':
      msg = '实例中没有同名服务组'
      notifyType = 'warning'
      break
    case 'instance_not_exist':
      msg = '实例不存在'
      notifyType = 'warning'
      break
    case 'bad_request':
      msg = '请求错误（有可能是在发布服务时serviceBehaviourPerInstance字段不符合格式）'
      notifyType = 'warning'
      break
    case 'cascaded_service_not_exist':
      msg = '重试发布或注销服务时，该级联服务不存在'
      notifyType = 'warning'
      break
    case 'unfinished_publishing':
      msg = '注销服务时，该服务并未完成发布'
      notifyType = 'warning'
      break
    case 'no_publishing_privilege':
      msg = '在实例上没有发布权限'
      notifyType = 'warning'
      break
    case 'unknown_error':
      msg = '未知错误'
      notifyType = 'warning'
      break

    // success
    case 'publishing_started':
      msg = '级联服务开始发布'
      notifyType = 'success'
      break
    case 'finished_one_instance_publishing':
      msg = '在一个实例上发布成功'
      notifyType = 'success'
      break
    case 'finished_all_publishing':
      msg = '在所有实例中发布成功'
      notifyType = 'success'
      break
    case 'concealing_started':
      msg = '级联服务开始注销'
      notifyType = 'success'
      break
    case 'finished_one_instance_concealing':
      msg = '在一个实例上注销成功'
      notifyType = 'success'
      break
    case 'finished_all_concealing':
      msg = '在所有实例上注销成功'
      notifyType = 'success'
      break
    case 'publishing_already_finished':
      msg = '服务发布成功'
      notifyType = 'success'
      break
    default:
      msg = '未知错误'
      notifyType = 'warning'
      break
  }
  return { msg, notifyType }
}
