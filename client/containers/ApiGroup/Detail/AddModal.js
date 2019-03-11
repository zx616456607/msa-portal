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
import { Modal, Row, Col, Button, Icon, Form, Input, InputNumber, Select } from 'antd'
import './style/AddModal.less'
import cloneDeep from 'lodash/cloneDeep'
import filter from 'lodash/filter'

const FormItem = Form.Item
const Option = Select.Option

class AddModal extends React.Component {
  state = {
    keys: [{
      key: 0,
    }],
  }

  componentDidMount() {
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

  checkPort = (rule, value, cb, idx) => {
    if (!value) return cb('请输入服务端口')
    if (value < 1 || value > 65535) return cb('服务端口范围 1~65535')
    const { form: { getFieldValue } } = this.props
    const { keys } = this.state
    let b
    keys.forEach(item => {
      if (!item._delete && item.key !== idx && getFieldValue('port-' + item.key) === value) {
        b = true
      }
    })
    if (b) return cb('服务端口重复')
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
                rules: [{ required: true, message: '请选择一个服务' }, {
                  validator: this.validateToNextService,
                }],
              })(
                <Select
                  placeholder="请选择服务"
                  style={{ width: '85%' }}
                >
                  {
                    serviceList && Object.keys(serviceList).map((_item, index) => {
                      if (serviceList[_item].istioEnabled === true) {
                        return <Option key={index} value={_item}>
                          {_item}</Option>
                      }
                      return null
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
                  validator: (rule, value, cb) => this.checkPort(rule, value, cb, key),
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
                rules: [{ required: true, message: '权重不能为空' }],
              }
              )(
                <InputNumber
                  placeholder="0"
                  style={{ width: '85%' }} />
              )
            }
          </FormItem>
        </Col>
        <Col span={4}>
          <FormItem className="server-item-formitem">
            {index !== 0 && <Button onClick={() => this.deleteItem(item)}><Icon type="delete" /></Button>}
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
  onSubmit = () => {
    const { onCancel, form: { validateFields } } = this.props
    validateFields(err => {
      if (err) return
    })
    onCancel()
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
  return state
}

export default connect(mapStateToProps, {
})(Form.create()(AddModal))
