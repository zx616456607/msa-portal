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
import { Row, Col, Form, Select, notification } from 'antd'
import './style/index.less'
import { fetchSpingCloud } from '../../actions/msaConfig'
import { setProjectConfig, getProjectClusters, getDefaultClusters, getProjectList } from '../../actions/current'
const Option = Select.Option
const FormItem = Form.Item

class ProjectCluster extends React.Component {
  state = {
    cutProject: false,
    clusterList: [],
    projectsText: '请选择项目项目',
    clustersText: '请选择集群',
  }

  componentDidMount() {
    const { form } = this.props
    const { getFieldValue } = form
    const project = getFieldValue('project')
    this.fetchCluster(project)
  }

  handleProject = name => {
    const { setProjectConfig } = this.props
    setProjectConfig({
      project: {
        namespace: name,
      },
    })
    this.setState({
      cutProject: true,
    })
    this.fetchCluster(name)
  }

  fetchCluster = name => {
    const { setProjectConfig, getProjectClusters } = this.props
    getProjectClusters(name).then(res => {
      if (res.error) {
        notification.error({
          message: '获取集群失败，请刷新页面重试',
        })
        return
      }
      const clustersObj = res.response.entities.clusters
      const clusters = res.response.result.data.clusters
      if (clusters.length === 0) {
        this.setState({
          clusterList: [],
        })
        return
      }
      setProjectConfig({
        cluster: { id: clustersObj[clusters[0]].clusterID },
      })
      const clusterList = []
      const query = {
        clusterID: clustersObj[clusters[0]].clusterID,
        clusterName: res.response.entities.clusters[clusters[0]].clusterName,
      }
      clusterList.push(query)
      this.setState({
        clusterList,
      })
    })
    // setTimeout(() => {
    //   callback()
    // }, 500)
  }

  handleCluster = () => {
    const { callback } = this.props
    setTimeout(() => {
      callback()
    }, 500)
  }

  render() {
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 13 },
    }
    const { clusterList } = this.state
    const { form, projectConfig } = this.props
    const { getFieldDecorator } = form
    const projectAry = this.props.projects
    const { project } = projectConfig || {}
    const projectItems = projectAry.filter(item =>
      !item.outlineRoles.includes('no-participator') && item.outlineRoles.includes('manager')
    )
    // const { clusterList } = this.state
    // const { projectsList, projectConfig, projectClusters } = this.props
    const projectSpace = Object.keys(project).length > 0 && project.namespace
    return (
      <div id="project-cluster">
        <Row className="header-project">
          <Col span={7}>
            <FormItem {...formItemLayout} label="项目">
              {getFieldDecorator('project', {
                initialValue: projectSpace ? projectSpace :
                  projectItems.length > 0 && projectItems[0].projectName,
                onChange: e => this.handleProject(e),
              })(
                <Select style={{ width: 200 }}
                >
                  {
                    projectItems.map(({ namespace, projectName }) =>
                      <Option key={namespace}>{projectName}</Option>)
                  }
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={7}>
            <FormItem {...formItemLayout} label="集群">
              {getFieldDecorator('cluster', {
                initialValue: clusterList.length > 0 ? clusterList[0].clusterName : undefined,
                onChange: () => this.handleCluster(),
              })(
                <Select style={{ width: 200 }}
                >
                  {
                    clusterList.map(cluster => (
                      <Option key={cluster.clusterID}>
                        {cluster.clusterName}
                      </Option>
                    ))
                  }
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
      </div>
    )
  }
}

const mapStateToProps = state => {
  const { entities, current } = state
  const { projects, clusters } = entities
  const { projectConfig } = current
  const userProjects = current.projects && current.projects.ids || []
  const currentClusters = current.clusters || {}
  const projectClusters = {}
  Object.keys(currentClusters).forEach(namespace => {
    const clusterList = currentClusters[namespace].ids || []
    projectClusters[namespace] = clusterList.map(id => clusters[id])
    projectClusters[namespace] = clusterList.map(id => clusters[id])
  })
  return {
    current,
    projectConfig,
    projectClusters,
    projects: userProjects.map(namespace => projects[namespace]),
  }
}

export default connect(mapStateToProps, {
  getProjectList,
  fetchSpingCloud,
  setProjectConfig,
  getDefaultClusters,
  getProjectClusters,
})(Form.create()(ProjectCluster))

