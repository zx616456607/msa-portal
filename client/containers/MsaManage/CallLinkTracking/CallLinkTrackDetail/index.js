/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2018 TenxCloud. All Rights Reserved.
 */

/**
 * Call link track detail
 *
 * @author zhaoyb
 * @date 2018-07-02
 */
import React from 'react'
import { connect } from 'react-redux'
import QueueAnim from 'rc-queue-anim'
import ReturnButton from '@tenx-ui/return-button'
import '@tenx-ui/return-button/assets/index.css'
import './style/index.less'
import { Card, Table, Button, Badge, Progress, Modal, Row, Col } from 'antd'
import CallLinkTrackIcon from '../../../../assets/img/msa-manage/call-link-track.png'
import { getZipkinTrace } from '../../../../actions/callLinkTrack'
import { formatFromnow } from '../../../../common/utils'

class CallLinkTrackDetail extends React.PureComponent {

  state = {
    visible: false,
    detailData: [],
    serverUrl: '',
    serverName: '',
    serviceList: [],
    serverDetail: [],
    detailTimestamp: '',
  }

  componentDidMount() {
    const { clusterID, getZipkinTrace } = this.props
    const traceId = this.props.location.pathname.split('/')[3]
    getZipkinTrace(clusterID, traceId)
  }

  backToList = () => {
    const { history } = this.props
    history.push('/msa-manage/call-link-tracking')
  }

  handleDetail = record => {
    this.setState({
      visible: true,
      serverUrl: record.name,
      serverName: record.serverName,
      detailTimestamp: record.timestamp,
      serviceList: record.annotations || [],
      serverDetail: record.binaryAnnotations,
    })
  }

  handleClose = () => {
    this.setState({
      visible: false,
    })
  }

  filterProgress = (text, success, duration) => {
    const { detailData } = this.props
    if (text) {
      if (text.length === 2) {
        return <Progress
          status={success ? 'success' : 'exception'}
          showInfo={false}
          percent={100}
        />
      }
      if (text.length === 4) {
        const countMS = Math.ceil((duration / detailData[0].duration) * 100)
        return <Progress
          status={success ? 'success' : 'exception'}
          showInfo={false}
          percent={countMS}
        />
      }
    }
  }

