/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * update consumer voucher component
 *
 * 2017-12-27
 * @author zhangcz
 */

import React from 'react'
import propTypes from 'prop-types'
import {
  Modal, Row, Col, Input,
  Icon, Radio, InputNumber,
} from 'antd'
import './style/UpdateConsumerVoucher.less'

const RadioGroup = Radio.Group
const { TextArea } = Input

class UpdateConsumerVoucher extends React.Component {
  static propTypes = {
    callback: propTypes.func.isRequired,
    loading: propTypes.bool.isRequired,
    closeModalMethod: propTypes.func.isRequired,
    // 当前更新的消费凭证
    record: propTypes.object.isRequired,
  }

  state = {
    updateSetting: 'delay',
    delayTime: 1,
    hideOld: false,
    hideNew: false,
  }

  handleOk = () => {
    const { callback } = this.props
    const { updateSetting, delayTime } = this.state
    let values = { updateSetting }
    if (updateSetting === 'delay') {
      values = Object.assign({}, values, { delayTime })
    }
    callback(values)
  }

  hideKeys = type => {
    switch (type) {
      case 'old':
        return this.setState(preState => {
          return { hideOld: !preState.hideOld }
        })
      case 'new':
        return this.setState(preState => {
          return { hideNew: !preState.hideNew }
        })
      default:
        return
    }
  }

  inputNumberOnchange = delayTime => {
    if (typeof delayTime !== 'number') {
      this.setState({
        delayTime: 1,
      })
      return
    }
    this.setState({
      delayTime,
    })
  }

  renderStarStr = () => {
    let star = ''
    for (let i = 0; i < 32; i++) {
      star += '*'
    }
    return star
  }

  render() {
    const { loading, closeModalMethod, record } = this.props
    const { updateSetting, delayTime, hideOld, hideNew } = this.state
    const starStr = this.renderStarStr()
    let oldKeys = `ak: ${record.clientId}\nsk: ${record.secret}`
    if (hideOld) {
      oldKeys = `ak: ${starStr}\nsk: ${starStr}`
    }
    let newKeys = `ak: ${record.clientId}\nsk: ${record.secret}`
    if (hideNew) {
      newKeys = `ak: ${starStr}\nsk: ${starStr}`
    }
    return (
      <Modal
        title="更新消费凭证"
        visible={true}
        closable={true}
        onOk={this.handleOk}
        onCancel={() => closeModalMethod()}
        width="570px"
        maskClosable={false}
        confirmLoading={loading}
        wrapClassName="update-consumer-voucher"
        okText="更新"
      >
        <Row>
          <Col span={4}>
            <span>凭证名称</span>
          </Col>
          <Col span={20}>
            <span>{record.name}</span>
          </Col>
        </Row>
        <Row>
          <Col span={4}>当前 AK / SK</Col>
          <Col span={19}>
            <div className="key-container">
              <TextArea
                disabled
                value={oldKeys}
                autosize={{ minRows: 2, maxRows: 8 }}
              />
              <Icon type="eye-o" className="text-ico" onClick={() => this.hideKeys('old')}/>
            </div>
          </Col>
        </Row>
        <Row>
          <Col span={4}>
            新 AK / SK
          </Col>
          <Col span={19}>
            <div className="key-container">
              <TextArea
                disabled
                value={newKeys}
                autosize={{ minRows: 2, maxRows: 8 }}
              />
              <Icon type="eye-o" className="text-ico" onClick={() => this.hideKeys('new')}/>
            </div>
          </Col>
        </Row>
        <Row>
          <Col span={4}>生效设置</Col>
          <Col span={20}>
            <RadioGroup
              defaultValue={updateSetting}
              onChange={e => this.setState({ updateSetting: e.target.value })}
            >
              <Radio value="delay">更新过度，新旧凭证同时失效</Radio>
              <Radio value="immediately">立即生效新凭证</Radio>
            </RadioGroup>
          </Col>
        </Row>
        {
          updateSetting === 'delay' && (
            <Row>
              <Col span={4}></Col>
              <Col span={20}>
                <InputNumber
                  min={1}
                  max={7000}
                  defaultValue={1}
                  value={delayTime}
                  onChange={this.inputNumberOnchange}
                /> 分
              </Col>
            </Row>
          )
        }
      </Modal>
    )
  }
}

export default UpdateConsumerVoucher
