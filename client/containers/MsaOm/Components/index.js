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
import classNames from 'classnames'
import MsaModal from './Modal'
import { fetchSpingCloud } from '../../../actions/msaConfig'
import { formatFromnow } from '../../../common/utils'
import { fetchMsaComponentList, getStart, getStop, getRedeploy } from '../../../actions/msaComponent'
import { Card, Button, Input, Table, Pagination, Dropdown, Menu, Modal, Icon, Progress, notification } from 'antd'
const Search = Input.Search

const tooltip = [{
  title: '重启组件',
  content: '该操作将重启 SpringCloud 对应组件, 重启会消耗一段时间, 重启后组件相关服务自动生效。',
}, {
  title: '停止组件',
  content: '该操作将停止 SpringCloud 对应组件, 可能会影响微服务的正常运行。请谨慎操作！',
}, {
  title: '重新部署',
  content: '该操作将重新部署 SpringCloud 对应组件, 可能会影响微服务的正常运行。请谨慎操作！',
}, {
  title: '水平扩展',
  content: 'Tips：实例数量调整, 保存后系统将调整实例数量至设置预期',
}]
const running = (
  <div>
    <span className={classNames('msa-table-status-box msa-table-running')}>
      <i className="msa-table-status" />运行中
    </span>
  </div>
)
const start = (
  <div>
    <span style={{ color: '#2db7f5' }}>正在重启中</span>
    <Progress percent={30} showInfo={false} />
  </div>
)
const restart = (
  <div>
    <span style={{ color: '#2db7f5' }}>正在扩展中</span>
    <Progress percent={30} showInfo={false} />
  </div>
)
const stop = (
  <div>
    <div className="stop"></div>
    <span style={{ color: '#f85a5a', marginLeft: 5, verticalAlign: 'text-bottom' }}>
      已停止
    </span>
  </div>
)
const remove = (
  <div>
    <span className={classNames('msa-table-status-box msa-table-error')}>
      <i className="msa-table-status" />已删除
    </span>
  </div>
)

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

  componentWillMount() {
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
    const { fetchSpingCloud, clusterId } = this.props
    fetchSpingCloud(clusterId).then(res => {
      if (res.error) return
      if (res.response.result.code === 200) {
        this.setState({
          apmID: res.response.result.data,
        }, () => {
          this.load()
        })
      }
    })
  }

  load = () => {
    const { apmID } = this.state
    const { fetchMsaComponentList, clusterId, nameSpace, info } = this.props
    const project = nameSpace === 'default' ? info.namespace : nameSpace
    if (Object.keys(apmID).length > 0) {
      apmID.forEach(item => {
        if (item.namespace === project) {
          const query = {
            id: item.id,
          }
          fetchMsaComponentList(clusterId, query, project)
        }
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
    if (Object.keys(data).length > 0) {
      data.forEach(item => {
        const curColumns = {
          id: item.deployment.metadata.uid,
          name: this.nameList(item.deployment.metadata.name),
          component: item.deployment.metadata.name,
          state: this.filterState(item.deployment.spec.replicas,
            item.deployment.status.availableReplicas),
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

  filterState = (replicas, available) => {
    if (replicas > 0 || available > 0) {
      return '运行中'
    } if (replicas === 0 || available > 0) {
      return '停止中'
    } if (replicas === 0 || available === 0) {
      return '已停止'
    } if (replicas > 0 || available <= 0) {
      return '启动中'
    }
  }

  handleButtonClick = () => {
    this.setState({
      tipsName: '水平扩展',
      visible: true,
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
      case '查看日志':
        return tooltip[4]
      case '高可用':
        return tooltip[5]
      default:
        return
    }
  }
  handleMenuClick = (e, value) => {
    const tips = this.tooptic(e.key)
    this.setState({
      toopVisible: true,
      tooltipTitle: tips.title,
      tooltipContent: tips.content,
      componentName: value.component,
    })
  }

  handleRealNum = value => {
    this.setState({
      inputValue: value,
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

  handleCommit = () => {
    const { componentName, tooltipTitle, apmID } = this.state
    const { clusterId, getStart, getStop, getRedeploy } = this.props
    if (tooltipTitle === '重启组件') {
      const query = {
        apmID: apmID[0].id,
        componentName,
      }
      getStart(clusterId, query).then(res => {
        if (res.error) {
          notification.error({
            message: `重启组件 ${componentName} 失败`,
          })
          return
        }
        if (res.response.result.code === 200) {
          notification.success({
            message: `重启组件 ${componentName} 成功`,
          })
          this.setState({
            toopVisible: false,
          })
          setTimeout(() => {
            this.fetchApmId()
          }, 1000)
        }
      })
    } if (tooltipTitle === '停止组件') {
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
    } if (tooltipTitle === '重新部署') {
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

  fetchState = text => {
    switch (text) {
      case '运行中':
        return running
      case '停止中':
        return stop
      case '已停止':
        return stop
      case '已删除':
        return remove
      case '正在扩展中':
        return restart
      case '启动中':
        return start
      default:
        return
    }
  }

  handleRefresh = () => {
    this.setState({
      loading: true,
    }, () => {
      this.fetchApmId()
    })
  }

  render() {
    const { loading, tooltipContent, tooltipTitle, visible, toopVisible,
      tipsName, metaData } = this.state
    const pagination = {
      simple: true,
      total: 1,
      defaultCurrent: 1,
    }
    const columns = [{
      key: 'component',
      title: '组件',
      dataIndex: 'component',
    }, {
      key: 'name',
      title: '名称',
      dataIndex: 'name',
    }, {
      key: 'state',
      title: '状态',
      dataIndex: 'state',
      render: text => (this.fetchState(text)),
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
        <Dropdown.Button onClick={this.handleButtonClick} overlay={
          <Menu onClick={e => this.handleMenuClick(e, record)} style={{ width: 100 }}>
            <Menu.Item key="重启组件">重启组件</Menu.Item>
            <Menu.Item key="停止组件">停止组件</Menu.Item>
            <Menu.Item key="重新部署">重新部署</Menu.Item>
          </Menu>
        }>水平扩展</Dropdown.Button>
      </div>,
    }]
    const scope = this

    return (
      <QueueAnim className="info">
        <div className="nav" key="nav">
          <Button type="primary" onClick={this.handleRefresh}><Icon type="sync" />刷 新</Button>
          <Search className="input" placeholder="按微服务名称搜索" />
          <div className="pages">
            <span className="total">共计{metaData.length}条</span>
            <Pagination {...pagination} />
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
        <Modal title={tooltipTitle} visible={toopVisible} onCancel={this.handleToopCancel}
          footer={[
            <Button key="back" type="ghost" onClick={this.handleToopCancel}>取 消</Button>,
            <Button key="submit" type="primary" onClick={this.handleCommit}>确 定</Button>,
          ]}>
          <div className="prompt" style={{ height: 70, backgroundColor: '#fffaf0', border: '1px dashed #ffc125', padding: 10, borderRadius: 4 }}>
            <div style={{ position: 'absolute', top: 90, left: 30 }}>
              <Icon type="exclamation-circle" style={{ fontSize: 25, color: '#ffbf00' }} />
            </div>
            <div style={{ width: '90%', marginLeft: 40 }}>
              <div>{tooltipTitle}</div>
              <span>{tooltipContent}</span>
            </div>
          </div>
        </Modal>
        <MsaModal visible={visible} tipsType={tipsName} scope={scope} />
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
  return {
    meta,
    info,
    nameSpace,
    clusterId,
  }
}

export default connect(mapStateToProps, {
  getStop,
  getStart,
  getRedeploy,
  fetchSpingCloud,
  fetchMsaComponentList,
})(MsaComponents)

