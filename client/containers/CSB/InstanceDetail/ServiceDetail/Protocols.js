/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * Service protocols detail
 *
 * 2017-12-22
 * @author zhangpc
 */

import React from 'react'
import {
  Row, Col, Tag,
} from 'antd'
import { transformCSBProtocols } from '../../../../common/utils'
import isEmpty from 'lodash/isEmpty'

export default class Protocols extends React.Component {
  renderCurrentServiceProtocolsInfo = () => {
    const { detail } = this.props
    const accessProtocolInfo = [{
      id: 'type',
      title: '接入接口协议',
      value: detail.type,
    }, {
      id: 'targetDetail',
      title: detail.type ? '端点' : 'WSDL 地址',
      value: detail.targetDetail,
    }, {
      id: 'responseType',
      title: '映射方式',
      value: detail.responseType,
    }, {
      id: '',
      title: 'WSDL 地址',
      value: detail,
    }, {
      id: '',
      title: '',
      value: detail,
    }, {
      id: '',
      title: '',
      value: detail,
    }]
    const openProtocolInfo = [{
      id: 'type',
      title: '开放接口协议',
      value: detail.type,
    }, {
      id: 'exposedPath',
      title: '开放地址',
      value: detail.exposedPath,
    }]
    return {
      accessProtocolInfo,
      openProtocolInfo,
    }
  }

  renderTypeTag = type => {
    switch (type) {
      case 'rest':
        return <Tag color="blue">Restful</Tag>
      default:
        return <Tag color="blue">WebService</Tag>
    }
  }

  renderOpenProtocolType = item => {
    if (item.id === 'exposedPath') {
      return item.value
    }
    return this.renderTypeTag(item.value)
  }

  renderProtocolType = detail => {
    const { type, transformationType } = detail
    if (transformationType === 'direct') {
      return transformCSBProtocols(type)
    }
    return transformCSBProtocols(transformationType.split('_')[0])
  }

  renderHttpMethod = detail => {
    const { limitationDetail } = detail
    let method = '--'
    if (isEmpty(limitationDetail)) {
      return method
    }
    const parseLimitDetail = JSON.parse(limitationDetail)
    if (!Array.isArray(parseLimitDetail)) {
      return parseLimitDetail.method
    }
    parseLimitDetail.some(item => {
      if (item.method) {
        method = item.method
        return true
      }
      return false
    })
    return method
  }
  render() {
    const { detail } = this.props
    const { type, transformationType, transformationDetail } = detail
    const { openProtocolInfo } = this.renderCurrentServiceProtocolsInfo()
    const protocolType = transformationType === 'direct' ? type : transformationType.split('_')[0]
    const { wsdl, bindingName, operationName } = JSON.parse(transformationDetail)
    return (
      <div className="service-protocols">
        <div className="first-title">接入协议信息</div>
        <div className="service-protocols-body row-table">

          <Row>
            <Col span={5}>
              <div className="txt-of-ellipsis">接入接口协议</div>
            </Col>
            <Col span={10}>
              <div className="txt-of-ellipsis">
                {this.renderProtocolType(detail)}
              </div>
            </Col>
          </Row>
          <Row>
            <Col span={5}>
              <div className="txt-of-ellipsis">
                {this.renderProtocolType(detail) === 'WebService' ? 'WSDL 地址' : '端点'}
              </div>
            </Col>
            <Col span={10}>
              <div className="txt-of-ellipsis">
                {protocolType === 'rest' ? detail.targetDetail : wsdl}
              </div>
            </Col>
          </Row>
          {
            protocolType === 'rest' &&
            <Row>
              <Col span={5}>
                <div className="txt-of-ellipsis">方法</div>
              </Col>
              <Col span={10}>
                <div className="txt-of-ellipsis">
                  {this.renderHttpMethod(detail)}
                </div>
              </Col>
            </Row>
          }
          {
            type === 'rest' && protocolType === 'soap' &&
              [
                <Row key={'binding'}>
                  <Col span={5}>
                    <div className="txt-of-ellipsis">Binding 名称</div>
                  </Col>
                  <Col span={10}>
                    <div className="txt-of-ellipsis">
                      {bindingName}
                    </div>
                  </Col>
                </Row>,
                <Row key={'operationName'}>
                  <Col span={5}>
                    <div className="txt-of-ellipsis">方法名称</div>
                  </Col>
                  <Col span={10}>
                    <div className="txt-of-ellipsis">
                      {operationName}
                    </div>
                  </Col>
                </Row>,
              ]
          }
        </div>
        <div className="first-title exposed-title">开放协议信息</div>
        <div className="service-protocols-body row-table">
          {
            openProtocolInfo.map(item => {
              return (
                <Row key={item.id}>
                  <Col span={5}>
                    <div className="txt-of-ellipsis">{item.title}</div>
                  </Col>
                  <Col span={10}>
                    <div className="txt-of-ellipsis">{this.renderOpenProtocolType(item)}</div>
                  </Col>
                </Row>
              )
            })
          }
        </div>
      </div>
    )
  }
}
