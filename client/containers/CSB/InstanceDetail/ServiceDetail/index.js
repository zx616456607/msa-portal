/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * Service detail
 *
 * 2017-12-07
 * @author zhangpc
 */

import React from 'react'
import {
  Menu, Dropdown, Row, Col, DatePicker, Tag, Table, Input,
} from 'antd'
import CreateG2 from '../../../../components/CreateG2'
import serviceIcon from '../../../../assets/img/csb/service.png'
import './style/index.less'

const RangePicker = DatePicker.RangePicker

const Chart = CreateG2(chart => {
  chart.col('dateTime', {
    alias: '时间',
    // type: 'time',
    // mask: 'MM:ss',
    tickCount: 10,
    // nice: false,
  })
  chart.col('count', {
    alias: '次数',
  })
  chart.col('monitorType', {
    type: 'cat',
  })
  chart.line()
    .position('dateTime*count')
    .color('monitorType', [ '#5cb85c', '#f85a5a' ])
    .shape('smooth')
    .size(2)
  chart.legend({
    title: '调用监控趋势',
    position: 'right', // 设置图例的显示位置
  })
  chart.render()
})

export default class ServiceDetail extends React.Component {
  state = {
    data: [
      { dateTime: '09:59:00', count: 12, monitorType: 'qps' },
      { dateTime: '10:00:00', count: 56, monitorType: 'qps' },
      { dateTime: '10:01:00', count: 78, monitorType: 'qps' },
      { dateTime: '10:02:00', count: 144, monitorType: 'qps' },
      { dateTime: '10:03:00', count: 345, monitorType: 'qps' },
      { dateTime: '10:04:00', count: 567, monitorType: 'qps' },
      { dateTime: '10:05:00', count: 456, monitorType: 'qps' },
      { dateTime: '10:06:00', count: 333, monitorType: 'qps' },
      { dateTime: '10:07:00', count: 233, monitorType: 'qps' },
      { dateTime: '10:08:00', count: 123, monitorType: 'qps' },
      { dateTime: '10:09:00', count: 56, monitorType: 'qps' },
      { dateTime: '10:10:00', count: 35, monitorType: 'qps' },
      { dateTime: '09:59:00', count: 0, monitorType: 'errNum' },
      { dateTime: '10:00:00', count: 1, monitorType: 'errNum' },
      { dateTime: '10:01:00', count: 3, monitorType: 'errNum' },
      { dateTime: '10:02:00', count: 6, monitorType: 'errNum' },
      { dateTime: '10:03:00', count: 7, monitorType: 'errNum' },
      { dateTime: '10:04:00', count: 9, monitorType: 'errNum' },
      { dateTime: '10:05:00', count: 12, monitorType: 'errNum' },
      { dateTime: '10:06:00', count: 5, monitorType: 'errNum' },
      { dateTime: '10:07:00', count: 12, monitorType: 'errNum' },
      { dateTime: '10:08:00', count: 4, monitorType: 'errNum' },
      { dateTime: '10:09:00', count: 3, monitorType: 'errNum' },
      { dateTime: '10:10:00', count: 2, monitorType: 'errNum' },
    ],
    forceFit: true,
    height: 300,
  }

