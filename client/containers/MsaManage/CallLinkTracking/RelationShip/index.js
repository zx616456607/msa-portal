/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2018 TenxCloud. All Rights Reserved.
 */

/**
 * Call link tracking relationship
 *
 * @author zhaoyb
 * @date 2018-06-28
 */
import React from 'react'
import { connect } from 'react-redux'
import QueueAnim from 'rc-queue-anim'
import { Row, Card, Button, DatePicker, Tooltip, Icon } from 'antd'
import isEmpty from 'lodash/isEmpty'
import './style/index.less'
import { getZipkinDependencies } from '../../../../actions/callLinkTrack'
import RelationChart from '@tenx-ui/relation-chart'

const { RangePicker } = DatePicker
const ButtonGroup = Button.Group

class RelationShip extends React.Component {

  state = {
    timer: '',
    timers: '',
    latelyKey: '',
    isTimerShow: true,
    btnFive: 'primary',
    btnAnHour: 'default',
    btnHalFhour: 'default',
    loading: true,
  }

  componentDidMount() {
    const query = {
      endTs: Date.parse(new Date(new Date() - 300 * 1000)),
    }
    this.loadData(query)
  }

  handleTimer = () => {
    const { isTimerShow } = this.state
    if (isTimerShow) {
      this.setState({
        isTimerShow: false,
      })
    } else {
      this.setState({
        isTimerShow: true,
      })
    }
  }

  handleLatelyTimer = key => {
    const query = {
      endTs: Date.parse(new Date()),
    }
    switch (key) {
      case 'five':
        this.setState({
          btnFive: 'primary',
          btnAnHour: 'default',
          btnHalFhour: 'default',
        })
        break
      case 'halFhour':
        this.setState({
          btnFive: 'default',
          btnAnHour: 'default',
          btnHalFhour: 'primary',
        })
        break
      case 'anHour':
        this.setState({
          btnFive: 'default',
          btnAnHour: 'primary',
          btnHalFhour: 'default',
        })
        break
      default:
        break
    }
    this.setState({
      latelyKey: key,
    })
    this.loadData(query)
  }

  onOk = value => {
    this.setState({
      timers: (Date.parse(value[1]) - Date.parse(value[0])),
    })
    const query = {
      endTs: Date.parse(value[1]),
      lookback: (Date.parse(value[1]) - Date.parse(value[0])),
    }
    this.loadData(query)
  }

  loadData = query => {
    const { clusterID, getZipkinDependencies } = this.props
    this.setState({
      loading: true,
    }, () => {
      getZipkinDependencies(clusterID, query).then(() => {
        this.setState({
          loading: false,
        })
      })
    })
  }

  filterNodes = edges => {
    const newArry = []
    edges.forEach(item => {
      if (newArry[item.target]) {
        newArry[item.target].callCount = newArry[item.target].callCount + item.callCount
      }
      const objAry = {
        callCount: item.callCount,
      }
      newArry[item.target] = objAry
    })
    return newArry
  }

  fliterAvg = value => {
    const { timers, latelyKey } = this.state
    const { data } = this.props
    let avgTimer
    const avgAry = this.filterNodes(data.edges)
    // if(avgAry.length === 0) return 0
    let time = 5
    switch (latelyKey) {
      case 'five':
        time = 5
        break
      case 'halFhour':
        time = 30
        break
      case 'anHour':
        time = 60
        break
      default:
        break
    }
    if (avgAry[value]) {
      avgTimer = timers ? (timers / 1000) / 1000 / 60 : avgAry[value].callCount / time
    } else {
      avgTimer = 0.00
    }
    return avgTimer.toFixed(2)
  }

