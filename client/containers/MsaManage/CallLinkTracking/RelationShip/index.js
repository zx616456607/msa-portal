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
import createG6Flow from '../../../../components/CreateG6/flowChart'
import './style/index.less'
import { getZipkinDependencies } from '../../../../actions/callLinkTrack'

const { RangePicker } = DatePicker
const ButtonGroup = Button.Group
const Chart4 = createG6Flow(chart => {
  chart.render()
  chart.edge()
    .shape('smooth')
    .style({
      arrow: true,
    })
    .size(2)
})

class RelationShip extends React.Component {

  state = {
    timer: '',
    isTimerShow: true,
  }

  componentDidMount() {
    const { clusterID, getZipkinDependencies } = this.props
    const query = {
      endTs: Date.parse(new Date(new Date() - 300 * 1000)),
    }
    getZipkinDependencies(clusterID, query)
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
    const { clusterID, getZipkinDependencies } = this.props
    let query
    switch (key) {
      case 'five':
        query = {
          endTs: Date.parse(new Date(new Date() - 300 * 1000)),
        }
        break
      case 'halFhour':
        query = {
          endTs: Date.parse(new Date(new Date() - 30 * 60 * 1000)),
        }
        break
      case 'anHour':
        query = {
          endTs: Date.parse(new Date(new Date() - 60 * 60 * 1000)),
        }
        break
      default:
        break
    }
    getZipkinDependencies(clusterID, query)
  }

  render() {
    const { isTimerShow, timer } = this.state
    const { data } = this.props
    if (!isEmpty(data)) {
      if (data.edges.length > 0) {
        data.edges.forEach(item => {
          if (item.errorCount > 0 && item.errorCount < item.callCount) {
            item.color = '#5ab46d'
            item.errPart = true
          } else {
            item.color = '#5ab46d'
            item.errPart = false
          }
          if (item.errorCount === item.callCount) {
            item.color = 'red'
          }
        })
      }
    }

    const tipText = (<div>
      <span></span>
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
          <ButtonGroup className="relation-ship-time">
            <Button icon="calendar" onClick={() => this.handleTimer()}>
              自定义日期
            </Button>
            {
              isTimerShow ?
                <Row>
                  <Button className="btn" onClick={() => this.handleLatelyTimer('five')} >最近5分钟</Button>
                  <Button className="btn" onClick={() => this.handleLatelyTimer('halFhour')}>最近30分钟</Button>
                  <Button className="btn" onClick={() => this.handleLatelyTimer('anHour')}>最近1小时</Button>
                </Row> :
                <Row>
                  <RangePicker
                    showTime={{ format: 'HH:mm' }}
                    format="YYYY-MM-DD HH:mm"
                    value={timer}
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
              !isEmpty(data) &&
              <Chart4
                data={data}
              />
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
