/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * IndexPage container
 *
 * 2017-08-16
 * @author zhangpc
 */

import React from 'react'
import { connect } from 'react-redux'
import QueueAnim from 'rc-queue-anim'
import { Row, Col, Card, Icon, Table, Spin } from 'antd'
import CreateG2 from '../../components/CreateG2'
import msaIcon from '../../assets/img/msa-manage/msa.svg'
import configCenterIcon from '../../assets/img/msa-manage/config-center.svg'
import routingManageIcon from '../../assets/img/msa-manage/routing-manage.svg'
import apiGatewayIcon from '../../assets/img/msa-manage/api-gateway.svg'
import { getLimitAndRoutes, getMicroservice, getRpcService, getServiceCall } from '../../actions/indexPage'
import { formatDate } from '../../common/utils'
import './style/index.less'

// const Option = Select.Option
const Chart = CreateG2(chart => {
  chart.col('dateTime', {
    alias: '时间',
    range: [ 0, 1 ],
  })
  chart.col('count', {
    alias: '次数',
  })
  chart.line()
    .position('dateTime*count')
    .size(2)
    .shape('smooth')
  chart.render()
})

class IndexPage extends React.Component {
  state = {
    data: [
      { dateTime: '09:59:00', count: 12 },
      { dateTime: '10:00:00', count: 56 },
      { dateTime: '10:01:00', count: 78 },
      { dateTime: '10:02:00', count: 144 },
      { dateTime: '10:03:00', count: 345 },
      { dateTime: '10:04:00', count: 567 },
      { dateTime: '10:05:00', count: 456 },
      { dateTime: '10:06:00', count: 333 },
      { dateTime: '10:07:00', count: 233 },
      { dateTime: '10:08:00', count: 123 },
      { dateTime: '10:09:00', count: 56 },
      { dateTime: '10:10:00', count: 35 },
    ],
    forceFit: true,
    width: 500,
    height: 450,
  }
  componentDidMount() {
    const { clusterID, getServiceCall } = this.props
    const startTime = new Date().getTime() - 7 * 86400000
    const endTime = new Date().getTime()
    this.loadLimitAndRoutesData()
    this.loadMicroservice(startTime, endTime)
    this.loadRpcService()
    getServiceCall(clusterID, { startTime, endTime, scaleSize: 7 })
  }
  loadLimitAndRoutesData = () => {
    const { clusterID, getLimitAndRoutes } = this.props
    getLimitAndRoutes(clusterID)
  }
  loadMicroservice = (startTime, endTime) => {
    const { clusterID, getMicroservice } = this.props
    getMicroservice(clusterID, { startTime, endTime })
  }
  loadRpcService = () => {
    const { clusterID, getRpcService } = this.props
    getRpcService(clusterID)
  }

