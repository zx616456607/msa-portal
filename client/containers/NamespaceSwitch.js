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
import { Menu, Dropdown, Icon, notification, Input } from 'antd'
import { USER_CURRENT_CONFIG } from '../constants'
import './style/NamespaceSwitch.less'
import {
  setCurrentConfig,
  getUserProjects,
  getProjectList,
  getProjectClusters,
} from '../actions/current'
import TenxIcon from '@tenx-ui/icon/lib/index.js'

const Search = Input.Search
const MenuItemGroup = Menu.ItemGroup;


class NamespaceSwitch extends React.Component {
  state = {
    projectsText: '请选择项目',
    clustersText: '请选择集群',
    clustersDropdownVisible: false,
    searchKey: undefined, // 当前搜索关键词
  }

  async componentDidMount() {
    const {
      userID,
      getProjectList,
      getUserProjects,
      setCurrentConfig,
      getProjectClusters,
    } = this.props
    await getProjectList({ size: 0 })
    getUserProjects(userID).then(res => {
      if (res.error) {
        notification.error({
          message: '获取用户项目失败，请刷新页面重试',
        })
        return
      }
      // 当非首次登录, 或刷新页面的时候, 从localStorage中读取当前设置namespace和clusterID
      // 类似一个保存上次设置的功能
      let namespace
      let clusterID
      // let setCurrentConfigFlag
      let currentNamespace
      let currentClusterID
      const myProjectList = this.props.projectsList.
        filter(({ outlineRoles }) => !outlineRoles.includes('no-participator'))
      const namespaceList = myProjectList.map(({ namespace }) => namespace)
      if (localStorage) {
        const currentConfig = localStorage.getItem(USER_CURRENT_CONFIG)
        if (currentConfig) {
          const configArray = currentConfig.split(',')
          namespace = configArray[0]
          clusterID = configArray[1]
          currentNamespace = namespace
          currentClusterID = clusterID
          if (!namespaceList.includes(namespace)) {
            setCurrentConfig({
              project: { },
              cluster: { },
            })
          } else {
            if (clusterID === '') {
              setCurrentConfig({
                project: { namespace },
                cluster: { },
              })
            } else {
              setCurrentConfig({
                project: { namespace },
                cluster: { id: clusterID },
              })
            }
          }
        }
      }
      const projects = res.response.entities.projects || {}
      let projectsText
      let clustersText
      const handleProjectClusters = (clusters, clustersObj) => {
        if (!clusters || clusters.length === 0) {
          this.setState({
            clustersText: '...',
          })
          setCurrentConfig({ space: { noClustersFlag: true },
          })
          return
        }
        let currentCluster
        // 判断localStorage 中的clusterID 是否真的还存在, 如果真的存在就使用, 如果
        // 不存在的了, 就默认使用第一个
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
      if (myProjectList.length === 0) { // 如果当前账户没有可用项目,则显示对应页面
        this.setState({
          projectsText: '...',
          clustersText: '...',
        })
        setCurrentConfig({ space: { noProjectsFlag: true } })
        return
      }
      // 如果上次保存中没有此次登录中的集群,或者localStorage中并没有保存上次的namespace 默认使用第一个
      if (!namespace || !namespaceList.includes(namespace)) {
        namespace = myProjectList[0].namespace
        setCurrentConfig({
          project: { namespace },
          cluster: { },
        })
      }
      projectsText = projects && projects[namespace] && projects[namespace].projectName
      this.setState({
        projectsText,
      })
      getProjectClusters(namespace).then(res => {
        if (res.error) {
          notification.error({
            message: '获取集群失败，请刷新页面重试',
          })
          return
        }
        const clustersObj = res.response.entities.clusters
        const clusters = res.response.result.data.clusters
        handleProjectClusters(clusters, clustersObj)
      })
    })
  }

  handleProjectChange = async ({ item, key }) => {
    const { setCurrentConfig, getProjectClusters } = this.props
    await getProjectClusters(key)
    const clusterArray = this.props.projectClusters[item.props.children]
    if (clusterArray.length === 0) {
      setCurrentConfig({
        space: {
          noClustersFlag: true,
        },
        cluster: {},
      })
    }
    const setStateAndLoacalStorge = () => {
      this.setState({
        projectsText: item.props.children,
        clustersDropdownVisible: true,
        clustersText: '请选择集群',
      })
      setCurrentConfig({
        project: {
          namespace: key,
        },
        cluster: {},
      })
    }
    const currentConfig = localStorage.getItem(USER_CURRENT_CONFIG)
    // localStorage中无设置值, 请用户重新选择集群
    if (!currentConfig) {
      setStateAndLoacalStorge()
      return
    }
    const configArray = currentConfig.split(',')
    const clusterID = configArray[1]
    if (clusterID === '') { // 如果用户并没有设置集群id
      setStateAndLoacalStorge()
      return
    }
    const clusterIDInCurrentCluster = clusterArray
      .some(({ clusterID: clusterIDInner }) => clusterIDInner === clusterID)
    if (!clusterIDInCurrentCluster) { // 如果用户设置的cluster在新的集群中没有
      setStateAndLoacalStorge()
      return
    }
    this.setState({
      projectsText: item.props.children,
      clustersDropdownVisible: true,
    })
    setCurrentConfig({
      project: {
        namespace: key,
      },
      cluster: { id: clusterID },
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
      space: { noClustersFlag: false },
    })
  }
  onProjectSearch = value => {
    value = typeof value === 'string' ? value : value.target.value
    this.setState({ searchKey: value })
  }
  render() {
    const {
      current,
      projectClusters,
      className,
      noSelfClassName,
      projectsList,
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
        <TenxIcon
          type="backup"
          size={14}
          style={{ marginRight: 10 }} />
        <div>项目</div>
        <div className={'divider'} />
        <div id="msa-portal-header-project">
          <Dropdown
            getPopupContainer={() => document.getElementById('msa-portal-header-project')}
            overlay={
              <Menu
                // style={{
                //   maxHeight: '200px',
                //   overflowY: 'auto',
                // }}
                selectable onSelect={this.handleProjectChange}>
                <Menu.Item key="Search" disabled>
                  <Search
                    placeholder="请输入项目名"
                    onSearch={this.onProjectSearch}
                    onChange={this.onProjectSearch}
                  />
                </Menu.Item>
                <MenuItemGroup
                  style={{
                    maxHeight: '150px',
                    overflowY: 'auto',
                  }}
                >
                  {
                    projectsList.length > 0 &&
                  projectsList
                    .filter(({ projectName }) =>
                      (this.state.searchKey ? projectName.includes(this.state.searchKey)
                        : true))
                    .map(item => {
                      if (!item.outlineRoles.includes('no-participator')) {
                        return (
                          <Menu.Item key={item.namespace}>
                            {item.projectName}
                          </Menu.Item>)
                      }
                      return null
                    })
                  }
                  {
                    projectsList.length === 0 && (
                      <Menu.Item key="no-project" disabled>
                      暂无项目
                      </Menu.Item>
                    )
                  }
                </MenuItemGroup>
                {/* </SubMenu> */}
              </Menu>
            }
            trigger={[ 'click' ]}>
            <a href="javascrip:void(0)" style={{ marginRight: 40 }}>
              {projectsText}
              <Icon type="down" />
            </a>
          </Dropdown>
        </div>
        <div className={'bigDivider'} />
        <TenxIcon
          type="cluster"
          size={14}
          style={{ marginRight: 10 }} />
        <div>集群</div>
        <div className={'divider'} />
        <div id="msa-portal-header-cluster">
          <Dropdown
            getPopupContainer={() => document.getElementById('msa-portal-header-cluster')}
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
      </div>
    )
  }
}

const mapStateToProps = state => {
  const { entities, current } = state
  const { projects, projectsList, clusters } = entities
  const userProjects = current.projects && current.projects.ids || []
  const userProjectsList = current.projectsList && current.projectsList.ids || []
  const currentClusters = current.clusters || {}
  const projectClusters = {}
  Object.keys(currentClusters).forEach(namespace => {
    const clusterList = currentClusters[namespace].ids || []
    projectClusters[namespace] = clusterList.map(id => clusters[id])
    projectClusters[namespace] = clusterList.map(id => clusters[id])
  })
  return {
    current: current || {},
    projects: userProjects.map(namespace => projects[namespace]),
    projectsList: userProjectsList.map(namespace => projectsList[namespace]),
    projectClusters,
  }
}

export default connect(mapStateToProps, {
  setCurrentConfig,
  getProjectList,
  getUserProjects,
  getProjectClusters,
})(NamespaceSwitch)
