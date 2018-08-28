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
import { Card, Button, Tooltip, Icon } from 'antd'
import isEmpty from 'lodash/isEmpty'
import './style/index.less'
import { getZipkinDependencies, getActiveRelationChartNode } from '../../../../actions/callLinkTrack'
import RelationChart from '@tenx-ui/relation-chart'
import ApmTimePicker from '../../../../components/ApmTimePicker'
import { formatDate } from '../../../../common/utils'

const btnArr = [{
  key: 'fiveMin',
  text: '最近5分钟',
}, {
  key: 'thirty',
  text: '最近30分钟',
}, {
  key: 'anHour',
  text: '最近1小时',
}]

class RelationShip extends React.Component {
  state = {
    timers: '',
    loading: true,
    rangeDateTime: [],
  }

  componentDidMount() {
    this.loadData()
  }

  loadData = () => {
    const { rangeDateTime } = this.state
    const { clusterID, getZipkinDependencies } = this.props
    const time = new Date().getTime()
    const five = Date.parse(new Date(new Date() - 300 * 1000))
    const query = {
      endTs: rangeDateTime.length > 0 ? Date.parse(formatDate(rangeDateTime[1])) : time,
      lookback: rangeDateTime.length > 0 ? rangeDateTime[1] - rangeDateTime[0] : time - five,
    }
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
    const { rangeDateTime } = this.state
    const { data } = this.props
    let avgTimer
    const timers = (rangeDateTime[1] - rangeDateTime[0]) / 1000 / 60
    const avgAry = this.filterNodes(data.edges)
    // let time = 5
    // switch (timers) {
    //   case '300000':
    //     time = 5
    //     break
    //   case '1800000':
    //     time = 30
    //     break
    //   case '3600000':
    //     time = 60
    //     break
    //   default:

    //     break
    // }
    // if (avgAry[value]) {
    //   avgTimer = timers ? (timers / 1000) / 1000 / 60 : avgAry[value].callCount / time
    // } else {
    //   avgTimer = 0.00
    // }
    if (avgAry[value]) {
      avgTimer = avgAry[value].callCount / timers
    } else {
      avgTimer = 0.00
    }
    return avgTimer.toFixed(2)
  }
  onClickNode = (lname, e) => {
    e.stopPropagation();
    const { getActiveRelationChartNode } = this.props;
    getActiveRelationChartNode(lname, 'set')
  }
  onRelationChartClick = () => {
    const { getActiveRelationChartNode } = this.props;
    getActiveRelationChartNode(null, 'clear')
  }
  render() {
    const { loading, rangeDateTime } = this.state
    const { data } = this.props
    const onClickNode = this.onClickNode
    const config = {
      rankdir: 'LR',
      marginx: 60,
      marginy: 60,
      nodesep: 60,
      edgesep: 15,
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
          item.onClick = onClickNode
          item.isAnimated = true
        })
      }
      if (data.edges.length > 0) {
        data.edges.forEach(item => {
          item.labelpos = 'c'
          item.arrowOffset = 10
          item.withArrow = true
          item.isAnimated = true
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
          <Button style={{ marginRight: 5 }} icon="reload" onClick={() => this.loadData()}>
            刷新
          </Button>
          <ApmTimePicker
            value={rangeDateTime}
            onChange={rangeDateTime => this.setState({ rangeDateTime })}
            timeArr={btnArr}
            onOk={this.loadData}
          />
          <div className="tip">
            <Tooltip placement="bottom" title={tipText}>
              <Icon type="question-circle-o" />
            </Tooltip>
          </div>
        </div>
        <div className="body" key="body">
          <Card>
            {
              data ?
                <RelationChart
                  graphConfigs={config}
                  nodes={data.nodes || []}
                  edges={data.edges || []}
                  loading={loading}
                  onSvgClick = {this.onRelationChartClick}
                  SvgHeight = "650px"
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
  getActiveRelationChartNode,
})(RelationShip)
