/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * Available instances modal
 *
 * 2017-12-04
 * @author zhangxuan
 */

import React from 'react'
import { connect } from 'react-redux'
import { Modal, Form, Input, Select, notification } from 'antd'
import { getAllClusters } from '../../../actions/current'
import { createInstance, editInstance, checkInstanceName } from '../../../actions/CSB/instance'
import {
  ASYNC_VALIDATOR_TIMEOUT,
} from '../../../constants'
import { ipOrDomainValidator } from '../../../common/utils'

const { TextArea } = Input
const FormItem = Form.Item
// const RadioGroup = Radio.Group
const Option = Select.Option

class InstanceModal extends React.Component {

  state = {}

  componentDidMount() {
    const { getAllClusters } = this.props
    getAllClusters({ size: 100 })
  }

  confirmModal = () => {
    const {
      closeCreateModal, createInstance, form,
      namespace, callback, currentInstance,
      editInstance,
    } = this.props
    form.validateFields((errors, values) => {
      if (errors) {
        return
      }
      this.setState({
        confirmLoading: true,
      })
      const { name, description, cluster, host } = values
      const body = {
        name,
        namespace,
        host,
        description,
      }
      if (currentInstance) {
        editInstance(cluster, currentInstance.id, body).then(res => {
          if (res.error) {
            this.setState({
              confirmLoading: false,
            })
            if (res.status === 409) {
              return notification.warn({
                message: '实例出口地址重复,请重新填写',
              })
            }
            notification.warn({
              message: '修改实例失败',
            })
            return
          }
          this.setState({
            confirmLoading: false,
          })
          notification.success({
            message: '修改实例成功',
          })
          callback()
          closeCreateModal()
        })
        return
      }
      createInstance(cluster, null, body).then(res => {
        if (res.error) {
          this.setState({
            confirmLoading: false,
          })
          if (res.status === 409) {
            return notification.warn({
              message: '实例出口地址重复,请重新填写',
            })
          }
          notification.warn({
            message: '创建实例失败',
          })
          return
        }
        callback()
        this.setState({
          confirmLoading: false,
        })
        notification.success({
          message: '创建实例成功',
        })
        closeCreateModal()
      })
    })
  }

  cancelModal = () => {
    const { closeCreateModal } = this.props
    closeCreateModal()
  }

  checkName = (rule, value, callback) => {
    const { clusterID, checkInstanceName, currentInstance } = this.props
    if (currentInstance) {
      return callback()
    }
    if (!value) {
      return callback('请输入实例名称')
    }
    if (value.length < 3 || value.length > 63) {
      return callback('实例名称需在3-63个字符之间')
    }
    const reg = /^[a-zA-Z0-9_.-]+$/
    if (!reg.test(value)) {
      return callback('支持字母、数字、下划线、中划线和 "."')
    }
    clearTimeout(this.checkNameTimeout)
    this.checkNameTimeout = setTimeout(() => {
      checkInstanceName(clusterID, { name: value }).then(res => {
        if (!res.response.result.data) {
          callback('实例名称重复')
        } else {
          callback()
        }
      })
    }, ASYNC_VALIDATOR_TIMEOUT)
  }

  checkCluster = (rule, value, callback) => {
    if (!value) {
      return callback('请选择部署集群')
    }
    callback()
  }

  checkDesc = (rule, value, callback) => {
    if (!value) {
      return callback('请输入描述信息')
    }
    if (value.length < 5) {
      return callback('请输入至少五个字符')
    }
    callback()
  }

  render() {
    const { confirmLoading } = this.state
    const { form, currentInstance, clusterList, visible } = this.props
    const { getFieldDecorator } = form
    const formItemLayout = {
      labelCol: {
        span: 6,
      },
      wrapperCol: {
        span: 18,
      },
    }
    const optionChildren = clusterList.map(item =>
      <Option key={item.clusterID} value={item.clusterID}>
        {item.clusterName}
      </Option>
    ) || []
    return (
      <Modal
        title={currentInstance ? '修改 CSB 实例' : '创建 CSB 实例'}
        visible={visible}
        onOk={this.confirmModal}
        onCancel={this.cancelModal}
        confirmLoading={confirmLoading}
      >
        <Form>
          <FormItem
            label="实例名称"
            {...formItemLayout}
          >
            {getFieldDecorator('name', {
              rules: [
                {
                  required: true,
                  validator: this.checkName,
                },
              ],
              initialValue: currentInstance ? currentInstance.name : '',
            })(
              <Input
                placeholder="请输入实例名称"
                disabled={!!currentInstance}
              />
            )}
          </FormItem>
          <FormItem
            label="部署集群"
            {...formItemLayout}
          >
            {getFieldDecorator('cluster', {
              rules: [
                {
                  required: true,
                  validator: this.checkCluster,
                },
              ],
              initialValue: currentInstance ? currentInstance.clusterId : undefined,
            })(
              <Select
                placeholder="请选择部署集群"
                disabled={!!currentInstance}
              >
                {optionChildren}
              </Select>
            )}
          </FormItem>
          <FormItem
            label="实例出口地址"
            {...formItemLayout}
          >
            {getFieldDecorator('host', {
              rules: [
                {
                  required: true,
                  whitespace: true,
                  // pattern: HOST_REG,
                  message: '请输入实例出口地址',
                }, {
                  validator: ipOrDomainValidator,
                },
              ],
              initialValue: currentInstance ? currentInstance.host : '',
            })(
              <Input
                placeholder="输入 IP 或域名，用于实例中发布服务开放地址"
                // disabled={!!currentInstance}
              />
            )}
          </FormItem>
          <FormItem
            label="实例描述"
            {...formItemLayout}
          >
            {getFieldDecorator('description', {
              rules: [
                {
                  required: true,
                  validator: this.checkDesc,
                },
              ],
              initialValue: currentInstance ? currentInstance.description : '',
            })(
              <TextArea row={4} placeholder="请输入至少五个字符" />
            )}
          </FormItem>
          {/* <FormItem*/}
          {/* {...formItemLayout}*/}
          {/* label="谁可以使用"*/}
          {/* >*/}
          {/* {getFieldDecorator('radio-group')(*/}
          {/* <RadioGroup>*/}
          {/* <Radio value="a">私有（仅自己）</Radio>*/}
          {/* <Radio value="b">公开（全部用户可申请使用）</Radio>*/}
          {/* </RadioGroup>*/}
          {/* )}*/}
          {/* </FormItem>*/}
        </Form>
      </Modal>
    )
  }
}

const mapStateToProps = state => {
  const { entities, current } = state
  const { clusters } = entities
  const { allClusters: allClusterIDs, config } = current
  const { id: clusterID } = config.cluster
  const { ids } = allClusterIDs
  const clusterList = ids && ids && ids.length && ids.map(item => clusters[item]) || []
  return {
    clusterList,
    clusterID,
  }
}
export default connect(mapStateToProps, {
  getAllClusters,
  createInstance,
  editInstance,
  checkInstanceName,
})(Form.create()(InstanceModal))
