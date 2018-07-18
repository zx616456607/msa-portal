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
import './style/configCenter.less'
import QueueAnim from 'rc-queue-anim'
import { getService, getBranchList, getCenterEvn, getCenterConfig, delCenterConfig, putCenterConfig } from '../../../actions/configCenter'
import { Button, Icon, Table, Pagination, Modal, Select, Input, notification, Card } from 'antd'
const Option = Select.Option
const { TextArea } = Input

class ConfigCenter extends React.Component {

  state = {
    loading: true,
    message: '',
    configName: '',
    branchName: '',
    value: '',
    branchValue: '',
    configGitUrl: '',
    deleteVisible: false,
    branchData: [],
    configData: [],
    productionData: [],
  }

  componentDidMount() {
    this.loadData()
  }

  loadData = () => {
    const { clusterID, getService, getBranchList } = this.props
    getService(clusterID).then(res => {
      if (res.error) return
      if (res.response.result.code === 200) {
        this.setState({
          configGitUrl: res.response.result.data.configGitUrl,
        })
        const branchQuery = {
          project_url: res.response.result.data.configGitUrl,
        }
        getBranchList(clusterID, branchQuery).then(res => {
          if (res.error) return
          if (res.response.result.code === 200) {
            this.setState({
              branchData: res.response.result.data,
              value: res.response.result.data[0].name,
            }, () => {
              this.fetchList()
            })
          }
        })
      }
    })
  }

  fetchList = branch => {
    const { getCenterEvn, clusterID } = this.props
    const { configGitUrl, value } = this.state
    const evnQuery = {
      project_url: configGitUrl,
      branch_name: branch === undefined ? value : branch,
    }
    getCenterEvn(clusterID, evnQuery)
  }

  handleCancel = () => {
    this.setState({
      deleteVisible: false,
    })
  }

  handleChang = e => {
    this.fetchList(e)
    this.setState({
      branchName: e,
    })
  }

  handleDelVisible = name => {
    this.setState({
      configName: name,
      deleteVisible: true,
    })
  }

  handleDel = () => {
    const { configGitUrl, configName, message, branchName, value } = this.state
    const { delCenterConfig, clusterID } = this.props
    const query = {
      project_url: configGitUrl,
      branch_name: branchName || value,
      file_path: configName,
      commit_message: message === '' ? '删除一个配置' : message,
    }
    delCenterConfig(clusterID, query).then(res => {
      if (res.error) {
        notification.error({
          message: `删除失败 ${configName}`,
        })
      }
      if (res.response.result.code === 200) {
        notification.success({
          message: `删除成功 ${configName}`,
        })
      }
      this.loadData()
      this.setState({
        deleteVisible: false,
      })
    })
  }

  handleDelInfo = e => {
    this.setState({
      message: e.target.value,
    })
  }

  handleRefresh = branch => {
    const { branchName } = this.state
    const value = branchName === '' ? branch : branchName
    this.setState({
      loading: true,
    })
    this.fetchList(value)
  }

  handleButtonClick = record => {
    this.props.history(`/msa-manage/config-center/${record.name}?detail=true&id=${record.id}`)
  }

