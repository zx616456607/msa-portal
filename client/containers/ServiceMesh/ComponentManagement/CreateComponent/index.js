/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2018 TenxCloud. All Rights Reserved.
 */

/**
 * CreateComponent container
 *
 * 2018-09-30
 * @author zhaoyb
 */

import React from 'react'
import { connect } from 'react-redux'
import QueueAnim from 'rc-queue-anim'
import { Button, Input, Card, Form, Row, Col, Icon, Select } from 'antd'
import './style/index.less'
const FormItem = Form.Item;

class CreateComponent extends React.Component {
  state = {}

  handleBack = () => {
  }

  render() {
    const { form } = this.props
    const { getFieldDecorator } = form
    const formItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 10 },
    }

    return (
      <QueueAnim className="create-component">
        <div className="create-component-btn layout-content-btns" keys="btn">
          <div className="back">
            <span className="backjia"></span>
            <span className="btn-back" onClick={() =>
              this.props.history.push('/service-mesh/component-management')
            }>返回</span>
          </div>
          <div className="title">编辑组件</div>
        </div>
        <Card className="create-component-body">
          <div>
            <Row>
              <FormItem {...formItemLayout} label="组件名">
                {getFieldDecorator('componentName', {
                  initialValue: undefined,
                  rules: [{ pattern: '', whitespace: true, message: '' }],
                })(
                  <Input className="selects" placeholder="请输入组件名称" />
                )}
              </FormItem>
            </Row>
            <Row>
              <FormItem {...formItemLayout} label="描述">
                {getFieldDecorator('desc', {
                  initialValue: undefined,
                  rules: [{ pattern: '', whitespace: true, message: '' }],
                })(
                  <Input className="selects" placeholder="请输入描述" />
                )}
              </FormItem>
            </Row>
            <div className="dotted" />
          </div>
          <div>
            <div className="form-title">
              <Row>
                <span className="service">选择服务</span>
                <Button><Icon type="link" />关联后端服务</Button>
                <span><Icon type="info-circle-o" />解除关联后端服务后，路由规则中相应的版本也将被移除，服务的对外访问方式将失效</span>
              </Row>
              <Row className="serviceHeader">
                <Col span={6}>服务</Col>
                <Col span={7}>组件服务版本</Col>
                <Col span={3} offset={1}>操作</Col>
              </Row>
              <Row className="serviceList" type="flex" align="middle">
                <Col span={6}>
                  <Select placeholder="请选择国家">
                  </Select>
                </Col>
                <Col span={6}>
                  <FormItem>
                    <Input
                      style={{ width: '100%' }}
                      {...getFieldDecorator('weight', {
                        initialValue: 1,
                      })}
                    />
                  </FormItem>
                </Col>
              </Row>
            </div>
            <div className="dotted" />
            <div className="btn-bottom">
              <Button className="cancel">取消</Button>
              <Button type="primary">确定</Button>
            </div>
          </div>
        </Card>
      </QueueAnim>
    )
  }
}

const mapStateToProps = state => {
  const { current } = state
  const { cluster } = current.config
  const clusterID = cluster.id
  return {
    clusterID,
  }
}

export default connect(mapStateToProps, {
})(Form.create()(CreateComponent))
