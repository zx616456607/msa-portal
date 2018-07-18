import React from 'react'
import { connect } from 'react-redux'
import QueueAnim from 'rc-queue-anim'
import { Icon, Select, Spin } from 'antd'
import WebSocket from '@tenx-ui/webSocket/lib/websocket'
import isEmpty from 'lodash/isEmpty'
import './style/BlownMonitoring.less'
import BlownChart from '../../components/BlownChart'
import ThreadChart from '../../components/BlownChart/ThreadChart'
import BlownDemoModal from '../../components/BlownChart/BlownDemo'
import * as msaActions from '../../actions/msa'
import { sleep } from '../../common/utils';

const Option = Select.Option

class BlownMonitoring extends React.Component {

  state = {}

  async componentDidMount() {
    const { msaBlownClusters, clusterId } = this.props
    await msaBlownClusters(clusterId)
    const { blownClusters } = this.props
    if (!isEmpty(blownClusters)) {
      this.selectBlownCluster(blownClusters[0])
    }
  }

  componentWillUnmount() {
    const { clearBlownMonitor } = this.props
    clearBlownMonitor()
  }

  toggleVisible = () => {
    this.setState(({ visible }) => {
      return {
        visible: !visible,
      }
    })
  }

  renderBlownClusters = () => {
    const { blownClusters } = this.props
    return (blownClusters || []).map(cluster => {
      return <Option key={cluster}>{cluster}</Option>
    })
  }

  selectBlownCluster = clusterName => {
    this.setState({
      blownCluster: clusterName,
    })
    this.toggleWebsocket()
  }

  toggleWebsocket = async () => {
    this.setState({
      wsFlag: false,
    })
    await sleep()
    this.setState({
      wsFlag: true,
    })
  }

  renderBlownCharts = () => {
    const { blownMonitor } = this.props
    const { circuitBreakerData, poolData } = blownMonitor || { circuitBreakerData: [] }
    return (circuitBreakerData || []).map(monitor => {
      const matchPool = poolData.filter(pool => pool.poolName === monitor.pool_name)
      let finalMonitor = monitor
      if (!isEmpty(matchPool)) {
        finalMonitor = Object.assign({}, monitor, {
          rollingCountThreadsExecuted: matchPool[0].rollingCountThreadsExecuted,
        })
      }
      return <div className="monitor-list" key={finalMonitor.circuitBreakerName}>
        <BlownChart dataSource={finalMonitor}/>
      </div>
    })
  }

  renderPools = () => {
    const { blownMonitor } = this.props
    const { poolData } = blownMonitor || { poolData: [] }
    return (poolData || []).map(pool => {
      return <div className="monitor-list" key={pool.poolName}>
        <ThreadChart dataSource={pool}/>
      </div>
    })
  }

  wsOnSetup = socket => {
    const { setBlownMonitor } = this.props
    socket.onmessage = data => {
      setBlownMonitor(data.data)
    }
  }

  render() {
    const { visible, blownCluster, wsFlag } = this.state
    const { clusterFetching, clusterId } = this.props
    if (clusterFetching || !blownCluster) {
      return <div className="loading">
        <Spin size={'large'}/>
      </div>
    }
    return (
      <QueueAnim className="blown-monitoring">
        {
          wsFlag &&
          <WebSocket
            url={`ws://192.168.4.236:8080/api/v1/clusters/${clusterId}/hystrix/socket/${blownCluster}`}
            onSetup={this.wsOnSetup}
          />
        }
        <div className="layout-content-btns" key={'btns'}>
          <Select
            placeholder={'服务监控组（默认）'}
            style={{ width: 200 }}
            value={blownCluster}
            onSelect={this.selectBlownCluster}
          >
            {this.renderBlownClusters()}
          </Select>
          <span
            className={'primary-color pointer'}
            onClick={this.toggleVisible}
          >
            <Icon type="picture" /> 查看示例图
          </span>
        </div>
        <div className="layout-content-body" key="body">
          <div className="first-title">断路器</div>
          <div className="monitor-wrapper">
            {this.renderBlownCharts()}
          </div>
          <div className="first-title">线程池</div>
          <div className="monitor-wrapper">
            {this.renderPools()}
          </div>
        </div>
        <BlownDemoModal
          visible={visible}
          onOk={this.toggleVisible}
          onCancel={this.toggleVisible}
        />
      </QueueAnim>
    )
  }
}

const mapStateToProps = state => {
  const { current, msa } = state
  const { id: clusterId } = current.config.cluster
  const { msaBlownClusters, msaBlownMonitor } = msa
  const { data: blownClusters, isFetching: clusterFetching } = msaBlownClusters
  const { data: blownMonitor, isFetching: monitorFetching } = msaBlownMonitor
  return {
    clusterId,
    blownClusters,
    blownMonitor,
    clusterFetching,
    monitorFetching,
  }
}

export default connect(mapStateToProps, {
  msaBlownClusters: msaActions.msaBlownClusters,
  msaBlownMonitor: msaActions.msaBlownMonitor,
  setBlownMonitor: msaActions.setBlownMonitor,
  clearBlownMonitor: msaActions.clearBlownMonitor,
})(BlownMonitoring)
