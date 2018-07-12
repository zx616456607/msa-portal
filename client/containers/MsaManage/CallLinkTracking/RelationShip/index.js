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
import QueueAnim from 'rc-queue-anim'
import { Row, Card, Button, DatePicker } from 'antd'
import isEmpty from 'lodash/isEmpty'
import createG6Flow from '../../../../components/CreateG6/flowChart'
import './style/index.less'

const { RangePicker } = DatePicker
const ButtonGroup = Button.Group
let Chart4 = createG6Flow(chart => {
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

  handleTimer = () => {
    this.setState({
      isTimerShow: false,
    })
  }

  handleLatelyTimer = () => { }

  render() {
    const { isTimerShow, timer } = this.state
    const data = {
      nodes: [
        {
          shape: 'rect',
          label: 'Service',
          id: 'add1174b',
        },
        {
          shape: 'rect',
          label: 'Service1',
          id: 'fbc69eaa',
        },
        {
          shape: 'rect',
          label: 'Service1-1',
          id: '0ce831a6',
        },
        {
          shape: 'rect',
          label: 'Service1-2',
          id: '46c87dc5',
        },
        {
          shape: 'rect',
          label: 'Service2',
          id: 'a7ae06e1',
        },
      ],
      edges: [
        {
          source: 'add1174b',
          target: 'fbc69eaa',
          color: '#5ab46d',
          label: '0/1 calss (错误/总)',
          id: 'ae85ce02',
        },
        {
          source: 'fbc69eaa',
          target: '0ce831a6',
          color: 'red',
          label: '1/2 calss (错误/总)',
          id: 'ebb1bb90',
        },
        {
          source: 'fbc69eaa',
          target: '46c87dc5',
          color: '#5ab46d',
          id: 'de5483e7',
        },
        {
          source: 'fbc69eaa',
          target: 'a7ae06e1',
          color: '#5ab46d',
          id: 'a0318c7b',
        },
      ],
    }
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
                  <Button className="btn" onClick={() => this.handleLatelyTimer('three')}>最近30分钟</Button>
                  <Button className="btn" onClick={() => this.handleLatelyTimer('today')}>最近1小时</Button>
                </Row> :
                <Row>
                  <RangePicker
                    showTime={{ format: 'HH:mm' }}
                    format="YYYY-MM-DD HH:mm"
                    value={timer}
                    onChange={timer => this.setState({ timer })}
                  />
                  {/* <Button icon="search" onClick={() => this.handleCustomTimer()} /> */}
                </Row>
            }
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

export default RelationShip