  render() {
    const { isTimerShow, timer, btnFive, btnAnHour, btnHalFhour, latelyKey, loading } = this.state
    const { data } = this.props
    const config = {
      rankdir: 'LR',
      marginx: 60,
      marginy: 60,
      ranker: 'tight-tree',
    }
    if (!isEmpty(data)) {
      if (data.nodes.length > 0) {
        data.nodes.forEach(item => {
          item.height = 50
          item.width = 50
          item.shape = 'circle'
          // item.label = typeof item.label === 'string' ? <div>{item.label}<br /> {this.fliterAvg(item.id)}次/min</div> : item.label
          item.labelMinor = this.fliterAvg(item.id) + '次/min'
        })
      }
      if (data.edges.length > 0) {
        data.edges.forEach(item => {
          item.labelpos = 'c'
          item.arrowOffset = 10
          item.withArrow = true
          if (item.errorCount > 0 && item.errorCount < item.callCount) {
            item.label = <div style={{ whiteSpace: 'nowrap' }}>{item.errorCount}/{item.callCount} calls</div>
            item.color = '#5ab46d'
            item.dashed = true
            // item.errPart = true
            // item.shape = 'rect'
          } else {
            item.label = <div style={{ whiteSpace: 'nowrap' }}>{item.errorCount}/{item.callCount} calls</div>
            item.color = '#5ab46d'
            // item.errPart = false
            // item.shape = 'rect'
          }
          if (item.errorCount === item.callCount) {
            item.color = 'red'
          }
        })
      }
    }
    const tipText = (<div>
      <span></span>
      <div className="">服务名称下方的数值表示：平均请求频率</div>
      <div className="">线上的数值表示：错误调用量／总调用量</div>
      <div className="content">发出的调用全部成功</div>
      <div className="line allLine"></div>
      <div className="arrow allArrow"></div>
      <div className="content">发出的调用部分成功/失败</div>
      <div className="line partLine"></div>
      <div className="arrow partArrow"></div>
      <div className="content">发出的调用全部失败</div>
      <div className="line errorLine"></div>
      <div className="arrow errorArrow"></div>
    </div>)
    return (
      <QueueAnim className="relation-ship">
        <div className="timer" key="time">
          <Button style={{ marginRight: 5 }} icon="calendar" onClick={() => {
            isTimerShow ?
              this.handleLatelyTimer(latelyKey)
              :
              this.onOk(timer)
          }}>
            刷新
          </Button>
          <ButtonGroup className="relation-ship-time">
            <Button icon="calendar" onClick={() => this.handleTimer()}>
              自定义日期
            </Button>
            {
              isTimerShow ?
                <Row>
                  <Button className="btn" type={btnFive} onClick={() => this.handleLatelyTimer('five')} >
                    最近5分钟
                  </Button>
                  <Button className="btn" type={btnHalFhour} onClick={() => this.handleLatelyTimer('halFhour')}>
                    最近30分钟
                  </Button>
                  <Button className="btn" type={btnAnHour} onClick={() => this.handleLatelyTimer('anHour')}>
                    最近1小时
                  </Button>
                </Row> :
                <Row>
                  <RangePicker
                    showTime={{ format: 'HH:mm' }}
                    format="YYYY-MM-DD HH:mm"
                    value={timer}
                    onOk={this.onOk}
                    onChange={timer => this.setState({ timer })}
                  />
                </Row>
            }
            <div className="tip">
              <Tooltip placement="bottom" title={tipText}>
                <Icon type="question-circle-o" />
              </Tooltip>
            </div>
          </ButtonGroup>
        </div>
        <div className="body" key="body">
          <Card>
            {
              data ?
                <RelationChart
                  graphConfigs={config}
                  nodes={data.nodes || []}
                  edges={data.edges || []}
                  style={{ height: '500px' }}
                  loading={loading}
                />
                :
                null
            }
          </Card>
        </div>
      </QueueAnim>
    )
  }
}

const mapStateToProps = state => {
  const { current, zipkin } = state
  const { cluster } = current.config
  const clusterID = cluster.id
  const { relationShipList } = zipkin
  const { data } = relationShipList
  return {
    data,
    clusterID,
  }
}
export default connect(mapStateToProps, {
  getZipkinDependencies,
})(RelationShip)
