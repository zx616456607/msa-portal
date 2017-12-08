/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * Blacklist && Whitelist
 *
 * 2017-12-05
 * @author zhangcz
 */

import React from 'react'
import PropTypes from 'prop-types'
import {
  Form, Modal, Row, Col,
  Input, Icon, Button, Radio,
  Tooltip,
} from 'antd'
import './style/blackAndWhiteListModal.less'
import cloneDeep from 'lodash/cloneDeep'

const FormItem = Form.Item
const RadioGroup = Radio.Group

class BlackAndWhiteListModal extends React.Component {
  static propTypes = {
    // 关闭 Modal 的函数
    closeblackAndWhiteModal: PropTypes.func.isRequired,
    // 点击确定按钮，获取 Modal 输入的值，供父组件调用
    callback: PropTypes.func.isRequired,
    // 确定按钮的 loading 态
    loading: PropTypes.bool.isRequired,
  }

  state = {
    blacklistArray: [{ IP: '1.1.1.1' }],
    whitelistArray: [{ IP: '1.1.1.1' }],
    blacklist: [],
    whitelist: [],
  }

  componentWillMount() {
    const { blacklistArray, whitelistArray } = this.state
    const blacklist = []
    const whitelist = []
    blacklistArray.forEach((value, index) => {
      const item = { index }
      blacklist.push(item)
    })
    whitelistArray.forEach((value, index) => {
      const item = { index }
      whitelist.push(item)
    })
    this.setState({
      blacklist,
      whitelist,
    })
  }

  addlist = (list, type) => {
    const preList = cloneDeep(list)
    const preIndex = preList[ preList.length - 1].index
    const item = {
      index: preIndex + 1,
    }
    preList.push(item)
    if (type === 'black') {
      this.setState({
        blacklist: preList,
      })
      return
    }
    if (type === 'white') {
      this.setState({
        whitelist: preList,
      })
      return
    }
  }

  cancleEdit = () => {
    const { closeblackAndWhiteModal } = this.props
    closeblackAndWhiteModal()
  }

  deletelist = (item, list, type) => {
    const prelist = []
    list.forEach(value => {
      if (value.index !== item.index) {
        prelist.push(value)
      }
    })
    if (type === 'white') {
      this.setState({
        whitelist: prelist,
      })
      return
    }
    if (type === 'black') {
      this.setState({
        blacklist: prelist,
      })
      return
    }
  }

  saveEdit = () => {
    const { callback, form } = this.props
    form.validateFields((errors, values) => {
      if (errors) {
        return
      }
      callback(values)
    })
  }

  renderList = (list, listArray, type) => {
    const { form } = this.props
    const { getFieldDecorator } = form
    let formProps = 'black'
    if (type === 'white') {
      formProps = 'white'
    }
    return list.map((item, index) => {
      return <FormItem key={`${formProps}-${index}`}>
        {
          getFieldDecorator(`${formProps}-${item.index}`, {
            initialValue: listArray[item.index] ? listArray[item.index].IP : undefined,
            rules: [{
              required: true,
              message: 'IP地址或者IP网段不能为空',
            }],
          })(
            <Input placeholder="IP地址如：192.168.1.1，或IP网段如：192.168.1.1/24"/>
          )
        }
        <Icon type="delete" onClick={this.deletelist.bind(this, item, list, formProps)}/>
      </FormItem>
    })
  }

  render() {
    const { blacklist, whitelist, blacklistArray, whitelistArray } = this.state
    const { form, loading } = this.props
    const { getFieldDecorator } = form
    return <Modal
      title="设置黑／白名单"
      visible={true}
      closable={true}
      onCancel={this.cancleEdit}
      maskClosable={false}
      width="570px"
      wrapClassName="blackAndWhiteList reset-modal-incloud-form"
      footer={[
        <Button key="cancel" size="large" onClick={this.cancleEdit}>取消</Button>,
        <Button key="save" size="large" type="primary" onClick={this.saveEdit} loading={loading}>保存</Button>,
      ]}
    >
      <Row className="row-style">
        <Col span="4">
          黑名单
          <Tooltip
            title={`IP黑名单支持ip网段添加，例如127.0.0.1/24\n
例如：127.0.0.1/24 24表示采用子网掩码中的前24位为有效位，
即用32-24=8bit来表示主机号，该子网可以容纳2^8 - 2 = 254 台
主机。故127.0.0.1/24 表示IP网段范围是：127.0.0.1~127.0.0.255`}
            placement="top"
          >
            <Icon type="question-circle-o" />
          </Tooltip>
        </Col>
        <Col span="20">
          黑名单中添加某个调用者的 IP 后，该调用者不能访问该服务
        </Col>
      </Row>
      <Row className="row-style">
        <Col span="4"></Col>
        <Col span="20">
          {this.renderList(blacklist, blacklistArray, 'black')}
          <Button
            type="dashed"
            icon="plus"
            className="add-btn"
            onClick={this.addlist.bind(this, blacklist, 'black')}
          >
            添加
          </Button>
        </Col>
      </Row>
      <Row className="row-style">
        <Col span="4">
          白名单
          <Tooltip
            title={`IP白名单支持ip网段添加，例如127.0.0.1/24
例如：127.0.0.1/24 24表示采用子网掩码中的前24位为有效位，
即用32-24=8bit来表示主机号，该子网可以容纳2^8 - 2 = 254 台
主机。故127.0.0.1/24 表示IP网段范围是：127.0.0.1~127.0.0.255`}
            placement="top"
          >
            <Icon type="question-circle-o" />
          </Tooltip>
        </Col>
        <Col span="20">
          白名单中添加某个调用者 IP 后，该调用者不用鉴权即可访问该服务。
        </Col>
      </Row>
      <Row className="row-style">
        <Col span="4"></Col>
        <Col span="20">
          {this.renderList(whitelist, whitelistArray, 'white')}
          <Button
            type="dashed"
            icon="plus"
            className="add-btn"
            onClick={this.addlist.bind(this, whitelist, 'white')}
          >
            添加
          </Button>
        </Col>
      </Row>
      <Row className="row-style">
        <Col span="4">
          默认配置
        </Col>
        <Col span="20">
          设置服务的默认访问策略，即不在白名单里，也不在黑名单里的 IP 地址
        </Col>
      </Row>
      <FormItem
        label={<span></span>}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 15 }}
      >
        {
          getFieldDecorator('default-setting', {
            initialValue: 'allow',
          })(
            <RadioGroup>
              <Radio value="allow">无需鉴权即可访问</Radio>
              <Radio value="none">不允许任何 IP 地址访问</Radio>
            </RadioGroup>
          )
        }
      </FormItem>
    </Modal>
  }
}

export default Form.create()(BlackAndWhiteListModal)
