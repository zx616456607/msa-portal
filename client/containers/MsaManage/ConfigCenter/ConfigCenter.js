/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * Config
 *
 * 2017-09-13
 * @author zhaoyb
 */

import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { parse } from 'query-string'
import './style/configCenter.less'
import QueueAnim from 'rc-queue-anim'
// ref_branch 基于哪个分支 branch_name project_url
import { deleteBranch, getService, getBranchList, getCenterEvn, delCenterConfig, putCenterConfig, getCommitMessages } from '../../../actions/configCenter'
import { Breadcrumb, Button, Icon, Table, Modal, Select, Input, notification, Card, Tooltip } from 'antd'
// import { formatDate } from '../../../common/utils'
import TimeHover from '@tenx-ui/time-hover/lib'
import cloneDeep from 'lodash/cloneDeep'
import CreateBranch from './CreateBranch'
import * as TenxModal from '@tenx-ui/modal'

const Option = Select.Option
const { TextArea } = Input

class ConfigCenter extends React.Component {

  state = {
    message: '',
    configName: '',
    branchValue: sessionStorage.getItem('branch') || '',
    configGitUrl: '',
    deleteVisible: false,
    branchData: [],
    configData: [],
    productionData: [],
    isDelFetching: false,
    delIndex: '',
    isLoadingLast: false,
    isShowAddModal: false,
    isShowDelModal: false,
  }

  componentDidMount() {
    this.loadData()
  }

  loadData = () => {
    const { clusterID, getService } = this.props
    getService(clusterID).then(res => {
      if (res.error) return
      if (res.response.result.code === 200) {
        const configGitUrl = res.response.result.data.configGitUrl
        this.setState({
          configGitUrl,
        }, () => {
          this.getBranches()
        })
      }
    })
  }
  getBranches = () => {
    const { configGitUrl } = this.state
    const { clusterID, getBranchList } = this.props
    const branchQuery = {
      project_url: configGitUrl,
    }
    getBranchList(clusterID, branchQuery).then(res => {
      if (res.error) return
      if (res.response.result.code === 200 && res.response.result.data.length > 0) {
        const temp = {
          branchData: res.response.result.data,
        }
        if (!this.state.branchValue) {
          temp.branchValue = res.response.result.data[0].name
        }
        this.setState(temp, () => {
          this.fetchList()
        })
      }
    })
  }

  fetchList = (new_path, isForce) => {
    const { getCenterEvn, clusterID, location } = this.props
    const temp = parse(location.search).path
    const path = new_path !== undefined ?
      new_path : temp || ''
    const { configGitUrl, branchValue } = this.state
    const envData = this.props.envData[branchValue + '/' + (path || '')]
    if (isForce || !(envData && envData.length && envData[0].isGet)) {
      const evnQuery = {
        project_url: configGitUrl,
        branch_name: branchValue,
        path,
      }
      const _this = this
      getCenterEvn(clusterID, evnQuery).then(res => {
        if (res.response && res.response.result.code === 200 && res.response.result.data) {
          const files = res.response.result.data.map(item => {
            return {
              file: path ? path + '/' + item.name : item.name,
              type: item.type,
            }
          })
          _this.getLastCommit(files, {
            project_url: configGitUrl,
            branch_name: branchValue,
            path,
          })
        }
      })
    }
  }
  getLastCommit = (body, query) => {
    const { getCommitMessages, clusterID } = this.props
    const _that = this
    this.setState({
      isLoadingLast: true,
    }, () => {
      getCommitMessages(clusterID, body, query).then(() => {
        _that.setState({
          isLoadingLast: false,
        })
      })
    })
  }
  handleCancel = () => {
    this.setState({
      deleteVisible: false,
    })
  }

  handleChang = e => {
    sessionStorage.clear()
    sessionStorage.setItem('branch', e)
    this.setState({
      branchValue: e,
    }, () => {
      this.fetchList()
    })
  }

  handleDelVisible = name => {
    this.setState({
      configName: name,
      deleteVisible: true,
    })
  }

  handleDel = () => {
    const { configGitUrl, configName, message, branchValue } = this.state
    const { delCenterConfig, clusterID } = this.props
    const query = {
      project_url: configGitUrl,
      branch_name: branchValue,
      file_path: configName,
      commit_message: message === '' ? '删除一个配置' : message,
    }
    this.setState({
      isDelFetching: true,
    })
    delCenterConfig(clusterID, query).then(res => {
      this.setState({
        deleteVisible: false,
        isDelFetching: false,
      })
      if (res.error) {
        notification.error({
          message: `删除配置 ${configName} 失败`,
        })
        return
      }
      if (res.response.result.code === 200) {
        this.fetchList()
        notification.success({
          message: `删除配置 ${configName} 成功`,
        })
      }

    })
  }