  render() {
    const columns = [
      {
        title: '服务名称',
        dataIndex: 'name',
        key: 'name',
        width: 100,
      },
      {
        title: '次数',
        dataIndex: 'count',
        key: 'count',
        width: 100,
      },
    ]
    const { periodCallData } = this.props
    const { limitsAndRoutes,
      microservice,
      rpcService,
      sortedCallService,
      sortedErrorService, numberOfServiceCall } = this.props.overView
    return (
      <QueueAnim className="index-page">
        <div className="index-page-time-picker">
        </div>
        <Row gutter={16} key="row1">
          <Col span={8} className="index-page-overview">
            <Card hoverable={true}>
              {
                microservice.isFetching ?
                  <div className="index-page-spinning">
                    <Spin/>
                  </div>
                  :
                  <div>
                    {
                      microservice.data ?
                        <Row gutter={16}>
                          <Col span={15}>
                            <div className="index-page-overview-left">
                              <svg>
                                <use xlinkHref={`#${msaIcon.id}`} />
                              </svg>
                              <div className="index-page-overview-left-title">
                                REST服务数量
                              </div>
                              <div className="index-page-overview-left-num">
                                {microservice.data.restServiceCount}
                              </div>
                            </div>
                          </Col>
                          <Col span={9}>
                            <Row className="index-page-overview-right-row">
                              <Col span={16}>
                                可被发现
                              </Col>
                              <Col span={8}>
                                {microservice.data.discoverableCount}
                              </Col>
                            </Row>
                            <Row className="index-page-overview-right-row">
                              <Col span={16}>
                                不可被发现
                              </Col>
                              <Col span={8}>
                                {microservice.data.undiscoverableCount}
                              </Col>
                            </Row>
                          </Col>
                        </Row>
                        :
                        <div className="index-page-spinning">
                          <Icon type="frown-o" theme="outlined" style={{ marginRight: 8 }}/>
                          暂无数据
                        </div>
                    }
                  </div>
              }
            </Card>
          </Col>
          <Col span={8}>
            <Card hoverable={true}>
              {
                rpcService.isFetching ?
                  <div className="index-page-spinning">
                    <Spin/>
                  </div>
                  :
                  <div>
                    {
                      rpcService.data ?
                        <Row gutter={16}>
                          <Col span={15}>
                            <div className="index-page-overview-left">
                              <svg>
                                <use xlinkHref={`#${configCenterIcon.id}`} />
                              </svg>
                              <div className="index-page-overview-left-title">
                                RPC服务数量
                              </div>
                              <div className="index-page-overview-left-num">
                                {rpcService.data.rpcServiceCount}
                              </div>
                            </div>
                          </Col>
                          <Col span={9}>
                            <Row className="index-page-overview-right-row">
                              <Col span={16}>
                                提供者
                              </Col>
                              <Col span={8}>
                                {rpcService.data.providerCount}
                              </Col>
                            </Row>
                            <Row className="index-page-overview-right-row">
                              <Col span={16}>
                                消费者
                              </Col>
                              <Col span={8}>
                                {rpcService.data.consumerCount}
                              </Col>
                            </Row>
                          </Col>
                        </Row>
                        :
                        <div className="index-page-spinning">
                          <Icon type="frown-o" theme="outlined" style={{ marginRight: 8 }}/>
                          暂无数据
                        </div>
                    }
                  </div>
              }
            </Card>
          </Col>
          <Col span={8}>
            <Card hoverable={true}>
              {
                microservice.isFetching ?
                  <div className="index-page-spinning">
                    <Spin/>
                  </div>
                  :
                  <div>
                    {
                      microservice.data ?
                        <Row gutter={16}>
                          <Col span={15}>
                            <div className="index-page-overview-left">
                              <div className="icon-box">
                                <Icon type="appstore-o" />
                              </div>
                              <div className="index-page-overview-left-title">
                                实例数量
                              </div>
                              <div className="index-page-overview-left-num">
                                {microservice.data.instanceCount}
                              </div>
                            </div>
                          </Col>
                          <Col span={9}>
                            <Row className="index-page-overview-right-row">
                              <Col span={16}>
                                up 实例
                              </Col>
                              <Col span={8}>
                                {microservice.data.upCount}
                              </Col>
                            </Row>
                            <Row className="index-page-overview-right-row">
                              <Col span={16}>
                                down 实例
                              </Col>
                              <Col span={8}>
                                {microservice.data.downCount}
                              </Col>
                            </Row>
                          </Col>
                        </Row>
                        :
                        <div className="index-page-spinning">
                          <Icon type="frown-o" theme="outlined" style={{ marginRight: 8 }}/>
                          暂无数据
                        </div>
                    }
                  </div>
              }
            </Card>
          </Col>
        </Row>
        <Row gutter={16} key="row2">
          <Col span={8}>
            <Card hoverable={true}>
              {
                limitsAndRoutes.isFetching ?
                  <div className="index-page-spinning">
                    <Spin/>
                  </div>
                  :
                  <div>
                    {
                      limitsAndRoutes.data ?
                        <Row gutter={16}>
                          <Col span={15}>
                            <div className="index-page-overview-left">
                              <svg>
                                <use xlinkHref={`#${apiGatewayIcon.id}`} />
                              </svg>
                              <div className="index-page-overview-left-title">
                                限流规则
                              </div>
                              <div className="index-page-overview-left-num">
                                {limitsAndRoutes.data.ratelimitCount}
                              </div>
                            </div>
                          </Col>
                          <Col span={9}>
                            <Row className="index-page-overview-right-row">
                              <Col span={16}>
                                启用规则
                              </Col>
                              <Col span={8}>
                                {limitsAndRoutes.data.runningRatelimitCount}
                              </Col>
                            </Row>
                            <Row className="index-page-overview-right-row">
                              <Col span={16}>
                                停用规则
                              </Col>
                              <Col span={8}>
                                {limitsAndRoutes.data.stoppedRatelimitCount}
                              </Col>
                            </Row>
                          </Col>
                        </Row>
                        :
                        <div className="index-page-spinning">
                          <Icon type="frown-o" theme="outlined" style={{ marginRight: 8 }}/>
                          暂无数据
                        </div>
                    }
                  </div>
              }
            </Card>
          </Col>
          <Col span={8}>
            <Card hoverable={true}>
              {
                limitsAndRoutes.isFetching ?
                  <div className="index-page-spinning">
                    <Spin/>
                  </div>
                  :
                  <div>
                    {
                      limitsAndRoutes.data ?
                        <Row gutter={16}>
                          <Col span={15}>
                            <div className="index-page-overview-left">
                              <svg>
                                <use xlinkHref={`#${routingManageIcon.id}`} />
                              </svg>
                              <div className="index-page-overview-left-title">
                                路由数量
                              </div>
                              <div className="index-page-overview-left-num">
                                {limitsAndRoutes.data.routeCount}
                              </div>
                            </div>
                          </Col>
                          <Col span={9}>
                            <Row className="index-page-overview-right-row">
                              <Col span={16}>
                                running
                              </Col>
                              <Col span={8}>
                                {limitsAndRoutes.data.runningRouteCount}
                              </Col>
                            </Row>
                            <Row className="index-page-overview-right-row">
                              <Col span={16}>
                                stop
                              </Col>
                              <Col span={8}>
                                {limitsAndRoutes.data.stoppedRouteCount}
                              </Col>
                            </Row>
                          </Col>
                        </Row>
                        :
                        <div className="index-page-spinning">
                          <Icon type="frown-o" theme="outlined" style={{ marginRight: 8 }}/>
                          暂无数据
                        </div>

                    }
                  </div>
              }

            </Card>
          </Col>
          <Col span={8}>
            <Card hoverable={true}>
              {
                microservice.isFetching ?
                  <div className="index-page-spinning">
                    <Spin/>
                  </div>
                  :
                  <div>
                    {
                      microservice.data ?
                        <Row gutter={16}>
                          <Col span={15}>
                            <div className="index-page-overview-left">
                              <div className="icon-box">
                                <Icon type="desktop" />
                              </div>
                              <div className="index-page-overview-left-title">
                                事件数量
                              </div>
                              <div className="index-page-overview-left-num">
                                {microservice.data.eurekaEventLogCount}
                              </div>
                            </div>
                          </Col>
                          <Col span={9}>
                            <Row className="index-page-overview-right-row">
                              <Col span={16}>
                                <span className="level critical">严重</span>
                              </Col>
                              <Col span={8}>
                                {microservice.data.criticalCount}
                              </Col>
                            </Row>
                            <Row className="index-page-overview-right-row">
                              <Col span={16}>
                                <span className="level importance">重要</span>
                              </Col>
                              <Col span={8}>
                                {microservice.data.majorCount}
                              </Col>
                            </Row>
                          </Col>
                        </Row>
                        :
                        <div className="index-page-spinning">
                          <Icon type="frown-o" theme="outlined" style={{ marginRight: 8 }}/>
                          暂无数据
                        </div>
                    }
                  </div>
              }
            </Card>
          </Col>
        </Row>
        <Row gutter={16} key="row3">
          <Col span={12}>
            <Card hoverable={true} title="近 7 天服务调用top20" style={{ height: 560 }}>
              <Row gutter={16}>
                <Col span={12} className="index-page-top-call">
                  <div className="index-page-top-call-success">成功最多服务</div>
                  {
                    numberOfServiceCall.isFetching ?
                      <div className="index-page-spinning service-call-spinning">
                        <Spin/>
                      </div>
                      :
                      <Table
                        columns={columns}
                        dataSource={sortedCallService}
                        bordered={true}
                        size="small"
                        pagination={false}
                        scroll={{ y: 340 }}
                      />
                  }
                </Col>
                <Col span={12}>
                  <div className="index-page-top-call-failed">失败最多服务</div>
                  {
                    numberOfServiceCall.isFetching ?
                      <div className="index-page-spinning service-call-spinning">
                        <Spin/>
                      </div>
                      :
                      <Table
                        columns={columns}
                        dataSource={sortedErrorService}
                        bordered={true}
                        size="small"
                        pagination={false}
                        scroll={{ y: 340 }}
                      />
                  }
                </Col>
              </Row>
            </Card>
          </Col>
          <Col span={12}>
            <Card hoverable={true} title="所有微服务调用次数" style={{ height: 560 }}>
              {
                numberOfServiceCall.isFetching ?
                  <div className="index-page-spinning service-call-spinning">
                    <Spin/>
                  </div>
                  :
                  <Chart
                    data={periodCallData}
                    width={this.state.width}
                    height={this.state.height}
                    forceFit={this.state.forceFit}
                  />
              }
            </Card>
          </Col>
        </Row>
      </QueueAnim>
    )
  }
}

const mapStateToProps = state => {
  const { current } = state
  const { cluster } = current.config
  const clusterID = cluster.id
  const { overView } = state
  const { numberOfServiceCall } = overView
  let periodCallData = []
  let sortedCallService = []
  let sortedErrorService = []
  if (numberOfServiceCall.data) {
    sortedCallService = numberOfServiceCall.data.periodCallData
    sortedErrorService = numberOfServiceCall.data.periodCallData
    periodCallData = numberOfServiceCall.data.periodCallData
    sortedErrorService.map(() => {
      return null
    })
    sortedCallService.map(() => {
      return null
    })
    periodCallData.map(item => {
      item.dateTime = formatDate(item.startTime, 'MM-DD')
      return null
    })
  }
  return {
    errorObject: state.errorObject,
    auth: state.entities.auth,
    clusterID,
    overView,
    periodCallData,
    sortedCallService,
    sortedErrorService,
  }
}

export default connect(mapStateToProps, {
  getLimitAndRoutes,
  getMicroservice,
  getRpcService,
  getServiceCall,
})(IndexPage)
