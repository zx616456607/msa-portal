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
    const errorCodeDataSource = [{
      key: '1',
      code: '401',
      suggestion: '检查是否提供相应的授权信息',
      comment: '访问服务时发生未授权错误',
    }]

    const errorCodeColumns = [{
      title: '错误代码',
      dataIndex: 'code',
      key: 'code',
    }, {
      title: '处置建议',
      dataIndex: 'suggestion',
      key: 'suggestion',
    }, {
      title: '说明',
      dataIndex: 'comment',
      key: 'address',
    }]
    return (
      <div className="service-parameters">
        <div className="error-code">
          <div className="error-code-title">错误代码</div>
          <Table
            dataSource={errorCodeDataSource}
            columns={errorCodeColumns}
            pagination={false}
            size="middle"
          />
          <div className="error-code-title">模拟返回结果</div>
          <Input.TextArea />
        </div>
      </div>
    )
  }
}
