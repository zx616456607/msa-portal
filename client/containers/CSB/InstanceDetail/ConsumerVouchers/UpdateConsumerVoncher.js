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
  }

  componentDidMount() {
    setTimeout(() => {
      this.delayTimeInput && this.delayTimeInput.focus()
    }, 200)
    const timeout = this.renderTimeout()
    if (typeof timeout === 'number') {
      this.setState({ delayTime: timeout })
    }
  }

  handleOk = () => {
    const { callback } = this.props
    const { updateSetting, delayTime } = this.state
    let values = { updateSetting }
    let delayTimeIllegality = false
    if (updateSetting === 'delay') {
      delayTimeIllegality = this.testDelayTime()
      values = Object.assign({}, values, { delayTime })
    }
    if (delayTimeIllegality) {
      setTimeout(() => {
        callback(values)
      }, 200)
      return
    }
    callback(values)
  }

  hideKeys = () => {
    this.setState(preState => {
      return { hideOld: !preState.hideOld }
    })
  }

  testDelayTime = () => {
    const { delayTime } = this.state
    const delayNumber = parseInt(delayTime, 10)
    if (isNaN(delayNumber)) {
      this.setState({
        delayTime: 1,
      })
      return true
    }
    return false
  }

  renderStarStr = () => {
    let star = ''
    for (let i = 0; i < 32; i++) {
      star += '*'
    }
    return star
  }

  renderTimeout = () => {
    const { record } = this.props
    const { expireAt } = record
    if (!expireAt) {
      return false
    }
    const nowTime = new Date().getTime()
    const updateTime = new Date(expireAt).getTime()
    const timeDifference = updateTime - nowTime
    if (timeDifference < 0) {
      return 0
    }
    const min = parseInt(timeDifference / 1000 / 60, 10)
    return min
  }

  render() {
    const { loading, closeModalMethod, record } = this.props
    const { updateSetting, delayTime, hideOld } = this.state
    const { expireAt, secret, clientId } = record
    const starStr = this.renderStarStr()
    const timeout = this.renderTimeout()
    let oldKeys = `ak: ${clientId}\nsk: ${secret}`
    if (hideOld) {
      oldKeys = `ak: ${starStr}\nsk: ${starStr}`
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
        okText={ expireAt ? '完成更新' : '确定' }
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
              <Icon type="eye-o" className="text-ico" onClick={() => this.hideKeys()}/>
            </div>
          </Col>
        </Row>
        <Row>
          <Col span={4}>
            新 AK / SK
          </Col>
          <Col span={19} className="newkeys-style">
            更新后，新 AccessKey / SecretKey 将会被生成
          </Col>
        </Row>
        <Row>
          <Col span={4}>生效设置</Col>
          <Col span={20}>
            <RadioGroup
              defaultValue={updateSetting}
              onChange={e => this.setState({ updateSetting: e.target.value })}
              disabled={!!expireAt}
            >
              <Radio value="delay">更新过渡，新旧凭证同时生效</Radio>
              <Radio value="immediately">立即生效，仅用新凭证</Radio>
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
                  value={delayTime}
                  ref={input => { this.delayTimeInput = input }}
                  onChange={delayTime => this.setState({ delayTime })}
                  onBlur={this.testDelayTime}
                  disabled={!!expireAt}
                /> 分
              </Col>
            </Row>
          )
        }
        {
          timeout === 0 && <Row>
            <Col span={4}></Col>
            <Col span={20} className="timeout-style">
              已超时，旧 ak / sk 不生效，完成更新后方可进行下次更新。
            </Col>
          </Row>
        }
      </Modal>
    )
  }
}

export default UpdateConsumerVoucher
