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
import { Modal, Form, Input, Select } from 'antd'
import { getAllClusters } from '../../../actions/current'
import { createInstance, editInstance } from '../../../actions/CSB/instance'
const { TextArea } = Input

const FormItem = Form.Item
// const RadioGroup = Radio.Group
const Option = Select.Option

class InstanceModal extends React.Component {

  componentDidMount() {
    const { getAllClusters } = this.props
    getAllClusters({ size: 100 })
  }

  confirmModal = () => {
    const {
      closeCreateModal, createInstance, form,
      userId, namespace, callback, currentInstance,
      editInstance,
    } = this.props
    form.validateFields((errors, values) => {
      if (errors) {
        return
      }
      const { name, description, cluster } = values
      const body = {
        name,
        namespace,
        description,
        systemCallKey: 'wdfaflasdf',
      }
      const query = {
        userId,
      }
      if (currentInstance) {
        editInstance(cluster, currentInstance.id, body).then(res => {
          if (res.error) {
            return
          }
          callback()
          closeCreateModal()
        })
        return
      }
      createInstance(cluster, query, body).then(res => {
        if (res.error) {
          return
        }
        callback()
        closeCreateModal()
      })
    })
  }

  cancelModal = () => {
    const { closeCreateModal } = this.props
    closeCreateModal()
  }

  checkName = (rule, value, callback) => {
    if (!value) {
      return callback('请输入实例名称')
    }
    callback()
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
    const { form, currentInstance, clusterList, visible } = this.props
    const { getFieldDecorator } = form
    const formItemLayout = {
      labelCol: {
        span: 4,
      },
      wrapperCol: {
        span: 20,
      },
    }
    const child = clusterList &&
      clusterList.length &&
      clusterList.map(item =>
        <Option key={item.clusterID} value={item.clusterID}>{item.clusterName}</Option>)
    return (
      <Modal
        title={currentInstance ? '修改 CSB 实例' : '创建 CSB 实例'}
        visible={visible}
        onOk={this.confirmModal}
        onCancel={this.cancelModal}
      >
        <Form>
          <FormItem
            label="实例名称"
            {...formItemLayout}
          >
            {getFieldDecorator('name', {
              rules: [
                {
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
                  validator: this.checkCluster,
                },
              ],
              initialValue: currentInstance ? currentInstance.clusterId : '',
            })(
              <Select
                placeholder="请选择部署集群"
                disabled={!!currentInstance}
              >
                {child}
              </Select>
            )}
          </FormItem>
          <FormItem
            label="实例描述"
            {...formItemLayout}
          >
            {getFieldDecorator('description', {
              rules: [
                {
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
  const { allClusters } = entities
  const { allClusters: allClusterIDs } = current
  const { ids } = allClusterIDs
  const clusterList = ids && ids && ids.length && ids.map(item => allClusters[item]) || []
  return {
    clusterList,
  }
}
export default connect(mapStateToProps, {
  getAllClusters,
  createInstance,
  editInstance,
})(Form.create()(InstanceModal))