  render() {
    const { envData, isFetching } = this.props
    const { branchData, branchName } = this.state
    let branch = ''
    if (branchName) {
      branch = branchName
    } else {
      if (Object.keys(branchData).length > 0) {
        branch = branchData[0].name
      }
    }
    const columns = [{
      id: 'id',
      title: '配置名称',
      dataIndex: 'name',
      width: '60%',
      render: (text, record) =>
        <Link to={`/msa-manage/config-center/${text}?detail=true&id=${record.id}&branch=${branch}`}>
          {text}
        </Link>,
    }, {
      id: 'id',
      title: '操作',
      dataIndex: 'operation',
      width: '40%',
      render: (text, record) => <div>
        <Button className="detail" type="primary" onClick={() => this.props.history.push(`/msa-manage/config-center/${record.name}?detail=true&id=${record.id}&branch=${branch}`)}>查看详情</Button>
        <Button className="detail" onClick={() => this.props.history.push(`/msa-manage/config-center/${record.name}?detail=update&id=${record.id}&branch=${branch}`)}>更新</Button>
        <Button onClick={() => this.handleDelVisible(record.name)}>删除</Button>
      </div>,
    }]
    const pagination = {
      simple: true,
      total: 1,
      defaultCurrent: 1,
    }
    const data = branchData ? branchData.map((item, index) => (<Option key={index} value={item.name}>{item.name}</Option>)) : ''
    return (
      <QueueAnim className="center" >
        <div key="body">
          <Card className="config-center">
            <div className="branch">
              <span>版本分支：</span>
              <Select style={{ width: 200 }} onChange={this.handleChang} value={branch}>
                {data}
              </Select>
            </div>
            <div>
              <div className="exploit layout-content-btns">
                <div className="headers">
                  <Button type="primary" onClick={() => this.props.history.push(`/msa-manage/config-center/config/create?detail=false&branch=${branchName}`)}>
                    <Icon type="plus" style={{ color: '#fff' }} />
                    <span className="font">添加配置</span>
                  </Button>
                  <Button className="refresh" icon="sync" onClick={() => this.handleRefresh(branch)}>刷新</Button>
                  <div className="pages">
                    <span className="total">共计{envData.length}条</span>
                    <Pagination {...pagination} />
                  </div>
                </div>
              </div>
              <Table
                columns={columns}
                dataSource={envData}
                pagination={false}
                loading={isFetching}
                rowKey={row => row.name} />
              {/* <TabPane tab="测试环境" key="2">
                <div className="exploit">
                  <div className="headers">
                    <Button className="add" type="primary" onClick={() => this.props.history.push('/msa-manage/config-center/config/create?config')}>
                      <Icon type="plus" style={{ color: '#fff' }} />
                      <span className="font">添加配置</span>
                    </Button>
                    <Button className="refresh" icon="sync" onClick={() => this.handleRefresh(branch)}>刷新</Button>
                    <div className="pages">
                      <span className="total">共计{envData.length}条</span>
                      <Pagination {...pagination} />
                    </div>
                  </div>
                  <div className="bottom">
                    <Table
                      columns={columns}
                      dataSource={envData}
                      pagination={false}
                      rowKey={row => row.name} />
                  </div>
                </div>
              </TabPane>
              <TabPane tab="生产环境" key="3">
                <div className="exploit">
                  <div className="headers">
                    <Button className="add" type="primary" onClick={() => this.props.history.push('/msa-manage/config-center/config/create?pt')}>
                      <Icon type="plus" style={{ color: '#fff' }} />
                      <span className="font">添加配置</span>
                    </Button>
                    <Button className="refresh" icon="sync" onClick={() => this.handleRefresh(branch)}>刷新</Button>
                    <div className="pages">
                      <span className="total">共计{envData.length}条</span>
                      <Pagination {...pagination} />
                    </div>
                  </div>
                  <div className="bottom">
                    <Table
                      columns={columns}
                      dataSource={envData}
                      pagination={false}
                      rowKey={row => row.name} />
                  </div>
                </div>
              </TabPane> */}
            </div>
            <Modal title="删除配置操作" visible={this.state.deleteVisible} onCancel={this.handleCancel}
              footer={[
                <Button key="back" type="ghost" onClick={this.handleCancel}>取 消</Button>,
                <Button key="submit" type="primary" onClick={this.handleDel}>确 定</Button>,
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
          </Card>
        </div>
      </QueueAnim>
    )
  }
}

const mapStateToProps = state => {
  const { current, configCenter } = state
  const { data, isFetching } = configCenter
  const { cluster } = current.config
  const clusterID = cluster.id
  const envData = data || []
  return {
    envData,
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
  getCenterConfig,
})(ConfigCenter)