  render() {
    const { serverDetail, serviceList, detailTimestamp, serverUrl, serverName } = this.state
    const { isFetching, detailData } = this.props
    const columns = [{
      id: 'id',
      title: '微服务名称',
      dataIndex: 'serverName',
      width: '15%',
    }, {
      title: '方法名',
      dataIndex: 'name',
      width: '15%',
    }, {
      title: '状态',
      dataIndex: 'success',
      width: '10%',
      render: status => <div className={status ? 'success-status' : 'error-status'}>
        <Badge status={status ? 'success' : 'error'} />
        {status ? '成功' : '失败'}
      </div>,
    }, {
      title: '耗时(ms)',
      dataIndex: 'duration',
      width: '10%',
      render: text => text / 1000,
    }, {
      title: `时间线 0 ms - ${detailData.length > 0 && detailData[0].duration / 1000} ms`,
      dataIndex: 'annotations',
      width: '20%',
      render: (text, record) => this.filterProgress(text, record.success, record.duration, record),
    }, {
      title: '操作',
      width: '15%',
      render: text => <Button type="primary"
        onClick={() => this.handleDetail(text)}>查看详情</Button>,
    }]
    const modalColums = [{
      key: 'id',
      title: 'key',
      dataIndex: 'key',
      width: '30% ',
    }, {
      key: 'value',
      title: 'value',
      dataIndex: 'value',
    }]

    return (
      <QueueAnim className="call-link-track-detail">
        <ReturnButton onClick={this.backToList}>返回</ReturnButton>
        <Card
          className="call-link-track-detail-header"
          key="call-link-track-detail-header"
          bordered={false}
        >
          <img src={CallLinkTrackIcon} alt="call-link-tracking" />
          <div className="call-link-track-detail-header-right">
            <div className="call-link-track-detail-id"></div>
            <ul className="call-link-track-detail-middle">
              <li>开始时间：
                {detailData.length > 0 && formatFromnow(detailData[0].timestamp / 1000)}
              </li>
              <li>调用深度：{detailData.length > 0 && detailData[0].spanCount}</li>
              <li>调用耗时：{detailData.length > 0 && detailData[0].duration / 1000} ms</li>
              <li>总span数：{detailData.length > 0 && detailData[0].spanCount}</li>
            </ul>
            <div className="call-link-track-detail-service-count">
              <span>服务数：
                {detailData.length > 0 && Object.keys(detailData[0].services).length}
              </span>
              <span>
                {
                  detailData.length > 0 && Object.keys(detailData[0].services).map(item => {
                    return <Button type="primary" size="small">
                      {`${item} x ${detailData[0].services[item]}`}</Button>
                  })
                }
              </span>
            </div>
          </div>
        </Card>
        <div className="layout-content-body" key="body">
          <Card>
            <Table
              pagination={false}
              dataSource={detailData}
              columns={columns}
              rowKey={key => key.id}
            />
          </Card>
        </div>
        <Modal title={`${serverName} (${serverUrl})`}
          visible={this.state.visible}
          width={'40%'}
          onCancel={this.handleClose}
          footer={[
            <Button key="back" type="ghost" onClick={this.handleClose}>取 消</Button>,
            <Button key="submit" type="primary" onClick={this.handleClose}>确 定</Button>,
          ]}>
          {
            <div className="modal-server">
              <div className="top">
                <div>请求相对开始时间：
                  {
                    detailData.length > 0 && detailTimestamp - detailData[0].timestamp
                  } ms</div>
                <div>span 总耗时：{detailData.length > 0 && detailData[0].duration / 1000} ms</div>
              </div>
              {
                serviceList.length === 4 &&
                <div className="flow-chart">
                  <Row gutter={16}>
                    <Col span={6}>
                      <div className="server">
                        {serviceList.length > 0 && serviceList[0].endpoint.serviceName}
                      </div>
                    </Col>
                    <Col span={6}>
                      <div className="send">发送请求耗时：
                        {
                          serviceList.length > 0 &&
                          (serviceList[1].timestamp - serviceList[0].timestamp) / 1000
                        } ms
                      </div>
                      <div className="arrow-left sx-arrow-left"></div>
                      <div className="end">收到响应耗时：
                        {
                          serviceList.length > 0 &&
                          (serviceList[3].timestamp - serviceList[0].timestamp) / 1000
                        } ms
                      </div>
                      <div className="arrow-rigth sx-arrow-rigth"></div>
                    </Col>
                    <Col span={6}>
                      <div className="server end-server">
                        {serviceList.length > 0 && serviceList[1].endpoint.serviceName}
                      </div>
                    </Col>
                    <Col span={6}>
                      <div className="server-time">服务端处理请求耗时：
                        {
                          serviceList.length > 0 &&
                          (serviceList[2].timestamp - serviceList[1].timestamp) / 1000
                        } ms
                      </div>
                      <div className="arrow-time"></div>
                    </Col>
                  </Row>
                </div>
              }
              {
                serviceList.length === 2 &&
                <div className="flow-chart">
                  <Row gutter={16}>
                    <Col span={6}>
                      <div className="server end-server">
                        {serviceList.length > 0 && serviceList[0].endpoint.serviceName}
                      </div>
                    </Col>
                    <Col span={6}>
                      <div className="server-time">服务端处理请求耗时：
                        {
                          serviceList.length > 0 &&
                          (serviceList[1].timestamp - serviceList[0].timestamp) / 1000
                        } ms
                      </div>
                      <div className="arrow-time"></div>
                    </Col>
                  </Row>
                </div>
              }
              <div className="body">
                <Table
                  pagination={false}
                  loading={isFetching}
                  dataSource={serverDetail}
                  columns={modalColums}
                  rowKey={key => key.id}
                />
              </div>
            </div>
          }
        </Modal>
      </QueueAnim>
    )
  }
}

const mapStateToProps = state => {
  const { current, zipkin } = state
  const { cluster } = current.config
  const clusterID = cluster.id
  const { traceList, tracesList } = zipkin
  const { data, isFetching } = traceList
  const detailData = []
  if (data) {
    detailData.push(data)
  }
  return {
    tracesList,
    detailData,
    clusterID,
    isFetching,
  }
}

export default connect(mapStateToProps, {
  getZipkinTrace,
})(CallLinkTrackDetail)
