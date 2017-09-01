/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * TransactionInspector component
 *
 * 2017-09-01
 * @author zhangpc
 */

import React from 'react'
import { Row, Col, Table, Spin, Progress, Icon } from 'antd'
import './style/index.less'

export default class TransactionInspector extends React.Component {
  state = {
    expandedRowKeys: [],
  }

  componentWillReceiveProps(nextProps) {
    const { dataSource } = nextProps
    const { transactionId } = dataSource
    if (transactionId && transactionId !== this.props.dataSource.transactionId) {
      const { parentKeys } = this.formatData(dataSource)
      this.setState({
        expandedRowKeys: parentKeys,
      })
    }
  }

  formatData(dataSource) {
    const callStack = dataSource.callStack || []
    let data = callStack.map(stack => (
      {
        id: parseInt(stack[6]),
        parentID: parseInt(stack[7] || '0'),
        method: stack[10],
        argument: stack[11],
        startTime: stack[12],
        gapMs: stack[13],
        execMs: stack[14],
        execPercent: '',
        selfMs: stack[16],
        class: stack[17],
        api: stack[19],
        agent: stack[20],
        application: dataSource.applicationId,
        isHasException: stack[22],
      }
    ))
    data = data.sort((a, b) => b.parentID - a.parentID)
    let formatData = []
    const parentObj = {}
    let rootParentExecMs
    const findStackByID = id => {
      for (let i = 0; i < data.length; i++) {
        if (data[i].id === id) {
          return data[i]
        }
      }
    }
    data.forEach(stack => {
      const { parentID } = stack
      if (parentID) {
        const parent = findStackByID(parentID)
        if (!parent.children) {
          parent.children = [ stack ]
        } else {
          parent.children.push(stack)
        }
        parentObj[parentID] = true
      } else {
        formatData.push(stack)
        rootParentExecMs = stack.execMs
      }
    })
    formatData = formatData.reverse()
    return {
      data: formatData,
      parentKeys: Object.keys(parentObj).map(key => parseInt(key)),
      rootParentExecMs,
    }
  }

  percent(numerator, denominator) {
    let percentage = (numerator / denominator) * 100
    if (percentage > 100) {
      percentage = 100
    }
    return percentage
  }

  render() {
    const { dataSource } = this.props
    const { expandedRowKeys } = this.state
    const { data, rootParentExecMs } = this.formatData(dataSource)
    const columns = [{
      title: 'Method',
      dataIndex: 'method',
      key: 'method',
      width: '20%',
      render: (text, record) => {
        if (!record.isHasException) {
          return text
        }
        return (
          <span className="error"><Icon type="close-circle-o" /> {text}</span>
        )
      },
    }, {
      title: 'Argument',
      dataIndex: 'argument',
      key: 'argument',
      width: '12%',
    }, {
      title: 'Start time',
      dataIndex: 'startTime',
      key: 'startTime',
      width: '10%',
    }, {
      title: 'Gap(ms)',
      dataIndex: 'gapMs',
      key: 'gapMs',
      width: '5%',
    }, {
      title: 'Exec(ms)',
      dataIndex: 'execMs',
      key: 'execMs',
      width: '5%',
    }, {
      title: 'Exec(%)',
      dataIndex: 'execPercent',
      key: 'execPercent',
      width: '8%',
      render: (text, record) => {
        let { execMs, selfMs } = record
        selfMs && (selfMs = parseInt(selfMs))
        return (
          <div>
            {
              execMs && (
                <Progress
                  percent={this.percent(execMs, rootParentExecMs)}
                  strokeWidth={4}
                  showInfo={false}
                />
              )
            }
            {
              selfMs > 0 && (
                <Progress
                  percent={this.percent(selfMs, rootParentExecMs)}
                  strokeWidth={4}
                  showInfo={false}
                />
              )
            }
          </div>
        )
      },
    }, {
      title: 'Self(ms)',
      dataIndex: 'selfMs',
      key: 'selfMs',
      width: '5%',
    }, {
      title: 'Class',
      dataIndex: 'class',
      key: 'class',
      width: '8%',
    }, {
      title: 'API',
      dataIndex: 'api',
      key: 'api',
      width: '8%',
    }, {
      title: 'Agent',
      dataIndex: 'agent',
      key: 'agent',
      width: '8%',
    }, {
      title: 'Application',
      dataIndex: 'application',
      key: 'application',
      width: '11%',
    }]
    return (
      <div className="transaction-inspector">
        <Spin spinning={dataSource.isFetching}>
          <div className="transaction-inspector-toggler">
            <div className="transaction-inspector-toggler-center"></div>
          </div>
          <Row className="transaction-inspector-title">
            <Col span={6}>
              <div className="transaction-inspector-title-cell txt-of-ellipsis">
                Application: {dataSource.applicationName}
              </div>
            </Col>
            <Col span={6}>
              <div className="transaction-inspector-title-cell txt-of-ellipsis">
                TransactionId: {dataSource.transactionId}
              </div>
            </Col>
            <Col span={6}>
              <div className="transaction-inspector-title-cell txt-of-ellipsis">
                AgentId: {dataSource.agentId}
              </div>
            </Col>
            <Col span={6}>
              <div className="transaction-inspector-title-cell txt-of-ellipsis no-border">
                ApplicationName: {dataSource.applicationId}
              </div>
            </Col>
          </Row>
          <div className="transaction-inspector-call-stack">
            <div className="transaction-inspector-call-stack-header">
              <table>
                <thead>
                  <tr>
                    <th width="20%">Method</th>
                    <th width="12%">Argument</th>
                    <th width="10%">Start time</th>
                    <th width="5%">Gap(ms)</th>
                    <th width="5%">Exec(ms)</th>
                    <th width="8%">Exec(%)</th>
                    <th width="5%">Self(ms)</th>
                    <th width="8%">Class</th>
                    <th width="8%">API</th>
                    <th width="8%">Agent</th>
                    <th width="11%">Application</th>
                  </tr>
                </thead>
              </table>
            </div>
            <Table
              className="transaction-inspector-call-stack-body"
              columns={columns}
              dataSource={data}
              pagination={false}
              showHeader={false}
              rowKey={record => record.id}
              defaultExpandAllRows={true}
              expandedRowKeys={expandedRowKeys}
              onExpandedRowsChange={expandedRowKeys => this.setState({ expandedRowKeys })}
              size="small"
            />
          </div>
        </Spin>
      </div>
    )
  }
}
