/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * Header component
 *
 * 2017-08-16
 * @author zhangpc
 */

import React from 'react'
import { Layout, Menu, Dropdown, Icon, Button, notification } from 'antd'
import { Link } from 'react-router-dom'
import { getDefaultSelectedKeys } from '../../common/utils'
import { USER_CURRENT_CONFIG } from '../../constants'
import './style/index.less'

// const MenuItemGroup = Menu.ItemGroup
const SubMenu = Menu.SubMenu
const LayoutHeader = Layout.Header
const menus = [
  {
    to: '/',
    text: '总览',
    disabled: true,
  },
  {
    to: '/test1',
    text: '微服务治理',
    disabled: true,
  },
  {
    to: '/apms',
    text: '性能管理 APM',
  },
  {
    to: '/test2',
    text: '微服务运维',
    disabled: true,
  },
  {
    to: '/test3',
    text: '系统设置',
    disabled: true,
  },
]
const MY_PORJECT = '我的个人项目'

const testClusters = [
  {
    clusterID: 'CID-fe23111d77cb',
    clusterName: '时速云测试环境',
  },
  {
    clusterID: 'CID-fe23111d7test',
    clusterName: '不要删除修改测试集群',
  },
]

export default class Header extends React.Component {
  state = {
    projectsText: '切换项目',
    clustersText: '切换集群',
    clustersDropdownVisible: false,
  }

  componentDidMount() {
    const [ firstCluster ] = testClusters
    this.setState({
      clustersText: firstCluster.clusterName,
    })
    this.props.setCurrentConfig({
      cluster: {
        id: firstCluster.clusterID,
      },
    })
    const {
      userID,
      getUserProjects,
      setCurrentConfig,
      getDefaultClusters,
      getProjectClusters,
    } = this.props
    getUserProjects(userID).then(res => {
      let namespace
      let clusterID
      let setCurrentConfigFlag
      if (localStorage) {
        const currentConfig = localStorage.getItem(USER_CURRENT_CONFIG)
        if (currentConfig) {
          const configArray = currentConfig.split(',')
          namespace = configArray[0]
          clusterID = configArray[1]
          setCurrentConfigFlag = true
          setCurrentConfig({
            project: { namespace },
            cluster: { id: clusterID },
          })
        }
      }
      const projects = res.response.entities.projects || {}
      if (!namespace || !clusterID) {
        namespace = 'default'
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
        clusters.every(clusterID => {
          const cluster = clustersObj[clusterID]
          if (cluster.isOk) {
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
        if (!setCurrentConfigFlag) {
          setCurrentConfig({
            project: { namespace },
            cluster: { id: clusterID },
          })
        }
      }
      if (namespace === 'default') {
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
    })
    if (key === 'default') {
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
      location,
      currentUser,
      currentConfig,
      projects,
      projectClusters,
    } = this.props
    const { project } = currentConfig
    const currentProjectClusters = projectClusters[project.namespace] || []
    const { projectsText, clustersText, clustersDropdownVisible } = this.state
    return (
      <LayoutHeader className="layout-header">
        <Link to="/apms">
          <div className="logo" />
        </Link>
        <div className="projects">
          <Dropdown
            overlay={
              <Menu onSelect={this.handleProjectChange}>
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
            <Button type="ghost" style={{ marginLeft: 8 }} title={projectsText}>
              {projectsText} <Icon type="down" />
            </Button>
          </Dropdown>
        </div>
        <div className="clusters">
          <Dropdown
            visible={clustersDropdownVisible}
            onVisibleChange={visible => this.setState({ clustersDropdownVisible: visible })}
            overlay={
              <Menu onSelect={this.handleClusterChange}>
                {
                  currentProjectClusters.map(cluster => (
                    <Menu.Item key={cluster.clusterID}>
                      {cluster.clusterName}
                    </Menu.Item>
                  ))
                }
              </Menu>
            }
            trigger={[ 'click' ]}>
            <Button type="ghost" style={{ marginLeft: 8 }} title={clustersText}>
              {clustersText} <Icon type="down" />
            </Button>
          </Dropdown>
        </div>
        <div className="user">
          <Dropdown
            overlay={
              <Menu>
                <Menu.Item key="logout">
                  退 出
                </Menu.Item>
                <Menu.Item key="test1">
                  test1
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item key="test2">
                  test2
                </Menu.Item>
              </Menu>
            }
            trigger={[ 'click' ]}>
            <a className="ant-dropdown-link" href="#">
              {currentUser.userName || '...'} <Icon type="down" />
            </a>
          </Dropdown>
        </div>
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={getDefaultSelectedKeys(location, menus)}
          className="layout-header-menu"
        >
          {
            menus.map(menu => (
              <Menu.Item
                key={menu.to}
                disabled={menu.disabled}>
                <Link to={menu.to}>
                  {menu.text}
                </Link>
              </Menu.Item>
            ))
          }
        </Menu>
      </LayoutHeader>
    )
  }
}
