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
import { Row, Col, Slider, InputNumber, Button, Modal, Icon } from 'antd'

const tooltip = [{
  title: '水平扩展',
  content: 'Tips：实例数量调整, 保存后系统将调整实例数量至设置预期',
}, {
  title: '查看日志',
  content: '',
}, {
  title: '高可用',
  content: '',
}]

export default class MsaModal extends React.Component {
  state = {
    inputValue: 0,
    tooltipTitle: '',
    tooltipContent: '',
    extendVisible: false,
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

  handleExtendCancel = () => {
    const { scope } = this.props
    scope.setState({
      visible: false,
    })
  }

  handleRealNum = value => {
    this.setState({
      inputValue: value,
    })
  }

  render() {
    const { tipsType, visible } = this.props
    const tipsName = tipsType ? this.fetchtooltips(tipsType).title : ''

    return (
      <div className="modal">
        <Modal title={tipsName} visible={visible} onCancel={this.handleExtendCancel}
          footer={[
            <Button key="back" type="ghost" onClick={this.handleExtendCancel}>取 消</Button>,
            <Button key="submit" type="primary" onClick={this.handleDel}>确 定</Button>,
          ]}>
          {
            tipsType === '水平扩展' ?
              <div className="extend">
                <div style={{ height: 40, backgroundColor: '#d9edf6', border: '1px dashed #85d7fd', padding: 10, borderRadius: 4, marginBottom: 20 }}>
                  <span>{tooltip[0].content}</span>
                </div>
                <Row>
                  <Col className="itemTitle" span={4}>组件名称</Col>
                  <Col className="itemBody" span={20}>qwqeqweqwe</Col>
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
                          max={20}
                          onChange={this.handleRealNum}
                          value={this.state.inputValue} />
                      </Col>
                      <Col span={12}>
                        <InputNumber
                          className="inputn"
                          min={1}
                          max={20}
                          value={this.state.inputValue}
                        /> 个
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </div> :
              <div className="body" style={{ padding: 0 }}>
                <div className="title" style={{ color: '#333' }}>
                  <Icon type="arrows-alt" className="enlarge" />
                </div>
                <div className="connent">
                  <div className="infos">
                    <span>暂无日志记录</span>
                  </div>
                </div>
              </div>
          }
        </Modal>
      </div>
    )
  }
}

