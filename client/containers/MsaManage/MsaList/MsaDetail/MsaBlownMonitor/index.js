/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2018 TenxCloud. All Rights Reserved.
 */

/**
 * Msa blown monitor
 *
 * @author zhangxuan
 * @date 2018-07-12
 */
import React from 'react'
import { connect } from 'react-redux'
import { Icon, Spin } from 'antd'
import WebSocket from '@tenx-ui/webSocket/lib/websocket'
import BlownChart from '../../../../../components/BlownChart'
import ThreadChart from '../../../../../components/BlownChart/ThreadChart'
import * as msaActions from '../../../../../actions/msa'
import { API_CONFIG } from '../../../../../constants'
import './style/index.less'
import BlownDemoModal from '../../../../../components/BlownChart/BlownDemo'
import PoolDemoModal from '../../../../../components/BlownChart/PoolDemo'
import EmptyBlown from '../../../../../components/BlownChart/EmptyBlown'
import isEmpty from 'lodash/isEmpty'
import { sleep } from '../../../../../common/utils'
import { withNamespaces } from 'react-i18next'
const { MSA_API } = API_CONFIG

@withNamespaces('MsaList')
class MsaBlownMonitor extends React.PureComponent {

  state = {
    wsFetching: true,
  }

  async componentDidMount() {
    await sleep(200)
    this.setState({
      wsFetching: false,
    })
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

  togglePoolVisible = () => {
    this.setState(({ poolVisible }) => {
      return {
        poolVisible: !poolVisible,
      }
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
    const { setBlownMonitor, namespace, userInfo, clusterID, name } = this.props
    const { namespace: userNamespace } = userInfo
    const finalNamespace = namespace === 'default' ? userNamespace : namespace
    const body = {
      clusterId: clusterID,
      namespace: finalNamespace,
      serviceName: name,
    }
    socket.send(JSON.stringify(body))
    socket.onmessage = data => {
      setBlownMonitor(data.data)
    }
  }

  render() {
    const { visible, wsFetching, poolVisible } = this.state
    const { blownMonitor, t } = this.props
    const host = MSA_API.replace('http', 'ws')
    if (wsFetching) {
      return <div className="loading">
        <Spin size={'large'}/>
      </div>
    }
    return (
      <div className="msa-blown-monitor">
        <WebSocket
          url={`${host}/api/v1/clusters/hystrix/ws`}
          onSetup={this.wsOnSetup}
        />
        <div className="layout-content-body blown-monitor-body">
          <div style={{ marginBottom: 20 }}>
            <span className="first-title">{t('detail.MsaBlownMonitor.breaker')}</span>
            <span
              style={{ marginLeft: 20 }}
              className={'primary-color pointer'}
              onClick={this.toggleVisible}
            >
              <Icon type="picture" /> {t('detail.MsaBlownMonitor.viewPic')}
            </span>
          </div>
          {
            isEmpty(blownMonitor) || isEmpty(blownMonitor.circuitBreakerData)
              ?
              <EmptyBlown
                loading={isEmpty(blownMonitor)}
              />
              :
              <div className="monitor-wrapper">
                {this.renderBlownCharts()}
              </div>
          }
          <div style={{ marginBottom: 20 }}>
            <span className="first-title">{t('detail.MsaBlownMonitor.threadPool')}</span>
            <span
              style={{ marginLeft: 20 }}
              className={'primary-color pointer'}
              onClick={this.togglePoolVisible}
            >
              <Icon type="picture" /> {t('detail.MsaBlownMonitor.viewPic')}
            </span>
          </div>
          {
            isEmpty(blownMonitor) || isEmpty(blownMonitor.poolData)
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
          onCancel={this.toggleVisible}
          onOk={this.toggleVisible}
        />
        <PoolDemoModal
          visible={poolVisible}
          onOk={this.togglePoolVisible}
          onCancel={this.togglePoolVisible}
        />
      </div>
    )
  }
}

const mapStateToProps = state => {
  const { current, msa } = state
  const { config, user } = current
  const { project } = config
  const { namespace } = project
  const { msaBlownMonitor } = msa
  const { data: blownMonitor } = msaBlownMonitor
  return {
    namespace,
    userInfo: user.info,
    blownMonitor,
  }
}

export default connect(mapStateToProps, {
  msaBlownMonitor: msaActions.msaBlownMonitor,
  setBlownMonitor: msaActions.setBlownMonitor,
  clearBlownMonitor: msaActions.clearBlownMonitor,
})(MsaBlownMonitor)
