/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * Components
 *
 * 2017-11-21
 * @author zhaoyb
 */

import React from 'react'
import { connect } from 'react-redux'
import QueueAnim from 'rc-queue-anim'
import './style/index.less'
import isEmpty from 'lodash/isEmpty'
import MsaModal from './Modal'
import { fetchSpingCloud } from '../../../actions/msaConfig'
import { formatFromnow } from '../../../common/utils'
import { renderCSBInstanceStatus } from '../../../components/utils'
import ProjectCluster from '../../../components/ProjectCluster'
import { fetchMsaComponentList, getStart, getStop, getRedeploy } from '../../../actions/msaComponent'
import { Card, Button, Table, Dropdown, Menu, Modal, Icon, notification } from 'antd'

const tooltip = [{
  id: 'restart',
  title: '重启组件',
  content: '该操作将重启 SpringCloud 对应组件, 重启会消耗一段时间, 重启后组件相关服务自动生效。',
}, {
  id: 'stop',
  title: '停止组件',
  content: '该操作将停止 SpringCloud 对应组件, 可能会影响微服务的正常运行。请谨慎操作！',
}, {
  id: 'redeploy',
  title: '重新部署',
  content: '该操作将重新部署 SpringCloud 对应组件, 可能会影响微服务的正常运行。请谨慎操作！',
}, {
  id: 'start',
  title: '启动组件',
  content: '该操作将启动 SpringCloud 对应组件。',
}]

const SHOW_BTN_COMPONENTS = [ 'spring-cloud-config', 'hystrix-turbine', 'spring-cloud-discovery' ]

class MsaComponents extends React.Component {
  state = {
    metaData: [],
    apmID: [],
    tipsName: '',
    componentName: '',
    toopVisible: false,
    visible: false,
    tooltipTitle: '',
    tooltipContent: '',
    loading: true,
  }

  componentDidMount() {
    this.fetchApmId()
  }

  componentWillReceiveProps(nextProps) {
    const { meta } = nextProps
    if (meta !== undefined) {
      if (!meta.isFetching) {
        this.filterData(meta.meta)
      }
    } else {
      this.setState({
        loading: false,
      })
    }
  }

  fetchApmId = () => {
    const { fetchSpingCloud, clusterId, projectConfig } = this.props
    const { namespace } = projectConfig.project
    fetchSpingCloud(clusterId, namespace).then(res => {
      if (res.error) return
      if (res.response.result.code === 200) {
        this.setState({
          loading: true,
          apmID: res.response.result.data,
        }, () => {
          this.load()
        })
      }
    })
  }

  load = () => {
    const { apmID } = this.state
    const { fetchMsaComponentList, clusterId, projectConfig } = this.props
    const { namespace } = projectConfig.project
    if (!isEmpty(apmID)) {
      const query = {
        id: apmID[0].id,
      }
      fetchMsaComponentList(clusterId, query, namespace)
      this.setState({
        loading: false,
      })
    }
  }

  nameList = value => {
    switch (value) {
      case 'spring-cloud-auth':
        return '认证服务'
      case 'spring-cloud-config':
        return '配置中心'
      case 'spring-cloud-discovery':
        return '注册中心'
      case 'spring-cloud-gateway':
        return '服务网关'
      case 'spring-cloud-hystrix-turbine':
        return '熔断监控'
      case 'spring-cloud-mysql':
        return '数据存储'
      case 'spring-cloud-rabbitmq':
        return '消息队列'
      case 'spring-cloud-tracing':
        return '服务调用链'
      default:
        return
    }
  }

  filterData = data => {
    const curData = []
    if (!isEmpty(data)) {
      data.forEach(item => {
        const curColumns = {
          id: item.deployment.metadata.uid,
          name: this.nameList(item.deployment.metadata.name),
          component: item.deployment.metadata.name,
          status: this.filterState(item.deployment),
          count: item.deployment.spec.replicas,
          time: this.filterTimer(item.deployment.metadata.creationTimestamp),
        }
        curData.push(curColumns)
      })
    }
    this.setState({
      loading: false,
      metaData: curData,
    })
  }

