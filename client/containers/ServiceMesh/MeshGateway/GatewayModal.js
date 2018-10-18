/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2018 TenxCloud. All Rights Reserved.
 */

/**
 * GatewayModal
 *
 * @author songsz
 * @date 2018-09-17
 */
import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Modal, Form, Input, Select, Icon, notification, Button, Tooltip } from 'antd'
import './style/GatewayModal.less'
import * as actions from '../../../actions/meshGateway'
import { IP_REG } from '../../../constants'
import { getDeepValue } from '../../../common/utils'

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

const mapStateToProps = state => {
  const { current, meshGateway: { meshIngressGatewayList }, entities } = state
  const { cluster } = current.config
  const clusterID = cluster.id
  return {
    clusterID,
    entities,
    meshIngressGatewayList,
  }
}

@connect(mapStateToProps, {
  getMeshIngressGateway: actions.getMeshIngressGateway,
  getMeshGateway: actions.getMeshGateway,
  postMeshGateway: actions.postMeshGateway,
  putMeshGateway: actions.putMeshGateway,
})
class GatewayModal extends React.Component {
  static propTypes = {
    visible: PropTypes.bool.isRequired,
    type: PropTypes.string.isRequired,
    loadData: PropTypes.func,
    closeModal: PropTypes.func.isRequired,
  }
  state = {
    uuid: 1,
    isFetching: false,
  }
  getFormInitialValue = () => {
    const { entities } = this.props
    const data = this.props.data || {}
    let out
    if (entities.meshIngressGatewayList) {
      const outId = getDeepValue(data, [ 'metadata', 'labels', 'ownerreferences/ingressgateway' ])
      entities.meshIngressGatewayList[outId] && (out = outId)
    }
    const domain = getDeepValue(data, [ 'spec', 'servers', 0, 'hosts' ]) || []
    const keys = []
    const domainValue = []
    domain.map((host, index) => {
      const i = 1000 - index
      domainValue[i] = host
      keys.push(i)
      return null
    })
    if (!keys.length) {
      keys.push(0)
    }
    return {
      name: getDeepValue(data, [ 'metadata', 'name' ]) || undefined,
      out,
      domain: domainValue,
      keys,
    }
  }
  handleConfirm = async () => {
    const {
      form, postMeshGateway, putMeshGateway,
      clusterID, getMeshGateway, type, data } = this.props
    const { validateFields } = form
    validateFields(async (errors, values) => {
      if (errors) {
        return
      }
      this.setState({
        isFetching: true,
      })
      // 创建
      if (type === 'create') {
        const finalData = {
          apiVersion: 'networking.istio.io/v1alpha3',
          kind: 'Gateway',
          metadata: {
            name: values.name,
            annotations: {
              displayName: values.name,
            },
            labels: {
              'ownerreferences/ingressgateway': values.out,
            },
          },
          spec: {
            selector: {
              istio: 'ingressgateway',
              'istio-ingressgateway': values.out,
            },
            servers: [
              {
                hosts: values.domain,
                port: {
                  name: 'http',
                  number: 80,
                  protocol: 'HTTP',
                },
              },
            ],
          },
        }
        const res = await postMeshGateway(clusterID, finalData)
        if (res && res.response && res.response.result) {
          notification.success({
            message: '创建网关成功',
          })
          this.cancelModal()
        }
      }
      // 编辑
      if (type === 'edit') {
        const finalData = data
        finalData.metadata.name = values.name
        finalData.metadata.annotations.displayName = values.name
        finalData.metadata.labels['ownerreferences/ingressgateway'] = values.out
        finalData.spec.selector['istio-ingressgateway'] = values.out
        finalData.spec.servers[0].hosts = values.domain.filter(host => host)
        const res = await putMeshGateway(clusterID, finalData)
        if (res && res.response && res.response.result) {
          notification.success({
            message: '更新网关成功',
          })
          this.cancelModal()
        }
      }
      this.setState({
        isFetching: false,
      })
      getMeshGateway && getMeshGateway(clusterID)
    })
  }
  addItems = () => {
    const { form } = this.props
    const { uuid } = this.state
    const keys = form.getFieldValue('keys')
    form.setFieldsValue({
      keys: keys.concat(uuid + 1),
    })
    this.setState({
      uuid: uuid + 1,
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
  domainValidator = (rule, value, cb) => {
    if (!value) return cb()
    const domainReg = /^[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z0-9]{1,}\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/
    if (domainReg.test(value) || IP_REG.test(value)) {
      return cb()
    }
    cb('请填写正确的服务域名')
  }
  renderItems = (init, onlyLook) => {
    const { form: { getFieldValue, getFieldDecorator } } = this.props
    getFieldDecorator('keys', { initialValue: init.keys })
    const keys = getFieldValue('keys')
    return (
      <React.Fragment>
        {
          keys.map((k, index) => {
            return (
              <FormItem
                {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
                label={index === 0 ? '解析服务域名' : ''}
                required
                key={k}
              >
                {getFieldDecorator(`domain[${k}]`, {
                  initialValue: init.domain[k],
                  validateTrigger: [ 'onChange', 'onBlur' ],
                  rules: [{
                    required: true,
                    whitespace: true,
                    message: '请输入服务域名',
                  }, {
                    validator: this.domainValidator,
                  }],
                })(
                  <Input disabled={onlyLook} className={'domainInput'} placeholder="请输入服务域名" />
                )}
                {
                  keys.length > 1 && !onlyLook &&
                  <Icon
                    type="minus-circle-o"
                    disabled={keys.length === 1}
                    onClick={() => this.removeItems(k)}
                    className="remove"
                  />
                }
              </FormItem>
            )
          })
        }
        {
          !onlyLook &&
          <div onClick={this.addItems} className="add"><Icon type="plus-circle" theme="outlined" /> 添加服务域名</div>
        }
      </React.Fragment>
    )
  }
  cancelModal = () => {
    const { closeModal, form } = this.props
    closeModal && closeModal()
    form.resetFields()
  }
  renderFooter = onlyLook => {
    if (onlyLook) {
      return (
        <Button type="primary" onClick={this.cancelModal}>知道了</Button>
      )
    }
    return (
      <React.Fragment>
        <Button onClick={this.cancelModal}>取消</Button>
        <Button type="primary" loading={this.state.isFetching} onClick={this.handleConfirm}>
          {
            this.props.type === 'edit' ? '更新' : '确定'
          }
        </Button>
      </React.Fragment>
    )
  }
  render() {
    const init = this.getFormInitialValue()
    const { form, visible, meshIngressGatewayList, entities, type } = this.props
    const ingressList = entities.meshIngressGatewayList || []
    const { getFieldDecorator } = form
    const onlyLook = type !== 'edit' && type !== 'create'
    return (
      <Modal
        className={'mesh-gateway-modal'}
        title={this.modalTitle()}
        onCancel={this.cancelModal}
        footer={this.renderFooter(onlyLook)}
        visible={visible}
        maskClosable={false}
      >
        <Form>
          <FormItem {...formItemLayout} label="网关名称">
            {
              getFieldDecorator('name', {
                initialValue: init.name,
                rules: [{
                  required: true,
                  whitespace: true,
                  message: '请输入网关名称',
                }, {
                  pattern: /^[a-z][a-z0-9\-]{1,48}[a-z0-9]$/,
                  message: '由 3~60 位小写字母、数字、中划线组成，以小写字母开头，小写字母或者数字结尾',
                }],
              })(
                <Input
                  disabled={type !== 'create'}
                  className="inputNSelect"
                  type="text"
                  placeholder="请输入网关名称"
                />
              )
            }
          </FormItem>
          <FormItem {...formItemLayout} label={
            <span>
              服务网格出口
              <Tooltip title="路由规则对外访问地址（用户自行申请的），为确保路由规则中所填域名能解析到该网关，需在该网关处添加此地址，否则将无法通过该网关对外暴露服务">
                <Icon type="question-circle" className="outTip" theme="outlined" />
              </Tooltip>
            </span>
          }>
            {
              getFieldDecorator('out', {
                initialValue: init.out,
                rules: [{
                  required: true,
                  message: '请选择服务网格出口',
                }],
              })(
                <Select
                  disabled={onlyLook}
                  className="inputNSelect"
                  placeholder={'请选择服务网格出口'}
                >
                  {
                    (meshIngressGatewayList.data || []).map(id =>
                      <Option value={ingressList[id].hashedName}>{ingressList[id].name}</Option>
                    )
                  }
                </Select>
              )
            }
          </FormItem>
          {
            this.renderItems(init, onlyLook)
          }
        </Form>
      </Modal>
    )
  }
}

export default connect(null, {})(Form.create()(GatewayModal))
