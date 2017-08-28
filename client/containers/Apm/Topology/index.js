import React from 'react'
import { Menu, Dropdown, Button, Icon, message, DatePicker, Radio, Row, Col } from 'antd'
import '../style/topology.less'
import RelationSchema from '../../../components/RelationSchema'
const { RangePicker } = DatePicker

export default class Topology extends React.Component {
  constructor() {
    super()
    this.state = {
      size: 'defalut',
    }
  }
  handleMenuClick() {
    message.info('Click on menu item.')
  }
  handleSizeChange = e => {
    this.setState({ size: e.target.value })
  }
  render() {
    const { size } = this.state
    const menu = (
      <Menu onClick={this.handleMenuClick}>
        <Menu.Item key="1">1st menu item</Menu.Item>
        <Menu.Item key="2">2nd menu item</Menu.Item>
        <Menu.Item key="3">3d menu item</Menu.Item>
      </Menu>
    )
    return (
      <div className="topology">
        <div className="topology-header">
          <Dropdown overlay={menu}>
            <Button size="large" style={{ marginLeft: 8 }}>
              选择微服务（展示其所在链路拓扑） <Icon type="down" />
            </Button>
          </Dropdown>
          <Button size="large">
            <i className="fa fa-refresh"/> 刷新
          </Button>
          <RangePicker size="large" renderExtraFooter={() => 'extra footer'} showTime />
          <Radio.Group size="large" value={size} onChange={this.handleSizeChange}>
            <Radio.Button value="large"><Icon type="calendar" /> 自定义日期</Radio.Button>
            <Radio.Button value="large">最近5分钟</Radio.Button>
            <Radio.Button value="default">3小时</Radio.Button>
            <Radio.Button value="small">今天</Radio.Button>
            <Radio.Button value="small">昨天</Radio.Button>
            <Radio.Button value="small">最近7天</Radio.Button>
          </Radio.Group>
        </div>
        <Row className="topology-body">
          <Col span={14}>
            <RelationSchema data={[]}/>
          </Col>
          <Col span={10}>
            chart
          </Col>
        </Row>
      </div>
    )
  }
}
