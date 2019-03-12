/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2019 TenxCloud. All Rights Reserved.
 */

/**
 * api group detail server list
 *
 * 2019-03-04
 * @author rensiwei
 */

import React from 'react'
import { connect } from 'react-redux'
import { Modal, Row, Col, Button, Icon, Form, Input, InputNumber, Select, notification } from 'antd'
import './style/AddModal.less'
import cloneDeep from 'lodash/cloneDeep'
import filter from 'lodash/filter'
import { loadAllServices } from '../../../actions/serviceMesh'
import { addGatewayApiGroupTarget } from '../../../actions/gateway'
import getDeepValue from '@tenx-ui/utils/lib/getDeepValue'

const FormItem = Form.Item
const Option = Select.Option

class AddModal extends React.Component {
  state = {
    keys: [{
      key: 0,
    }],
  }

  getServices = () => {
    const { clusterID, loadAllServices, project } = this.props
    loadAllServices(
      clusterID,
      { headers: project, from: 0, size: 999 }
    )
  }
  componentDidMount() {
    this.getServices()
  }
  deleteItem = item => {
    const temp = cloneDeep(this.state.keys)
    const temp_key = filter(temp, { key: item.key })[0]
    if (temp_key) {
      temp_key._delete = true
      this.setState({
        keys: temp,
      })
    }
  }

  checkPort = (rule, value, cb) => {
    if (!value) return cb('请输入服务端口')
    if (value < 1 || value > 65535) return cb('服务端口范围 1~65535')
    cb()
  }

  renderList = () => {
    const { keys } = this.state
    const { form: { getFieldDecorator }, serviceList } = this.props
    return keys.map((item, index) => {
      if (item._delete) return null
      const { key } = item
      return <Row key={`server-item-${key}`}>
        <Col span={8}>
          <FormItem className="server-item-formitem">
            {
              getFieldDecorator(`serviceName-${key}`, {
                rules: [{ required: true, message: '请选择一个服务' }],
              })(
                <Select
                  placeholder="请选择服务"
                  style={{ width: '85%' }}
                >
                  {
                    serviceList && serviceList.map(_item => {
                      const name = getDeepValue(_item, [ 'service', 'metadata', 'name' ]) || ''
                      return <Option key={name} value={name}>
                        {name}</Option>
                    })
                  }
                </Select>
              )
            }
          </FormItem>
        </Col>
        <Col span={8}>
          <FormItem className="server-item-formitem">
            {
              getFieldDecorator(`port-${key}`, {
                rules: [{
                  validator: this.checkPort,
                }],
              }
              )(
                <Input
                  placeholder="8080"
                  style={{ width: '85%' }} />
              )
            }
          </FormItem>
        </Col>
        <Col span={4}>
          <FormItem className="server-item-formitem">
            {
              getFieldDecorator(`weight-${key}`, {
                initialValue: 100,
                rules: [{ required: true, message: '权重不能为空' }],
              })(
                <InputNumber
                  min={0}
                  placeholder="0"
                  style={{ width: '85%' }} />
              )
            }
          </FormItem>
        </Col>
        <Col span={4}>
          <FormItem className="server-item-formitem">
            <Button disabled={index === 0} onClick={() => this.deleteItem(item)}><Icon type="delete" /></Button>
          </FormItem>
        </Col>
      </Row>
    })
  }
  add = () => {
    const { form: { validateFields } } = this.props
    const { keys } = this.state
    let arr = []
    let _key = 0
    keys.forEach(item => {
      const { key } = item
      if (!item._delete) {
        arr = arr.concat([ `serviceName-${key}`, `port-${key}`, `weight-${key}` ])
      }
      key > _key && (_key = key)
    })
    validateFields(arr, err => {
      if (err) return
      this.setState({
        keys: cloneDeep(keys).concat({
          key: ++_key,
        }),
      })
    })
  }
  checkPortAndName = (values, keys) => {
    let b
    const { targets } = this.props
    for (let i = 0; i < keys.length; i++) {
      for (let k = 0; k < targets.length; k++) {
        const item = targets[k]
        if (item.host === values[`serviceName-${keys[i].key}`]
          && values[`port-${keys[i].key}`] === String(item.port)) {
          b = true
          notification.destroy()
          notification.warn({
            message: `服务地址:服务端口 ${item.host}:${item.port} 重复`,
          })
        }
      }
      if (b) break
      for (let j = 0; j < keys.length; j++) {
        if (i !== j
          && values[`port-${keys[i].key}`] === values[`port-${keys[j].key}`]
          && values[`serviceName-${keys[i].key}`] === values[`serviceName-${keys[j].key}`]) {
          notification.destroy()
          notification.warn({
            message: `服务地址 ${values[`serviceName-${keys[i].key}`]} + 服务端口 ${values[`port-${keys[i].key}`]} 重复`,
          })
          b = true
          break;
        }
      }
      if (b) break
    }
    return b
  }
  onSubmit = () => {
    const { onCancel, form: { validateFields }, onOk,
      clusterID, apiGroupId, addGatewayApiGroupTarget } = this.props
    const { keys } = this.state
    validateFields((err, values) => {
      if (err) return
      const body = []
      const _keys = keys.filter(item => !item._delete)
      if (this.checkPortAndName(values, _keys)) return
      _keys.forEach(item => {
        body.push({
          serviceName: values[`serviceName-${item.key}`],
          host: values[`serviceName-${item.key}`],
          proxyType: 1, // 目前逻辑 只有负载均衡可以添加
          weight: values[`weight-${item.key}`],
          port: values[`port-${item.key}`],
        })
      })
      addGatewayApiGroupTarget(clusterID, apiGroupId, body).then(res => {
        const result = getDeepValue(res, [ 'response', 'result' ]) || {}
        if (result.code === 200) {
          notification.success({
            message: '关联成功',
          })
          onOk()
          return onCancel()
        }
        notification.warn({
          message: '关联失败',
        })
      })
    })
  }
  render() {
    const { visible, onCancel } = this.props
    return (
      <Modal
        visible={visible}
        wrapClassName="service-add-modal"
        title="关联后端服务"
        onCancel={onCancel}
        maskClosable={false}
        onOk={this.onSubmit}
      >
        <Form>
          <Row>
            <Col span={8}>服务地址</Col>
            <Col span={8}>服务端口</Col>
            <Col span={4}>权重</Col>
            <Col span={4}>操作</Col>
          </Row>
          {this.renderList()}
          <a onClick={this.add}><Icon type="plus-circle" /> 添加服务地址</a>
        </Form>
      </Modal>
    )
  }
}

const mapStateToProps = state => {
  const { current, serviceMesh } = state
  const { cluster, project } = current.config
  const clusterID = cluster.id
  const serviceList = getDeepValue(serviceMesh, [ 'serviceList', 'data', 'services' ]) || []
  return {
    clusterID,
    serviceList,
    project: project.namespace,
  }
}

export default connect(mapStateToProps, {
  loadAllServices,
  addGatewayApiGroupTarget,
})(Form.create()(AddModal))
