import React from 'react'
import { connect } from 'react-redux'
import QueueAnim from 'rc-queue-anim'
import { Icon, Select, Spin, notification } from 'antd'
import WebSocket from '@tenx-ui/webSocket/lib/websocket'
import isEmpty from 'lodash/isEmpty'
import './style/BlownMonitoring.less'
import BlownChart from '../../components/BlownChart'
import ThreadChart from '../../components/BlownChart/ThreadChart'
import BlownDemoModal from '../../components/BlownChart/BlownDemo'
import EmptyBlown from '../../components/BlownChart/EmptyBlown'
import * as msaActions from '../../actions/msa'
import { sleep } from '../../common/utils'
import { API_CONFIG } from '../../constants'
const { MSA_API } = API_CONFIG

const Option = Select.Option

class BlownMonitoring extends React.Component {

  state = {}

  async componentDidMount() {
    const { msaBlownClusters, clusterId } = this.props
    const result = await msaBlownClusters(clusterId)
    if (result.error) {
      notification.warn({
        message: '请求熔断集群失败',
      })
      return
    }
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

  selectBlownCluster = async clusterName => {
    if (clusterName === this.state.blownCluster) {
      return
    }
    this.setState({
      blownCluster: clusterName,
    })
    this.setState({
      wsFetching: true,
    })
    await sleep(200)
    this.setState({
      wsFetching: false,
    })
  }

  renderBlownCharts = () => {
    const { blownMonitor } = this.props
    const { circuitBreakerData, poolData } = blownMonitor || { circuitBreakerData: [] }
    return (circuitBreakerData || []).map(monitor => {
      const matchPool = poolData.filter(pool => pool.poolName === monitor.poolName)
      let finalMonitor = monitor
      if (!isEmpty(matchPool)) {
        finalMonitor = Object.assign({}, monitor, {
          rollingCountThreadsExecuted: matchPool[0].rollingCountThreadsExecuted,
          reportingHosts: matchPool[0].reportingHosts,
          propertyValue_metricsRollingStatisticalWindowInMilliseconds:
          matchPool[0].propertyValue_metricsRollingStatisticalWindowInMilliseconds,
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
    const { blownCluster } = this.state
    const { setBlownMonitor, namespace, userInfo, clusterId } = this.props
    const { namespace: userNamespace } = userInfo
    const finalNamespace = namespace === 'default' ? userNamespace : namespace
    const body = {
      clusterId,
      namespace: finalNamespace,
      clusterName: blownCluster,
    }
    socket.send(JSON.stringify(body))
    socket.onmessage = data => {
      setBlownMonitor(data.data)
    }
  }

  render() {
    const { visible, blownCluster, wsFetching } = this.state
    const { clusterFetching, blownClusters, blownMonitor } = this.props
    if (clusterFetching || wsFetching) {
      return <div className="loading">
        <Spin size={'large'}/>
      </div>
    }
    const host = MSA_API.replace('http', 'ws')
    return (
      <QueueAnim className="blown-monitoring">
        {
          !wsFetching &&
          <WebSocket
            url={`${host}/api/v1/clusters/hystrix/ws`}
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
          {
            (isEmpty(blownClusters) || isEmpty(blownMonitor)
              || isEmpty(blownMonitor.circuitBreakerData))
              ?
              <EmptyBlown
                loading={isEmpty(blownMonitor)}
              />
              :
              <div className="monitor-wrapper">
                {this.renderBlownCharts()}
              </div>
          }
          <div className="first-title">线程池</div>
          {
            (isEmpty(blownClusters) || isEmpty(blownMonitor)
              || isEmpty(blownMonitor.poolData))
              ?
              <EmptyBlown
                loading={isEmpty(blownMonitor)}
              />
              :
              <div className="monitor-wrapper">
                {this.renderPools()}
              </div>
          }
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
  const { config, user } = current
  const { cluster, project } = config
  const { namespace } = project
  const { id: clusterId } = cluster
  const { msaBlownClusters, msaBlownMonitor } = msa
  const { data: blownClusters, isFetching: clusterFetching } = msaBlownClusters
  const { data: blownMonitor } = msaBlownMonitor
  return {
    clusterId,
    namespace,
    userInfo: user.info,
    blownClusters,
    blownMonitor,
    clusterFetching,
  }
}

export default connect(mapStateToProps, {
  msaBlownClusters: msaActions.msaBlownClusters,
  msaBlownMonitor: msaActions.msaBlownMonitor,
  setBlownMonitor: msaActions.setBlownMonitor,
  clearBlownMonitor: msaActions.clearBlownMonitor,
})(BlownMonitoring)
