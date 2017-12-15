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
import { createInstance } from '../../../actions/CSB/instance'

const FormItem = Form.Item
// const RadioGroup = Radio.Group
const Option = Select.Option

class InstanceModal extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      visible: false,
    }
  }

  componentWillReceiveProps(nextProps) {
    const { visible: oldVisible } = this.props
    const { visible: newVisible, getAllClusters } = nextProps
    if (oldVisible !== newVisible) {
      this.setState({
        visible: newVisible,
      })
    }
    if (!oldVisible && newVisible) {
      getAllClusters({ size: 100 })
    }
  }

  confirmModal = () => {
    const { closeCreateModal, createInstance, form, userId } = this.props
    form.validateFields((errors, values) => {
      if (errors) {
        return
      }
      const { name, description, cluster } = values
      const body = {
        name,
        description,
        systemCallKey: 'wdfaflasdf',
      }
      const query = {
        userId,
      }
      createInstance(cluster, query, body).then(res => {
        if (res.error) {
          return
        }
        closeCreateModal()
        this.setState({
          visible: false,
        })
      })
    })
  }

  cancelModal = () => {
    const { closeCreateModal } = this.props
    closeCreateModal()
    this.setState({
      visible: false,
    })
  }
  render() {
    const { form, currentInstance, clusterList } = this.props
    const { visible } = this.state
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
            {getFieldDecorator('name')(
              <Input placeholder="请输入实例名称" />
            )}
          </FormItem>
          <FormItem
            label="部署集群"
            {...formItemLayout}
          >
            {getFieldDecorator('cluster')(
              <Select>
                {child}
              </Select>
            )}
          </FormItem>
          <FormItem
            label="实例描述"
            {...formItemLayout}
          >
            {getFieldDecorator('description')(
              <Input type="textarea" placeholder="请输入至少五个字符" />
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
})(Form.create()(InstanceModal))
