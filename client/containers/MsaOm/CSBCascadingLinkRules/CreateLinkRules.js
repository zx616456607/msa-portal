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
  Spin,
} from 'antd'
import './style/CreateLinkRules.less'
import QueueAnim from 'rc-queue-anim'
import cloneDeep from 'lodash/cloneDeep'
import classNames from 'classnames'
import { connect } from 'react-redux'
import { getInstances } from '../../../actions/CSB/instance'
import { createCsbCascadingLinkRule } from '../../../actions/CSB/cascadingLinkRules'
import {
  CSB_OM_INSTANCES_FLAG,
  UNUSED_CLUSTER_ID,
  CREATE_CSB_CASCADING_LINK_RLUE_DEFAULT_INSTANCE_QUERY,
} from '../../../constants'
import { instancesSltMaker } from '../../../selectors/CSB/instance'
import { parse as parseQuerystring } from 'query-string'
import TenxIcon from '@tenx-ui/icon/es/_old'

const FormItem = Form.Item
const Option = Select.Option
const TextArea = Input.TextArea
const Step = Steps.Step
const omInstancesSlt = instancesSltMaker(CSB_OM_INSTANCES_FLAG)

class CreateLinkRules extends React.Component {
  state = {
    confirmLoading: false,
    targetInstancesArray: [{
      index: 1,
      isDelete: false,
    }],
  }

  componentDidMount() {
    this.loadInstancesList()
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

  createLinkRules = async () => {
    const { form, createCsbCascadingLinkRule } = this.props
    form.validateFields(async (errors, values) => {
      if (errors) return
      this.setState({ confirmLoading: true })
      const { name, description } = values
      const keys = Object.keys(values)
      const literalArray = keys.sort().filter(target => {
        if (target.substring(0, 7) === 'target-') {
          return true
        }
        return false
      })
      let literalPath = ''
      literalArray.forEach(item => {
        literalPath += `<-${values[item].split('/')[0]}`
      })
      const body = {
        name,
        description,
        literalPath: literalPath.substring(2, literalPath.length),
      }
      const res = await createCsbCascadingLinkRule(body)
      this.setState({
        confirmLoading: false,
      })
      if (res.error && res.error.includes('The same order linkPath')) {
        return notification.error({
          message: '链路方向与已有级联链路完全一致，需重新添加链路实例',
        })
      }
      if (res.error) return
      notification.success({ message: '创建级联链路规则成功' })
      this.cancelCreateLinkRules()
    })
  }

  deleteTargetInstances = index => {
    const { targetInstancesArray } = this.state
    const preList = cloneDeep(targetInstancesArray)
    preList[index - 1].isDelete = true
    this.setState({ targetInstancesArray: preList })
  }

  loadInstancesList = () => {
    const { getInstances } = this.props
    getInstances(UNUSED_CLUSTER_ID, CREATE_CSB_CASCADING_LINK_RLUE_DEFAULT_INSTANCE_QUERY)
  }

  renderLinkRulesSteps = () => {
    const { targetInstancesArray } = this.state
    const { form } = this.props
    const instanceList = cloneDeep(targetInstancesArray)
    const instanceKeyList = [ 'target-0' ]
    instanceList.forEach(item => {
      if (!item.isDelete) {
        instanceKeyList.push(`target-${item.index}`)
      }
    })
    const instanceValues = form.getFieldsValue(instanceKeyList)
    let noInstance = true
    for (const key in instanceValues) {
      if (instanceValues[key] !== undefined) {
        noInstance = false
        break
      }
    }
    if (noInstance) {
      return <div className="no-instance-list">
        <div>
          <TenxIcon
            type="step-circle"
            size={26}
            className="no-instance-fill"
          />
        </div>
        <div>
          请选择实例
        </div>
      </div>
    }
    const values = form.getFieldsValue()
    return (
      <Steps direction="vertical" className="steps-row-style">
        {
          values['target-0'] && <Step
            key="target-0"
            status="finish"
            title={<div className="instance-name">实例 {values['target-0'].split('/')[1]}</div>}
            description={<div className="step-dec-style"></div>}
            icon={
              <TenxIcon
                type="step-circle"
                size={26}
                className="StepIcon"
              />
            }
          />
        }
        {
          targetInstancesArray.map(step => {
            if (step.isDelete || !values[`target-${step.index}`]) return null
            const instanceName = values[`target-${step.index}`].split('/')[1]
            return <Step
              key={`step-${step.index}`}
              status="finish"
              title={<div className="instance-name">实例 {instanceName}</div>}
              description={<div className="step-dec-style"></div>}
              icon={
                <TenxIcon
                  type="step-circle"
                  size={26}
                  className="StepIcon"
                />
              }
            />
          })
        }
      </Steps>
    )
  }

  renderInstanceSelect = item => {
    const { omInstances, form } = this.props
    const { targetInstancesArray } = this.state
    const { content, isFetching } = omInstances
    const values = form.getFieldsValue()
    const instanceIndexList = targetInstancesArray.filter(target => {
      if (!target.isDelete) return true
      return false
    })
    const instanceValuesIdList = [ 'target-0' ]
    instanceIndexList.forEach(item => {
      instanceValuesIdList.push(`target-${item.index}`)
    })
    const loadingOption = <Option value={null} disabled><Spin /></Option>
    const instanceOption = content.map(instance => {
      let disabled = false
      instanceValuesIdList.forEach(item => {
        if (values[item] && values[item].split('/')[0] === instance.id) {
          disabled = true
        }
      })
      return (
        <Option
          value={`${instance.id}/${instance.name}`}
          key={instance.id}
          disabled={disabled}
        >
          {instance.name}
        </Option>
      )
    })
    return (
      <Select placeholder={`请选择${item === 'target-0' ? '起点' : '目标'}实例`}>
        {isFetching ? loadingOption : instanceOption}
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
          'reset-from-label-style': item.index !== 1,
        })
        return (
          <FormItem
            label={ item.index === 1 ? '选择目标实例' : <span></span>}
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
            <Button icon="delete" disabled={item.index === 1} className="delete-icon-style"
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
    const instanceList = this.renderInstanceSelect('target-0')
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
                  key="target-0"
                  {...formItemLayout}
                >
                  {
                    getFieldDecorator('target-0', {
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
                  key="description"
                  {...formItemLayout}
                >
                  {
                    getFieldDecorator('description', {
                      rules: [{
                        required: true,
                        message: '链路规则描述不能为空',
                      }, {
                        validator: (rule, value, callback) => {
                          if (!value) return callback()
                          if (value.length < 5) return callback('请输入至少五个字符')
                          if (value.length > 255) return callback('描述信息最多255个字符')
                          return callback()
                        },
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
              <div className="title">链路方向</div>
              <div className="step-container">{this.renderLinkRulesSteps()}</div>
            </Col>
          </Row>
        </Card>
      </QueueAnim>
    )
  }
}

const mapStateToProps = (state, props) => {
  const { match } = props
  const { instanceID } = match.params
  const { location } = props
  location.query = parseQuerystring(location.search)
  location.from = 'createLinkRule'
  return {
    instanceID,
    omInstances: omInstancesSlt(state, props),
  }
}

export default connect(mapStateToProps, {
  getInstances,
  createCsbCascadingLinkRule,
})(Form.create()(CreateLinkRules))
