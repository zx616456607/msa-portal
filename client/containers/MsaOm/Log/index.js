/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * LOGS
 *
 * @author zhaoyb
 * @date 2017-11-10
 */

import React from 'react'
import { connect } from 'react-redux'
import QueueAnim from 'rc-queue-anim'
import { Row, Col, Select, Button, Form, Input, DatePicker } from 'antd'
import LogComponent from './LogsDetail'
import TenxIcon from '@tenx-ui/icon/es/_old'
import {
  getServiceOfQueryLog, getQueryLogList,
  loadServiceContainerList,
} from '../../../actions/logs'
import { getProjectClusters } from '../../../actions/current'
import './style/index.less'
import { formatDate } from '../../../common/utils'
const FormItem = Form.Item
const Option = Select.Option
const { RangePicker } = DatePicker

class Logs extends React.Component {
  state = {
    bigLog: true,
    cluster: '',
    logs: [],
    serverName: '',
    projectName: '',
    clusterList: [],
    serviceList: [],
    exampleList: [],
  }

  componentDidMount() {
    const { projectsList } = this.props
    if (projectsList.length > 0) {
      this.handleProject(projectsList[0].projectName)
    }
  }

  bigLog = state => {
    this.setState({
      bigLog: state,
    })
  }

  handleClusters = value => {
    const serverAry = []
    const { projectName } = this.state
    const { getServiceOfQueryLog } = this.props
    if (projectName) {
      getServiceOfQueryLog(value, projectName).then(item => {
        item.response.result.data.apps.forEach(item => {
          item.services.forEach(server => {
            const tmpBody = {
              serviceName: server.metadata.name,
              instanceNum: server.spec.replicas,
              annotations: server.spec.template.metadata,
            }
            serverAry.push(tmpBody)
          })
          this.setState({
            cluster: value,
            serviceList: serverAry,
          })
        })
      })
    }
  }

  handleProject = value => {
    const { form, getProjectClusters } = this.props
    getProjectClusters(value).then(res => {
      if (res.error) {
        return
      }
      let clusterList = []
      const clusterIDList = res.response.result.data.clusters
      const clusterAry = res.response.entities.clusters
      if (clusterIDList) {
        clusterList = clusterIDList.map(item => clusterAry[item])
      }
      this.setState({
        projectName: value,
        clusterList,
      }, () => {
        form.setFieldsValue({
          clusters: undefined,
        })
      })
    })
  }

  handleServer = value => {
    const { clusterID, loadServiceContainerList } = this.props
    loadServiceContainerList(clusterID, value).then(item => {
      this.setState({
        serverName: value,
        exampleList: item.response.result.data.instances,
      })
    })
  }

  handleSearch = () => {
    const { form, clusterID, getQueryLogList, projectConfig } = this.props
    const { validateFields } = form
    const { namespace } = projectConfig.project
    validateFields((error, value) => {
      if (error) return
      const body = {
        kind: value.example ? 'pod' : 'service',
        from: null,
        size: null,
        keyword: null,
        date_start: value.time && formatDate(value.time[0], 'YYYY-MM-DD'),
        date_end: value.time && formatDate(value.time[1], 'YYYY-MM-DD'),
        log_type: 'stdout',
        filename: '',
      }
      const query = value.example ? value.example : value.server
      const state = !!value.example
      getQueryLogList(clusterID, query, state, body, namespace).then(res => {
        this.setState({
          logs: res.response.result.data && res.response.result.data.logs,
        })
      })
    })
  }

  handleReset = () => {
    this.props.form.resetFields()
  }

  render() {
    const { logs, bigLog, serverName, serviceList, exampleList, clusterList } = this.state
    const { form, projectsList } = this.props
    const { getFieldDecorator } = form
    const projectItems = projectsList.filter(item =>
      !item.outlineRoles.includes('no-participator') && item.outlineRoles.includes('manager')
    )
    const defaultProject = projectItems.length > 0 ? projectItems[0].projectName : undefined
    return (
      <QueueAnim className="log">
        <div className="form" key="from">
          <Row>
            <Col span={6}>
              <FormItem>
                {getFieldDecorator('project', {
                  initialValue: defaultProject,
                  onChange: e => this.handleProject(e),
                })(
                  <Select style={{ width: '90%' }} placeholder="选择项目" size="default" showSearch>
                    {
                      projectItems.length > 0 && projectItems.map(item =>
                        <Option key={item.namespace}>{item.projectName}</Option>)
                    }
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem>
                {getFieldDecorator('clusters', {
                  rules: [{ message: '请选择集群' }],
                  onChange: e => this.handleClusters(e),
                })(
                  <Select style={{ width: '90%' }} placeholder="选择集群" size="default" showSearch>
                    {
                      clusterList && clusterList.map(item => (
                        <Option key={item.clusterID}>{item.clusterName}</Option>
                      ))
                    }
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem>
                {getFieldDecorator('server', {
                  rules: [{ message: '请选择服务' }],
                  onChange: e => this.handleServer(e),
                })(
                  <Select style={{ width: '90%' }} placeholder="选择服务" size="default" showSearch>
                    {
                      serviceList.length > 0 && serviceList.map(item => (
                        <Option key={item.serviceName}>{item.serviceName}</Option>
                      ))
                    }
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem>
                {getFieldDecorator('example', {
                  rules: [{ message: '请选择实例' }],
                })(
                  <Select style={{ width: '100%' }} placeholder="选择实例" size="default"
                    showSearch>
                    {
                      exampleList && exampleList.map(item => (
                        <Option key={item.metadata.name}>{item.metadata.name}</Option>
                      ))
                    }
                  </Select>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={6}>
              <FormItem>
                {getFieldDecorator('time', {
                })(
                  <RangePicker
                    style={{ width: '90%' }}
                    size="default"
                    key="timePicker"
                    showTime={{ format: 'HH:mm' }}
                    format="YYYY-MM-DD HH:mm"
                    placeholder={[ '开始日期', '结束日期' ]}
                  />
                )}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem>
                {getFieldDecorator('Keyword', {
                  rules: [{ message: '请填写关键词' }],
                })(
                  <Input placeholder="关键字" size="default" style={{ width: '90%' }} />
                )}
              </FormItem>
            </Col>
            <Col span={12} style={{ lineHeight: '3.5' }}>
              <Button type="primary" onClick={() => this.handleSearch()}>
                <TenxIcon
                  type="search"
                  size={12}
                  className="select"
                />
                立即查询
              </Button>
              <Button className="back" type={'primary'} icon={'rollback'}
                onClick={() => this.handleReset()}>重置
              </Button>
            </Col>
          </Row>
        </div>
        <div className={bigLog ? 'logs' : 'bigLogBox'} key="logs">
          <LogComponent
            logs={logs}
            name={serverName}
            callback={e => this.bigLog(e)} />
        </div>
      </QueueAnim>
    )
  }
}

const mapStateToProps = state => {
  const { entities, current } = state
  const { projects: projectsList } = entities
  const { cluster } = current.config
  const clusterID = cluster.id
  const { projectConfig } = current
  const { projects: { ids: userProjectsList = [] } = {} } = current
  return {
    clusterID,
    projectConfig,
    projectsList: userProjectsList.map(namespace => projectsList[namespace]),
  }
}

export default connect(mapStateToProps, {
  getQueryLogList,
  getProjectClusters,
  getServiceOfQueryLog,
  loadServiceContainerList,
})(Form.create()(Logs))
