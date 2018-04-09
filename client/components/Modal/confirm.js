/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * confirm Modal
 * https://ant.design/components/modal-cn/#components-modal-demo-confirm
 *
 * 2017-11-07
 * @author zhangpc
 */

import React from 'react'
import ReactDOM from 'react-dom'
import { Modal, Icon } from 'antd'
import ActionButton from 'antd/lib/modal/ActionButton'
import classNames from 'classnames'

export default function confirm(config) {
  let {
    iconType,
    okType,
    width,
    style,
    maskClosable,
    modalTitle,
    content,
    type,
    className,
    title,
    cancelText,
    okText,
    onCancel,
    onOk,
    ...otherProps
  } = config

  iconType = iconType || 'question-circle'
  okType = okType || 'primary'

  const prefixCls = 'ant-confirm'
  const div = document.createElement('div')
  document.body.appendChild(div)

  width = width || 416
  style = style || {}

  type = type || 'confirm'

  modalTitle = modalTitle || '确定操作'

  // 默认为 false，保持旧版默认行为
  maskClosable = maskClosable === undefined ? false : maskClosable

  function close(...args) {
    const unmountResult = ReactDOM.unmountComponentAtNode(div)
    if (unmountResult && div.parentNode) {
      div.parentNode.removeChild(div)
    }
    const triggerCancel = args && args.length &&
      args.some(param => param && param.triggerCancel)
    if (onCancel && triggerCancel) {
      onCancel(...args)
    }
  }

  const body = (
    <div className={`${prefixCls}-body`}>
      <Icon type={iconType} />
      <span className={`${prefixCls}-title`}>{title}</span>
      <div className={`${prefixCls}-content`}>{content}</div>
    </div>
  )

  cancelText = cancelText || '取消'
  okText = okText || '确定'
  const footer = (
    [
      <ActionButton actionFn={onCancel} closeModal={close} key="cancel">
        {cancelText}
      </ActionButton>,
      <ActionButton type={okType} actionFn={onOk} closeModal={close} autoFocus key="ok">
        {okText}
      </ActionButton>,
    ]
  )

  const classString = classNames(prefixCls, {
    [`${prefixCls}-${type}`]: true,
    'tenx-confirm-modal': true,
  }, className)

  ReactDOM.render(
    <Modal
      className={classString}
      onCancel={close.bind(this, { triggerCancel: true })}
      visible
      title={modalTitle}
      maskClosable={maskClosable}
      style={style}
      width={width}
      okType={okType}
      {...otherProps}
      footer={footer}
    >
      <div className={`${prefixCls}-body-wrapper`}>
        {body}
      </div>
    </Modal>,
    div
  )

  return {
    destroy: close,
  }
}
