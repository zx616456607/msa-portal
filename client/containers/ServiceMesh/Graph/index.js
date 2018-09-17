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
import Page from '@tenx-ui/page'
import '@tenx-ui/page/assets/index.css'
import QueueAnim from 'rc-queue-anim'
import './styles/index.less'
import { connect } from 'react-redux'
import { DEFAULT } from '../../../constants'
import * as current from '../../../actions/current'
import * as meshAction from '../../../actions/serviceMesh'
import { getDeepValue } from '../../../../client/common/utils'
import RelationChartComponent from './RelationChartComponent'
import debounce from 'lodash/debounce'
import moment from 'moment'
const { Option, OptGroup } = Select

function mapStateToProps(state) {
  const { entities, current, serviceMesh } = state
  const { projects, clusters } = entities
  const userProjects = current.projects && current.projects.ids || []
  const currentClusters = current.clusters || {}
  const projectClusters = {}
  Object.keys(currentClusters).forEach(namespace => {
    const clusterList = currentClusters[namespace].ids || []
    projectClusters[namespace] = clusterList.map(id => clusters[id])
  })
  const appsList = serviceMesh && serviceMesh.serviceList && serviceMesh.serviceList.data &&
   serviceMesh.serviceList.data.services || []
  return {
    current: current || {},
    projects: userProjects.map(namespace => projects[namespace]),
    projectClusters,
    appsList,
  }
}
class ServiceMeshGraph extends React.Component {
  state = {
    searchQuery: {}, // 搜索条件
    isTimeRange: false, // 显示
  }
  node = null
  appNode = null
  async componentDidMount() {
    const { current, projectClusters, loadAppList, getProjectClusters, getDefaultClusters,
    } = this.props
    const currentConfig = current.config || {}
    const project = currentConfig.project || {}
    if (project.namespace === DEFAULT) {
      await getDefaultClusters()
    } else {
      await getProjectClusters(project.namespace)
    }
    const currentProjectClusters = projectClusters[project.namespace] || []
    if (currentProjectClusters.length === 0) {
      this.setState({ searchQuery: {
        item: project.namespace,
      },
      })
      return
    }
    const data = await loadAppList(
      currentProjectClusters[0].clusterID,
      { headers: project.namespace, from: 0, size: 10 }
    )
    this.setState({ searchQuery: {
      item: project.namespace,
      cluster: currentProjectClusters[0].clusterID,
      app: getDeepValue(data, [ 'response', 'result', 'data', 'services', 0, 'deployment', 'metadata', 'name' ]),
      timeRange: 5 },
    })
  }
  handleChange = (itemType, value) => {
    const { searchQuery } = this.state
    this.setState({ searchQuery: Object.assign({}, searchQuery, { [itemType]: value }) })
  }
  handleSelectChange = (itemType, value) => {
    const { getDefaultClusters, getProjectClusters } = this.props
    const { searchQuery } = this.state
    // console.log('value', value)
    if (value === DEFAULT) {
      getDefaultClusters()
    } else {
      getProjectClusters(value)
    }
    const newSearchQuert = { ...searchQuery }
    newSearchQuert.cluster = undefined
    newSearchQuert.app = undefined
    newSearchQuert.item = value
    this.node.focus() // 默认重新选中集群
    this.setState({ searchQuery: newSearchQuert })
  }
  handleClusterChange = (itemType, value) => {
    const { loadAppList } = this.props
    const { searchQuery } = this.state

    if (searchQuery.item) {
      loadAppList(value, { headers: searchQuery.item, from: 0, size: 10 })
    }
    this.appNode.focus()
    const newSearchQuert = { ...searchQuery }
    newSearchQuert.app = undefined
    newSearchQuert.cluster = value
    this.setState({ searchQuery: newSearchQuert })
  }
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
      if (timeRange.begin >= timeRange.end) {
        notification.warn({
          message: '起始时间不能大于结束时间',
        })
        return
      }
      this.setState({ searchQuery: Object.assign({}, searchQuery, { timeRange }) })
    }
  }
  debounceSearchApp = value => {
    const { loadAppList } = this.props
    const { searchQuery = {} } = this.state
    const searchApp = () => {
      loadAppList(searchQuery.cluster, { headers: searchQuery.item, from: 0, size: 100, filter: `name ${value}` })
    }
    debounce(searchApp, 800)()
  }
  loadGraph = () => {
    const { loadServiceMeshGraph } = this.props
    const { app, cluster, item, timeRange: { begin, end } = {} } = this.state.searchQuery
    const check = [ app, cluster, item, begin, end ].every(item => item !== undefined)
    check && loadServiceMeshGraph(cluster, { project: item },
      { service: app, begin: 0, end: 1000 })
  }
  render() {
    const { current, projects, projectClusters, appsList } = this.props
    const { searchQuery: { item, cluster, app, timeRange }, isTimeRange } = this.state
    const currentConfig = current.config || {}
    const project = currentConfig.project || {}
    let currentProjectClusters
    if (!item) {
      currentProjectClusters = projectClusters[project.namespace] || []
    } else {
      currentProjectClusters = projectClusters[item] || []
    }
    return (
      <Page>
        <QueueAnim>
          <div className="ServiceMeshGraph" key="body">
            <div className="searchBar">
              <Select
                showSearch
                style={{ width: 160 }}
                optionFilterProp="children"
                placeholder="选择项目"
                onChange={value => this.handleSelectChange('item', value)}
                filterOption={
                  (input, option) =>
                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
                value={item}
              >
                <Option value="default">我的个人项目</Option>
                <OptGroup label="共享项目">
                  {
                    projects.map(p => (
                      <Option key={p.namespace}>
                        {p.projectName}
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
                </OptGroup>
              </Select>
              <Select
                showSearch
                style={{ width: 160 }}
                optionFilterProp="children"
                placeholder="选择集群"
                onChange={value => this.handleClusterChange('cluster', value)}
                filterOption={
                  (input, option) =>
                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
                ref = { relnode => { this.node = relnode } }
                value={cluster}
              >
                {
                  item && currentProjectClusters.map(cluster => (
                    <Option key={cluster.clusterID} >
                      {cluster.clusterName}
                    </Option>
                  ))
                }
                {
                  currentProjectClusters.length === 0 && (
                    <Option key="no-cluster" disabled>
                      暂无集群
                    </Option>
                  )
                }
              </Select>
              <Select
                showSearch={true}
                onSearch={this.debounceSearchApp}
                style={{ width: 160 }}
                optionFilterProp="children"
                placeholder="选择服务"
                onChange={value => this.handleChange('app', value)}
                value={app}
                ref={ relnode => { this.appNode = relnode } }
                filterOption={false}
              >
                {
                  cluster && appsList.map(apps => {
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
              <Button className="TimePickerButton"
                type="primary"
                onClick={this.toogleTimePicker}
                icon="calendar">
                自定义时间
              </Button>
              {
                isTimeRange === false ?
                  <Radio.Group value = {timeRange}
                    onChange={ e => this.timeRangeSelect('singleTime', e.target.value)}
                  >
                    <Radio.Button className="fiveButton" value={5}>最近5分钟</Radio.Button>
                    <Radio.Button value={30}>最近30分钟</Radio.Button>
                    <Radio.Button value={60}>最近1小时</Radio.Button>
                  </Radio.Group>
                  :
                  <span >
                    <DatePicker className="daySelect" onChange={value => this.timeRangeSelect('day', value)} />
                    <TimePicker className="firstTimeSelect" onChange={ value => this.timeRangeSelect('first', value)} />
                    <TimePicker className="secondTimeSelect" onChange={ value => this.timeRangeSelect('second', value)} />
                  </span>
              }
            </div>
            <div className="infoBar">
              <span className="meshInfo">{`应用: ${'x'}个`}</span>
              <span className="meshInfo">{`服务: ${'t'}个`}</span>
              <span className="meshInfo">{`调用: ${'y'}个`}</span>
              <Button onClick={this.loadGraph}><Icon type="sync"/>刷新</Button>
            </div>
            <div className="SvgContainer">
              <RelationChartComponent searchQuery={this.state.searchQuery}/>
            </div>
          </div>
        </QueueAnim>
      </Page>
    )
  }
}

export default connect(mapStateToProps, {
  getDefaultClusters: current.getDefaultClusters,
  getProjectClusters: current.getProjectClusters,
  loadAppList: meshAction.loadAllServices,
  loadServiceMeshGraph: meshAction.loadServiceMeshGraph,
})(ServiceMeshGraph)

