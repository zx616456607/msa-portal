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
      name: '胡彦斌',
      age: 32,
      address: '西湖区湖底公园1号',
    }, {
      key: '2',
      name: '胡彦祖',
      age: 42,
      address: '西湖区湖底公园1号',
    }]

    const errorCodeColumns = [{
      title: '错误代码',
      dataIndex: 'name',
      key: 'name',
    }, {
      title: '处置建议',
      dataIndex: 'age',
      key: 'age',
    }, {
      title: '说明',
      dataIndex: 'address',
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
