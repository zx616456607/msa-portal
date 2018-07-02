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
import { Card, Table, Button, Badge, Progress } from 'antd'
import CallLinkTrackIcon from '../../../../assets/img/msa-manage/call-link-track.png'

class CallLinkTrackDetail extends React.PureComponent {

  backToList = () => {
    const { history } = this.props
    history.push('/msa-manage/call-link-tracking')
  }

  render() {
    const columns = [{
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
        <Badge status={status ? 'success' : 'error'}/>
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
      render: () => <Button type="primary">查看详情</Button>,
    }]
    const data = [{
      serviceName: 'service1',
      method: 'poll',
      status: true,
      duration: '70',
      progress: 20,
      children: [{
        serviceName: 'service2',
        method: 'post',
        status: false,
        duration: '79',
        progress: 50,
        children: [{
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
          <img src={CallLinkTrackIcon} alt="call-link-tracking"/>
          <div className="call-link-track-detail-header-right">
            <div className="call-link-track-detail-id">01234567</div>
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
              dataSource={data}
              columns={columns}
            />
          </Card>
        </div>
      </QueueAnim>
    )
  }
}

const mapStateToProps = () => {
  return {}
}

export default connect(mapStateToProps, {

})(CallLinkTrackDetail)
