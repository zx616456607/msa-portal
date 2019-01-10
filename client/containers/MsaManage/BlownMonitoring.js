import React from 'react'
import { connect } from 'react-redux'
import QueueAnim from 'rc-queue-anim'
import { Icon, Select, Spin, notification, DatePicker, Button } from 'antd'
import WebSocket from '@tenx-ui/webSocket/lib/websocket'
import isEmpty from 'lodash/isEmpty'
import './style/BlownMonitoring.less'
import BlownChart from '../../components/BlownChart'
import ThreadChart from '../../components/BlownChart/ThreadChart'
import BlownDemoModal from '../../components/BlownChart/BlownDemo'
import PoolDemoModal from '../../components/BlownChart/PoolDemo'
import EmptyBlown from '../../components/BlownChart/EmptyBlown'
import * as msaActions from '../../actions/msa'
import { getDeepValue, sleep } from '../../common/utils'
import { API_CONFIG } from '../../constants'
import { withNamespaces } from 'react-i18next'
import moment from 'moment'

const { MSA_API } = API_CONFIG

const Option = Select.Option

@withNamespaces('blownMonitor')
class BlownMonitoring extends React.Component {

  state = {}

  async componentDidMount() {
    const { msaBlownClusters, clusterId, t } = this.props
    const result = await msaBlownClusters(clusterId)
    if (result.error) {
      notification.warn({
        message: t('blownMonitor.loadBlownClusterFailed'),
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

  togglePoolVisible = () => {
    this.setState(({ poolVisible }) => {
      return {
        poolVisible: !poolVisible,
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
    const { msaBlownServices, clusterId } = this.props
    if (clusterName === this.state.blownCluster) {
      return
    }
    await msaBlownServices(clusterId, clusterName)
    this.setState({
      blownCluster: clusterName,
      currentService: undefined,
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
    const { blownCluster, currentService, currentApi, dateValue } = this.state
    const { setBlownMonitor, namespace, userInfo, clusterId } = this.props
    const { namespace: userNamespace } = userInfo
    const finalNamespace = namespace === 'default' ? userNamespace : namespace
    const body = {
      clusterId,
      namespace: finalNamespace,
      clusterName: blownCluster,
      serviceName: currentService,
      methodName: currentApi,
      time: dateValue ? parseInt((dateValue / 1000)) : undefined,
    }
    socket.send(JSON.stringify(body))
    socket.onmessage = data => {
      setBlownMonitor(data.data)
    }
  }

  selectBlownService = currentService => {
    this.setState({
      currentService,
      currentApi: undefined,
    })
  }

  selectBlownApi = currentApi => {
    this.setState({
      currentApi,
    })
  }

  dateChange = time => {
    this.setState({
      dateValue: time.valueOf(),
    })
  }

  renderBlownServices = () => {
    const { blownServices } = this.props
    if (isEmpty(blownServices)) {
      return
    }
    return Object.keys(blownServices).map(service => <Option key={service}>{service}</Option>)
  }

  renderBlownApis = () => {
    const { blownServices } = this.props
    const { currentService } = this.state
    if (isEmpty(blownServices) || !currentService) {
      return
    }
    if (isEmpty(blownServices[currentService])) {
      return
    }
    return blownServices[currentService].map(api => <Option key={api}>{api}</Option>)
  }

  searchMonitor = async () => {
    const { clearBlownMonitor } = this.props
    await clearBlownMonitor()
    this.setState({
      wsFetching: true,
    })
    await sleep(200)
    this.setState({
      wsFetching: false,
    })
  }

  resetBtn = async () => {
    const { blownClusters } = this.props
    if (!isEmpty(blownClusters)) {
      this.setState({
        blownCluster: blownClusters[0],
      })
    }
    this.setState({
      currentService: undefined,
      currentApi: undefined,
      dateValue: null,
    })
    await sleep()
    this.searchMonitor()
  }

  render() {
    const {
      visible, blownCluster, wsFetching, poolVisible,
      currentService, currentApi, dateValue,
    } = this.state
    const { clusterFetching, blownClusters, blownMonitor, t } = this.props
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
            placeholder={t('blownMonitor.blownClusterPld')}
            style={{ width: 200 }}
            value={blownCluster}
            onSelect={this.selectBlownCluster}
            showSearch
          >
            {this.renderBlownClusters()}
          </Select>
          <Select
            placeholder={t('blownMonitor.blownServicePld')}
            style={{ width: 200 }}
            value={currentService}
            onSelect={this.selectBlownService}
            showSearch
          >
            {this.renderBlownServices()}
          </Select>
          <Select
            placeholder={t('blownMonitor.serviceApiPld')}
            style={{ width: 200 }}
            value={currentApi}
            onSelect={this.selectBlownApi}
            showSearch
            notFoundContent={t('blownMonitor.selectService')}
          >
            {this.renderBlownApis()}
          </Select>
          <DatePicker
            onChange={this.dateChange}
            showTime
            value={dateValue ? moment(dateValue) : null}
            format={'YYYY-MM-DD hh:mm:ss'}
            placeholder={t('blownMonitor.datePld')}
          />
          <Button
            type={'primary'}
            icon="search"
            onClick={this.searchMonitor}
          >
            {t('blownMonitor.search')}
          </Button>
          <Button
            type={'primary'}
            icon={'rollback'}
            onClick={this.resetBtn}
          >
            {t('blownMonitor.reset')}
          </Button>
        </div>
        <div className="layout-content-body" key="body">
          <div style={{ marginBottom: 20 }}>
            <span className="first-title">{t('blownMonitor.breaker')}</span>
            <span
              style={{ marginLeft: 20 }}
              className={'primary-color pointer'}
              onClick={this.toggleVisible}
            >
              <Icon type="picture" /> {t('blownMonitor.viewDemo')}
            </span>
          </div>
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
          <div style={{ marginBottom: 20 }}>
            <span className="first-title">{t('blownMonitor.threadPool')}</span>
            <span
              style={{ marginLeft: 20 }}
              className={'primary-color pointer'}
              onClick={this.togglePoolVisible}
            >
              <Icon type="picture" /> {t('blownMonitor.viewDemo')}
            </span>
          </div>
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
        <PoolDemoModal
          visible={poolVisible}
          onOk={this.togglePoolVisible}
          onCancel={this.togglePoolVisible}
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
  const blownServices = getDeepValue(state, [ 'msa', 'msaBlownServices', 'data' ])
  return {
    clusterId,
    namespace,
    userInfo: user.info,
    blownClusters,
    blownMonitor,
    clusterFetching,
    blownServices,
  }
}

export default connect(mapStateToProps, {
  msaBlownClusters: msaActions.msaBlownClusters,
  msaBlownServices: msaActions.msaBlownServices,
  setBlownMonitor: msaActions.setBlownMonitor,
  clearBlownMonitor: msaActions.clearBlownMonitor,
})(BlownMonitoring)
