/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * AddClientModal container
 *
 * 2017-09-12
 * @author zhangpc
 */

import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Modal, Form, Input, Checkbox, Select, notification, Button, Row, Col, Tooltip } from 'antd'
import isEmpty from 'lodash/isEmpty'
import cloneDeep from 'lodash/cloneDeep'
import './style/AddClientModal.less'
import { createClient, editClient } from '../../../../../../actions/certification'
import { REDIRECT_URL_REG } from '../../../../../../constants'
import { sleep } from '../../../../../../common/utils'

const FormItem = Form.Item
const CheckboxGroup = Checkbox.Group
const Option = Select.Option

const authModeOpts = [ 'authorization_code', 'implicit', 'password', 'client_credentials' ]

let uuid = 0

class AddClientModal extends React.Component {
  static propTypes = {
    visible: PropTypes.bool.isRequired,
    isView: PropTypes.bool, // 是否查看详情
    currentClient: PropTypes.object, // 当前查看或编辑的客户端
    loadData: PropTypes.func, // 点击确定后加载列表
    closeModal: PropTypes.func.isRequired, // 关闭 Modal
  }

  state = {}

  async componentDidMount() {
    const { form, currentClient } = this.props
    if (isEmpty(currentClient)) {
      return
    }
    const { scope, autoapprove } = currentClient
    if (!isEmpty(scope)) {
      const keys = []
      const formObj = {}
      scope.forEach((sco, index) => {
        keys.push(index)
        uuid = index
        uuid++
        Object.assign(formObj, {
          [`scope-${index}`]: sco,
        })
        if (isEmpty(autoapprove)) {
          Object.assign(formObj, {
            [`autoapprove-${index}`]: false,
          })
        }
        if (autoapprove.length === 1) {
          switch (autoapprove[0]) {
            case 'true':
              Object.assign(formObj, {
                [`autoapprove-${index}`]: true,
              })
              break
            case 'false':
              Object.assign(formObj, {
                [`autoapprove-${index}`]: false,
              })
              break
            default:
              break
          }
          if (autoapprove[0] === sco) {
            Object.assign(formObj, {
              [`autoapprove-${index}`]: true,
            })
          }
        } else if (autoapprove.length > 1) {
          if (autoapprove.includes(sco)) {
            Object.assign(formObj, {
              [`autoapprove-${index}`]: true,
            })
          }
        }
      })
      form.setFieldsValue({ keys })
      await sleep()
      form.setFieldsValue(formObj)
    }
  }

  componentWillUnmount() {
    uuid = 0
    this.props.form.resetFields()
  }

  confirmModal = async () => {
    const {
      form, currentClient, loadData, closeModal, createClient, editClient, isView,
      identityZoneDetail,
    } = this.props
    const { validateFields } = form
    if (isView) {
      closeModal()
      return
    }
    validateFields(async (errors, values) => {
      if (errors) {
        return
      }
      this.setState({
        confirmLoading: true,
      })
      const { name, client_id, client_secret, authorized_grant_types, redirect_uri, keys } = values
      const body = {
        name,
        client_id,
        client_secret,
        authorized_grant_types,
        redirect_uri: redirect_uri.split(','),
      }
      if (!isEmpty(keys)) {
        const scope = []
        const autoapprove = []
        keys.forEach(key => {
          scope.push(values[`scope-${key}`])
          if (values[`autoapprove-${key}`]) {
            autoapprove.push(values[`scope-${key}`])
          }
        })
        Object.assign(body, { scope, autoapprove })
      }

      const zoneInfo = {
        id: identityZoneDetail.id,
        subdomain: identityZoneDetail.subdomain,
      }
      // 创建
      if (isEmpty(currentClient)) {
        const result = await createClient(body, zoneInfo)
        if (result.error) {
          this.setState({
            confirmLoading: false,
          })
          notification.warn({
            message: '创建客户端失败',
          })
          return
        }
        this.setState({
          confirmLoading: false,
        })
        form.resetFields()
        notification.success({
          message: '创建客户端成功',
        })
        loadData && loadData()
        closeModal()
        return
      }
      // 编辑
      const res = await editClient(body, zoneInfo)
      if (res.error) {
        this.setState({
          confirmLoading: false,
        })
        notification.warn({
          message: '修改客户端失败',
        })
        return
      }
      this.setState({
        confirmLoading: false,
      })
      form.resetFields()
      notification.success({
        message: '修改客户端成功',
      })
      loadData && loadData()
      closeModal()
    })
  }

