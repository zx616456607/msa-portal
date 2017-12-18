/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * CSB instance om
 *
 * 2017-12-13
 * @author zhangxuan
 */

import React from 'react'
import { connect } from 'react-redux'
import { Radio, Button, Icon, Input, Table, Dropdown, Menu, Select, Pagination } from 'antd'
import QueueAnim from 'rc-queue-anim'
import isEqual from 'lodash/isEqual'
import { parse as parseQuerystring } from 'query-string'
import './style/index.less'
import CreateModal from './CreateModal'
import confirm from '../../../components/Modal/confirm'
import { getInstances, deleteInstance } from '../../../actions/CSB/instance'
import {
  instancesSltMaker,
  getQueryAndFuncs,
} from '../../../selectors/CSB/instance'
import { UNUSED_CLUSTER_ID, CSB_OM_INSTANCES_FLAG } from '../../../constants'
import { formatDate, getQueryKey, toQuerystring } from '../../../common/utils'

const RadioGroup = Radio.Group
const SearchInput = Input.Search
const Option = Select.Option

const omInstancesSlt = instancesSltMaker(CSB_OM_INSTANCES_FLAG)
const { mergeQuery } = getQueryAndFuncs(CSB_OM_INSTANCES_FLAG)

class CSBInstanceOm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      createModal: false,
      currentSearchType: 'creator',
      searchValue: '',
      creationTimeSort: true,
      transferNumSort: true,
      cpuRateSort: true,
      memoryRateSort: true,
    }
  }

  componentWillMount() {
    this.getInstanceList()
  }

  componentWillReceiveProps(nextPorps) {
    const { location: oldLocation } = this.props
    const { location: newLocation } = nextPorps
    const { query: oldQuery } = oldLocation
    const { query: newQuery } = newLocation
    const {
      transferNum: oldTransferNum, cpuRate: oldCpuRate,
      memoryRate: oldMemoryRate, creationTime: oldCreationTime,
    } = oldQuery
    const {
      transferNum: newTransferNum, cpuRate: newCpuRate,
      memoryRate: newMemoryRate, creationTime: newCreationTime,
    } = newQuery
    if (oldTransferNum !== newTransferNum) {
      this.setState({
        transferNumSort: this.transferQuerySort(newTransferNum),
      })
    }
    if (oldCpuRate !== newCpuRate) {
      this.setState({
        cpuRateSort: this.transferQuerySort(newCpuRate),
      })
    }
    if (oldMemoryRate !== newMemoryRate) {
      this.setState({
        memoryRateSort: this.transferQuerySort(newMemoryRate),
      })
    }
    if (oldCreationTime !== newCreationTime) {
      this.setState({
        creationTimeSort: this.transferQuerySort(newCreationTime),
      })
    }
  }

  transferQuerySort = str => {
    return str === 'desc'
  }

  getInstanceList = query => {
    const { getInstances, location, userID, history } = this.props
    const {
      currentSearchType, searchValue,
    } = this.state
    query = Object.assign({}, location.query, { [currentSearchType]: searchValue }, query)
    if (currentSearchType === 'name') {
      delete query.creator
    }
    if (currentSearchType === 'creator') {
      delete query.name
    }
    if (searchValue === '') {
      delete query[currentSearchType]
    }
    if (query.page === 1) {
      delete query.page
    }
    location.query = getQueryKey(query)
    if (!isEqual(query, location.query)) {
      history.push(`${location.pathname}?${toQuerystring(query)}`)
    }
    getInstances(UNUSED_CLUSTER_ID, mergeQuery(userID, query))
  }

  tableChange = (pagination, filters, sorter) => {
    console.log(filters, sorter)
    this.setState({
      page: pagination.current,
    }, this.getInstanceList)
  }

  radioChange = e => {
    this.setState({
      radioValue: e.target.value,
    })
  }

  handleButtonClick = row => {
    const { history } = this.props
    history.push(`/csb-instances-available/${row.id}`)
  }

  stopConfirm = () => {
    confirm({
      modalTitle: '停止 CSB 实例',
      title: '停止后，不能使用实例发布或订阅服务，重新启动后不影响实例中\n' +
      '已发布或已订阅的服务。',
      content: '确定是否停止该实例？',
      onOk: () => {

      },
    })
  }

  deleteConfirm = () => {
    const { deleteInstance } = this.props
    const { currentInstance } = this.state
    confirm({
      modalTitle: '放弃使用 CSB 实例',
      title: '放弃使用后将不能在此实例中发布、订阅服务；已发布的服务将被\n' +
      '注销，已订购的服务将被退订。',
      content: `确定是否放弃使用 ${currentInstance.name} 实例？`,
      onOk: () => {
        return new Promise((resolve, reject) => {
          deleteInstance(currentInstance.clusterId, currentInstance.id).then(res => {
            if (res.error) {
              return reject()
            }
            resolve()
            this.getInstanceList()
          })
        })
      },
    })
  }

  handleMenuClick = (e, row) => {
    switch (e.key) {
      case 'stop':
        this.stopConfirm()
        break
      case 'edit':
        this.setState({
          createModal: true,
          currentInstance: row,
        })
        break
      case 'delete':
        this.setState({
          currentInstance: row,
        }, this.deleteConfirm)
        break
      default:
        break
    }
  }

  openCreateModal = () => {
    this.setState({
      createModal: true,
    })
  }

  closeCreateModal = () => {
    this.setState({
      createModal: false,
      currentInstance: null,
    })
  }

  render() {
    const {
      radioValue, createModal, currentInstance, searchValue,
      currentSearchType,
    } = this.state
    const { omInstances, userID, namespace, location } = this.props
    const { totalElements, isFetching, content, size } = omInstances
    const { query } = location
    const pagination = {
      simple: true,
      total: totalElements,
      pageSize: size,
      current: parseInt(query.page) || 1,
      onChange: page => this.getInstanceList({ page }),
    }
    const columns = [
      { title: 'CSB实例', dataIndex: 'name' },
      { title: '创建人', dataIndex: 'creator.name' },
      { title: '部署集群', dataIndex: 'clusterId' },
      { title: '状态', dataIndex: 'status',
        filters: [{
          text: '运行中',
          value: 'running',
        }, {
          text: '正在启动',
          value: 'starting',
        }, {
          text: '已停止',
          value: 'stop',
        }],
        render: text => (text ? text : '-'),
      },
      {
        title: '累计调用量',
        dataIndex: 'transferNum',
        sorter: (a, b) => a.transferNum - b.transferNum,
        render: text => (text ? text : '-'),
      },
      {
        title: 'CPU利用率',
        dataIndex: 'cpuRate',
        sorter: (a, b) => a.cpuRate - b.cpuRate,
        render: text => (text ? text : '-'),
      },
      {
        title: 'CPU利用率',
        dataIndex: 'memoryRate',
        sorter: (a, b) => a.memoryRate - b.memoryRate,
        render: text => (text ? text : '-'),
      },
      {
        title: '创建时间',
        dataIndex: 'creationTime',
        sorter: (a, b) => a.creationTime - b.creationTime,
        render: text => formatDate(text),
      },
      { title: '操作',
        render: (text, row) => {
          const menu = (
            <Menu onClick={e => this.handleMenuClick(e, row)} style={{ width: 110 }}>
              {/* <Menu.Item key="stop">停止</Menu.Item>*/}
              <Menu.Item key="edit">修改实例</Menu.Item>
              <Menu.Item key="delete">删除</Menu.Item>
            </Menu>
          )
          return (
            <Dropdown.Button onClick={() => this.handleButtonClick(row)} overlay={menu}>
              实例详情
            </Dropdown.Button>
          )
        },
      },
    ]
    const selectBefore = (
      <Select defaultValue="creator" style={{ width: 90 }} onSelect={currentSearchType => this.setState({ currentSearchType })}>
        <Option value="creator">创建人</Option>
        <Option value="name">实例名称</Option>
      </Select>
    )
    return (
      <QueueAnim className="csb-om">
        {
          createModal &&
          <CreateModal
            callback={this.getInstanceList}
            userId={userID}
            namespace={namespace}
            visible={createModal}
            currentInstance={currentInstance}
            closeCreateModal={this.closeCreateModal}
          />
        }
        <div className="csb-om-radio" key="radios">
          实例状态：
          <RadioGroup onChange={this.radioChange} value={radioValue}>
            <Radio value={false}>全部实例</Radio>
            <Radio value={true}>待启动</Radio>
          </RadioGroup>
        </div>
        <div className="layout-content-btns" key="btns">
          <Button type="primary" onClick={this.openCreateModal}><Icon type="plus"/>创建实例</Button>
          <Button type="primary" onClick={() => this.getInstanceList()}><Icon type="sync" /> 刷新</Button>
          <SearchInput
            addonBefore={selectBefore}
            placeholder="请输入关键字搜索"
            style={{ width: 280 }}
            value={searchValue}
            onChange={e => this.setState({ searchValue: e.target.value })}
            onSearch={value => this.getInstanceList({ [currentSearchType]: value, page: 1 })}
          />
          {
            totalElements ?
              <div className="page-box">
                <span className="total">共计 {totalElements} 条</span>
                <Pagination {...pagination}/>
              </div>
              : null
          }
        </div>
        <div className="layout-content-body" key="body">
          <Table
            className="csb-om-table"
            columns={columns}
            dataSource={content}
            pagination={false}
            onChange={this.tableChange}
            loading={isFetching}
            rowKey={row => row.id}
          />
        </div>
      </QueueAnim>
    )
  }
}

const mapStateToProps = (state, props) => {
  const { current } = state
  const { user } = current
  const { info } = user
  const { userID, namespace } = info
  const { location } = props
  location.query = parseQuerystring(location.search)
  return {
    location,
    namespace,
    userID,
    omInstances: omInstancesSlt(state, props),
  }
}

export default connect(mapStateToProps, {
  getInstances,
  deleteInstance,
})(CSBInstanceOm)
