/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * My Published Services Table
 *
 * 2017-12-05
 * @author zhangcz
 */

import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import isEmpty from 'lodash/isEmpty'
import ServiceDetailDock from '../ServiceDetail/Dock'
import { Dropdown, Menu, Table, notification, Tooltip } from 'antd'
import { formatDate, parseOrderToQuery, sleep } from '../../../../common/utils'
import BlackAndWhiteListModal from './BlackAndWhiteListModal'
import confirm from '../../../../components/Modal/confirm'
import { renderCSBInstanceServiceStatus } from '../../../../components/utils'
import {
  PutInstanceService,
  delInstanceService,
  createBlackAndWhiteList,
  editPublishedService,
  getCascadedDetail,
} from '../../../../actions/CSB/instanceService'
import './style/ServiceTable.less'
import TenxIcon from '@tenx-ui/icon/es/_old'

const modalTooptip = [
  {
    modalTitle: '注销',
    title: '注销服务后，不可以对该服务进行变更，启动，停止和订购操作。',
  }, {
    modalTitle: '启动服务',
    title: '您确定要启动这个服务吗？',
  }, {
    modalTitle: '停止服务',
    title: '您确定要停止这个服务吗？',
  }]
const resyltMessages = [
  {
    message: '启动服务失败',
  }, {
    message: '启动服务成功',
  }, {
    message: '停止服务失败',
  }, {
    message: '停止服务成功',
  }, {
    message: '注销服务失败',
  }, {
    message: '注销服务成功',
  },
]

class ServicesTable extends React.Component {
  static propTypes = {
    // 获取列表数据的函数
    loadData: PropTypes.func.isRequired,
    // 列表数据
    dataSource: PropTypes.array,
    // 来源：服务列表或服务组
    from: PropTypes.oneOf([ 'services', 'group' ]),
  }

  static defaultProps = {
    from: 'services',
    currentService: {},
  }

  state = {
    serviceId: '',
    confirmLoading: false,
    visible: false,
    blackAndWhiteListModalVisible: false,
    currentRow: {},
  }

  componentDidMount() {
    const { from, loadData } = this.props
    if (from === 'group') {
      loadData()
    }
  }

  closeblackAndWhiteModal = () => {
    this.setState({
      blackAndWhiteListModalVisible: false,
    })
  }

  handleCreateModalValues = () => { }

  handleSaveBlackAndWhiteList = values => {
    const { createBlackAndWhiteList, instanceID, editPublishedService } = this.props
    const { serviceId } = this.state
    const { blackOrWhite } = values
    this.setState({ confirmLoading: true })
    const keys = Object.keys(values)
    const requestList = []
    keys.forEach(item => {
      if (item.substring(0, 5) === 'white') {
        requestList.push({
          serviceId,
          ipOrNet: values[item],
          blackOrWhite: false,
        })
      }
      if (item.substring(0, 5) === 'black') {
        requestList.push({
          serviceId,
          ipOrNet: values[item],
          blackOrWhite: true,
        })
      }
    })
    createBlackAndWhiteList(instanceID, serviceId, requestList).then(res => {
      if (res.error) { return }
      const body = { blackOrWhite }
      editPublishedService(instanceID, serviceId, body).then(res => {
        this.setState({ confirmLoading: false })
        if (res.error) {
          return
        }
        notification.success({
          message: '修改黑白名单成功',
        })
        const { loadData } = this.props
        loadData()
        this.setState({ blackAndWhiteListModalVisible: false })
      })
    })
  }

  openBlackAndWhiteListModal = record => {
    this.setState({
      serviceId: record.id,
      blackAndWhiteListModalVisible: true,
      confirmLoading: false,
      currentService: record,
    })
  }

  renderHandleServiceDropdown = record => {
    const { cascadedType, status } = record
    const cantUesed = status === 4
    const menu = <Menu style={{ width: 100 }}
      onClick={this.serviceMenuClick.bind(this, record)}
    >
      <Menu.Item key="edit" disabled={cantUesed}>编辑</Menu.Item>
      {
        status === 2
          ? <Menu.Item key="start" disabled={cantUesed}>启动</Menu.Item>
          : <Menu.Item key="stop" disabled={cantUesed}>停止</Menu.Item>
      }
      <Menu.Item key="list" disabled={cantUesed}>黑／白名单</Menu.Item>
      <Menu.Item
        key="logout"
        disabled={
          (!cascadedType && cantUesed) || (cascadedType && ![ 5, 6 ].includes(cascadedType))
        }
      >
        注销
      </Menu.Item>
    </Menu>
    return (
      <Dropdown.Button
        overlay={menu}
        onClick={this.viewServiceDetails.bind(this, record)}
      >
        显示详情
      </Dropdown.Button>
    )
  }

