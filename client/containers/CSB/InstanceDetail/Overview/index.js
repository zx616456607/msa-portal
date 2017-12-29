/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * Overview
 *
 * 2017-12-05
 * @author zhaoyb
 */

import React from 'react'
import QueueAnim from 'rc-queue-anim'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { Card, Button, Row, Col } from 'antd'
import './style/index.less'
import G2 from 'g2'
import { formatDate } from '../../../../common/utils'
import createG2 from '../../../../components/CreateG2'
import { getInstanceOverview } from '../../../../actions/CSB/instance'

const Chart = createG2(chart => {
  const Stat = G2.Stat
  chart.legend(false)
  chart.coord('theta', {
    radius: 1,
    inner: 0.75,
  })
  chart.intervalStack().position(Stat.summary.percent('count'))
    .color('area', [ '#5cb85c', '#f85a5a', '#d9d9d9' ])
    .style({
      lineWidth: 1,
    })
  chart.render()
})
const Chart1 = createG2(chart => {
  const Stat = G2.Stat
  chart.legend(false)
  chart.coord('theta', {
    radius: 1,
    inner: 0.75,
  })
  chart.intervalStack().position(Stat.summary.percent('count'))
    .color('area', [ '#5cb85c', '#f85a5a', '#ffbf00', '#d9d9d9' ])
    .style({
      lineWidth: 1,
    })
  chart.render()
})
const Chart2 = createG2(chart => {
  const Stat = G2.Stat
  chart.legend(false)
  chart.coord('theta', {
    radius: 1,
    inner: 0.75,
  })
  chart.intervalStack().position(Stat.summary.percent('count'))
    .color('area', [ '#5cb85c', '#f85a5a' ])
    .style({
      lineWidth: 1,
    })
  chart.render()
})
const Chart3 = createG2(chart => {
  const Stat = G2.Stat
  chart.legend(false)
  chart.coord('theta', {
    radius: 1,
    inner: 0.75,
  })
  chart.intervalStack().position(Stat.summary.percent('count'))
    .color('area', [ '#5cb85c', '#f85a5a', '#d9d9d9' ])
    .style({
      lineWidth: 1,
    })
  chart.render()
})

class InstanceDetailOverview extends React.Component {
  state = {
    width: 260,
    height: 210,
  }

  componentWillMount() {
    this.loadData()
  }

  loadData = () => {
    const { instanceID, cluster, getInstanceOverview } = this.props
    getInstanceOverview(cluster.id, instanceID)
  }

  goPublishService = () => {
    const { history, instanceID } = this.props
    history.push(`/csb-instances-available/${instanceID}/publish-service`)
  }

  goSubscriptService = () => {
    const { history, instanceID } = this.props
    history.push(`/csb-instances-available/${instanceID}/subscription-services`)
  }

  filterStatus = key => {
    switch (key) {
      case 1:
        return '已激活'
      case 2:
        return '已停止'
      case 3:
        return '待审批'
      case 4:
        return '已注销'
      default:
        return ''
    }
  }

  filterStatusCount = data => {
    let countList
    if (data && data.length > 0) {
      let runCount = 0
      let errorCount = 0
      let offCount = 0
      let approvalCount = 0
      data.forEach(item => {
        switch (item.status) {
          case 1:
            runCount = item.count
            break
          case 2:
            errorCount = item.count
            break
          case 3:
            approvalCount = item.count
            break
          case 4:
            offCount = item.count
            break
          default:
            return ''
        }
      })
      countList = {
        runCount,
        offCount,
        errorCount,
        approvalCount,
      }
    }
    return countList
  }

  filterData = data => {
    const { publishedServiceData, serviceubscribeData, subServiceData, cansubServiceData } =
      data && data || {}
    const publish = this.filterStatusCount(publishedServiceData)
    const publishSub = this.filterStatusCount(serviceubscribeData)
    const subService = this.filterStatusCount(subServiceData)
    const canSubService = this.filterStatusCount(cansubServiceData)
    const ListStatusCount = {
      publish,
      publishSub,
      subService,
      canSubService,
    }
    return ListStatusCount
  }

