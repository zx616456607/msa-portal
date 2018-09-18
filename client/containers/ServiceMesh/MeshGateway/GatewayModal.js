/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2018 TenxCloud. All Rights Reserved.
 */

/**
 *
 *
 * @author zhangxuan
 * @date 2018-05-17
 */
import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Modal, Form, Input, Select, Icon } from 'antd'
import './style/GatewayModal.less'

const { Option } = Select
const FormItem = Form.Item
const formItemLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 14 },
}
const formItemLayoutWithOutLabel = {
  wrapperCol: {
    span: 14,
    offset: 7,
  },
}

class GatewayModal extends React.Component {
  static propTypes = {
    visible: PropTypes.bool.isRequired,
    type: PropTypes.string.isRequired,
    loadData: PropTypes.func,
    closeModal: PropTypes.func.isRequired,
  }

  state = {
    uuid: 0,
  }

  handleConfirm = async () => {
    const { form } = this.props
    const { validateFields } = form
    validateFields(async errors => {
      if (errors) {
        return
      }
    })
  }
  addItems = () => {
    const { form } = this.props
    const { uuid } = this.state
    const keys = form.getFieldValue('keys')
    this.setState({
      uuid: uuid + 1,
    })
    form.setFieldsValue({
      keys: keys.concat(uuid),
    })
  }
  removeItems = k => {
    const { form } = this.props
    const keys = form.getFieldValue('keys')
    if (keys.length === 1) return
    form.setFieldsValue({
      keys: keys.filter(key => key !== k),
    });
  }
  modalTitle = () => {
    switch (this.props.type) {
      case 'create':
        return '创建网关'
      case 'edit':
        return '编辑网关'
      default:
        return '网关详情'
    }
  }
  renderItems = () => {
    const { form: { getFieldValue, getFieldDecorator } } = this.props
    getFieldDecorator('keys', { initialValue: [] })
    const keys = getFieldValue('keys')
    return (
      <React.Fragment>
        {
          keys.map((k, index) => {
            return (
              <FormItem
                {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
                label={index === 0 ? '解析服务域名' : ''}
                required={false}
                key={k}
              >
                {getFieldDecorator(`domain[${k}]`, {
                  validateTrigger: [ 'onChange', 'onBlur' ],
                  rules: [{
                    required: true,
                    whitespace: true,
                    message: '请输入服务域名',
                  }],
                })(
                  <Input className={'domainInput'} placeholder="请输入服务域名" />
                )}
                {keys.length > 1 ? (
                  <Icon
                    type="minus-circle-o"
                    disabled={keys.length === 1}
                    onClick={() => this.removeItems(k)}
                    className="remove"
                  />
                ) : null}
              </FormItem>
            )
          })
        }
        <div onClick={this.addItems} className="add"><Icon type="plus-circle" theme="outlined" /> 添加服务域名</div>
      </React.Fragment>
    )
  }
  render() {
    const { form, visible, closeModal } = this.props
    const { loading } = this.state
    const { getFieldDecorator } = form

    return (
      <Modal
        className={'mesh-gateway-modal'}
        title={this.modalTitle()}
        onCancel={closeModal}
        onOk={this.handleConfirm}
        visible={visible}
        confirmLoading={loading}
        maskClosable={false}
      >
        <Form>
          <FormItem {...formItemLayout} label="网关名称">
            {
              getFieldDecorator('name', {
                initialValue: '',
              })(
                <Input type="text" placeholder="请输入网关名称"/>
              )
            }
          </FormItem>
          <FormItem {...formItemLayout} label="服务网格出口">
            {
              getFieldDecorator('out', {
                initialValue: '',
              })(
                <Select
                  placeholder={'请选择服务网格出口'}
                >
                  <Option value={3}>3333</Option>
                  <Option value={4}>444</Option>
                </Select>
              )
            }
          </FormItem>
          {
            this.renderItems()
          }
        </Form>
      </Modal>
    )
  }
}

export default connect(null, {})(Form.create()(GatewayModal))
