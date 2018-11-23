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
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import {
  Form, Modal, Row, Col,
  Input, Icon, Button, Radio,
  Tooltip, Spin,
} from 'antd'
import './style/BlackAndWhiteListModal.less'
import cloneDeep from 'lodash/cloneDeep'
import {
  getInstanceServiceACL,
  delInstanceServiceACL,
  getServiceBlackAndWhiteList,
} from '../../../../actions/CSB/instanceService'

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
    isFetching: true,
  }

  componentDidMount() {
    this.loadData()
  }

  loadData = () => {
    const { getServiceBlackAndWhiteList, instanceId, serviceId } = this.props
    getServiceBlackAndWhiteList(instanceId, serviceId).then(res => {
      this.setState({ isFetching: false })
      if (res.error) {
        return
      }
      const arr = res.response.result.data || []
      const blacklistArray = []
      const whitelistArray = []
      const blacklist = []
      const whitelist = []
      let blackcount = 0
      let whitecount = 0
      arr.forEach(item => {
        if (/^\d{1,3}\./.test(item.ipOrNet)) {
          if (item.blackOrWhite) {
            blacklistArray.push({ IP: item.ipOrNet })
            blacklist.push({ index: blackcount })
            blackcount++
          }
          if (!item.blackOrWhite) {
            whitelistArray.push({ IP: item.ipOrNet })
            whitelist.push({ index: whitecount })
            whitecount++
          }
        }
      })
      this.setState({
        blacklist,
        blacklistArray,
        whitelistArray,
        whitelist,
      })
    })
  }

  addlist = (list, type) => {
    const preList = cloneDeep(list)
    const length = preList.length
    const preIndex = length ? preList[length - 1].index : -1
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
      return <FormItem key={`${formProps}-${index}`}
      >
        {
          getFieldDecorator(`${formProps}-${item.index}`, {
            initialValue: listArray[ item.index ] ? listArray[ item.index ].IP : undefined,
            rules: [{
              validator: (rule, value, callback) => {
                if (!value) {
                  return callback('IP地址或者IP网段不能为空')
                }
                if (!/^\d{1,3}(\.\d{1,3}){3}(\/\d{1,3})?$/.test(value)) {
                  return callback('IP地址如：192.168.1.0，或IP网段如：192.168.1.0/24')
                }
                const { form: { getFieldsValue, getFieldValue } } = this.props
                const keys = Object.keys(getFieldsValue())
                let i = 0
                while (keys.indexOf(`${formProps}-${i}`) > -1) {
                  if (i < item.index && value === getFieldValue(`${formProps}-${i}`)) {
                    return callback(new Error('IP 地址重复'))
                  }
                  i++
                }
                return callback()
              },
            }],
          })(
            <Input placeholder="IP地址如：192.168.1.0，或IP网段如：192.168.1.0/24" />
          )
        }
        <Icon type="delete" onClick={this.deletelist.bind(this, item, list, formProps)} />
      </FormItem>
    })
  }

  render() {
    const { blacklist, whitelist, blacklistArray, whitelistArray, isFetching } = this.state
    const { form, loading, currentService } = this.props
    const { getFieldDecorator } = form
    const { blackOrWhite } = currentService
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
      {
        isFetching
          ? <div style={{ textAlign: 'center' }}><Spin/></div>
          : <div>
            <Row>
              <div className="alert">
                若所填 IP 既被添加到白名单，又在黑名单里，则黑名单优先，即拒绝访问该服务
              </div>
            </Row>
            <Row className="row-style">
              <Col span="4">
                黑名单
                <Tooltip
                  title={`IP黑名单支持ip网段添加，例如192.168.1.0/24\n
            例如：192.168.1.0/24 24表示采用子网掩码中的前24位为有效位，
            即用32-24=8bit来表示主机号，该子网可以容纳2^8 - 2 = 254 台
            主机。故192.168.1.0/24 表示IP网段范围是：192.168.1.0~192.168.1.255`}
                  placement="top"
                >
                  <Icon type="question-circle-o"/>
                </Tooltip>
              </Col>
              <Col span="20">
                黑名单中添加某个调用者的 IP 后，该调用者不能访问该服务
              </Col>
            </Row>
            <Row className="row-style add-row">
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
                  title={`IP白名单支持ip网段添加，例如192.168.1.0/24
            例如：192.168.1.0/24 24表示采用子网掩码中的前24位为有效位，
            即用32-24=8bit来表示主机号，该子网可以容纳2^8 - 2 = 254 台
            主机。故192.168.1.0/24 表示IP网段范围是：192.168.1.0~192.168.1.255`}
                  placement="top"
                >
                  <Icon type="question-circle-o"/>
                </Tooltip>
              </Col>
              <Col span="20">
                白名单中添加某个调用者 IP 后，该调用者不用鉴权即可访问该服务。
              </Col>
            </Row>
            <Row className="row-style add-row">
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
                <Tooltip
                  title={`对于既不在白名单里，也不在黑名单里的IP地址，\n
            通过：表示无需鉴权即可访问；\n
            拒绝：代表该服务默认不允许任何 IP 地址访问`}
                  placement="top"
                >
                  <Icon type="question-circle-o"/>
                </Tooltip>
              </Col>
              <Col span="20">
                设置服务的默认访问策略，即不在白名单里，也不在黑名单里的 IP 地址
              </Col>
            </Row>
            <FormItem
              label={<span></span>}
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 15 }}
              className="reset-form-label-style"
            >
              {
                getFieldDecorator('blackOrWhite', {
                  initialValue: blackOrWhite,
                })(
                  <RadioGroup>
                    <Radio value={false}>无需鉴权即可访问</Radio>
                    <Radio value={true}>不允许任何 IP 地址访问</Radio>
                  </RadioGroup>
                )
              }
            </FormItem>
          </div>
      }
    </Modal>
  }
}

const mapStateToProps = () => {
  return {
    //
  }
}

export default connect(mapStateToProps, {
  getInstanceServiceACL,
  delInstanceServiceACL,
  getServiceBlackAndWhiteList,
})(Form.create()(BlackAndWhiteListModal))