  getOverviewData = data => {
    const { myPublishedService, mySubscribeRequest, mySubscribedService, subscribableService } =
      data || {}
    let datalist
    const publishedServiceData = []
    const serviceubscribeData = []
    const subServiceData = []
    const cansubServiceData = []
    if (data) {
      myPublishedService.forEach(item => {
        const publishedService = {
          status: item.status,
          count: item.count,
          area: this.filterStatus(item.status),
        }
        publishedServiceData.push(publishedService)
      })
      mySubscribeRequest.forEach(item => {
        const subscribeRequest = {
          status: item.status,
          count: item.count,
          area: this.filterStatus(item.status),
        }
        serviceubscribeData.push(subscribeRequest)
      })
      mySubscribedService.forEach(item => {
        const subscribedService = {
          status: item.status,
          count: item.count,
          area: this.filterStatus(item.status),
        }
        subServiceData.push(subscribedService)
      })
      subscribableService.forEach(item => {
        const canSubService = {
          status: item.status,
          count: item.count,
          area: this.filterStatus(item.status),
        }
        cansubServiceData.push(canSubService)
      })
      datalist = {
        publishedServiceData,
        serviceubscribeData,
        subServiceData,
        cansubServiceData,
      }
    }
    return datalist
  }

  render() {
    const { instanceID } = this.props
    const images = [
      { src: require('../../../../assets/img/csb/csb.png') },
    ]
    const { dataList } = this.props
    const { instanceName, creator, creationTime, description, instanceOverview } = dataList || {}
    const { totalCallCount, totalErrorCallCount } =
      instanceOverview && instanceOverview.callOverview || {}
    const { myEvidenceCount, incompleteEvidenceCount } = instanceOverview && instanceOverview || {}
    const OverviewData = this.getOverviewData(instanceOverview)
    const { publishedServiceData, serviceubscribeData, subServiceData, cansubServiceData } =
      OverviewData && OverviewData || []
    const { publish, publishSub, subService, canSubService } =
      this.filterData(OverviewData) || {}
    return (
      <QueueAnim className="csb-overview">
        <div className="top" key="top">
          <div className="topLeft">
            <div className="imgs">
              <img src={images[0].src} />
            </div>
            <div className="desc">
              <h2>实例名称：{instanceName}</h2>
              <div className="descs">
                <div>创建人：{creator}</div>
                <div>创建时间：{formatDate(creationTime)}</div>
                <div>描述：{description}</div>
              </div>
            </div>
          </div>
          <div className="btn">
            <Button onClick={this.goPublishService} type="primary">
              发布服务
            </Button>
            <Button className="subscribe" onClick={this.goSubscriptService}>
              订阅服务
            </Button>
          </div>
        </div>
        <div className="release" key="release">
          <span className="first-title">服务发布</span>
          <Row className="content" gutter={8} style={{ marginTop: 16 }}>
            <Col span={6}>
              <Card
                title="我的服务调用"
                bordered={false}
                bodyStyle={{ height: 180 }}
              >
                <span>累计调用量</span>
                <h1>{totalCallCount} 个</h1>
                <span>累计错误量</span>
                <h1>{totalErrorCallCount} 个</h1>
              </Card>
            </Col>
            <Col span={9}>
              <Card title="我发布的服务"
                extra={<Link to={`/csb-instances-available/${instanceID}/my-published-services`}>
                  更多>>
                </Link>
                }
                bordered={false}
                bodyStyle={{ height: 180, padding: '0px' }}
              >
                <Chart
                  data={publishedServiceData || []}
                  // data={this.state.data}
                  width={this.state.width}
                  height={this.state.height} />
                {/* <span className="">共
                  {
                    publish !== undefined ?
                      publish.runCount + publish.errorCount + publish.offCount : 0
                  }个</span> */}
                <div className="desc">
                  <div>
                    <div className="dec-run dec-pie"></div>
                    <p>已激活</p>
                    <span>{publish !== undefined ? publish.runCount : 0}个</span>
                  </div>
                  <div>
                    <div className="dec-error dec-pie"></div>
                    <p>已停用</p>
                    <span>{publish !== undefined ? publish.errorCount : 0}个</span>
                  </div>
                  <div>
                    <div className="dec-on dec-pie"></div>
                    <p>已注销</p>
                    <span>{publish !== undefined ? publish.offCount : 0}个</span>
                  </div>
                </div>
              </Card>
            </Col>
            <Col span={9}>
              <Card
                title="服务订阅审批"
                extra={<Link to={`/csb-instances-available/${instanceID}/service-subscription-approval`}>
                  去审批>>
                </Link>
                }
                bordered={false}
                bodyStyle={{ height: 180, padding: '0px' }}
              >
                <Chart1
                  data={serviceubscribeData || []}
                  width={this.state.width}
                  height={this.state.height} />
                <div className="desc-trial">
                  <div>
                    <div className="dec-run dec-pie"></div>
                    <p>已通过</p>
                    <span>{publishSub !== undefined ? publishSub.runCount : 0}个</span>
                  </div>
                  <div>
                    <div className="dec-error dec-pie"></div>
                    <p>已拒绝</p>
                    <span>{publishSub !== undefined ? publishSub.errorCount : 0}个</span>
                  </div>
                  <div>
                    <div className="dec-trial dec-pie"></div>
                    <p>待审批</p>
                    <span>{publishSub !== undefined ? publishSub.approvalCount : 0}个</span>
                  </div>
                  <div>
                    <div className="dec-on dec-pie"></div>
                    <p>已退订</p>
                    <span>{publishSub !== undefined ? publishSub.offCount : 0}个</span>
                  </div>
                </div>
              </Card>
            </Col>
          </Row>
        </div>
        <div className="release" key="subscribe">
          <span className="first-title">服务订阅</span>
          <Row className="content" gutter={8} style={{ marginTop: 16 }}>
            <Col span={6}>
              <Card
                title="消费凭证"
                extra={<Link to={`/csb-instances-available/${instanceID}/consumer-vouchers`}>
                  更多>>
                </Link>
                }
                bordered={false}
                bodyStyle={{ height: 180 }}
              >
                <span>我创建</span>
                <h1>{myEvidenceCount} 个</h1>
                <span>未完成更新</span>
                <h1>{incompleteEvidenceCount} 个</h1>
              </Card>
            </Col>
            <Col span={9}>
              <Card
                title="我订阅的服务"
                extra={<Link to={`/csb-instances-available/${instanceID}/my-subscribed-service`}>
                  更多>>
                </Link>
                }
                bordered={false}
                bodyStyle={{ height: 180, padding: '0px' }}
              >
                <Chart2
                  data={subServiceData || []}
                  width={this.state.width}
                  height={this.state.height} />
                <div className="des">
                  <div>
                    <div className="dec-runs dec-pie"></div>
                    <p>已激活</p>
                    <span>{subService !== undefined ? subService.runCount : 0}个</span>
                  </div>
                  <div>
                    <div className="dec-errors dec-pie"></div>
                    <p>已停用</p>
                    <span>{subService !== undefined ? subService.errorCount : 0}个</span>
                  </div>
                </div>
              </Card>
            </Col>
            <Col span={9}>
              <Card
                title="可订阅的服务"
                extra={<Link to={`/csb-instances-available/${instanceID}/subscription-services`}>
                  去订阅>>
                </Link>
                }
                bordered={false}
                bodyStyle={{ height: 180, padding: '0px' }}
              >
                <Chart3
                  data={cansubServiceData || []}
                  width={this.state.width}
                  height={this.state.height} />
                <div className="des">
                  <div>
                    <div className="dec-runs dec-pie"></div>
                    <p>已激活</p>
                    <span>{canSubService !== undefined ? canSubService.runCount : 0}个</span>
                  </div>
                  <div>
                    <div className="dec-errors dec-pie"></div>
                    <p>已停用</p>
                    <span>{canSubService !== undefined ? canSubService.errorCount : 0}个</span>
                  </div>
                  <div>
                    <div className="dec-on dec-pie"></div>
                    <p>已注销</p>
                    <span>{canSubService !== undefined ? canSubService.offCount : 0}个</span>
                  </div>
                </div>
              </Card>
            </Col>
          </Row>
        </div>
      </QueueAnim>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  const { current, CSB } = state
  const { match } = ownProps
  const { instanceID } = match.params
  const { cluster } = current.config
  const dataList = CSB.instanceOverview[instanceID]
  return {
    cluster,
    dataList,
    instanceID,
  }
}

export default connect(mapStateToProps, {
  getInstanceOverview,
})(InstanceDetailOverview)
