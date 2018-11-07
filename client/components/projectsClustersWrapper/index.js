/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * 高阶组件: Wrapper of ProjectsClusters
 * 保证组件在加载完项目和集群后才渲染，以及在切换项目和集群时组件会卸载后再挂载
 *
 * 2018-11-06
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
    const projectNamespace = projects[0].namespace
    form.setFieldsValue({ projectNamespace })
    this.onProjectChange(projectNamespace)
  }

  onProjectChange = async projectNamespace => {
    const { getProjectClusters, form } = this.props
    const { setFieldsValue, resetFields } = form
    resetFields([ 'clusterID' ])
    const clustersRes = await getProjectClusters(projectNamespace)
    if (clustersRes.error) {
      notification.warn({
        message: '获取项目集群失败，请刷新页面重试',
      })
      return
    }
    const { projectClusters } = this.props
    if (projectClusters[projectNamespace] && projectClusters[projectNamespace][0]) {
      setFieldsValue({
        clusterID: projectClusters[projectNamespace][0].clusterID,
      })
    }
  }

  renderComponent = () => {
    const {
      Component, projectsLoading, projectClustersLoading, form,
      projects, projectClusters,
    } = this.props
    const { clusterChange } = this.state
    const { getFieldsValue } = form
    const { projectNamespace, clusterID } = getFieldsValue()
    const clusters = projectClusters[projectNamespace] || []
    let clustersLoading = projectClustersLoading[projectNamespace]
    if (clustersLoading === undefined) {
      clustersLoading = true
    }
    if (projectsLoading || clustersLoading || clusterChange) {
      if (clusterChange) {
        this.setState({ clusterChange: false })
      }
      return renderLoading('加载项目集群中 ...')
    }
    if (!clusterID) {
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
    let currentProject
    let currentCluster
    projects.every(item => {
      if (item.namespace === projectNamespace) {
        currentProject = item
        return false
      }
      return true
    })
    clusters.every(item => {
      if (item.clusterID === clusterID) {
        currentCluster = item
        return false
      }
      return true
    })
    const props = {
      projectNamespace, clusterID, projects, clusters, currentProject,
      currentCluster,
    }
    return <Component {...props} />
  }

  render() {
    const { form, projectsLoading, projects, projectClusters } = this.props
    const { getFieldDecorator, getFieldValue } = form
    const clusters = projectClusters[getFieldValue('projectNamespace')] || []
    return (
      <React.Fragment>
        <Form className="select-project-cluster-form" hideRequiredMark>
          <Row gutter={24}>
            <Col span={6} style={{ display: 'block' }}>
              <FormItem label="项目">
                {getFieldDecorator('projectNamespace', {
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
                {getFieldDecorator('clusterID', {
                  rules: [{
                    required: true,
                    message: '请选择集群',
                  }],
                })(
                  <Select
                    placeholder="请选择集群"
                    onChange={() => this.setState({ clusterChange: true })}
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
                <Button
                  type="primary"
                  onClick={() => this.setState({ clusterChange: true })}
                >
                刷新
                </Button>
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
