/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * LOGS
 *
 * 2017-11-10
 * @author zhaoyb
 */

import React from 'react'
import QueueAnim from 'rc-queue-anim'
import { Row, Col, Select, Button, Form, Input, DatePicker } from 'antd'
import LogComponent from './LogsDetail'
import select from '../../../assets/img/msa-pam/select.svg'
const FormItem = Form.Item
const { RangePicker } = DatePicker

class Logs extends React.Component {
  render() {
    const { getFieldDecorator } = this.props.form
    return (
      <QueueAnim className="log">
        <div className="form" key="from">
          <Row gutter={8}>
            <Col span={4}>
              <FormItem>
                {getFieldDecorator('project', {
                  rules: [{ required: true, message: '请选择项目' }],
                })(
                  <Select style={{ width: '100%' }} placeholder="选择项目" size="default"></Select>
                )}
              </FormItem>
            </Col>
            <Col span={4}>
              <FormItem>
                {getFieldDecorator('colony', {
                  rules: [{ required: true, message: '请选择集群' }],
                })(
                  <Select style={{ width: '100%' }} placeholder="选择集群" size="default"></Select>
                )}
              </FormItem>
            </Col>
            <Col span={4}>
              <FormItem>
                {getFieldDecorator('server', {
                  rules: [{ required: true, message: '请选择服务' }],
                })(
                  <Select style={{ width: '100%' }} placeholder="选择服务" size="default"></Select>
                )}
              </FormItem>
            </Col>
            <Col span={4}>
              <FormItem>
                {getFieldDecorator('example', {
                  rules: [{ required: true, message: '请选择实例' }],
                })(
                  <Select style={{ width: '100%' }} placeholder="选择实例" size="default"></Select>
                )}
              </FormItem>
            </Col>
            <Col span={4}>
              <FormItem>
                {getFieldDecorator('time', {
                  rules: [{ required: true, message: '请选择时间' }],
                })(
                  <RangePicker
                    size="default"
                    key="timePicker"
                    showTime={{ format: 'HH:mm' }}
                    format="YYYY-MM-DD HH:mm"
                    placeholder={[ '开始日期', '结束日期' ]}
                    onChange={this.onChange}
                    onOk={this.onOk}
                  />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={8}>
            <Col span={4}>
              <FormItem>
                {getFieldDecorator('search', {
                  rules: [{ required: true, message: '请填写关键词' }],
                })(
                  <Input placeholder="关键字" size="default"/>
                )}
              </FormItem>
            </Col>
            <Col span={4} style={{ lineHeight: 2.6 }}>
              <Button type="primary">
                <svg className="select">
                  <use xlinkHref={`#${select.id}`} />
                </svg>
                立即查询
              </Button>
            </Col>
          </Row>
        </div>
        <div className="logs" key="logs">
          <LogComponent />
        </div>
      </QueueAnim>
    )
  }
}
export default Form.create()(Logs)