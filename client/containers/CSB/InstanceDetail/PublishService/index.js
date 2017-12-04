/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * Publish service
 *
 * 2017-12-04
 * @author zhangpc
 */

import React from 'react'
import QueueAnim from 'rc-queue-anim'
import {
  Form, Steps, Row, Col,
} from 'antd'
import AccessAgreement from './AccessAgreement'
import OpenAgreement from './OpenAgreement'
import './style/index.less'

const Step = Steps.Step

class PublishService extends React.Component {
  render() {
    const { form } = this.props
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 },
      },
    }
    return (
      <QueueAnim className="publish-service">
        <Row key="publish-service">
          <Col span={18}>
            <div className="publish-service-steps">
              <Steps size="small" current={0}>
                <Step title="选择协议" />
                <Step title="参数设定" />
                <Step title="服务控制" />
              </Steps>
            </div>
            <Form className="publish-service-body">
              <AccessAgreement form={form} formItemLayout={formItemLayout} />
              <OpenAgreement form={form} formItemLayout={formItemLayout} />
            </Form>
          </Col>
          <Col span={6}>
            <div className="publish-service-detail">
              <div className="publish-service-detail-header">
              发布详情
              </div>
              <div className="publish-service-detail-body">
              hhh
              </div>
            </div>
          </Col>
        </Row>
      </QueueAnim>
    )
  }
}

export default Form.create()(PublishService)
