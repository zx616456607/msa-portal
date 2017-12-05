/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * modal
 *
 * 2017-12-05
 * @author zhaoyb
 */
import React from 'react'
import { Row, Col, Slider, InputNumber, Button, Modal } from 'antd'

export default class MsaModal extends React.Component {
  state = {
    inputValue: 0,
    tooltipTitle: '',
    tooltipContent: '',
    extendVisible: false,
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
            <div className="extend">

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
            </div>
          }
        </Modal>
      </div>
    )
  }
}

