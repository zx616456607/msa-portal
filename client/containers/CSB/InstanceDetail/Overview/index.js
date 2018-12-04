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
import { renderCSBInstanceServiceApproveStatus, renderCSBInstanceServiceStatus } from '../../../../components/utils'
import { renderInstanceRole } from '../../../../common/utils'


class InstanceDetailOverview extends React.Component {
  state = {
    width: 260,
    height: 180,
    plotCfg: {
      margin: [ 40, 80, 40, 40 ],
    },
  }
  ChartColor = []
  ChartColor1 = []
  ChartColor2 = []
  ChartColor3 = []

  componentDidMount() {
    this.loadData()
  }

  loadData = () => {
    const { instanceID, currentInstance, getInstanceOverview } = this.props
    const { instance } = currentInstance
    const { clusterId } = instance
    getInstanceOverview(clusterId, instanceID)
  }

  goPublishService = () => {
    const { history, instanceID } = this.props
    history.push(`/csb-instances/available/${instanceID}/publish-service`)
  }

  goSubscriptService = () => {
    const { history, instanceID } = this.props
    history.push(`/csb-instances/available/${instanceID}/subscription-services`)
  }

  filterStatus = key => {
    switch (key) {
      case 1:
        return { text: '已激活', color: '#5cb85c' }
      case 2:
        return { text: '已停止', color: '#f85a5a' }
      case 4:
        return { text: '已注销', color: '#faad14' }
      default:
        return {}
    }
  }