  serviceMenuClick = (record, item) => {
    const { key } = item
    const { match, history } = this.props
    const { instanceID } = match.params
    if (key === 'list') {
      return this.openBlackAndWhiteListModal(record)
    }
    if (key === 'edit') {
      return history.push(`/csb-instances/available/${instanceID}/publish-service?serviceID=${record.id}&isEdit=true`)
    }
    this.serviceOperation(record, key)
  }

  serviceModals = (record, type) => {
    let resultMessage
    switch (type) {
      case 'start':
        resultMessage = {
          body: {
            status: '1',
          },
          title: modalTooptip[1].title,
          content: '',
          modalTitle: modalTooptip[1].modalTitle,
        }
        break
      case 'stop':
        resultMessage = {
          body: {
            status: '2',
          },
          title: modalTooptip[2].title,
          content: '',
          modalTitle: modalTooptip[2].modalTitle,
        }
        break
      case 'logout':
        resultMessage = {
          body: {
            status: '4',
          },
          title: modalTooptip[0].title,
          modalTitle: modalTooptip[0].modalTitle,
          content: `Tips：对于没有被订阅过的服务，注销后不可见。确定注销服务 ${record.name} 吗？`,
        }
        break
      default:
        break
    }
    return resultMessage
  }

  serviceMessages = (type, isError) => {
    let message
    switch (type) {
      case 'start':
        if (isError) {
          message = resyltMessages[0].message
        } else {
          message = resyltMessages[1].message
        }
        return message
      case 'stop':
        if (isError) {
          message = resyltMessages[2].message
        } else {
          message = resyltMessages[3].message
        }
        return message
      case 'logout':
        if (isError) {
          message = resyltMessages[4].message
        } else {
          message = resyltMessages[5].message
        }
        return message
      default:
        return message
    }
  }

  serviceOperation = async (record, type) => {
    const { loadData, match, PutInstanceService, delInstanceService,
      cascadedServicesWebsocket, getCascadedDetail,
    } = this.props
    const { instanceID } = match.params
    if (type === 'list') {
      this.openBlackAndWhiteListModal(record)
      return
    }
    const { body, title, content, modalTitle } = this.serviceModals(record, type)
    const self = this
    confirm({
      title,
      content,
      modalTitle,
      async onOk() {
        if (type === 'logout') {
          if (!record.cascadedType) {
            return delInstanceService(instanceID, record.id).then(res => {
              if (res.error) {
                notification.error({
                  message: self.serviceMessages(type, true),
                })
                return
              }
              if (res.response.result.code === 200) {
                notification.success({
                  message: self.serviceMessages(type, false),
                })
                loadData()
              }
            })
          }
          await getCascadedDetail(record.name, record.version)
          const { cascadedServiceDetail } = self.props
          const body = {
            type: 'conceal',
            cascadedService: {
              id: cascadedServiceDetail.data.id,
            },
          }
          cascadedServicesWebsocket.send('/api/v1/cascaded-services', {}, JSON.stringify(body))
          await sleep(200)
          loadData()
          return
        }
        PutInstanceService(instanceID, record.id, body).then(res => {
          if (res.error) {
            notification.error({
              message: self.serviceMessages(type, true),
            })
            return
          }
          if (res.response.result.code === 200) {
            notification.success({
              message: self.serviceMessages(type, false),
            })
            loadData()
          }
        })
      },
    })
  }

  viewServiceDetails = record => {
    this.setState({
      visible: true,
      currentRow: record,
    })
  }

  handleChange = (pagination, filters, sorter) => {
    const { from, check, groupID, loadData } = this.props
    let cascadedType = filters.cascadedType
    let filtersStr = ''
    let sorterStr = ''
    if (!isEmpty(filters)) {
      const { status } = filters
      if (check) {
        if (status.length < 3 && status.length > 0) {
          filtersStr = status
          if (status > 1) {
            status.forEach(item => {
              filtersStr = {
                status: item,
              }
            })
          }
        }
      }
      filtersStr = status
    }
    if (!isEmpty(sorter)) {
      sorterStr = parseOrderToQuery(sorter)
    }
    if (cascadedType) {
      if (cascadedType.length === 1) {
        if (parseInt(cascadedType[0]) === 1) {
          cascadedType = [ 1, 2, 5, 6, 8 ]
        }
      } else {
        cascadedType = [ 0, 1, 2, 5, 6, 8 ]
      }
    }
    const group = from ? groupID : null
    loadData(group, {
      status: filtersStr,
      sort: sorterStr,
      page: pagination.current,
      cascadedType,
    })
  }

