/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2018 TenxCloud. All Rights Reserved.
 */

/**
 * Create CSB Cascading Link Rules Component
 *
 * 2018-1-11
 * @author zhangcz
 */

import React from 'react'
import {
  Row, Col, Form, Input, Select,
  Button, Card, notification, Steps,
} from 'antd'
import './style/CreateLinkRules.less'
import QueueAnim from 'rc-queue-anim'
import cloneDeep from 'lodash/cloneDeep'
import classNames from 'classnames'
import StepIcon from '../../../assets/img/csb/StepIcon.svg'

const FormItem = Form.Item
const Option = Select.Option
const TextArea = Input.TextArea
const Step = Steps.Step

class CreateLinkRules extends React.Component {
  state = {
    confirmLoading: false,
    targetInstancesArray: [{
      index: 0,
      isDelete: false,
    }],
  }

  addTargetInstances = () => {
    const { targetInstancesArray } = this.state
    const { form } = this.props
    const availableList = targetInstancesArray.filter(item => {
      if (item.isDelete) return false
      return true
    })
    const lastItem = availableList[availableList.length - 1]
    const validateArray = [ `target-${lastItem.index}` ]
    form.validateFields(validateArray, errors => {
      if (errors) return
      const preList = cloneDeep(targetInstancesArray)
      preList.push({
        index: lastItem.index + 1,
        isDelete: false,
      })
      this.setState({ targetInstancesArray: preList })
    })
  }

  cancelCreateLinkRules = () => {
    const { history } = this.props
    history.push('/msa-om/csb-cascading-link-rules')
  }

  createLinkRules = () => {
    const { form } = this.props
    form.validateFields((errors, values) => {
      if (errors) return
      this.setState({ confirmLoading: true })
      console.log('values=', values)
      setTimeout(() => {
        notification.success({ message: '创建级联链路规则成功' })
        this.setState({
          confirmLoading: false,
        }, this.cancelCreateLinkRules)
      }, 2000)
    })
  }

  deleteTargetInstances = index => {
    const { targetInstancesArray } = this.state
    const preList = cloneDeep(targetInstancesArray)
    preList[index].isDelete = true
    this.setState({ targetInstancesArray: preList })
  }

  renderLinkRulesSteps = () => {
    const { targetInstancesArray } = this.state
    const { form } = this.props
    if (!targetInstancesArray.length) return <span>暂无实例授信</span>
    const values = form.getFieldsValue()
    return (
      <Steps direction="vertical" className="steps-row-style">
        {
          values.start && <Step
            key="start"
            status="finish"
            title={<span>{values.start}</span>}
            description={<div className="step-dec-style"></div>}
            icon={<svg className="StepIcon">
              <use xlinkHref={`#${StepIcon.id}`}/>
            </svg>}
          />
        }
        {
          targetInstancesArray.map(step => {
            if (step.isDelete || !values[`target-${step.index}`]) return null
            return <Step
              key={`step-${step.index}`}
              status="finish"
              title={<span>{values[`target-${step.index}`]}</span>}
              description={<div className="step-dec-style"></div>}
              icon={<svg className="StepIcon">
                <use xlinkHref={`#${StepIcon.id}`}/>
              </svg>}
            />
          })
        }
      </Steps>
    )
  }

  renderInstanceSelect = item => {
    return (
      <Select placeholder={`请选择${item === 'start' ? '起点' : '目标'}实例`}>
        <Option value="实例a">实例a</Option>
        <Option value="实例b">实例b</Option>
        <Option value="实例c">实例c</Option>
        <Option value="实例d">实例d</Option>
      </Select>
    )
  }

  renderTargetInstanceTemplate = formItemLayout => {
    const { form } = this.props
    const { getFieldDecorator } = form
    const { targetInstancesArray } = this.state
    const instanceList = this.renderInstanceSelect()
    return targetInstancesArray.map(item => {
      if (!item.isDelete) {
        const resetFormLabelClass = classNames({
          'reset-from-label-style': item.index !== 0,
        })
        return (
          <FormItem
            label={ item.index === 0 ? '选择目标实例' : <span></span>}
            key={`target-${item.index}`}
            {...formItemLayout}
            className={resetFormLabelClass}
          >
            {
              getFieldDecorator(`target-${item.index}`, {
                rules: [{
                  required: true,
                  message: '目标实例不能为空',
                }],
              })(instanceList)
            }
            <Button icon="delete" disabled={item.index === 0} className="delete-icon-style"
              onClick={this.deleteTargetInstances.bind(this, item.index)}
            />
          </FormItem>
        )
      }
      return null
    })
  }

  render() {
    const { confirmLoading } = this.state
    const { form } = this.props
    const { getFieldDecorator } = form
    const formItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 15 },
    }
    const instanceList = this.renderInstanceSelect('start')
    return (
      <QueueAnim>
        <div key="second"></div>
        <Card id="create-link-rules" key="create-link-rules">
          <Row type="flex">
            <Col span={17}>
              <div className="padding-style">
                <div className="second-title">创建级联链路规则</div>
              </div>
              <Form className="padding-style">
                <FormItem
                  label="链路规则名称"
                  key="name"
                  {...formItemLayout}
                >
                  {
                    getFieldDecorator('name', {
                      rules: [{
                        required: true,
                        message: '链路规则名称不能为空',
                      }],
                    })(
                      <Input placeholder="请输入链路规则名称"/>
                    )
                  }
                </FormItem>
                <FormItem
                  label="选择起点实例"
                  key="start"
                  {...formItemLayout}
                >
                  {
                    getFieldDecorator('start', {
                      rules: [{
                        required: true,
                        message: '起点实例不能为空',
                      }],
                    })(instanceList)
                  }
                </FormItem>
                {this.renderTargetInstanceTemplate(formItemLayout)}
                <Row>
                  <Col span={5}/>
                  <Col span={15}>
                    <Button type="dashed" icon="plus" className="add-button-style"
                      onClick={() => this.addTargetInstances()}
                    >
                      添加一个实例
                    </Button>
                  </Col>
                </Row>
                <FormItem
                  label="链路规则描述"
                  key="desc"
                  {...formItemLayout}
                >
                  {
                    getFieldDecorator('desc', {
                      rules: [{
                        required: true,
                        message: '链路规则描述不能为空',
                      }],
                    })(
                      <TextArea placeholder="请输入至少五个字符"/>
                    )
                  }
                </FormItem>
              </Form>
              <div className="hander-box">
                <Button onClick={() => this.cancelCreateLinkRules()}>取消</Button>
                <Button type="primary" loading={confirmLoading}
                  onClick={() => this.createLinkRules()}>
                  确定
                </Button>
              </div>
            </Col>
            <Col span={7}>
              <div className="title">实例授信</div>
              <div className="step-container">{this.renderLinkRulesSteps()}</div>
            </Col>
          </Row>
        </Card>
      </QueueAnim>
    )
  }
}

export default Form.create()(CreateLinkRules)