  filterSubscriptionState = key => {
    switch (key) {
      case 1:
        return { text: '待审批', color: '#2db7f5' }
      case 2:
        return { text: '已通过', color: '#5cb85c' }
      case 3:
        return { text: '已拒绝', color: '#f85a5a' }
      case 4:
        return { text: '已退订', color: '#faad14' }
      default:
        return {}
    }
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
      this.ChartColor = []
      this.ChartColor1 = []
      this.ChartColor2 = []
      this.ChartColor3 = []
      myPublishedService.forEach(item => {
        const getState = this.filterStatus(item.status)
        const publishedService = {
          status: item.status,
          count: item.count,
          area: getState.text,
        }
        this.ChartColor.push(getState.color)
        publishedServiceData.push(publishedService)
      })
      mySubscribeRequest.forEach(item => {
        const getState = this.filterSubscriptionState(item.status)
        const subscribeRequest = {
          status: item.status,
          count: item.count,
          area: getState.text,
        }
        this.ChartColor1.push(getState.color)
        serviceubscribeData.push(subscribeRequest)
      })
      mySubscribedService.forEach(item => {
        const getState = this.filterStatus(item.status)
        const subscribedService = {
          status: item.status,
          count: item.count,
          area: getState.text,
        }
        this.ChartColor2.push(getState.color)
        subServiceData.push(subscribedService)
      })
      subscribableService.forEach(item => {
        const getState = this.filterStatus(item.status)
        const canSubService = {
          status: item.status,
          count: item.count,
          area: getState.text,
        }
        this.ChartColor3.push(getState.color)
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

  getStatusDesc = (key, value, index) => {
    return <div className="status-list" key={index}>{renderCSBInstanceServiceApproveStatus(key)}<span className="status-desc">{value}个</span></div>
  }

  getServiceStatusDesc = (key, value, index) => {
    return <div className="status-list" key={index}>{renderCSBInstanceServiceStatus(key)}<span className="status-desc">{value}个</span></div>
  }

  filterStateType() {
    const { currentInstance } = this.props
    switch (currentInstance.role) {
      case 1:
        return <Button className="subscribe" onClick={this.goSubscriptService}>订阅服务</Button>
      case 2:
        return <Button onClick={this.goPublishService} type="primary">发布服务</Button>
      case 4:
        return <div>
          <Button onClick={this.goPublishService} type="primary">发布服务</Button>
          <Button className="subscribe" onClick={this.goSubscriptService}>订阅服务</Button></div>
      default:
        break
    }
  }

  render() {
    const { instanceID, currentInstance } = this.props
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
    const Chart = createG2(chart => {
      const Stat = G2.Stat
      chart.legend(false)
      chart.coord('theta', {
        radius: 1,
        inner: 0.75,
      })
      chart.intervalStack().position(Stat.summary.percent('count'))
        .color('area', this.ChartColor)
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
        .color('area', this.ChartColor1)
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
        .color('area', this.ChartColor2)
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
        .color('area', this.ChartColor3)
        .style({
          lineWidth: 1,
        })
      chart.render()
    })
    return (
      <QueueAnim className="csb-overview">
        <div className="top" key="top">
          <div className="topLeft">
            <div className="imgs">
              <img alt="csb" src={images[0].src} />
            </div>
            <div className="desc">
              <h2>实例名称：{instanceName}</h2>
              <div className="descs">
                <div>创建人：{creator}</div>
                <div>创建时间：{formatDate(creationTime)}</div>
                <div>描述：{description}</div>
                <div>实例授权：{renderInstanceRole(currentInstance.role)}</div>
              </div>
            </div>
          </div>
          <div className="btn">
            {this.filterStateType()}
          </div>
        </div>
        <div className={`release ${currentInstance.role === 2 || currentInstance.role === 4 ? 'show' : 'hide'}`} key="release">
          <span className="first-title">服务发布</span>
          <Row className="content" gutter={8} style={{ marginTop: 16 }}>
            <Col span={6}>
              <Card
                title="我的服务调用"
                bordered={false}
                bodyStyle={{ height: 180 }}
              >
                <span>累计调用量</span>
                <h1>{totalCallCount || 0} 个</h1>
                <span>累计错误量</span>
                <h1>{totalErrorCallCount || 0} 个</h1>
              </Card>
            </Col>
            <Col span={9}>
              <Card title="我发布的服务"
                extra={<Link to={`/csb-instances/available/${instanceID}/my-published-services`}>
                  更多>>
                </Link>
                }
                bordered={false}
                bodyStyle={{ height: 180, padding: '0px' }}
              >
                <Row type={'flex'} align={'middle'}>
                  <Col span={14}>
                    <Chart
                      data={publishedServiceData || []}
                      width={this.state.width}
                      plotCfg={this.state.plotCfg}
                      height={this.state.height} />
                  </Col>
                  <Col span={10}>
                    <div>
                      {
                        publishedServiceData ?
                          publishedServiceData.map((item, index) => {
                            return this.getServiceStatusDesc(item.status, item.count, index)
                          }) : ''
                      }
                    </div>
                  </Col>
                </Row>
              </Card>
            </Col>
            <Col span={9}>
              <Card
                title="服务订阅审批"
                extra={<Link to={`/csb-instances/available/${instanceID}/service-subscription-approval`}>
                  去审批>>
                </Link>
                }
                bordered={false}
                bodyStyle={{ height: 180, padding: '0px' }}
              >
                <Row type={'flex'} align={'middle'}>
                  <Col span={14}>
                    <Chart1
                      data={serviceubscribeData || []}
                      width={this.state.width}
                      plotCfg={this.state.plotCfg}
                      height={this.state.height} />
                  </Col>
                  <Col span={10}>
                    <div>
                      {
                        serviceubscribeData ?
                          serviceubscribeData.map((item, index) => {
                            return this.getStatusDesc(item.status, item.count, index)
                          }) : ''
                      }
                    </div>
                  </Col>
                </Row>
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
                bordered={false}
                bodyStyle={{ height: 180 }}
              >
                <span>我创建</span>
                <h1>{myEvidenceCount || 0} 个</h1>
                <span>未完成更新</span>
                <h1>{incompleteEvidenceCount || 0} 个</h1>
              </Card>
            </Col>
            <Col span={9} className={`${currentInstance.role === 1 || currentInstance.role === 4 ? 'show' : 'hide'}`}>
              <Card
                title="我订阅的服务"
                extra={<Link to={`/csb-instances/available/${instanceID}/my-subscribed-service`}>
                  更多>>
                </Link>
                }
                bordered={false}
                bodyStyle={{ height: 180, padding: '0px' }}
              >
                <Row type={'flex'} align={'middle'}>
                  <Col span={14}>
                    <Chart2
                      data={subServiceData || []}
                      width={this.state.width}
                      plotCfg={this.state.plotCfg}
                      height={this.state.height} />
                  </Col>
                  <Col span={10}>
                    <div>
                      {
                        subServiceData ?
                          subServiceData.map((item, index) => {
                            return this.getServiceStatusDesc(item.status, item.count, index)
                          }) : ''
                      }
                    </div>
                  </Col>
                </Row>
              </Card>
            </Col>
            <Col span={9} className={`${currentInstance.role === 1 || currentInstance.role === 4 ? 'show' : 'hide'}`}>
              <Card
                title="可订阅的服务"
                extra={<Link to={`/csb-instances/available/${instanceID}/subscription-services`}>
                  去订阅>>
                </Link>
                }
                bordered={false}
                bodyStyle={{ height: 180, padding: '0px' }}
              >
                <Row type={'flex'} align={'middle'}>
                  <Col span={14}>
                    <Chart3
                      data={cansubServiceData || []}
                      width={this.state.width}
                      plotCfg={this.state.plotCfg}
                      height={this.state.height} />
                  </Col>
                  <Col span={10}>
                    <div>
                      {
                        cansubServiceData ?
                          cansubServiceData.map((item, index) => {
                            return this.getServiceStatusDesc(item.status, item.count, index)
                          }) : ''
                      }
                    </div>
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>
        </div>
      </QueueAnim>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  const { CSB, entities } = state
  const { csbAvaInstances } = entities
  const { match } = ownProps
  const { instanceID } = match.params
  const dataList = CSB.instanceOverview[instanceID]
  return {
    dataList,
    instanceID,
    currentInstance: csbAvaInstances[instanceID],
  }
}

export default connect(mapStateToProps, {
  getInstanceOverview,
})(InstanceDetailOverview)
