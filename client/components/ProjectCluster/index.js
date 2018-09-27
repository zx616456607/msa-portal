/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2018 TenxCloud. All Rights Reserved.
 */

/**
 * ProjectCluster
 *
 * 2018-09-03
 * @author zhaoyb
 */

import React from 'react'
import { connect } from 'react-redux'
import { Row, Col, Select, notification } from 'antd'
import './style/index.less'
import confirm from '../../components/Modal/confirm'
import { USER_CURRENT_CONFIG } from '../../constants'
import { fetchSpingCloud } from '../../actions/msaConfig'
import { setProjectConfig, getProjectClusters, getDefaultClusters, getProjectList } from '../../actions/current'
const Option = Select.Option

class ProjectCluster extends React.Component {
  state = {
    projectsText: '请选择项目项目',
    clustersText: '请选择集群',
  }

  async componentDidMount() {
    const { getProjectList, setProjectConfig } = this.props
    await getProjectList().then(res => {
      if (res.error) {
        notification.error({
          message: '获取用户项目失败，请刷新页面重试',
        })
        return
      }
      let namespace
      let clusterID
      if (localStorage) {
        const currentConfig = localStorage.getItem(USER_CURRENT_CONFIG)
        if (currentConfig) {
          const configArray = currentConfig.split(',')
          namespace = configArray[0]
          clusterID = configArray[1]
          setProjectConfig({
            project: { namespace },
            cluster: { id: clusterID },
          })
        }
      }
    })
    const { current, projectsList, projectClusters, setProjectAndClusterStatus } = this.props
    const currentConfig = current.config || {}
    const project = currentConfig.project || {}
    const clusters = projectClusters[project.namespace] || []
    const projectItems = projectsList.filter(item =>
      !item.outlineRoles.includes('no-participator') && item.outlineRoles.includes('manager')
    )
    const disabledProjectSelect = projectItems.length === 0;
    const disabledClusters = clusters.length === 0;
    setProjectAndClusterStatus({
      noClustersFlag: disabledClusters,
      noProjectsFlag: disabledProjectSelect,
    })
  }

  handleProject = e => {
    const { projectsList, callback, clusterID, setProjectConfig, fetchSpingCloud,
      namespaces } = this.props
    fetchSpingCloud(clusterID).then(res => {
      let isDeployed = false
      const space = e === 'default' ? namespaces : e
      res.response.result.data.forEach(item => {
        if (item.namespace === space) {
          isDeployed = true
        }
      })

      if (isDeployed) {
        projectsList.forEach(item => {
          if (item.projectName === e || e === 'default') {
            if (!item.outlineRoles.includes('no-participator')) {
              if (item.outlineRoles.includes('manager')) {
                setProjectConfig({
                  project: {
                    namespace: e,
                  },
                })
                setTimeout(() => {
                  callback()
                }, 500)
                return
              }
            }
          }
        })
      } else {
        confirm({
          modalTitle: '提示',
          title: '当前项目 & 集群：SpringCloud 基础服务组件未安装',
          content: '请联系项目管理员安装',
          okText: '知道了',
          hideCancelButton: true,
          cancelText: '返回首页',
          onOk: () => { },
          onCancel: () => { },
        })
      }
    })
  }

  handleCluster = () => { }

  render() {
    const { current, projectsList, projectClusters } = this.props
    const currentConfig = current.config || {}
    const project = currentConfig.project || {}
    const clusters = projectClusters[project.namespace] || []
    const projectItems = projectsList.filter(item =>
      !item.outlineRoles.includes('no-participator') && item.outlineRoles.includes('manager')
    )
    const disabledProjectSelect = projectItems.length === 0;
    const defaultProject = disabledProjectSelect ? undefined : projectItems[0].namespace

    const disabledClusters = clusters.length === 0;
    return (
      <div id="project-cluster">
        <Row className="header-project">
          <Col span={6}>
            <span>项目</span>
            <Select style={{ width: 200 }} defaultValue={defaultProject}
              onChange={e => this.handleProject(e)} disabled={disabledProjectSelect}>
              {
                projectItems.map(({ namespace, projectName }) =>
                  <Option key={namespace}>{projectName}</Option>)
              }
            </Select>
          </Col>
          <Col span={6}>
            <span>集群</span>
            <Select style={{ width: 200 }} onChange={() => this.handleCluster()} defaultValue={
              clusters && clusters.length > 0 && clusters[0].clusterName}
            disabled={disabledClusters}>
              {
                clusters.map(cluster => (
                  <Option key={cluster.clusterID} disabled={!cluster.isOk}>
                    {cluster.clusterName}
                  </Option>
                ))
              }
            </Select>
          </Col>
        </Row>
      </div>
    )
  }
}

const mapStateToProps = state => {
  const { entities, current } = state
  const { user } = current
  const { projectsList, clusters } = entities
  const userProjectsList = current.projectsList && current.projectsList.ids || []
  const currentClusters = current.clusters || {}
  const projectClusters = {}
  const clusterID = current.config.cluster.id
  const namespaces = user.info.namespace
  Object.keys(currentClusters).forEach(namespace => {
    const clusterList = currentClusters[namespace].ids || []
    projectClusters[namespace] = clusterList.map(id => clusters[id])
  })
  return {
    current,
    clusterID,
    namespaces,
    projectClusters,
    projectsList: userProjectsList.map(namespace => projectsList[namespace]),
  }
}

export default connect(mapStateToProps, {
  getProjectList,
  fetchSpingCloud,
  setProjectConfig,
  getDefaultClusters,
  getProjectClusters,
})(ProjectCluster)

