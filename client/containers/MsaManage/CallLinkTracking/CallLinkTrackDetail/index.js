/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2018 TenxCloud. All Rights Reserved.
 */

/**
 * Call link track detail
 *
 * @author zhangxuan
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

class CallLinkTrackDetail extends React.PureComponent {

  state = {
    visible: false
  }

  componentDidMount() {
    const { clusterID, getZipkinTrace } = this.props
    getZipkinTrace(clusterID, '6d4bf6fc3f03260b')
  }

  backToList = () => {
    const { history } = this.props
    history.push('/msa-manage/call-link-tracking')
  }

  handleDetail = () => {
    this.setState({
      visible: true
    })
  }

  handleClose = () => {
    this.setState({
      visible: false
    })
  }

  render() {
    const { data, isFetching } = this.props
    const columns = [{
      id: 'id',
      title: '微服务名称',
      dataIndex: 'serviceName',
      width: '15%',
    }, {
      title: '方法名',
      dataIndex: 'method',
      width: '15%',
    }, {
      title: '状态',
      dataIndex: 'status',
      width: '10%',
      render: status => <div className={status ? 'success-status' : 'error-status'}>
        <Badge status={status ? 'success' : 'error'} />
        {status ? '成功' : '失败'}
      </div>,
    }, {
      title: '耗时',
      dataIndex: 'duration',
      width: '10%',
      render: text => text + ' ms',
    }, {
      title: '时间线 0 ms - 38.29 ms',
      dataIndex: 'progress',
      width: '20%',
      render: progress => <Progress
        status={progress < 50 ? 'exception' : 'success'}
        showInfo={false}
        percent={progress}
      />,
    }, {
      title: '操作',
      width: '15%',
      render: () => <Button type="primary" onClick={this.handleDetail}>查看详情</Button>,
    }]
    const modalColums = [{
      key: 'id',
      title: 'key',
      dataIndex: 'name',
    }, {
      key: 'value',
      title: 'value',
      dataIndex: 'value',
    }]
    const modalData = [{
      key: 1,
      name: 'http.host',
      value: 'localhost',
    }, {
      key: 2,
      name: 'http.mothod',
      value: 'GET',
    }]
    const datas = [{
      id: '1',
      key: 1,
      serviceName: 'service1',
      method: 'poll',
      status: true,
      duration: '70',
      progress: 20,
      children: [{
        key: 2,
        serviceName: 'service2',
        method: 'post',
        status: false,
        duration: '79',
        progress: 50,
        children: [{
          key: 3,
          serviceName: 'service3',
          method: 'get',
          status: true,
          duration: 80,
          progress: 100,
        }],
      }],
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
              <li>开始时间：22分钟前</li>
              <li>调用深度：3</li>
              <li>调用耗时：38.29 ms</li>
              <li>总span数：4</li>
            </ul>
            <div className="call-link-track-detail-service-count">
              <span>服务数：2</span>
              <span>
                <Button type="primary" size="small">service1 x 2</Button>
                <Button type="primary" size="small">service1 x 2</Button>
                <Button type="primary" size="small">service1 x 2</Button>
                <Button type="primary" size="small">service1 x 2</Button>
              </span>
            </div>
          </div>
        </Card>
        <div className="layout-content-body" key="body">
          <Card>
            <Table
              pagination={false}
              dataSource={datas}
              columns={columns}
              rowKey={key => key.id}
            />
          </Card>
        </div>
        <Modal title="服务详情"
          visible={this.state.visible}
          width={'40%'}
          onCancel={this.handleClose}
          footer={[
            <Button key="back" type="ghost" onClick={this.handleClose}>取 消</Button>,
            <Button key="submit" type="primary" onClick={this.handleOk}>确 定</Button>,
          ]}>
          {
            <div className="modal-server">
              <div className="top">
                <div>请求相对开始时间：10.00 ms</div>
                <div>span 总耗时： 1.2 ms</div>
              </div>
              <div className="flow-chart">
                <Row gutter={16}>
                  <Col span={6}>
                    <div className="server">
                      service1
                    </div>
                  </Col>
                  <Col span={6}>
                    <div className="send">发送请求耗时：1S</div>
                    <div className="arrow-left sx-arrow-left"></div>
                    <div className="end">收到响应耗时：1S</div>
                    <div className="arrow-rigth sx-arrow-rigth"></div>
                  </Col>
                  <Col span={6}>
                    <div className="server end-server">server2</div>
                  </Col>
                  <Col span={6}>
                    <div className="server-time">服务端处理请求耗时：1.00 ms</div>
                    <div className="arrow-time"></div>
                  </Col>
                </Row>
              </div>
              <div className="body">
                <Table
                  pagination={false}
                  loading={isFetching}
                  dataSource={modalData}
                  columns={modalColums}
                  rowKey="uid"
                />
              </div>
            </div>
          }
        </Modal>
      </QueueAnim>
    )
  }
}

const mapStateToProps = (state) => {
  const { current, zipkin } = state
  const { cluster } = current.config
  const clusterID = cluster.id
  const { data, isFetching } = zipkin.traceList
  return {
    data,
    clusterID,
    isFetching
  }
}

export default connect(mapStateToProps, {
  getZipkinTrace
})(CallLinkTrackDetail)
