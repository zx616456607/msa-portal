/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * Wrapper of ProjectsClusters
 * 高阶组件，保证组件在加载完项目和集群后才渲染，以及在切换项目和集群时组件会卸载后再挂载
 *
 * 2017-09-06
 * @author zhangpc
 */

import React from 'react'
import { connect } from 'react-redux'
import { Form, Row, Col, Button, Select, notification } from 'antd'
import * as currentActions from '../../actions/current'
import './style/index.less'
import { renderLoading } from '../utils'
import noClustersImage from '../../assets/img/no-clusters.png'

const FormItem = Form.Item
const Option = Select.Option

class ProjectsClusters extends React.Component {
  state = {
    clusterChange: false,
  }

  async componentDidMount() {
    const { form, getProjectList } = this.props
    const projectListRes = await getProjectList({ size: 0 })
    if (projectListRes.error) {
      notification.warn({
        message: '获取用户项目失败，请刷新页面重试',
      })
      return
    }
    const { projects } = this.props
    const project = projects[0].namespace
    form.setFieldsValue({ project })
    this.onProjectChange(project)
  }

  onProjectChange = async project => {
    const { getProjectClusters, form } = this.props
    const { setFieldsValue, resetFields } = form
    resetFields([ 'cluster' ])
    const clustersRes = await getProjectClusters(project)
    if (clustersRes.error) {
      notification.warn({
        message: '获取项目集群失败，请刷新页面重试',
      })
      return
    }
    const { projectClusters } = this.props
    if (projectClusters[project] && projectClusters[project][0]) {
      setFieldsValue({
        cluster: projectClusters[project][0].clusterID,
      })
    }
  }

  renderComponent = () => {
    const { Component, projectsLoading, projectClustersLoading, form } = this.props
    const { clusterChange } = this.state
    const { getFieldsValue } = form
    const { project, cluster } = getFieldsValue()
    let clustersLoading = projectClustersLoading[project]
    if (clustersLoading === undefined) {
      clustersLoading = true
    }
    if (projectsLoading || clustersLoading || clusterChange) {
      if (clusterChange) {
        this.setState({ clusterChange: false })
      }
      return renderLoading('加载项目集群中 ...')
    }
    if (!cluster) {
      return (
        <div className="noclustersOrPrjects">
          <div className="noclustersOrPrjectsinfoWrap">
            <img src={noClustersImage} alt="no-clusters" />
            <br />
            <span>
            项目暂无授权的集群，请先申请『授权集群』或选择其他项目
            </span>
          </div>
        </div>
      )
    }
    return <Component project={project} cluster={cluster} />
  }

  render() {
    const { form, projectsLoading, projects, projectClusters } = this.props
    const { getFieldDecorator, getFieldValue } = form
    const clusters = projectClusters[getFieldValue('project')] || []
    return (
      <React.Fragment>
        <Form className="select-project-cluster-form" hideRequiredMark>
          <Row gutter={24}>
            <Col span={6} style={{ display: 'block' }}>
              <FormItem label="项目">
                {getFieldDecorator('project', {
                  rules: [{
                    required: true,
                    message: '请选择项目',
                  }],
                })(
                  <Select
                    placeholder={projectsLoading ? '加载项目中 ...' : '请选择项目'}
                    onChange={this.onProjectChange}
                  >
                    {
                      projects.map(({ namespace }) => <Option key={namespace}>
                        {namespace}
                      </Option>)
                    }
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={6} style={{ display: 'block' }}>
              <FormItem label="集群">
                {getFieldDecorator('cluster', {
                  rules: [{
                    required: true,
                    message: '请选择集群',
                  }],
                })(
                  <Select
                    placeholder="请选择集群"
                    onChange={() => {
                      this.setState({ clusterChange: true })
                    }}
                  >
                    {
                      clusters.map(
                        ({ clusterID, clusterName }) => <Option key={clusterID}>
                          {clusterName}
                        </Option>
                      )
                    }
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem>
                <Button type="primary">刷新</Button>
              </FormItem>
            </Col>
          </Row>
        </Form>
        {this.renderComponent()}
      </React.Fragment>
    )
  }
}

export default Component => {
  const mapStateToProps = state => {
    const { entities, current } = state
    const { projects, clusters } = entities
    const userProjects = current.projects || {}
    const userProjectsList = (userProjects.ids || []).map(namespace => projects[namespace])
      .filter(project =>
        !project.outlineRoles.includes('no-participator') && project.outlineRoles.includes('manager')
      )
    const currentClusters = current.clusters || {}
    const projectClusters = {}
    const projectClustersLoading = {}
    Object.keys(currentClusters).forEach(namespace => {
      const clusterList = currentClusters[namespace].ids || []
      projectClusters[namespace] = clusterList.map(id => clusters[id])
      projectClustersLoading[namespace] = currentClusters[namespace].isFetching
      if (projectClustersLoading[namespace] === undefined) {
        projectClustersLoading[namespace] = true
      }
    })
    let projectsLoading = userProjects.isFetching
    if (projectsLoading === undefined) {
      projectsLoading = true
    }
    return {
      Component,
      current: current || {},
      projectsLoading,
      projects: userProjectsList,
      projectClusters,
      projectClustersLoading,
    }
  }

  return connect(mapStateToProps, {
    getProjectClusters: currentActions.getProjectClusters,
    getProjectList: currentActions.getProjectList,
  })(Form.create()(ProjectsClusters))
}
