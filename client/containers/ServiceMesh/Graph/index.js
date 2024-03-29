/*
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2018 TenxCloud. All Rights Reserved.
 * ----
 * index.js page
 *
 * @author zhangtao
 * @date Friday July 27th 2018
 */
import React from 'react'
import { Select, Button, Icon, DatePicker, Radio, TimePicker, notification } from 'antd'
import '@tenx-ui/page/assets/index.css'
import QueueAnim from 'rc-queue-anim'
import './styles/index.less'
import { connect } from 'react-redux'
import * as currentActions from '../../../actions/current'
import * as meshAction from '../../../actions/serviceMesh'
import getDeepValue from '@tenx-ui/utils/lib/getDeepValue'
import RelationChartComponent from './RelationChartComponent'
import debounce from 'lodash/debounce'
import moment from 'moment'
const { Option } = Select

function mapStateToProps(state) {
  const { entities, current, serviceMesh } = state
  const { projects, clusters } = entities
  const { cluster, project } = current.config
  const clusterID = cluster.id
  const userProjects = current.projects && current.projects.ids || []
  const currentClusters = current.clusters || {}
  const projectClusters = {}
  Object.keys(currentClusters).forEach(namespace => {
    const clusterList = currentClusters[namespace].ids || []
    projectClusters[namespace] = clusterList.map(id => clusters[id])
  })
  const appsList = serviceMesh && serviceMesh.serviceList && serviceMesh.serviceList.data &&
   serviceMesh.serviceList.data.services || []
  // graphData 数据
  const { serviceMesh: { graphDataList = {} } = {} } = state
  return {
    current: current || {},
    projects: userProjects.map(namespace => projects[namespace]),
    projectClusters,
    appsList,
    graphDataList,
    clusterID,
    project: project.namespace,
  }
}
class ServiceMeshGraph extends React.Component {
  state = {
    searchQuery: {}, // 搜索条件
    isTimeRange: false, // 显示
    loading: false, // 刷新relationChart
    defaultLoadSize: 10,
    // projects: [], // 当前服务列表
    // clusters: {}, // 当前所有集群信息
    // currentClusters: [], // 当前选中的项目的集群
  }
  // node = null
  serviceNode = null
  async componentDidMount() {
    // const { current,
    // loadAppList, getProjectClusters, getDefaultClusters,
    // } = this.props
    // const currentConfig = current.config || {}
    // const project = currentConfig.project || {}
    // if (project.namespace === DEFAULT) {
    //   await getDefaultClusters()
    // } else {
    //   await getProjectClusters(project.namespace)
    // }
    // 这里必须要重新从this.props中重新拿一下projectClusters.
    // 因为当代码跑到上一个await的时候, async被暂停, 转而去执行redux相关的操作
    // 如果在async最前面就去this.props中去拿projectClusters的话
    // await返回后执行下面的同步代码,实际上相当于拿的还是上一次的projectClusters, 因为我的代码中写的
    // 每次都会返回一个新的projectClusters, 所以它的引用不同. 所以只能拿到之前的projectClusters
    // 而如果在使用的时候, 重新从this.porps中拿一下, 就能拿到最新的数据了.
    // const { projectClusters } = this.props
    // const currentProjectClusters = projectClusters[project.namespace] || []
    // if (currentProjectClusters.length === 0) {
    //   this.setState({ searchQuery: {
    //     item: project.namespace,
    //   },
    //   })
    //   return
    // }
    const { loadAppList, clusterID, project } = this.props
    /* const projectCluster = await this.props.loadProjectClusterList()
    const {
      clusters = {}, projects = [],
    } = projectCluster.response && projectCluster.response.result || {}
    const projectsList = projects
      .filter(({ istioEnabledClusterIds }) => istioEnabledClusterIds.length !== 0)
    this.setState({ clusters, projects: projectsList })
    if (projectsList.length === 0) { return }

    const { name: namespace, istioEnabledClusterIds: [ cluster ], istioEnabledClusterIds = [],
    } = projectsList[0] */
    const data = await loadAppList(
      clusterID,
      { headers: project, from: 0, size: this.state.defaultLoadSize }
    )
    // const clusterName = Object.entries(this.state.clusters).filter(([ key ]) => key === cluster) || []
    // const { name } = clusterName[0][1] || {}
    this.setState({ searchQuery: {
      // item: project,
      // cluster: clusterID,
      app: getDeepValue(data, [ 'response', 'result', 'data', 'services', 0, 'deployment', 'metadata', 'name' ]),
    } })
    // const currentClusterList = Object.entries(this.state.clusters)
    //   .filter(([ key ]) => istioEnabledClusterIds.includes(key))
    // this.setState({ currentClusters: currentClusterList })
  }
  handleChange = (itemType, value) => {
    const { searchQuery } = this.state
    this.setState({ searchQuery: Object.assign({}, searchQuery, { [itemType]: value }) })
  }
  /* handleSelectChange = (itemType, value) => {
    // const { getDefaultClusters, getProjectClusters } = this.props
    const { searchQuery } = this.state
    // console.log('value', value)
    // if (value === DEFAULT) {
    //   getDefaultClusters()
    // } else {
    //   getProjectClusters(value)
    // }
    const currentClusterName = this.state.projects.filter(({ namespace }) => namespace === value)[0]
      .istioEnabledClusterIds || []
    const currentClusterList = Object.entries(this.state.clusters)
      .filter(([ key ]) => currentClusterName.includes(key))
    this.setState({ currentClusters: currentClusterList })
    const newSearchQuert = { ...searchQuery }
    newSearchQuert.cluster = undefined
    newSearchQuert.app = undefined
    newSearchQuert.item = value
    this.serviceNode.focus() // 默认选中服务
    this.setState({ searchQuery: newSearchQuert })
  }
  handleClusterChange = (itemType, value) => {
    const { loadAppList } = this.props
    const { searchQuery } = this.state

    if (searchQuery.item) {
      loadAppList(value, { headers: searchQuery.item, from: 0, size: 10 })
    }
    this.serviceNode.focus()
    const newSearchQuert = { ...searchQuery }
    newSearchQuert.app = undefined
    newSearchQuert.cluster = value
    this.setState({ searchQuery: newSearchQuert })
  } */
  toogleTimePicker = () => {
    const { isTimeRange } = this.state
    this.setState({ isTimeRange: !isTimeRange })
  }
  rangeTime = { day: null, first: null, second: null }
  timeRangeSelect =(key, value) => {
    const { searchQuery, isTimeRange } = this.state
    if (!isTimeRange) {
      const timeRange = { begin: moment().subtract(value, 'm').valueOf(), end: moment().valueOf() }
      return this.setState({ searchQuery: Object.assign({}, searchQuery, { timeRange }) })
    }
    this.rangeTime[key] = value
    // 除了当前的key, 别的字段都不能等于null
    const checkRangeTime = Object.entries(this.rangeTime)
      .filter(([ rkey ]) => rkey !== key)
      .every(arr => arr[1] !== null)
    if (checkRangeTime) {
      const day = this.rangeTime.day.format('MMMM Do YYYY, h:mm:ss a').split(',')
      const first = this.rangeTime.first.format('MMMM Do YYYY, h:mm:ss a').split(',')
      const second = this.rangeTime.second.format('MMMM Do YYYY, h:mm:ss a').split(',')
      const timeRange = { begin: moment(`${day[0]},${first[1]}`, 'MMMM Do YYYY, h:mm:ss a').valueOf(),
        end: moment(`${day[0]},${second[1]}`, 'MMMM Do YYYY, h:mm:ss a').valueOf() }
      const flag = this.verifyTime(timeRange)
      if (flag === -1) { return }
      this.setState({ searchQuery: Object.assign({}, searchQuery, { timeRange }) })
    }
  }
  verifyTime = (timeRange = {}) => {
    if (timeRange.begin >= timeRange.end) {
      notification.warn({
        message: '开始时间不能大于结束时间',
      })
      return -1
    }
    if (timeRange.end > Date.now()) {
      notification.warn({
        message: '不能选择未来时间',
      })
      return -1
    }
    return 0
  }
  debounceSearchApp = value => {
    const { loadAppList, clusterID } = this.props
    // const { searchQuery = {} } = this.state
    const searchApp = () => {
      loadAppList(clusterID, { headers: this.props.current.config.project.namespace, filter: `name ${value}` })
    }
    debounce(searchApp, 800)()
  }
  loadGraph = async () => {
    const { loadServiceMeshGraph, clusterID, project } = this.props
    const { app, timeRange = {} } = this.state.searchQuery
    if (!app) {
      return notification.info({
        message: '请选择服务后重试',
      })
    }
    this.setState({ loading: true })
    await loadServiceMeshGraph(clusterID, project,
      { service: app, begin: timeRange.begin, end: timeRange.end })
    this.setState({ loading: false })
  }
  disabledDate = current => {
    // Can not select days before today and today
    return current && current > moment().endOf('day');
  }
  setLoading = value => {
    this.setState({ loading: value })
  }
  onPopupScroll = () => {
    if (this.onPopupScrollTimer) {
      clearTimeout(this.onPopupScrollTimer)
    }
    this.onPopupScrollTimer = setTimeout(() => {
      this.setState({ defaultLoadSize: this.state.defaultLoadSize + 10 })
      this.props.loadAppList(this.props.clusterID, {
        headers: this.props.current.config.project.namespace,
        from: 0, size: this.state.defaultLoadSize + 10 })
    }, 1200)
  }
  render() {
    const { appsList, clusterID, project } = this.props
    const {
      searchQuery: { app }, isTimeRange,
      // projects, currentClusters,
    } = this.state
    return (
      <QueueAnim>
        <div className="ServiceMeshGraph" key="body">
          <div className="searchBar">
            {/* <Select
              showSearch
              style={{ width: 120 }}
              optionFilterProp="children"
              placeholder="选择项目"
              onChange={value => this.handleSelectChange('item', value)}
              dropdownMatchSelectWidth={false}
              filterOption={
                (input, option) =>
                  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              value={item}
            >
              {
                projects.map(p => (
                  <Option key={p.namespace}>
                    {p.namespace}
                  </Option>
                ))
              }
              {
                projects.length === 0 && (
                  <Option key="no-project" disabled>
                        暂无项目
                  </Option>
                )
              }
            </Select>
            <Select
              showSearch
              style={{ width: 120 }}
              optionFilterProp="children"
              placeholder="选择集群"
              onChange={value => this.handleClusterChange('cluster', value)}
              dropdownMatchSelectWidth={false}
              filterOption={
                (input, option) =>
                  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              ref = { relnode => { this.node = relnode } }
              value={cluster}
            >
              {
                currentClusters.map(clusters => {
                  const value = clusters[1]
                  return <Option key={value.id} value={value.id} >
                    {value.name}
                  </Option>
                })
              }
              {
                currentClusters.length === 0 && (
                  <Option key="no-cluster" disabled>
                      暂无集群
                  </Option>
                )
              }
            </Select> */}
            <Select
              showSearch={true}
              onSearch={this.debounceSearchApp}
              style={{ width: 120 }}
              optionFilterProp="children"
              placeholder="选择服务"
              onChange={value => this.handleChange('app', value)}
              value={app}
              ref={ relnode => { this.serviceNode = relnode } }
              filterOption={false}
              dropdownMatchSelectWidth={false}
              onPopupScroll={this.onPopupScroll}
            >
              {
                appsList.map(apps => {
                  return (
                    <Option
                      key={apps.deployment.metadata.name}
                      value={apps.deployment.metadata.name}>
                      { apps.deployment.metadata.name }
                    </Option>
                  )
                })
              }
            </Select>
            <div
              className="operationButton"
            >
              <Button className="TimePickerButton"
                type="primary"
                onClick={this.toogleTimePicker}
                icon="calendar">
                自定义时间
              </Button>
              {
                isTimeRange === false ?
                  <Radio.Group
                    onChange={ e => this.timeRangeSelect('singleTime', e.target.value)}
                  >
                    <Radio.Button className="fiveButton" value={5}>最近5分钟</Radio.Button>
                    <Radio.Button value={30}>最近30分钟</Radio.Button>
                    <Radio.Button value={60}>最近1小时</Radio.Button>
                  </Radio.Group>
                  :
                  <span >
                    <DatePicker
                      className="daySelect"
                      onChange={value => this.timeRangeSelect('day', value)}
                      disabledDate={this.disabledDate}/>
                    <TimePicker
                      className="firstTimeSelect"
                      placeholder="开始时间"
                      onChange={ value => this.timeRangeSelect('first', value)}
                    />
                    <TimePicker
                      className="secondTimeSelect"
                      placeholder="结束时间"
                      onChange={ value => this.timeRangeSelect('second', value)}
                    />
                  </span>
              }
            </div>
          </div>
          <div className="infoBar">
            {/*
              //TODO: 后端目前没有, 有了再加
               <span className="meshInfo">{`应用: ${'x'}个`}</span>
              <span className="meshInfo">{`服务: ${'t'}个`}</span>
              <span className="meshInfo">{`调用: ${'y'}个`}</span> */}
            <span className="graphInfo"> 展示满足以上筛选条件的, 所有启用 service Mesh 的微服务拓扑 </span>
            <Button onClick={this.loadGraph}><Icon type="sync"/>刷新</Button>
          </div>
          <div className="SvgContainer">
            <RelationChartComponent
              searchQuery={{
                ...this.state.searchQuery,
                cluster: clusterID,
                item: project,
              }}
              graphDataList={this.props.graphDataList}
              setLoading= {this.setLoading}
              loading={this.state.loading}
            />
          </div>
        </div>
      </QueueAnim>
    )
  }
}

export default connect(mapStateToProps, {
  getDefaultClusters: currentActions.getDefaultClusters,
  getProjectClusters: currentActions.getProjectClusters,
  loadAppList: meshAction.loadAllServices,
  loadServiceMeshGraph: meshAction.loadServiceMeshGraph,
})(ServiceMeshGraph)

