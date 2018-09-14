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
import { USER_CURRENT_CONFIG } from '../../constants'
import { setProjectConfig, getProjectClusters, getDefaultClusters, getProjectList } from '../../actions/current'
const Option = Select.Option

class ProjectCluster extends React.Component {
  state = {
    projectsText: '请选择项目项目',
    clustersText: '请选择集群',
  }

  componentDidMount() {
    const { getProjectList, setProjectConfig } = this.props
    getProjectList().then(res => {
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
  }

  handleProject = e => {
    const { projectsList, callback, setProjectConfig } = this.props
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
  }

  render() {
    const { current, projectsList, projectClusters } = this.props
    const currentConfig = current.config || {}
    const project = currentConfig.project || {}
    const clusters = projectClusters[project.namespace] || []
    return (
      <div id="project-cluster">
        <Row className="header-project">
          <Col span={6}>
            <span>项目</span>
            <Select style={{ width: 200 }} defaultValue="个人项目" onChange={e => this.handleProject(e)}>
              <Option key="default">个人项目</Option>
              {
                projectsList.map(item => {
                  if (!item.outlineRoles.includes('no-participator') && item.outlineRoles.includes('manager')) {
                    return <Option key={item.namespace}>{item.projectName}</Option>
                  }
                  return null
                })
              }
            </Select>
          </Col>
          <Col span={6}>
            <span>集群</span>
            <Select style={{ width: 200 }} onChange={() => this.handleCluster()} defaultValue={
              clusters && clusters.length > 0 && clusters[0].clusterName}>
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
  const { projectsList, clusters } = entities
  const userProjectsList = current.projectsList && current.projectsList.ids || []
  const currentClusters = current.clusters || {}
  const projectClusters = {}
  Object.keys(currentClusters).forEach(namespace => {
    const clusterList = currentClusters[namespace].ids || []
    projectClusters[namespace] = clusterList.map(id => clusters[id])
  })
  return {
    current,
    projectClusters,
    projectsList: userProjectsList.map(namespace => projectsList[namespace]),
  }
}

export default connect(mapStateToProps, {
  getProjectList,
  setProjectConfig,
  getDefaultClusters,
  getProjectClusters,
})(ProjectCluster)