  filterTimer = value => {
    if (value === undefined && !value) return
    const start = value.replace('T', ' ').replace('Z', '')
    return formatFromnow(start)
  }

  filterState = item => {
    let res
    const { metadata, status, spec } = item
    const replicas = spec.replicas
    const available = status.availableReplicas
    const {
      updatedReplicas,
      unavailableReplicas,
      observedGeneration,
      readyReplicas,
    } = status
    if (replicas === 0 && available > 0) {
      res = 3 // 'Stopping'
    }
    if (observedGeneration >= metadata.generation &&
      replicas === updatedReplicas && readyReplicas > 0) {
      status.available = readyReplicas
      res = 1 // 'Running'
    }
    if (replicas > 0 && available < 1) {
      status.unavailableReplicas = replicas
      res = 2 // 'Pending'
    }
    if (updatedReplicas && unavailableReplicas) {
      res = 4 // 'Deploying'
    }
    if (available < 1) {
      res = 0 // 'Stopped'
    }
    return res
    // if (replicas > 0 || available > 0) {
    //   return 1
    // } if (replicas === 0 || available > 0) {
    //   return 3
    // } if (replicas === 0 || available === 0) {
    //   return 0
    // } if (replicas > 0 || available <= 0) {
    //   return 2
    // }
  }

  handleButtonClick = record => {
    let targetTip = tooltip[0]
    if (record.status === 3) {
      targetTip = tooltip[3]
    }
    this.setState({
      toopVisible: true,
      tooltipTitle: targetTip,
      tooltipContent: targetTip.content,
      componentName: record.component,
    })
  }

  tooptic = key => {
    switch (key) {
      case '重启组件':
        return tooltip[0]
      case '停止组件':
        return tooltip[1]
      case '重新部署':
        return tooltip[2]
      default:
        return tooltip[3]
    }
  }
  handleMenuClick = (e, value) => {
    if (e.key === '水平扩展') {
      this.setState({
        tipsName: '水平扩展',
        visible: true,
        currentComponent: value,
      })
      return
    }
    const tips = this.tooptic(e.key)
    this.setState({
      toopVisible: true,
      tooltipTitle: tips,
      tooltipContent: tips.content,
      componentName: value.component,
    })
  }


  handleToopCancel = () => {
    this.setState({
      toopVisible: false,
    })
  }

  handleExtendCancel = () => {
    this.setState({
      extendVisible: false,
    })
  }

  handleLogsCancel = () => {
    this.setState({
      logsVisible: false,
    })
  }

  // getApmID = apmIDs => {
  //   apmIDs = apmIDs || this.state.apmID
  // }

  handleCommit = () => {
    const { componentName, tooltipTitle, apmID } = this.state
    const { clusterId, getStart, getStop, getRedeploy } = this.props
    if (tooltipTitle.id === 'restart' || tooltipTitle.id === 'start') {
      const query = {
        apmID: apmID[0].id,
        componentName,
      }
      getStart(clusterId, query).then(res => {
        if (res.error) {
          notification.error({
            message: `${tooltipTitle.title} ${componentName} 失败`,
          })
          return
        }
        if (res.response.result.code === 200) {
          notification.success({
            message: `${tooltipTitle.title} ${componentName} 成功`,
          })
          this.setState({
            toopVisible: false,
          })
          setTimeout(() => {
            this.fetchApmId()
          }, 1000)
        }
      })
    } if (tooltipTitle.id === 'stop') {
      const query = {
        apmID: apmID[0].id,
        componentName,
      }
      getStop(clusterId, query).then(res => {
        if (res.error) {
          notification.error({
            message: `停止组件 ${componentName} 失败`,
          })
          return
        }
        if (res.response.result.code === 200) {
          notification.success({
            message: `停止组件 ${componentName} 成功`,
          })
          this.setState({
            toopVisible: false,
          })
          this.fetchApmId()
        }
      })
    } if (tooltipTitle.id === 'redeploy') {
      const query = {
        apmID: apmID[0].id,
        componentName,
      }
      getRedeploy(clusterId, query).then(res => {
        if (res.error) {
          notification.error({
            message: `重新部署 ${componentName} 失败`,
          })
        }
        if (res.response.result.code === 200) {
          notification.success({
            message: `重新部署 ${componentName} 成功`,
          })
          this.setState({
            toopVisible: false,
          })
          this.fetchApmId()
        }
      })
    }
  }

