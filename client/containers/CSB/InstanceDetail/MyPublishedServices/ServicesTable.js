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
import ServiceDetailDock from '../ServiceDetail/Dock'
import {
  Dropdown, Menu, Table, Notification,
} from 'antd'
import { formatDate } from '../../../../common/utils'
import BlackAndWhiteListModal from './BlackAndWhiteListModal'
import confirm from '../../../../components/Modal/confirm'
import { PutInstanceService, delInstanceService } from '../../../../actions/CSB/instanceService'

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

  handleCreateModalValues = values => {
    console.log('values=', values)
  }

  handleSaveBlackAndWhiteList = values => {
    console.log('values=', values)
  }

  openBlackAndWhiteListModal = record => {
    this.setState({
      serviceId: record.id,
      blackAndWhiteListModalVisible: true,
      confirmLoading: false,
    })
  }

  renderHandleServiceDropdown = record => {
    const menu = <Menu style={{ width: 100 }}
      onClick={this.serviceMenuClick.bind(this, record)}
    >
      <Menu.Item key="edit">编辑</Menu.Item>
      {
        record.status === 2 ? <Menu.Item key="start">启动</Menu.Item> :
          <Menu.Item key="stop">停止</Menu.Item>
      }
      <Menu.Item key="list">黑／白名单</Menu.Item>
      <Menu.Item key="logout">注销</Menu.Item>
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

  renderServiceStatusUI = status => {
    let className = ''
    let desc = ''
    switch (status) {
      case 1:
        desc = '已激活'
        className = 'activated'
        break
      case 2:
        desc = '已停用'
        className = 'deactivated'
        break
      case 4:
        desc = '已注销'
        className = 'cancelled'
        break
      default:
        break
    }
    return <span className={className}><div className="status-icon"></div>{desc}</span>
  }

  searchWithServiceName = value => {
    console.log('value=', value)
  }

  serviceMenuClick = (record, item) => {
    const { key } = item
    const { history } = this.props
    if (key === 'list') {
      return this.openBlackAndWhiteListModal(record)
    }
    if (key === 'edit') {
      return history.push(`/csb-instances-available/63/publish-service?id=${record.id}&model=edit`)
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

  serviceOperation = (record, type) => {
    const { loadData, match, PutInstanceService, delInstanceService } = this.props
    const { instanceID } = match.params
    const { body, title, content, modalTitle } = this.serviceModals(record, type)
    const self = this
    confirm({
      title,
      content,
      modalTitle,
      onOk() {
        if (type === 'logout') {
          delInstanceService(instanceID, record.id).then(res => {
            if (res.error) {
              Notification.error({
                message: self.serviceMessages(type, true),
              })
              return
            }
            if (res.response.result.code === 200) {
              Notification.success({
                message: self.serviceMessages(type, false),
              })
              loadData()
            }
          })
          return
        }
        PutInstanceService(instanceID, record.id, body).then(res => {
          if (res.error) {
            Notification.error({
              message: self.serviceMessages(type, true),
            })
            return
          }
          if (res.response.result.code === 200) {
            Notification.success({
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

  render() {
    const { dataSource, loading, from, size, match } = this.props
    const {
      confirmLoading, blackAndWhiteListModalVisible, visible,
      currentRow,
    } = this.state
    let columns = [
      {
        id: 'id',
        title: '服务名',
        dataIndex: 'name',
        key: 'name',
        render: (text, row) => <a onClick={this.viewServiceDetails.bind(this, row)}>
          {text}
        </a>,
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
        render: (text, row) => this.renderServiceStatusUI(row.status),
      },
      {
        title: '待审批订阅',
        dataIndex: 'wait',
        key: 'wait',
        // render: (text, row) => row.
      },
      {
        title: '累计调用量',
        dataIndex: 'num',
        key: 'num',
      },
      {
        title: '平均RT（ms）',
        dataIndex: 'ave',
        key: 'ave',
      },
      {
        title: '发布时间',
        dataIndex: 'time',
        key: 'time',
        render: (text, row) => formatDate(row.publishTime),
      },
      {
        title: '操作',
        dataIndex: 'handle',
        key: 'handle',
        render: (text, record) => this.renderHandleServiceDropdown(record),
      },
    ]
    const { instanceID } = match.params
    if (from === 'group') {
      const columnsKeys = [ 'name', 'version', 'status', 'wait', 'time', 'handle' ]
      columns = columns.filter(column => columnsKeys.indexOf(column.key) > -1)
      columns.forEach(column => (column.width = `${100 / columns.length}%`))
    }
    const self = this
    return [
      <div key="table">
        <Table
          columns={columns}
          dataSource={dataSource}
          pagination={false}
          loading={loading}
          rowKey={row => row.id}
          size={size}
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
          />
        }
        <ServiceDetailDock
          callback={self.serviceOperation}
          visible={visible}
          onVisibleChange={visible => this.setState({ visible })}
          instanceId={instanceID}
          detail={currentRow}
          renderServiceStatusUI={this.renderServiceStatusUI}
        />
      </div>,
    ]
  }
}

const mapStateToProps = () => {
  return {
    //
  }
}

export default connect(mapStateToProps, {
  delInstanceService,
  PutInstanceService,
})(ServicesTable)