  renderServiceCascadedType = record => {
    const { cascadedType } = record
    const type = parseInt(cascadedType)
    const svgArray = [
      <Tooltip title="接入" placement="top" key="serviceAccess">
        <TenxIcon
          type="access"
          size={14}
          className="serviceAccess"
        />
      </Tooltip>,
      <Tooltip title="接力" placement="top" key="serviceRelay">
        <TenxIcon
          type="ellipsis-circle"
          size={14}
          className="serviceRelay"
        />
      </Tooltip>,
      <Tooltip title="开放" placement="top" key="serviceOut">
        <TenxIcon
          type="way-out"
          size={14}
          className="serviceOut"
        />
      </Tooltip>,
    ]
    switch (type) {
      case 1:
        return [ svgArray[1] ]
      case 2:
        return [ svgArray[2] ]
      case 5:
        return [ svgArray[0], svgArray[1] ]
      case 6:
        return [ ...svgArray ]
      case 8:
        return [ svgArray[1], svgArray[2] ]
      case 0:
      default:
        return null
    }
  }

  render() {
    const { dataSource, pageSize, total, loading, from, match, check, ...otherProps } = this.props
    const {
      confirmLoading, blackAndWhiteListModalVisible, visible,
      currentRow, currentService,
    } = this.state
    let columns = [
      {
        id: 'id',
        title: '服务名',
        dataIndex: 'name',
        key: 'name',
        render: (text, row) => <div>
          <a onClick={this.viewServiceDetails.bind(this, row)}>{text}</a>
          <div>{this.renderServiceCascadedType(row)}</div>
        </div>,
      },
      {
        title: '服务版本',
        dataIndex: 'version',
        key: 'version',
        render: (text, row) => row.version,
      },
      {
        title: '所属服务组',
        dataIndex: 'groupName',
        key: 'groupName',
      },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        filters: check ? [{
          text: '已停用',
          value: '2',
        }, {
          text: '已激活',
          value: '1',
        }, {
          text: '已注销',
          value: '4',
        }] : [{
          text: '已停用',
          value: '2',
        }, {
          text: '已激活',
          value: '1',
        }],
        render: (text, row) => renderCSBInstanceServiceStatus(row.status),
      },
      {
        title: '是否级联',
        dataIndex: 'cascadedType',
        key: 'cascadedType',
        filters: [{
          text: '是',
          value: '1',
        }, {
          text: '否',
          value: '0',
        }],
        render: text => <div>{text ? '是' : '否'}</div>,
      },
      {
        title: '待审批订阅',
        dataIndex: 'waitApprovingCount',
        key: 'waitApprovingCount',
        sorter: true,
        render: text => (text !== undefined ? text : '-'),
      },
      {
        title: '累计调用量',
        dataIndex: 'totalCallCount',
        key: 'totalCallCount',
        render: text => (text !== undefined ? text : '-'),
      },
      {
        title: '平均RT（ms）',
        dataIndex: 'averageCallTime',
        key: 'averageCallTime',
        render: text => (
          text !== undefined
            ? Math.ceil(text * 100) / 100
            : '-'
        ),
      },
      {
        title: '发布时间',
        dataIndex: 'publishTime',
        key: 'publishTime',
        sorter: true,
        render: text => formatDate(text),
      },
      {
        title: '操作',
        dataIndex: 'handle',
        key: 'handle',
        render: (text, record) => this.renderHandleServiceDropdown(record),
      },
    ]
    const { instanceID } = match.params
    let pagination = false
    if (from === 'group') {
      const columnsKeys = [ 'name', 'version', 'status', 'wait', 'time', 'handle' ]
      columns = columns.filter(column => columnsKeys.indexOf(column.key) > -1)
      columns.forEach(column => (column.width = `${100 / columns.length}%`))
      pagination = {
        simple: true,
        hideOnSinglePage: true,
        pageSize,
        total,
      }
    }
    const self = this
    return [
      <div key="table">
        <Table
          className="services-table"
          columns={columns}
          dataSource={dataSource}
          pagination={pagination}
          loading={loading}
          rowKey={row => row.id}
          onChange={this.handleChange}
          {...otherProps}
        />
      </div>,
      <div key="modals">
        {
          blackAndWhiteListModalVisible && <BlackAndWhiteListModal
            instanceId={instanceID}
            serviceId={this.state.serviceId}
            closeblackAndWhiteModal={this.closeblackAndWhiteModal.bind(this)}
            callback={this.handleSaveBlackAndWhiteList}
            loading={confirmLoading}
            currentService={currentService}
          />
        }
        <ServiceDetailDock
          callback={self.serviceOperation}
          visible={visible}
          onVisibleChange={visible => this.setState({ visible })}
          instanceId={instanceID}
          detail={currentRow}
        />
      </div>,
    ]
  }
}

const mapStateToProps = (state, ownProps) => {
  const { CSB } = state
  const { cascadedServicesWebsocket, cascadedServiceDetail } = CSB
  const { match } = ownProps
  const { instanceID } = match.params
  return {
    instanceID,
    cascadedServicesWebsocket,
    cascadedServiceDetail,
  }
}

export default connect(mapStateToProps, {
  delInstanceService,
  PutInstanceService,
  createBlackAndWhiteList,
  editPublishedService,
  getCascadedDetail,
})(ServicesTable)
