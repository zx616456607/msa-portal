/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * modal
 *
 * 2017-11-22
 * @author zhaoyb
 */
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Row, Col, Slider, InputNumber, Modal, notification } from 'antd'
import { manualScaleComponent } from '../../../../actions/msaComponent'

const tooltip = [{
  title: '水平扩展',
  content: 'Tips：实例数量调整, 保存后系统将调整实例数量至设置预期',
}]

class MsaModal extends React.Component {
  static propTypes = {
    visible: PropTypes.bool.isRequired,
    closeModal: PropTypes.func.isRequired,
    currentComponent: PropTypes.object.isRequired,
    loadData: PropTypes.func,
  }
  constructor(props) {
    super()
    this.state = {
      inputValue: props.currentComponent.count || props.currentComponent.replicas,
    }
  }

  fetchtooltips = value => {
    switch (value) {
      case '水平扩展':
        return tooltip[0]
      case '查看日志':
        return tooltip[1]
      case '高可用':
        return tooltip[2]
      default:
        return
    }
  }

  handleRealNum = value => {
    this.setState({
      inputValue: value,
    })
  }

  handleConfirm = async () => {
    const { inputValue } = this.state
    const { manualScaleComponent,
      clusterId,
      currentComponent,
      closeModal,
      loadData,
      namespace } = this.props
    this.setState({
      loading: true,
    })
    const body = {
      number: parseInt(inputValue, 10),
      namespace,
    }
    const finalClusterId = currentComponent.clusterId || clusterId
    const name = currentComponent.component || 'dsb-server'
    const result = await manualScaleComponent(finalClusterId, name, body)
    if (result.error) {
      this.setState({
        loading: false,
      })
      notification.warn({
        message: '水平扩展失败',
      })
      return
    }
    loadData && loadData()
    this.setState({
      loading: false,
    })
    closeModal()
    notification.success({
      message: '水平扩展成功',
    })
  }

  render() {
    const { loading, inputValue } = this.state
    const { tipsType, visible, closeModal, currentComponent } = this.props
    const tipsName = tipsType ? this.fetchtooltips(tipsType).title : ''

    return (
      <div className="modal">
        <Modal
          title={tipsName}
          visible={visible}
          onCancel={closeModal}
          onOk={this.handleConfirm}
          confirmLoading={loading}
        >
          {
            <div className="extend">
              <div style={{ height: 40, backgroundColor: '#d9edf6', border: '1px dashed #85d7fd', padding: 10, borderRadius: 4, marginBottom: 20 }}>
                <span>{tooltip[0].content}</span>
              </div>
              <Row>
                <Col className="itemTitle" span={4}>组件名称</Col>
                <Col className="itemBody" span={20}>
                  {currentComponent && (currentComponent.component || currentComponent.name)}
                </Col>
              </Row>
              <Row>
                <Col className="itemTitle" span={4} style={{ lineHeight: 2.5 }}>
                  实例数量
                </Col>
                <Col span={20}>
                  <Row>
                    <Col span={12}>
                      <Slider
                        min={1}
                        max={10}
                        onChange={this.handleRealNum}
                        value={inputValue} />
                    </Col>
                    <Col span={12}>
                      <InputNumber
                        className="inputn"
                        min={1}
                        max={10}
                        value={inputValue}
                        onChange={this.handleRealNum}
                      /> 个
                    </Col>
                  </Row>
                </Col>
              </Row>
            </div>
          }
        </Modal>
      </div>
    )
  }
}

export default connect(state => {
  return { namespace: state.current.config.project.namespace }
}, {
  manualScaleComponent,
})(MsaModal)
