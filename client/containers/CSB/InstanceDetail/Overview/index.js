import React from 'react'
import { Link } from 'react-router-dom'
import QueueAnim from 'rc-queue-anim'
import { Card, Button, Row, Col } from 'antd'
import './style/index.less'

export default class InstanceDetailOverview extends React.Component {
  render() {
    const images = [
      { src: require('../../../../assets/img/csb/csb.png') },
    ]
    return (
      <QueueAnim className="overview">
        <div className="top" key="top">
          <div className="imgs">
            <img src={images[0].src}/>
          </div>
          <div className="desc">
            <h2>实例名称：</h2>
            <div className="descs">
              <div>创建人：小白</div>
              <div>创建时间：2017-12-12</div>
              <div>描述：Asia圣诞节</div>
            </div>
          </div>
          <div className="btn">
            <Link to="/csb-instances-available/publish-service">
              <Button type="primary">发布服务</Button>
            </Link>
            <Button className="subscribe">订阅服务</Button>
          </div>
        </div>
        <div className="release" key="release">
          <span className="first-title">服务发布</span>
          <Row className="content" gutter={8} style={{ marginTop: 16 }}>
            <Col span={6}>
              <Card title="我的服务调用" bodyStyle={{ height: 180 }}>
                <span>累计调用量</span>
                <h1>10000个</h1>
                <span>累计错误量</span>
                <h1>10000个</h1>
              </Card>
            </Col>
            <Col span={9}>
              <Card title="我发布的服务" extra={<a href="#">更多>></a>} bordered={false} bodyStyle={{ height: 180, padding: '0px' }}>
              </Card>
            </Col>
            <Col span={9}>
              <Card title="服务订阅审批" extra={<a href="#">更多>></a>} bordered={false} bodyStyle={{ height: 180, padding: '0px' }}>
              </Card>
            </Col>
          </Row>
        </div>
        <div className="release" key="subscribe">
          <span className="first-title">服务订阅</span>
          <Row className="content" gutter={8} style={{ marginTop: 16 }}>
            <Col span={6}>
              <Card title="消费凭证" bodyStyle={{ height: 180 }}>
                <span>我创建</span>
                <h1>10000个</h1>
                <span>最近更新时间</span>
                <h1>2017-11-11 12:00</h1>
              </Card>
            </Col>
            <Col span={9}>
              <Card title="我订阅的服务" extra={<a href="#">更多>></a>} bordered={false} bodyStyle={{ height: 180, padding: '0px' }}>
              </Card>
            </Col>
            <Col span={9}>
              <Card title="可订阅的服务" extra={<a href="#">更多>></a>} bordered={false} bodyStyle={{ height: 180, padding: '0px' }}>
              </Card>
            </Col>
          </Row>
        </div>
      </QueueAnim>
    )
  }
}
