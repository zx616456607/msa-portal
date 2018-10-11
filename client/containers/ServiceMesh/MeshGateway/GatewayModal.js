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
import { Modal, Form, Input, Select, Icon, notification } from 'antd'
import './style/GatewayModal.less'
import * as actions from '../../../actions/meshGateway'
import { APP_NAME_REG, APP_NAME_REG_NOTICE, HOSTNAME_REG, IP_REG } from '../../../constants'

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
  postMeshGateway: actions.postMeshGateway,
})
class GatewayModal extends React.Component {
  static propTypes = {
    visible: PropTypes.bool.isRequired,
    type: PropTypes.string.isRequired,
    loadData: PropTypes.func,
    closeModal: PropTypes.func.isRequired,
  }
  state = {
    uuid: 0,
    isFetching: false,
  }
  componentDidMount() {
    const { getMeshIngressGateway, clusterID } = this.props
    getMeshIngressGateway && getMeshIngressGateway(clusterID)
  }
  handleConfirm = async () => {
    const { form, postMeshGateway, clusterID } = this.props
    const { validateFields } = form
    validateFields(async (errors, values) => {
      if (errors) {
        return
      }
      this.setState({
        isFetching: true,
      })
      const data = {
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
      const res = await postMeshGateway(clusterID, data)
      this.setState({
        isFetching: false,
      })
      if (res && res.response && res.response.result) {
        notification.success({
          message: '创建网关成功',
        })
        this.cancelModal()
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
  domainValidator = (rule, value, cb) => {
    if (!value) return cb()
    if (HOSTNAME_REG.test(value) || IP_REG.test(value)) {
      return cb()
    }
    cb('请填写正确的服务域名')
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
                  }, {
                    validator: this.domainValidator,
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
  cancelModal = () => {
    const { closeModal, form } = this.props
    closeModal && closeModal()
    form.resetFields()
  }
  render() {
    const { form, visible, meshIngressGatewayList, entities } = this.props
    const ingressList = entities.meshIngressGatewayList || []
    const { getFieldDecorator } = form
    return (
      <Modal
        className={'mesh-gateway-modal'}
        title={this.modalTitle()}
        onCancel={this.cancelModal}
        onOk={this.handleConfirm}
        visible={visible}
        confirmLoading={meshIngressGatewayList.isFetching}
        maskClosable={false}
      >
        <Form>
          <FormItem {...formItemLayout} label="网关名称">
            {
              getFieldDecorator('name', {
                initialValue: '',
                rules: [{
                  required: true,
                  message: '请输入网关名称',
                }, {
                  pattern: APP_NAME_REG,
                  message: APP_NAME_REG_NOTICE,
                }],
              })(
                <Input className="inputNSelect" type="text" placeholder="请输入网关名称"/>
              )
            }
          </FormItem>
          <FormItem {...formItemLayout} label="服务网格出口">
            {
              getFieldDecorator('out', {
                initialValue: undefined,
              })(
                <Select
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
            this.renderItems()
          }
        </Form>
      </Modal>
    )
  }
}

export default connect(null, {})(Form.create()(GatewayModal))
