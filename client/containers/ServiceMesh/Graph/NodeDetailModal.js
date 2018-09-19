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

function formateInOutData(inData = {}, outDetail = {}) {
  const inOutData = [
    {
      name: '',
      all: '总计',
      success: '成功率',
      failure: '失误率',
    }, {
      name: 'In',
      all: inData.total,
      success: `${parseFloat(inData[200] / inData.total).toFixed(2) * 100}%`,
      failure: `${parseFloat((inData.total - inData[200]) / inData.total).toFixed(2) * 100}%`,
    }, {
      name: 'Out',
      all: outDetail.total,
      success: `${parseFloat(outDetail[200] / outDetail.total).toFixed(2) * 100}%`,
      failure: `${parseFloat((outDetail.total - outDetail[200]) / outDetail.total).toFixed(2) * 100}%`,
    },
  ]
  return inOutData
}

// const mainData = [
//   {
//     service: 'dsa',
//     port: '222',
//     number: 'asdf',
//     time: 'fasd',
//   },
// ]
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
    const { isVisible, onClose, serviceName, getContainer } = this.props
    const { serviceName: { inDetail = {}, outDetail = {} } = {} } = this.props
    return (
      <div className="NodeDetailModal">
        <Modal className="NodeDetailModal"
          wrapClassName="ServiceMeshNodeDetailModalWrap"
          visible = {isVisible}
          onCancel = {onClose}
          width={380}
          mask={false}
          maskStyle={ { pointerEvents: 'none', backgroundColor: 'red' } }
          getContainer={() => getContainer}
        >
          {/* <div>{serviceName}</div> */}
          <div className="baseMessage">
            <div>
              <span className="item">服务:</span><span className="info">{serviceName.name}</span>
            </div>
            <div>
              <span className="item">项目:</span>
              <span className="info">{serviceName.namespace}</span>
            </div>
            {/* <div>
            <span className="item">服务类型:</span>
            <span className="info">{serviceName.protocol}</span>
            </div> */}
            {/* <div>
            <span className="item">服务版本</span>
            <span className="info"></span>{serviceName.version}</div> */}
          </div>
          <Divider/>
          <div className="baseMessage contentMessage">
            <div style={{ fontSize: '12px' }}>QPS(每秒钟请求次数)</div>
            <ul className="inOutTable">
              {formateInOutData(inDetail, outDetail).map(({ name, all, success, failure }) => {
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
            <InOutGraph inDetail={inDetail} outDetail={outDetail}/>
            {/* <ul className="mainTable inOutTable">
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
            </ul> */}
          </div>
        </Modal>
      </div>
    )
  }
}
