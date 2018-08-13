/*
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2018 TenxCloud. All Rights Reserved.
 * ----
 * index.js page
 *
 * @author zhangtao
 * @date Friday July 27th 2018
 */
import React from 'react';
import { Select, Button, Icon, Switch, DatePicker, Radio } from 'antd';
import Page from '@tenx-ui/page';
import '@tenx-ui/page/assets/index.css'
import QueueAnim from 'rc-queue-anim'
import './styles/index.less'
import moment from 'moment';
import { connect } from 'react-redux';
import { DEFAULT } from '../../../constants'
import * as current from '../../../actions/current'
import * as meshAction from '../../../actions/serviceMesh'
import { getDeepValue } from '../../../../client/common/utils';
import RelationChartComponent from './RelationChartComponent';
// import SvgWraper from '../../../components/SvgWraper'
// import NodeDetailModal from './NodeDetailModal'
const { Option, OptGroup } = Select;
// const ButtonGroup = Button.Group;
const { RangePicker } = DatePicker


function range(start, end) {
  const result = [];
  for (let i = start; i < end; i++) {
    result.push(i);
  }
  return result;
}

function mapStateToProps(state) {
  const { entities, current, serviceMesh } = state;
  const { projects, clusters } = entities;
  const userProjects = current.projects && current.projects.ids || [];
  const currentClusters = current.clusters || {}
  const projectClusters = {}
  Object.keys(currentClusters).forEach(namespace => {
    const clusterList = currentClusters[namespace].ids || []
    projectClusters[namespace] = clusterList.map(id => clusters[id])
  })
  const appsList = serviceMesh && serviceMesh.appsList && serviceMesh.appsList.data &&
   serviceMesh.appsList.data.apps || []
  return {
    current: current || {},
    projects: userProjects.map(namespace => projects[namespace]),
    projectClusters,
    appsList,
  }
}
@connect(mapStateToProps, {
  getDefaultClusters: current.getDefaultClusters,
  getProjectClusters: current.getProjectClusters,
  loadAppList: meshAction.loadAppList,
})
export default class ServiceMeshGraph extends React.Component {
  state = {
    searchQuery: {}, // 搜索条件
  }
  node = null
  appNode = null
  componentDidMount = async () => {
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
      { headers: project.namespace }
    )
    this.setState({ searchQuery: {
      item: project.namespace,
      cluster: currentProjectClusters[0].clusterID,
      app: getDeepValue(data, [ 'response', 'result', 'data', 'apps', 0, 'name' ]),
      timeRange: 5 },
    })
  }
  handleChange = (itemType, value) => {
    const { searchQuery } = this.state
    this.setState({ searchQuery: Object.assign({}, searchQuery, { [itemType]: value }) });
  }
  disabledRangeTime = (_, type) => {
    if (type === 'start') {
      return {
        disabledHours: () => range(0, 60).splice(4, 20),
        disabledMinutes: () => range(30, 60),
        disabledSeconds: () => [ 55, 56 ],
      };
    }
    return {
      disabledHours: () => range(0, 60).splice(20, 4),
      disabledMinutes: () => range(0, 31),
      disabledSeconds: () => [ 55, 56 ],
    };
  }
  handleSelectChange = (itemType, value) => {
    const { getDefaultClusters, getProjectClusters } = this.props;
    const { searchQuery } = this.state;
    // console.log('value', value)
    if (value === DEFAULT) {
      getDefaultClusters()
    } else {
      getProjectClusters(value)
    }
    const newSearchQuert = { ...searchQuery }
    newSearchQuert.cluster = undefined;
    newSearchQuert.app = undefined;
    newSearchQuert.item = value
    this.node.focus(); // 默认重新选中集群
    this.setState({ searchQuery: newSearchQuert });
  }
  handleClusterChange = (itemType, value) => {
    const { loadAppList } = this.props
    const { searchQuery } = this.state
    // this.handleChange(itemType, value)

    if (searchQuery.item) {
      loadAppList(value, { headers: searchQuery.item })
    }
    this.appNode.focus()
    const newSearchQuert = { ...searchQuery }
    newSearchQuert.app = undefined
    newSearchQuert.cluster = value
    this.setState({ searchQuery: newSearchQuert })
  }
  render() {
    const { current, projects, projectClusters, appsList } = this.props;
    const { searchQuery: { item, cluster, app, timeRange } } = this.state
    const currentConfig = current.config || {}
    const project = currentConfig.project || {}
    let currentProjectClusters;
    if (!item) {
      currentProjectClusters = projectClusters[project.namespace] || []
    } else {
      currentProjectClusters = projectClusters[item] || [];
    }
    return (
      <Page>
        <QueueAnim>
          <div className="ServiceMeshGraph">
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
                ref = { relnode => { this.node = relnode; } }
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
                showSearch
                style={{ width: 160 }}
                optionFilterProp="children"
                placeholder="选择应用"
                onChange={value => this.handleChange('app', value)}
                filterOption={
                  (input, option) =>
                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
                value={app}
                ref={ relnode => { this.appNode = relnode } }
              >
                {
                  cluster && appsList.map(apps => {
                    return (
                      <Option key={apps.name} value={apps.name}>{ apps.name }</Option>
                    )
                  })
                }
              </Select>
              <RangePicker
                disabledTime={this.disabledRangeTime}
                showTime={{
                  hideDisabledOptions: true,
                  defaultValue: [ moment('00:00:00', 'HH:mm:ss'), moment('11:59:59', 'HH:mm:ss') ],
                }}
                format="YYYY-MM-DD HH:mm:ss"
                onChange={(_, dateStrings) => this.handleChange('timeRange', dateStrings)}
              />
              <Radio.Group value = {timeRange}
                onChange={ e => this.handleChange('timeRange', e.target.value)}
              >
                <Radio.Button value={5}>最近5分钟</Radio.Button>
                <Radio.Button value={30}>最近30分钟</Radio.Button>
                <Radio.Button value={60}>最近1小时</Radio.Button>
              </Radio.Group>
            </div>
            <div className="infoBar">
              <span className="meshInfo">{`应用: ${'x'}个`}</span>
              <span className="meshInfo">{`服务: ${'t'}个`}</span>
              <span className="meshInfo">{`调用: ${'y'}个`}</span>
              <Switch checkedChildren="开" unCheckedChildren="关"/>
              <Button onClick={ () => this.node.focus() }><Icon type="sync"/>刷新</Button>
            </div>
            <div className="SvgContainer">
              <RelationChartComponent/>
            </div>
          </div>
        </QueueAnim>
      </Page>
    )
  }
}

