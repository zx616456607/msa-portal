/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2018 TenxCloud. All Rights Reserved.
 */

/**
 * NewRoute container
 *
 * 2018-10-10
 * @author zhouhaitao
 */

import React from 'react'
import ReturnButton from '@tenx-ui/return-button'
import { Card, Form, Input, Select, Radio, Button, Tag } from 'antd'
import './style/NewRoute.less'

const FormItem = Form.Item
const Option = Select.Option
const RadioGroup = Radio.Group
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 2 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 10, push: 1 },
  },
}

class NewRouteComponent extends React.Component {
  state = {
    ruleName: '',
    visitType: 'pub',
  }
  nameProps = () => {
    const { getFieldDecorator } = this.props.form
    return getFieldDecorator('ruleName', {
      onChange: e => this.setState({ ruleName: e.target.value }),
      rules: [
        { required: true, message: '请输入规则名称' },
      ],
      trigger: 'onChange',
    })
  }
  visitTypeProps = () => {
    const { getFieldDecorator } = this.props.form
    return getFieldDecorator('visitType', {
      initialValue: this.state.visitType,
      onChange: e => this.setState({ visitType: e.target.value }),
    })

  }
  render() {
    const { nameProps, visitTypeProps } = this
    const { visitType } = this.state
    return <div id="new-route">
      <div className="top">
        <ReturnButton onClick={() => this.props.history.push('/service-mesh/routes-management')}>返回路由管理列表</ReturnButton>
        <span>
          {
            this.props.match.params.id ? '创建路由规则' : '编辑路由规则'
          }
        </span>
      </div>
      <Card>
        <Form>
          <FormItem
            label="规则名称"
            {...formItemLayout}
          >
            {nameProps()(<Input placeholder="请输入规则名称"/>)}
          </FormItem>
          <FormItem
            label="选择组件"
            {...formItemLayout}
          >
            <Select
              placeholder="请选择组件"
              style={{ width: 200 }}
            >
              <Option value="1"> 组件1</Option>
              <Option value="2"> 组件2</Option>
            </Select>
          </FormItem>
          <FormItem
            label="访问方式"
            {...formItemLayout}
          >
            {
              visitTypeProps()(
                <RadioGroup>
                  <Radio value="pub">公网访问</Radio>
                  <Radio value="inner">仅在集群内访问</Radio>
                </RadioGroup>
              )
            }
            <div className="visit-type-inner">
              {
                visitType === 'pub' ?
                  <div className="pub-content">
                    <div className="tip">该规则中的服务可通过网关访问，请选择网络出口</div>
                    <div className="selection">
                      <Select
                        mode="multiple"
                        placeholder="选择网关（gateway）"
                        style={{ width: 200 }}
                      >
                        <Option value="gateway1">gateway1</Option>
                        <Option value="gateway2">gateway2</Option>
                      </Select>
                      <Button icon="sync"/>
                      <a href="/www.baidu.com" target="_blank">去创建网关 >></a>
                      <div>
                        <Tag closable>网关1</Tag><Tag closable>网关2</Tag>
                      </div>
                    </div>
                  </div>
                  :
                  <div className="inner-content">
                    该规则中的服务仅提供给集群内其他服务访问
                  </div>
              }
            </div>
          </FormItem>
        </Form>
      </Card>
    </div>
  }
}
const NewRoute = Form.create()(NewRouteComponent)
export default NewRoute