  renderDropdown = () => {
    const menu = (
      <Menu style={{ width: 109 }}>
        <Menu.Item key="list">黑／白名单</Menu.Item>
        <Menu.Item key="logout">注销</Menu.Item>
      </Menu>
    )
    return (
      <Dropdown.Button overlay={menu}>
        停止服务
      </Dropdown.Button>
    )
  }

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
      <div className="service-detail">
        <div className="service-detail-header">
          <div className="service-detail-header-icon">
            <img width="80" height="80" src={serviceIcon} alt="service" />
          </div>
          <div className="service-detail-header-right">
            <div>
              <h2 className="txt-of-ellipsis">服务名称：hello</h2>
            </div>
            <Row>
              <Col span={6}>
                <div className="txt-of-ellipsis">
                  运行状态：
                  <span className="success-status">
                    已激活
                  </span>
                </div>
              </Col>
              <Col span={14}>
                <div className="txt-of-ellipsis">
                所属服务组：hellogroup
                </div>
              </Col>
              <Col span={4} className="service-detail-header-btns">
                {this.renderDropdown()}
              </Col>
            </Row>
            <Row>
              <Col span={6}>
                <div className="txt-of-ellipsis">
                服务版本：1.1
                </div>
              </Col>
              <Col span={14}>
                <div className="txt-of-ellipsis">
                服务描述：哈哈哈
                </div>
              </Col>
            </Row>
          </div>
        </div>
        <div className="service-detail-body">
          <div className="service-statistics">
            <div className="first-title">服务统计信息</div>
            <div className="service-statistics-body">
              <Row>
                <Col span={9} className="service-statistics-item">
                  <div>累计调用量</div>
                  <div>
                    <span>210</span>
                    <span>个</span>
                  </div>
                </Col>
                <Col span={10} className="service-statistics-item">
                  <div>累计错误量</div>
                  <div className="error-status">
                    <span>210</span>
                    <span>个</span>
                  </div>
                </Col>
              </Row>
              <Row className="service-statistics-and-monitor">
                <Col span={12}>服务响应 & 调用监控趋势</Col>
                <Col span={12}>
                  <RangePicker
                    showTime
                    size="small"
                    format="YYYY-MM-DD HH:mm:ss"
                  />
                </Col>
              </Row>
              <Row>
                <Col span={9} className="service-statistics-item">
                  <div>平均响应时间</div>
                  <div>
                    <span>210</span>
                    <span>ms</span>
                  </div>
                </Col>
                <Col span={10} className="service-statistics-item">
                  <div>最小响应时间</div>
                  <div>
                    <span>210</span>
                    <span>ms</span>
                  </div>
                </Col>
                <Col span={5} className="service-statistics-item">
                  <div>最大响应时间</div>
                  <div>
                    <span>210</span>
                    <span>ms</span>
                  </div>
                </Col>
              </Row>
              <div className="service-detail-body-monitor">
                <Chart
                  data={this.state.data}
                  height={this.state.height}
                  width={100}
                  forceFit={this.state.forceFit}
                />
              </div>
            </div>
          </div>
          <div className="service-protocols">
            <div className="first-title">服务协议信息</div>
            <div className="service-protocols-body row-table">
              <Row>
                <Col span={4}>接入接口协议</Col>
                <Col span={8}>
                  <div className="txt-of-ellipsis">
                  Restful-API
                  </div>
                </Col>
                <Col span={4}>开放接口协议</Col>
                <Col span={8}>
                  <div className="txt-of-ellipsis">
                    <Tag color="blue">Restful-API</Tag>
                    <Tag color="blue">WebService</Tag>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col span={4}>端点</Col>
                <Col span={8}>
                  <div className="txt-of-ellipsis">
                    /test/123
                  </div>
                </Col>
                <Col span={4}>开放地址</Col>
                <Col span={8}>
                  <div className="txt-of-ellipsis">
                    /test/123
                  </div>
                </Col>
              </Row>
              <Row>
                <Col span={4}>请求格式</Col>
                <Col span={8}>
                  <div className="txt-of-ellipsis">
                  JSON
                  </div>
                </Col>
                <Col span={4}>方法</Col>
                <Col span={8}>
                  <div className="txt-of-ellipsis">
                  GET
                  </div>
                </Col>
              </Row>
              <Row>
                <Col span={4}>消息格式转换</Col>
                <Col span={8}>
                  <div className="txt-of-ellipsis">
                  -
                  </div>
                </Col>
                <Col span={4}>响应格式</Col>
                <Col span={8}>
                  <div className="txt-of-ellipsis">
                  JSON
                  </div>
                </Col>
              </Row>
            </div>
          </div>
          <div className="service-parameters">
            <div className="first-title">服务参数信息</div>
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
          <div className="service-control">
            <div className="first-title">服务控制信息</div>
            <div className="service-control-body row-table">
              <Row>
                <Col span={4}>每秒最大调用量</Col>
                <Col span={20}>
                  <div className="txt-of-ellipsis">
                  2000000
                  </div>
                </Col>
              </Row>
              <Row>
                <Col span={4}>允许不授权访问</Col>
                <Col span={20}>
                  <div className="txt-of-ellipsis">
                  允许
                  </div>
                </Col>
              </Row>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