  renderModalTitle = () => {
    const { currentClient, isView } = this.props
    if (isEmpty(currentClient)) {
      return '添加 OAuth 应用'
    }
    if (!isView) {
      return '编辑 OAuth 应用'
    }
    return '查看 OAuth 应用'
  }

  renderFooter = () => {
    const { isView, closeModal } = this.props
    const { confirmLoading } = this.state
    return [
      !isView && <Button key="cancel" type="ghost" onClick={closeModal}>取消</Button>,
      <Button key="confirm" type="primary" onClick={this.confirmModal} loading={confirmLoading}>
        确定
      </Button>,
    ]
  }


  checkScope = (rules, value, callback, key) => {
    const { getFieldValue } = this.props.form
    if (!value) {
      return callback('请选择授权范围')
    }
    const keys = getFieldValue('keys')
    const cloneKeys = cloneDeep(keys)
    const newValue = getFieldValue(`scope-${key}`)
    const result = cloneKeys.every(item => {
      if (item === key) {
        return true
      }
      const currentValue = getFieldValue(`scope-${item}`)
      if (currentValue === newValue) {
        return false
      }
      return true
    })
    if (!result) {
      return callback('授权范围重复')
    }
    callback()
  }

  addScope = () => {
    const { form } = this.props
    const { setFieldsValue, getFieldValue, validateFields } = form
    const keys = getFieldValue('keys')
    const keysLength = keys.length
    const validatorArray = [ `scope-${keys[keysLength - 1]}` ]
    validateFields(validatorArray, errors => {
      if (errors) {
        return
      }
      uuid++
      const nextKeys = keys.concat(uuid)

      setFieldsValue({
        keys: nextKeys,
      })
    })
  }

  removeKey = k => {
    const { form } = this.props
    const { setFieldsValue, getFieldValue } = form

    const keys = getFieldValue('keys')

    setFieldsValue({
      keys: keys.filter(key => key !== k),
    })
  }

