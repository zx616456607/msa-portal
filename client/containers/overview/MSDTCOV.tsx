/*
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2018 TenxCloud. All Rights Reserved.
 * ----
 * MSDTCOV.tsx page
 *
 * @author zhangtao
 * @date Monday December 24th 2018
 */
import * as React from 'react'
import { Card, Row, Col, Spin } from 'antd'
import './styles/MSDTCOV.less'
import {
  Chart,
  Geom,
  Tooltip,
  Coord,
} from 'bizcharts'
import * as msaActions from '../../actions/msa'
import { connect } from 'react-redux'
import getDeepValue from '@tenx-ui/utils/lib/getDeepValue'

interface MSDTCOVPros {
  clusterID: string
  getDistributeList: (clusterId: string, query?: any, options?: any) => any
  getExecuctionRecordOverview: (clusterId: string, options: any) => any
}

interface MSDTCOVState {
  totalAffair: number
  todayFail: number
  todaySuccess: number
  loading: boolean
}

function mapStateToProps(state) {
  const clusterID = getDeepValue(state, ['current', 'config', 'cluster', 'id'])
  return { clusterID }
}
class MSDTCOV extends React.Component<MSDTCOVPros, MSDTCOVState> {
  state = {
    totalAffair: 0,
    todayFail: 0,
    todaySuccess: 0,
    loading: true,
  }
  async componentDidMount() {
    const [GDBRes, GERRes] = await
      Promise.all([
        this.props.getDistributeList(this.props.clusterID, { page: 1, size: 10 }, { isHandleError: true }),
        this.props.getExecuctionRecordOverview(this.props.clusterID, { isHandleError: true }),
      ])
    const totalAffair = getDeepValue(GDBRes, ['response', 'result', 'data', 'count']) || 0
    const todayFail = getDeepValue(GERRes, ['response', 'result', 'data', 'content', 'todayFail']) || 0
    const todaySuccess = getDeepValue(GERRes, ['response', 'result', 'data', 'content', 'todaySuccess']) || 0
    this.setState({ totalAffair, todayFail, todaySuccess, loading: false })
  }
  render() {
    const noData = this.state.todaySuccess || this.state.todayFail
    const data = [
      {
        type: '成功事务',
        value: this.state.todaySuccess,
      },
      {
        type: '无数据',
        value: noData ? 0 : 1,
      },
      {
        type: '两者都有',
        value: 0,
      },
      {
        type: '仅提供者',
        value: 0,
      },
      {
        type: '回滚事务',
        value: this.state.todayFail,
      },
    ]
    class SliderChart extends React.Component {
      render() {
        return (
          <Chart height={140} data={data} forceFit padding={'auto'} >
            <Coord type="theta" innerRadius={0.75} />
            { noData ?
            <Tooltip showTitle={false} /> : null
            }
            <Geom
              type="intervalStack"
              position="value"
              color={[ 'type', type => {
                if (type === '成功事务') { return '#43b3fb' }
                if (type === '回滚事务') { return '#f7565c' }
                return 'rgb(169,224,250)'
              } ]}
              shape="sliceShape"
            />
          </Chart>
        )
      }
    }
    return (
      <Spin spinning={this.state.loading}>
      <Card
        className="MSDTCOV"
        title={<div className="title">
        <span>分布式事务</span>
        <span className="grey">{`父事务统计 ${this.state.totalAffair} 个`}</span>
        </div>}
      >
        <div className="info">当天事务执行记录</div>
        <Row>
          <Col span={11}>
          <div className="SliderChart">
          <SliderChart />
          <div className="centerText">
            <div>共执行</div>
            <div>{`${this.state.todayFail + this.state.todaySuccess}个`}</div>
          </div>
          </div>
          </Col>
          <Col span={2}/>
          <Col span={11}>
          <div className="messageBox">
              <div><div className="color4">成功事务</div><div>{`${this.state.todaySuccess}个`}</div></div>
              <div><div className="color1">回滚事务</div><div>{`${this.state.todayFail}个`}</div></div>
            </div>
          </Col>
        </Row>
      </Card>
      </Spin>
    )
  }
}

export default connect(mapStateToProps, {
  getDistributeList: msaActions.getDistributeList,
  getExecuctionRecordOverview: msaActions.getExecuctionRecordOverview,
})(MSDTCOV)
