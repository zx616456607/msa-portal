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
import { getService, getBranchList, getCenterEvn, getCenterConfig, delCenterConfig, putCenterConfig } from '../../../actions/configCenter'
import { Row, Tabs, Button, Icon, Table, Pagination, Modal, Select, Input, notification } from 'antd'
const TabPane = Tabs.TabPane
const Option = Select.Option
const { TextArea } = Input

class ConfigCenter extends React.Component {

  state = {
    loading: true,
    message: '',
    configName: '',
    branchName: '',
    configGitUrl: '',
    deleteVisible: false,
    branchData: [],
    envData: [],
    configData: [],
    productionData: [],
  }

  componentWillMount() {
    this.loadData()
  }

  loadData = () => {
    const { clusterID, getService, getBranchList, getCenterEvn } = this.props
    getService(clusterID).then(res => {
      if (res.error) return
      if (res.response.result.code === 200) {
        this.setState({
          configGitUrl: res.response.result.data.configGitUrl,
        })
        const branchQuery = {
          url: res.response.result.data.configGitUrl,
          clusterId: clusterID,
        }
        getBranchList(branchQuery).then(res => {
          if (res.error) return
          if (res.response.result.code === 200) {
            this.setState({
              branchData: res.response.result.data,
            })
            const evnQuery = {
              url: this.state.configGitUrl,
              branchName: res.response.result.data[1].name,
              clusterId: clusterID,
            }
            getCenterEvn(evnQuery).then(res => {
              if (res.error) return
              if (res.response.result.code === 200) {
                this.setState({
                  loading: false,
                  envData: res.response.result.data,
                })
              }
            })
          }
        })
      }
    })
  }

  handleCancel = () => {
    this.setState({
      deleteVisible: false,
    })
  }

  handleChang = value => {
    this.setState({
      branchName: value,
    })
  }

  handleDelVisible = name => {
    this.setState({
      configName: name,
      deleteVisible: true,
    })
  }

  handleDel = () => {
    const { configGitUrl, configName, message } = this.state
    const { delCenterConfig, clusterID } = this.props
    const query = {
      url: configGitUrl,
      clusterId: clusterID,
      branchName: 'master',
      configName,
      message,
    }
    delCenterConfig(query).then(res => {
      if (res.error) {
        notification.error({
          message: `删除失败 ${configName}`,
        })
      }
      if (res.response.result.code === 200) {
        this.loadData()
        notification.success({
          message: `删除成功 ${configName}`,
        })
      }
    })
    this.setState({
      deleteVisible: false,
    })
  }

  handleDelInfo = e => {
    this.setState({
      message: e.target.value,
    })
  }

  render() {
    const { envData, branchData, loading } = this.state
    const columns = [{
      id: 'id',
      title: '配置名称',
      dataIndex: 'name',
      render: (text, record) =>
        <Link to={`/msa-manage/config-center/${text}#detal=true&id=${record.id}`}>
          {text}
        </Link>,
    }, {
      title: '更新时间',
      dataIndex: 'time',
    }, {
      id: 'id',
      title: '操作',
      dataIndex: 'operation',
      render: (text, record) => <div>
        <Link to={`/msa-manage/config-center/${record.name}#detal=true&id=${record.id}`}>
          <div className="desc" style={{ color: '#2db7f5' }}>查看详情</div>&nbsp; | &nbsp;
        </Link>
        <div className="desc" style={{ color: '#f85a5a' }} onClick={() => this.handleDelVisible(record.name)}>删除</div>
      </div>,
    }]

    const pagination = {
      simple: true,
      defaultCurrent: 1,
      defaultPageSize: 10,
    }

    return (
      <Row className="layout-content-btns">
        <Row className="branch">
          <span>版本分支：</span>
          <Select style={{ width: 200 }} onChange={this.handleChang} defaultValue="dev">
            {
              branchData ?
                branchData.map((item, index) => (
                  <Option key={index} value={item.name}>{item.name}</Option>
                )) : ''
            }
          </Select>
        </Row>
        <Tabs onChange={this.handleChang} type="card">
          <TabPane tab="开发环境" key="evn">
            <div className="exploit">
              <div className="headers">
                <Button className="add" type="primary" onClick={() => this.props.history.push('/msa-manage/config-center/config/create#evn')}>
                  <Icon type="plus" style={{ color: '#fff' }} />
                  <span className="font">添加配置</span>
                </Button>
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
                  loading={loading} />
              </div>
            </div>
          </TabPane>
          <TabPane tab="测试环境" key="config">
            <div className="exploit">
              <div className="headers">
                <Button className="add" type="primary" onClick={() => this.props.history.push('/msa-manage/config-center/config/create#config')}>
                  <Icon type="plus" style={{ color: '#fff' }} />
                  <span className="font">添加配置</span>
                </Button>
                <div className="pages">
                  <span className="total">共计{envData.length}条</span>
                  <Pagination simple defaultCurrent={0} total={2} />
                </div>
              </div>
              <div className="bottom">
                <Table
                  columns={columns}
                  dataSource={envData}
                  pagination={false} />
              </div>
            </div>
          </TabPane>
          <TabPane tab="生成环境" key="pt">
            <div className="exploit">
              <div className="headers">
                <Button className="add" type="primary" onClick={() => this.props.history.push('/msa-manage/config-center/config/create#pt')}>
                  <Icon type="plus" style={{ color: '#fff' }} />
                  <span className="font">添加配置</span>
                </Button>
                <div className="pages">
                  <span className="total">共计{envData.length}条</span>
                  <Pagination simple defaultCurrent={0} total={2} />
                </div>
              </div>
              <div className="bottom">
                <Table
                  columns={columns}
                  dataSource={envData}
                  pagination={false} />
              </div>
            </div>
          </TabPane>
        </Tabs>
        <Modal title="删除配置操作" visible={this.state.deleteVisible} onCancel={this.handleCancel}
          footer={[
            <Button key="back" type="ghost" onClick={this.handleCancel}>取 消</Button>,
            <Button key="submit" type="primary" onClick={this.handleDel}>确 定</Button>,
          ]}>
          <div className="prompt" style={{ height: 45, backgroundColor: '#fffaf0', border: '1px dashed #ffc125', padding: 10 }}>
            <span>删除当前配置操作完成后，客户端如有重启情况，将无法再继续读取该配置信息。</span>
          </div>
          <div style={{ marginTop: 10 }}>
            <span><Icon type="question-circle-o" style={{ color: '#2db7f5' }} />&nbsp;&nbsp;确认删除该配置 ?</span>
            <div className="remark">
              <span style={{ lineHeight: '65px' }}>添加备注 &nbsp;</span>
              <TextArea className="text" placeholder="删除一个配置" autosize={{ minRows: 2, maxRows: 6 }} style={{ width: '87%' }} onChange={this.handleDelInfo} />
            </div>
          </div>
        </Modal>
      </Row>
    )
  }
}

const mapStateToProps = state => {
  const { current } = state
  const { cluster } = current.config
  const clusterID = cluster.id
  return {
    clusterID,
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