  renderItem = (key, index) => {
    const { form, isView, identityZoneDetail } = this.props
    const { getFieldDecorator } = form
    const formItemLayout = {
      labelCol: { span: 10 },
      wrapperCol: { span: 14 },
    }
    if (isEmpty(identityZoneDetail)) {
      return
    }
    const ZONE_ID = identityZoneDetail.name
    const authScope = [
      { value: 'uaa.user', text: '用户都拥有的权限' }, { value: 'uaa.none', text: '此 OAuth 应用 将不会代表用户执行操作' },
      { value: 'uaa.admin', text: '超级用户权限' },
      { value: 'scim.write', text: '对整个跨域身份管理系统授予添加、更新、删除用户和组的权限' },
      { value: 'scim.read ', text: '对整个跨域身份管理系统授予读用户和组的权限' },
      { value: 'scim.create', text: '仅授予添加用户的权限，无删、改、查用户的权限' },
      { value: 'scim.userids', text: '用于用户名和用户 ID 之间转换' },
      { value: 'scim.invite', text: '用于 /invite_users 的 endpoint 参加邀请' },
      { value: 'groups.update', text: '提供更新组的能力，scim.write 也包含该能力' },
      { value: 'password.write', text: '提供修改用户密码的能力' },
      { value: 'openid', text: '获取用户信息，适用于 OpenID clients' },
      { value: 'idps.read', text: '读取、检索 identity providers的能力' },
      { value: 'idps.write', text: '添加、更新 identity providers 的能力' },
      { value: 'clients.admin', text: '添加、修改和删除 OAuth 应用的能力' },
      { value: 'clients.write', text: '添加、修改 OAuth 应用能力' },
      { value: 'clients.read', text: '获取客户端注册信息的能力' },
      { value: 'clients.secret', text: '修改自己 OAuth 应用密钥的能力' },
      { value: 'zones.read', text: '用于获取认证域信息' },
      { value: 'zones.write', text: '用于添加和修改认证域信息' },
      { value: 'scim.zones', text: '限制仅能在某个认证域组内添加、删除用户' },
      { value: 'oauth.approval', text: '默认授权，需要允许或拒绝 OAuth 应用代表用户行事' },
      { value: 'oauth.login', text: '用于登录应用程序（例如外部登录服务器，可以执行可信操作，或添加的用户未进行身份验证）' },
      // {value: 'approvals.me', text: '尚未使用'}
      { value: 'uaa.resource', text: '用于检查 token 的资源服务' },
      { value: `zones.${ZONE_ID}.admin`, text: '允许在指定认证域内操作' },
      { value: `zones.${ZONE_ID}.read`, text: '允许获取特定的认证域信息' },
      { value: `zones.${ZONE_ID}.clients.admin`, text: '切换区域后与 clients.admin 一致' },
      { value: `zones.${ZONE_ID}.clients.read`, text: '切换区域后与 clients.read 一致' },
      { value: `zones.${ZONE_ID}.clients.write`, text: '切换区域后与 clients.write 一致' },
      { value: `zones.${ZONE_ID}.clients.scim.read`, text: '切换区域后与 scim.read 一致' },
      { value: `zones.${ZONE_ID}.clients.scim.create`, text: '切换区域后与 scim.create 一致' },
      { value: `zones.${ZONE_ID}.clients.scim.write`, text: '切换区域后与 scim.write 一致' },
      { value: `zones.${ZONE_ID}.idps.read`, text: '切换区域后与 idps.read 一致' },
    ]
    return (
      <Row key={`item-${key}`} className="scope-row">
        <Col span={12}>
          <FormItem {...formItemLayout} label={index ? ' ' : '授权范围'}>
            {
              getFieldDecorator(`scope-${key}`, {
                // initialValue: 'uaa.none',
                rules: [
                  {
                    validator:
                      (rules, value, callback) => this.checkScope(rules, value, callback, key),
                  },
                ],
              })(
                <Select
                  style={{ width: '100%' }}
                  placeholder="请选择授权范围"
                  showSearch
                  optionFilterProp="children"
                  disabled={isView}
                >
                  {
                    authScope.map(scope =>
                      <Option key={scope.value}>
                        <Tooltip placement="topLeft" title={scope.text}>{scope.text}</Tooltip>
                      </Option>)
                  }
                </Select>
              )
            }
          </FormItem>
        </Col>
        <Col span={6} offset={2}>
          <FormItem label="">
            {
              getFieldDecorator(`autoapprove-${key}`, {
                valuePropName: 'checked',
                initialValue: false,
              })(
                <Checkbox disabled={isView}>自动审批</Checkbox>
              )
            }
          </FormItem>
        </Col>
        <Col span={2}><Button disabled={isView} icon="close" type="dashed" onClick={() => this.removeKey(key)}/></Col>
      </Row>
    )
  }
  render() {
    const { form, visible, isView, currentClient, closeModal } = this.props
    const { confirmLoading } = this.state
    const { getFieldDecorator, getFieldValue } = form
    const formItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 16 },
    }
    getFieldDecorator('keys', { initialValue: [ 0 ] })
    const keys = getFieldValue('keys')
    const authorizedGrantTypes = getFieldValue('authorized_grant_types')
    return (
      <Modal
        visible={visible}
        maskClosable={false}
        title={this.renderModalTitle()}
        width={720}
        className="add-client-modal"
        onOk={this.confirmModal}
        onCancel={closeModal}
        confirmLoading={confirmLoading}
        footer={this.renderFooter()}
      >
        <FormItem {...formItemLayout} label="名称">
          {
            getFieldDecorator('name', {
              initialValue: !isEmpty(currentClient) && !isEmpty(currentClient.name) ? currentClient.name : '',
            })(
              <Input disabled={isView} placeholder="请输入名称"/>
            )
          }
        </FormItem>
        {
          !isView &&
          <FormItem {...formItemLayout} label="授权方式">
            {
              getFieldDecorator('authorized_grant_types', {
                initialValue: !isEmpty(currentClient) &&
                !isEmpty(currentClient.authorized_grant_types)
                  ? currentClient.authorized_grant_types : [],
                rules: [
                  {
                    required: true,
                    message: '授权方式不能为空',
                  },
                ],
              })(
                <CheckboxGroup
                  disabled={isView}
                  options={authModeOpts}
                />
              )
            }
          </FormItem>
        }
        <FormItem {...formItemLayout} label="Client ID">
          {
            getFieldDecorator('client_id', {
              initialValue: !isEmpty(currentClient) && !isEmpty(currentClient.client_id) ? currentClient.client_id : '',
              rules: [
                {
                  required: true,
                  message: '客户端 ID 不能为空',
                },
              ],
            })(
              <Input disabled={!isEmpty(currentClient)} placeholder="请填写客户端 ID" />
            )
          }
        </FormItem>
        {
          isEmpty(currentClient) &&
          <FormItem {...formItemLayout} label="Client Secret">
            {
              getFieldDecorator('client_secret', {
                initialValue: !isEmpty(currentClient) && !isEmpty(currentClient.client_secret) ? currentClient.client_secret : '',
                rules: [
                  {
                    required: !isEmpty(authorizedGrantTypes) &&
                    (authorizedGrantTypes.includes('authorization_code') || authorizedGrantTypes.includes('client_credentials')),
                    message: '客户端 Secret 不能为空',
                  },
                ],
              })(
                <Input disabled={isView} placeholder="请填写客户端 Secret"/>
              )
            }
          </FormItem>
        }
        {/* <FormItem {...formItemLayout} label="AccessToken 有效时间">*/}
        {/* {*/}
        {/* getFieldDecorator('')*/}
        {/* }*/}
        {/* <Input placeholder="请填写 AccessToken 有效时间" addonAfter="秒" />*/}
        {/* </FormItem>*/}
        {/* <FormItem {...formItemLayout} label="RefreshToken 有效时间">*/}
        {/* <Input placeholder="请填写 RefreshToken 有效时间" addonAfter="秒" />*/}
        {/* </FormItem>*/}
        {/* <FormItem className="auto-auth" {...formItemLayout} label=" ">
          <Checkbox>全范围自动授权</Checkbox>
        </FormItem> */}
        {/* <FormItem {...formItemLayout} label="可用资源 ID">*/}
        {/* <Select style={{ width: '100%' }} placeholder="请选择可用资源 ID">*/}
        {/* <Option key="test">test</Option>*/}
        {/* </Select>*/}
        {/* </FormItem>*/}
        <FormItem {...formItemLayout} label="重定向 URL">
          {
            getFieldDecorator('redirect_uri', {
              initialValue: !isEmpty(currentClient) && !isEmpty(currentClient.redirect_uri) ? currentClient.redirect_uri.join(',') : '',
              rules: [
                {
                  whitespace: true,
                  pattern: REDIRECT_URL_REG,
                  required: true,
                  message: '请填写正确的重定向 URL 地址',
                },
              ],
            })(
              <Input disabled={isView} placeholder="如：http://www.tenxcloud.com" />
            )
          }
        </FormItem>
        {keys.map(this.renderItem)}
        <Row style={{ marginTop: 10 }}>
          <Col offset={5}>
            <Button disabled={isView} icon="plus" type="primary" ghost onClick={this.addScope}>添加授权范围</Button>
          </Col>
        </Row>
      </Modal>
    )
  }
}

const mapStateToProps = state => {
  const { certification } = state
  const { identityZoneDetail } = certification
  return {
    identityZoneDetail,
  }
}

export default connect(mapStateToProps, {
  createClient,
  editClient,
})(Form.create()(AddClientModal))