  handleDelInfo = e => {
    this.setState({
      message: e.target.value,
    })
  }

  componentWillReceiveProps(next) {
    const new_path = parse(next.location.search).path
    const prev = parse(this.props.location.search).path
    if (new_path !== prev) {
      this.fetchList(new_path || '')
    }
  }
  handleButtonClick = record => {
    this.props.history(`/msa-manage/config-center/${record.name}?detail=true&id=${record.id}`)
  }
  onAddOk = branch_name => {
    notification.success({
      message: '添加分支成功',
    })
    this.setState({
      branchValue: branch_name,
      isShowAddModal: false,
    })
    this.getBranches()
  }
  onDelClick = () => {
    const { branchValue, configGitUrl } = this.state
    const { deleteBranch, clusterID } = this.props
    const _this = this
    TenxModal.confirm({
      modalTitle: '删除分支',
      title: '删除后无法恢复',
      content: `确定删除分支 [${branchValue}]?`,
      onOk() {
        const query = {
          project_url: configGitUrl,
          branch_name: branchValue,
        }
        return new Promise((resolve, reject) => {
          deleteBranch(clusterID, query, { isHandleError: true }).then(res => {
            if (res.response && res.response.result && res.response.result.code === 200) {
              resolve()
              notification.success({
                message: `删除分支 ${branchValue} 成功`,
              })
              _this.setState({
                branchValue: undefined,
              }, () => {
                _this.getBranches()
              })
            } else {
              notification.warn({
                message: `删除分支 ${branchValue} 失败`,
              })
              reject()
            }
          })
        })
      },
      onCancel() {},
    })
  }
  render() {
    const { isFetching, location } = this.props
    const path = parse(location.search).path || ''
    const { branchData, branchValue, isLoadingLast, isShowAddModal, configGitUrl } = this.state
    const envData = this.props.envData[branchValue + '/' + (path || '')]
    const tempEnvData = cloneDeep(envData)
    if (path && envData && envData instanceof Array) {
      tempEnvData.unshift({
        name: '...',
        type: 'returnBack',
      })
    }
    const columns = [{
      id: 'id',
      title: '配置名称',
      dataIndex: 'name',
      width: '20%',
      render: (text, record) => {
        if (record.type === 'tree') {
          const temp = (path ? path + '/' : '') + text
          return <Link to={`/msa-manage/config-center?path=${temp}`}><Icon className="table-icon" type="folder" /> {text}</Link>
        } else if (record.type === 'blob') {
          return <Link to={`/msa-manage/config-center/${decodeURIComponent(text)}?detail=true&id=${record.id}&branch=${branchValue}&path=${path}`}>
            <Icon className="table-icon" type="file" /> {decodeURIComponent(text)}
          </Link>
        } else if (record.type === 'returnBack') {
          const arr = path.split('/')
          arr.pop()
          const temp = arr.length > 0 ? arr.join('/') : ''
          return <Link to={`/msa-manage/config-center${temp ? '?path=' + temp : ''}`}>{text}</Link>
        }
        return text
      },
    }, {
      title: '最近更新时间',
      dataIndex: 'time',
      width: '20%',
      render: (text, record, i) => {
        if (record.type === 'returnBack') {
          return ''
        }
        if (isLoadingLast) {
          if (i === 0 || (i === 1 && tempEnvData[0].type === 'returnBack')) {
            return <span className="loading-icon-wrapper"><Icon className="loading-icon" type="loading-3-quarters" /> 正在加载数据...</span>
          }
          return ''
        }
        return text ? <TimeHover time={text} /> : '未知'
      },
    }, {
      title: '最近一次提交',
      dataIndex: 'info',
      width: '20%',
      render: (text, record) => {
        if (record.type === 'returnBack') {
          return ''
        }
        if (isLoadingLast) return ''
        return text ? decodeURIComponent(text) : ''
      },
    }, {
      title: '最近一次修改人',
      dataIndex: 'user',
      width: '20%',
      render: (text, record) => {
        if (record.type === 'returnBack') {
          return ''
        }
        if (isLoadingLast) return ''
        return text ? decodeURIComponent(text) : ''
      },
    }, {
      id: 'id',
      title: '操作',
      dataIndex: 'operation',
      width: '27%',
      render: (text, record) => {
        if (record.type === 'returnBack') {
          return ''
        }
        let btns = [
          <Button key="1" className="detail" type="primary" onClick={() => this.props.history.push(`/msa-manage/config-center/${record.name}?detail=true&id=${record.id}&branch=${branchValue}`)}>查看详情</Button>,
        ]
        if (record.type === 'blob') {
          btns = [].concat(btns, [
            <Button key="2" className="detail" onClick={() => this.props.history.push(`/msa-manage/config-center/${record.name}?detail=update&id=${record.id}&branch=${branchValue}`)}>更新</Button>,
            <Button key="3"
              onClick={() => this.handleDelVisible(record.name)}
              disabled={this.state.isDelFetching && this.state.configName === record.name}>
            删除</Button>,
          ])
        }
        return <div>
          {btns}
        </div>
      },
    }]
    const data = branchData ? branchData.map((item, index) => (<Option key={index} value={item.name}>{item.name}</Option>)) : ''
    return (
      <QueueAnim className="center config-center" >
        <div key="body">
          <div className="branch">
            <span>版本分支：</span>
            <Select style={{ width: 200 }} onChange={this.handleChang}
              value={branchValue}>
              {data}
            </Select>
            <Tooltip title="添加分支">
              <Button className="icon-btn" type="primary" size="default" onClick={() => this.setState({
                isShowAddModal: true,
              })}><Icon type="plus" /></Button>
            </Tooltip>
            <Tooltip title="删除当前分支">
              <Button className="icon-btn" size="default" onClick={this.onDelClick}><Icon type="delete" /></Button>
            </Tooltip>
          </div>
          <Card>
            <div>
              <div className="exploit layout-content-btns">
                <div className="headers">
                  <Breadcrumb>
                    <Breadcrumb.Item>
                      <Link to="/msa-manage/config-center">...</Link>
                    </Breadcrumb.Item>
                    {
                      (() => {
                        const arr = path.split('/')
                        return arr.map((item, i) => {
                          if (i === arr.length - 1) return <Breadcrumb.Item>{item}</Breadcrumb.Item>
                          const temp = cloneDeep(arr).slice(0, i + 1).join('/')
                          return <Breadcrumb.Item>
                            <Link to={`/msa-manage/config-center?path=${temp}`}>{item}</Link>
                          </Breadcrumb.Item>
                        })
                      })()
                    }
                  </Breadcrumb>
                  <Button type="primary" onClick={() => this.props.history.push(`/msa-manage/config-center/config/create?detail=false&branch=${branchValue}`)}>
                    <Icon type="plus" style={{ color: '#fff' }} />
                    <span className="font">添加配置</span>
                  </Button>
                  <Button className="refresh" icon="sync" onClick={() => this.fetchList('', true)}>刷新</Button>
                </div>
              </div>
              <Table
                columns={columns}
                dataSource={tempEnvData}
                pagination={false}
                loading={isFetching}
                rowKey={row => row.name} />
            </div>
            <Modal title="删除配置操作" visible={this.state.deleteVisible} onCancel={this.handleCancel}
              footer={[
                <Button key="back" type="ghost" onClick={this.handleCancel}>取 消</Button>,
                <Button key="submit" type="primary" onClick={this.handleDel} loading={this.state.isDelFetching}>确 定</Button>,
              ]}>
              <div className="prompt" style={{ height: 45, backgroundColor: '#fffaf0', border: '1px dashed #ffc125', padding: 10 }}>
                <span>删除当前配置操作完成后，客户端如有重启情况，将无法再继续读取该配置信息。</span>
              </div>
              <div style={{ marginTop: 10 }}>
                <span><Icon type="question-circle-o" style={{ color: '#2db7f5' }} />&nbsp;&nbsp;确定删除该配置 ?</span>
                <div className="remark">
                  <span style={{ lineHeight: '65px' }}>添加备注 &nbsp;</span>
                  <TextArea className="text" placeholder="删除一个配置" autosize={{ minRows: 2, maxRows: 6 }} style={{ width: '87%' }} onChange={this.handleDelInfo} />
                </div>
              </div>
            </Modal>
            {
              isShowAddModal ?
                <CreateBranch
                  current={branchValue}
                  project_url={configGitUrl}
                  visible={isShowAddModal}
                  branchs={branchData}
                  onOk={this.onAddOk}
                  onCancel={() => this.setState({ isShowAddModal: false })}
                />
                :
                null
            }
          </Card>
        </div>
      </QueueAnim>
    )
  }
}

const mapStateToProps = state => {
  const { current, configCenter } = state
  const { isFetching } = configCenter
  const { cluster } = current.config
  const clusterID = cluster.id
  return {
    envData: configCenter,
    clusterID,
    isFetching,
  }
}

export default connect(mapStateToProps, {
  getService,
  getCenterEvn,
  getBranchList,
  delCenterConfig,
  putCenterConfig,
  getCommitMessages,
  deleteBranch,
})(ConfigCenter)
