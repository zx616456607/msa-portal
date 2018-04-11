/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * Service parameters detail
 *
 * 2017-12-22
 * @author zhangpc
 */

import React from 'react'
import {
  Table, Input,
} from 'antd'

export default class Parameters extends React.Component {
  render() {
    const { detail } = this.props
    const errorCode = JSON.parse(detail.errorCode || '[]')
    const errorCodeColumns = [{
      title: '错误代码',
      dataIndex: 'code',
      key: 'code',
    }, {
      title: '处置建议',
      dataIndex: 'advice',
      key: 'advice',
    }, {
      title: '说明',
      dataIndex: 'description',
      key: 'description',
    }]
    return (
      <div className="service-parameters">
        <div className="error-code">
          <div className="second-title">错误代码</div>
          <Table
            dataSource={errorCode}
            columns={errorCodeColumns}
            pagination={false}
            size="middle"
          />
          <div className="second-title">模拟返回结果</div>
          <Input.TextArea />
        </div>
      </div>
    )
  }
}
