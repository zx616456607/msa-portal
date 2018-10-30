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
import TenxIcon from '@tenx-ui/icon/es/_old'
import CreateG2 from '../../components/CreateG2'
import { getLimitAndRoutes, getMicroservice, getRpcService, getServiceCall } from '../../actions/indexPage'
import { formatDate } from '../../common/utils'
import Ellipsis from '@tenx-ui/ellipsis'
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
    const ellipsisComponent = num => <Ellipsis>{num.toString()}</Ellipsis>
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
                          <Col xl={18} xxl={15}>
                            <div className="index-page-overview-left">
                              <div className="icon-box">
                                <TenxIcon type="msa"/>
                              </div>
                              <div className="index-page-overview-left-title">
                                REST服务数量
                              </div>
                              <div className="index-page-overview-left-num">
                                {ellipsisComponent(microservice.data.restServiceCount)}
                              </div>
                            </div>
                          </Col>
                          <Col xl={6} xxl={9}>
                            <Row className="index-page-overview-right-row">
                              <Col span={17} className="over-long">
                                <Ellipsis>
                                  可被发现
                                </Ellipsis>
                              </Col>
                              <Col span={7}>
                                {ellipsisComponent(microservice.data.discoverableCount)}
                              </Col>
                            </Row>
                            <Row className="index-page-overview-right-row">
                              <Col span={17} className="over-long">
                                <Ellipsis>不可被发现</Ellipsis>
                              </Col>
                              <Col span={7}>
                                {ellipsisComponent(microservice.data.undiscoverableCount)}
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
                          <Col xl={17} xxl={15}>
                            <div className="index-page-overview-left">
                              <div className="icon-box">
                                <TenxIcon type="config-center"/>
                              </div>
                              <div className="index-page-overview-left-title">
                                RPC服务数量
                              </div>
                              <div className="index-page-overview-left-num">
                                {ellipsisComponent(rpcService.data.rpcServiceCount)}
                              </div>
                            </div>
                          </Col>
                          <Col xl={7} xxl={9}>
                            <Row className="index-page-overview-right-row">
                              <Col span={17}>
                                提供者
                              </Col>
                              <Col span={7}>
                                {ellipsisComponent(rpcService.data.providerCount)}
                              </Col>
                            </Row>
                            <Row className="index-page-overview-right-row">
                              <Col span={17}>
                                消费者
                              </Col>
                              <Col span={7}>
                                {ellipsisComponent(rpcService.data.consumerCount)}
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
                                {ellipsisComponent(microservice.data.instanceCount)}
                              </div>
                            </div>
                          </Col>
                          <Col span={9}>
                            <Row className="index-page-overview-right-row">
                              <Col span={16}>
                                up 实例
                              </Col>
                              <Col span={8}>
                                {ellipsisComponent(microservice.data.upCount)}
                              </Col>
                            </Row>
                            <Row className="index-page-overview-right-row">
                              <Col span={16}>
                                down 实例
                              </Col>
                              <Col span={8}>
                                {ellipsisComponent(microservice.data.downCount)}
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
                              <div className="icon-box">
                                <TenxIcon type="gateway"/>
                              </div>
                              <div className="index-page-overview-left-title">
                                限流规则
                              </div>
                              <div className="index-page-overview-left-num">
                                {ellipsisComponent(limitsAndRoutes.data.ratelimitCount)}
                              </div>
                            </div>
                          </Col>
                          <Col span={9}>
                            <Row className="index-page-overview-right-row">
                              <Col span={16}>
                                启用规则
                              </Col>
                              <Col span={8}>
                                {ellipsisComponent(limitsAndRoutes.data.runningRatelimitCount)}
                              </Col>
                            </Row>
                            <Row className="index-page-overview-right-row">
                              <Col span={16}>
                                停用规则
                              </Col>
                              <Col span={8}>
                                {ellipsisComponent(limitsAndRoutes.data.stoppedRatelimitCount)}
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
                              <div className="icon-box">
                                <TenxIcon type="routing-manage"/>
                              </div>
                              <div className="index-page-overview-left-title">
                                路由数量
                              </div>
                              <div className="index-page-overview-left-num">
                                {ellipsisComponent(limitsAndRoutes.data.routeCount)}
                              </div>
                            </div>
                          </Col>
                          <Col span={9}>
                            <Row className="index-page-overview-right-row">
                              <Col span={16}>
                                running
                              </Col>
                              <Col span={8}>
                                {ellipsisComponent(limitsAndRoutes.data.runningRouteCount)}
                              </Col>
                            </Row>
                            <Row className="index-page-overview-right-row">
                              <Col span={16}>
                                stop
                              </Col>
                              <Col span={8}>
                                {ellipsisComponent(limitsAndRoutes.data.stoppedRouteCount)}
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
                          <Col xl={17} xxl={15}>
                            <Row className="index-page-overview-left">
                              <div className="icon-box event-num-icon">
                                <Icon type="desktop" />
                              </div>
                              <div span={6} className="index-page-overview-left-title">
                                事件数量
                              </div>
                              <div className="index-page-overview-left-num event-num-text">
                                {ellipsisComponent(microservice.data.eurekaEventLogCount)}
                              </div>
                            </Row>
                          </Col>
                          <Col xl={7} xxl={9} className="index-page-overview-right-row-more-padding">
                            <Row className="index-page-overview-right-row">
                              <Col span={16}>
                                <span className="level critical">严重</span>
                              </Col>
                              <Col span={8}>
                                {ellipsisComponent(microservice.data.criticalCount)}
                              </Col>
                            </Row>
                            <Row className="index-page-overview-right-row">
                              <Col span={16}>
                                <span className="level importance">重要</span>
                              </Col>
                              <Col span={8}>
                                {ellipsisComponent(microservice.data.majorCount)}
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
