/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * Namespace switch container
 *
 * 2017-09-12
 * @author zhangpc
 */

import React from 'react'
import { connect } from 'react-redux'
import ClassNames from 'classnames'
import { Menu, Dropdown, Icon, notification } from 'antd'
import { USER_CURRENT_CONFIG, DEFAULT } from '../constants'
import './style/NamespaceSwitch.less'
import {
  setCurrentConfig,
  getUserProjects,
  getProjectClusters,
  getDefaultClusters,
} from '../actions/current'
import clusterIcon from '../assets/img/cluster.svg'
import projectIcon from '../assets/img/project.svg'

const SubMenu = Menu.SubMenu
const MY_PORJECT = '我的个人项目'

class NamespaceSwitch extends React.Component {
  state = {
    projectsText: '请选择项目项目',
    clustersText: '请选择集群',
    clustersDropdownVisible: false,
  }

  componentDidMount() {
    const {
      userID,
      getUserProjects,
      setCurrentConfig,
      getDefaultClusters,
      getProjectClusters,
    } = this.props
    getUserProjects(userID).then(res => {
      if (res.error) {
        notification.error({
          message: '获取用户项目失败，请刷新页面重试',
        })
        return
      }
      let namespace
      let clusterID
      // let setCurrentConfigFlag
      let currentNamespace
      let currentClusterID
      if (localStorage) {
        const currentConfig = localStorage.getItem(USER_CURRENT_CONFIG)
        if (currentConfig) {
          const configArray = currentConfig.split(',')
          namespace = configArray[0]
          clusterID = configArray[1]
          currentNamespace = namespace
          currentClusterID = clusterID
          // setCurrentConfigFlag = true
          setCurrentConfig({
            project: { namespace },
            cluster: { id: clusterID },
          })
        }
      }
      const projects = res.response.entities.projects || {}
      if (!namespace || !clusterID) {
        namespace = DEFAULT
      }
      let projectsText
      let clustersText
      const handleProjectClusters = (clusters, clustersObj) => {
        if (!clusters || clusters.length === 0) {
          notification.warn({
            message: '该项目下没有集群',
          })
          return
        }
        let currentCluster
        clusters.every(id => {
          const cluster = clustersObj[id]
          if (id === clusterID) {
            currentCluster = cluster
            return false
          }
          return true
        })
        if (!currentCluster) {
          currentCluster = clustersObj[clusters[0]]
        }
        clusterID = currentCluster.clusterID
        clustersText = currentCluster.clusterName
        this.setState({
          projectsText,
          clustersText,
        })
        if (namespace !== currentNamespace || clusterID !== currentClusterID) {
          setCurrentConfig({
            project: { namespace },
            cluster: { id: clusterID },
          })
        }
      }
      if (namespace === DEFAULT) {
        projectsText = MY_PORJECT
        getDefaultClusters().then(res => {
          if (res.error) {
            notification.error({
              message: '获取集群失败，请刷新页面重试',
            })
            return
          }
          const clustersObj = res.response.entities.clusters
          const clusters = res.response.result.clusters
          handleProjectClusters(clusters, clustersObj)
        })
        return
      }
      projectsText = projects && projects[namespace] && projects[namespace].projectName
      getProjectClusters(namespace).then(res => {
        if (res.error) {
          notification.error({
            message: '获取集群失败，请刷新页面重试',
          })
          return
        }
        const clustersObj = res.response.entities.clusters
        const clusters = res.response.result.clusters
        handleProjectClusters(clusters, clustersObj)
      })
    })
  }

  handleProjectChange = ({ item, key }) => {
    const { setCurrentConfig, getProjectClusters, getDefaultClusters } = this.props
    this.setState({
      projectsText: item.props.children,
      clustersDropdownVisible: true,
      clustersText: '请选择集群',
    })
    if (key === DEFAULT) {
      getDefaultClusters()
    } else {
      getProjectClusters(key)
    }
    setCurrentConfig({
      project: {
        namespace: key,
      },
    })
  }
  handleClusterChange = ({ item, key }) => {
    const { setCurrentConfig } = this.props
    this.setState({
      clustersText: item.props.children,
      clustersDropdownVisible: false,
    })
    setCurrentConfig({
      cluster: {
        id: key,
      },
    })
  }

  render() {
    const {
      current,
      projects,
      projectClusters,
      className,
      noSelfClassName,
    } = this.props
    const currentConfig = current.config || {}
    const project = currentConfig.project || {}
    const currentProjectClusters = projectClusters[project.namespace] || []
    const { projectsText, clustersText, clustersDropdownVisible } = this.state
    const containerStyle = ClassNames({
      'namespace-switch': !noSelfClassName,
      [className]: !!className,
      container: true,
    })
    return (
      <div className={containerStyle}>
        <svg className="menu-icon">
          <use xlinkHref={`#${projectIcon.id}`} />
        </svg>
        <div>项目</div>
        <div className={'divider'}/>
        <Dropdown
          overlay={
            <Menu selectable onSelect={this.handleProjectChange}>
              <Menu.Item key="default">
                {MY_PORJECT}
              </Menu.Item>
              <SubMenu key="share" title="共享项目">
                {
                  projects.map(project => (
                    <Menu.Item key={project.namespace}>
                      {project.projectName}
                    </Menu.Item>
                  ))
                }
                {
                  projects.length === 0 && (
                    <Menu.Item key="no-project" disabled>
                      暂无项目
                    </Menu.Item>
                  )
                }
              </SubMenu>
            </Menu>
          }
          trigger={[ 'click' ]}>
          <a href="javascrip:void(0)" style={{ marginRight: 40 }}>
            {projectsText}
            <Icon type="down" />
          </a>
        </Dropdown>
        <div className={'bigDivider'}/>
        <svg className="menu-icon">
          <use xlinkHref={`#${clusterIcon.id}`} />
        </svg>
        <div>集群</div>
        <div className={'divider'}/>
        <Dropdown
          visible={clustersDropdownVisible}
          onVisibleChange={visible => this.setState({ clustersDropdownVisible: visible })}
          overlay={
            <Menu selectable onClick={this.handleClusterChange}>
              {
                currentProjectClusters.map(cluster => (
                  <Menu.Item key={cluster.clusterID} disabled={!cluster.isOk}>
                    {cluster.clusterName}
                  </Menu.Item>
                ))
              }
              {
                currentProjectClusters.length === 0 && (
                  <Menu.Item key="no-cluster" disabled>
                    暂无集群
                  </Menu.Item>
                )
              }
            </Menu>
          }
          trigger={[ 'click' ]}>
          <a href="javascrip:void(0)">
            {clustersText}
            <Icon type="down" />
          </a>
        </Dropdown>
      </div>
    )
  }
}

const mapStateToProps = state => {
  const { entities, current } = state
  const { projects, clusters } = entities
  const userProjects = current.projects && current.projects.ids || []
  const currentClusters = current.clusters || {}
  const projectClusters = {}
  Object.keys(currentClusters).forEach(namespace => {
    const clusterList = currentClusters[namespace].ids || []
    projectClusters[namespace] = clusterList.map(id => clusters[id])
  })
  return {
    current: current || {},
    projects: userProjects.map(namespace => projects[namespace]),
    projectClusters,
  }
}

export default connect(mapStateToProps, {
  setCurrentConfig,
  getUserProjects,
  getProjectClusters,
  getDefaultClusters,
})(NamespaceSwitch)
