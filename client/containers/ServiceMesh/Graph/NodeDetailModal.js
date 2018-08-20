/*
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2018 TenxCloud. All Rights Reserved.
 * ----
 * nodeDetailModle.js page
 *
 * @author zhangtao
 * @date Thursday August 2nd 2018
 */
import React from 'react'
import { Modal, Divider } from 'antd'
import InOutGraph from './InOutGraph'
import './styles/NodeDetailModal.less'

const inOutData = [
  {
    name: '',
    all: '总计',
    success: '成功率',
    failure: '失误率',
  }, {
    name: 'In',
    all: '0',
    success: '100%',
    failure: '0%',
  }, {
    name: 'Out',
    all: '0',
    success: '10%',
    failure: '90%',
  },
]

const mainData = [
  {
    service: 'dsa',
    port: '222',
    number: 'asdf',
    time: 'fasd',
  },
]
export default class NodeDetailModal extends React.Component {
  componentDidUpdate = prevProps => {
    const { isVisible } = this.props
    if (prevProps.isVisible === false && isVisible === true) {
      this.reload()
    }
  }
  reload = () => {
    // const { serviceName } = this.props
  }
  render() {
    const { isVisible, onClose, serviceName } = this.props
    return (
      <div className="NodeDetailModal">
        <Modal className="NodeDetailModal"
          visible = {isVisible}
          onCancel = {onClose}
          width={380}
          mask={false}
        >
          {/* <div>{serviceName}</div> */}
          <div className="baseMessage">
            <div><span className="item">服务:</span><span className="info">{serviceName}</span></div>
            <div><span className="item">项目:</span><span className="info">{serviceName}</span></div>
            <div><span className="item">服务类型:</span><span className="info">{serviceName}</span></div>
            <div><span className="item">服务版本</span><span className="info"></span>{serviceName}</div>
          </div>
          <Divider/>
          <div className="baseMessage contentMessage">
            <div style={{ fontSize: '12px' }}>QPS(每秒钟请求次数)</div>
            <ul className="inOutTable">
              {inOutData.map(({ name, all, success, failure }) => {
                return (
                  <li key={name}>
                    <span>{name}</span>
                    <span>{all}</span>
                    <span>{success}</span>
                    <span>{failure}</span>
                  </li>
                )
              })}
            </ul>
            <InOutGraph/>
            <ul className="mainTable inOutTable">
              <li key="main">
                <span>依赖服务</span>
                <span>端口</span>
                <span>调用数(错/总)</span>
                <span>耗时(RT)</span>
              </li>
              { !mainData.length && <div className="cue">暂无依赖服务</div>}
              {
                mainData.map(({ service, port, number, time }) => {
                  return (
                    <li key={service}>
                      <span>{service}</span>
                      <span>{port}</span>
                      <span>{number}</span>
                      <span>{time}</span>
                    </li>
                  )
                })
              }
            </ul>
          </div>
        </Modal>
      </div>
    )
  }
}