  handleRefresh = () => {
    this.setState({
      loading: true,
    }, () => {
      this.fetchApmId()
    })
  }

  closeMsaModal = () => {
    this.setState({ visible: false, currentComponent: null })
  }

  render() {
    const { loading, tooltipContent, tooltipTitle, visible, toopVisible,
      tipsName, metaData, currentComponent } = this.state
    const { clusterId } = this.props
    const columns = [{
      key: 'component',
      title: '组件',
      dataIndex: 'component',
    }, {
      key: 'name',
      title: '名称',
      dataIndex: 'name',
    }, {
      key: 'status',
      title: '状态',
      dataIndex: 'status',
      render: text => renderCSBInstanceStatus(text),
    }, {
      key: 'count',
      title: '实例数量',
      dataIndex: 'count',
    }, {
      key: 'time',
      title: '启动时间',
      dataIndex: 'time',
    }, {
      title: '操作',
      key: 'operation',
      render: (text, record) => <div>
        <Dropdown.Button onClick={() => this.handleButtonClick(record)} overlay={
          <Menu onClick={e => this.handleMenuClick(e, record)} style={{ width: 100 }}>
            { record.status !== 3 && <Menu.Item key="停止组件">停止组件</Menu.Item> }
            <Menu.Item key="重新部署">重新部署</Menu.Item>
            {
              SHOW_BTN_COMPONENTS.includes(record.component) &&
              <Menu.Item key="水平扩展">水平扩展</Menu.Item>
            }
          </Menu>
        }>{ record.status === 3 ? '启动组件' : '重启组件' }</Dropdown.Button>
      </div>,
    }]
    return (
      <QueueAnim className="info">
        <div className="nav" key="nav">
          <div className="info-project"><ProjectCluster callback={this.fetchApmId}/></div>
          <Button type="primary" className="info-btn" onClick={this.handleRefresh}><Icon type="sync" />刷 新</Button>
          <div className="pages">
            <span className="total">共计 {metaData.length} 条&nbsp;&nbsp;</span>
          </div>
        </div>
        <Card key="body">
          <div className="body">
            <Table
              columns={columns}
              dataSource={metaData}
              pagination={false}
              loading={loading}
              rowKey={row => row.id} />
          </div>
        </Card>
        <Modal title={tooltipTitle.title} visible={toopVisible} onCancel={this.handleToopCancel}
          footer={[
            <Button key="back" type="ghost" onClick={this.handleToopCancel}>取 消</Button>,
            <Button key="submit" type="primary" onClick={this.handleCommit}>确 定</Button>,
          ]}>
          <div className="prompt" style={{ height: 70, backgroundColor: '#fffaf0', border: '1px dashed #ffc125', padding: 10, borderRadius: 4 }}>
            <div style={{ position: 'absolute', top: 90, left: 30 }}>
              <Icon type="exclamation-circle" style={{ fontSize: 25, color: '#ffbf00' }} />
            </div>
            <div style={{ width: '90%', marginLeft: 40 }}>
              <div>{tooltipTitle.title}</div>
              <span>{tooltipContent}</span>
            </div>
          </div>
        </Modal>
        {
          visible &&
          <MsaModal
            visible={visible}
            tipsType={tipsName}
            clusterId={clusterId}
            currentComponent={currentComponent}
            closeModal={this.closeMsaModal}
            loadData={this.load}
          />
        }
      </QueueAnim>
    )
  }
}

const mapStateToProps = state => {
  const { current, sringcloudComponent } = state
  const { cluster, project } = current.config
  const meta = sringcloudComponent[cluster.id]
  const { info } = current.user
  const nameSpace = project.namespace
  const clusterId = cluster.id
  const { projectConfig } = current

  return {
    meta,
    info,
    nameSpace,
    clusterId,
    projectConfig,
  }
}

export default connect(mapStateToProps, {
  getStop,
  getStart,
  getRedeploy,
  fetchSpingCloud,
  fetchMsaComponentList,
})(MsaComponents)

