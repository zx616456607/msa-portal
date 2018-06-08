/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2018 TenxCloud. All Rights Reserved.
 */

/**
 * Groups of auth zones
 *
 * @author zhaoyb
 * @date 2018-06-06
 */

import React from 'react'
import { connect } from 'react-redux'
import { Button, Table, Input, Menu, Dropdown, Modal, Form, notification } from 'antd'
import { DEFAULT_PAGESIZE } from '../../../../../../constants/index'
import './style/index.less'
import classNames from 'classnames'
import { formatDate } from '../../../../../../common/utils'
import { createGroup, getGroupList, deleteGroup, updateGroup } from '../../../../../../actions/certification'
import GroupsDetailDock from './Dock'

const Search = Input.Search
const FormItem = Form.Item

class Groups extends React.Component {

  state = {
    groupInfo: {},
    editData: {},
    editGroup: false,
    visible: false,
    inputValue: '',
    groupsDetailVisible: false,
  }

  componentDidMount() {
    this.loadGroupList()
  }

  loadGroupList = () => {
    const { inputValue } = this.state
    const { getGroupList } = this.props
    const queryInfo = {}
    if (inputValue) {
      Object.assign(queryInfo, {
        filter: `displayName=\"${inputValue}\"`,
      })
    }
    getGroupList(queryInfo)
  }

  handleAddGroup = () => {
    this.setState({
      visible: true,
      editGroup: false,
    })
  }

  handleMenu = (e, record) => {
    switch (e.key) {
      case 'groupName':
        return
      case 'del':
        this.handleDeleteGroup(record.id)
        return
      default:
        break
    }
  }

  handleDeleteGroup = id => {
    const { deleteGroup } = this.props
    deleteGroup(id).then(res => {
      if (res.error) {
        notification.warn({
          message: `${id}删除失败`,
        })
        return
      }
      notification.success({
        message: `${id}删除成功`,
      })
      this.loadGroupList()
    })
  }

  handlEditGroup = record => {
    this.setState({
      visible: true,
      editGroup: true,
      editData: record,
    })
  }

  handleOk = () => {
    const { editGroup, editData } = this.state
    const { createGroup, updateGroup, form } = this.props
    const { validateFields } = form
    validateFields(async (err, value) => {
      if (err) {
        return
      }
      const body = {
        displayName: value.groupName,
        description: value.desc,
      }
      let result
      if (editGroup) {
        const query = {
          id: editData.id,
          match: editData.meta.version,
        }
        result = await updateGroup(query, body)
      } else {
        result = await createGroup(body)
      }
      if (result.error) {
        notification.warn({
          message: editGroup ? `${value.groupName}组更新失败` : `${value.groupName}组添加失败`,
        })
        return
      }
      this.setState({
        visible: false,
      })
      notification.success({
        message: editGroup ? `${value.groupName}组更新成功` : `${value.groupName}组添加成功`,
      })
      this.loadGroupList()
    })
  }

  handleCancel = () => {
    this.setState({
      visible: false,
    })
  }

  handleDetail = record => {
    this.setState({
      groupInfo: record,
      groupsDetailVisible: true,
    })
  }

  render() {
    const { dataList, form, isFetching } = this.props
    const { getFieldDecorator } = form
    const { resources, totalResults } = dataList
    const pagination = {
      simple: true,
      total: totalResults || 0,
      pageSize: DEFAULT_PAGESIZE,
      // onChange: current => this.setState({ current }, this.loadGroupList),
    }
    const columns = [
      {
        id: 'id',
        title: '组名',
        key: 'displayName',
        dataIndex: 'displayName',
        render: (text, record) => <a onClick={() => this.handleDetail(record)}>{text}</a>,
      },
      {
        title: '用户（个）',
        dataIndex: 'members',
        key: 'members',
        width: '10%',
        render: text => <div>{text.length}</div>,
      },
      {
        title: '授权范围',
        dataIndex: 'approvals',
        key: 'approvals',
        width: '10%',
      },
      {
        title: '描述',
        dataIndex: 'description',
        key: 'description',
        width: '15%',
      },
      {
        title: '创建时间',
        dataIndex: 'meta.created',
        key: 'meta.created',
        render: time => formatDate(time),
      },
      {
        title: '操作',
        width: '15%',
        render: record => {
          const menu = (
            <Menu style={{ width: 90 }} onClick={e => this.handleMenu(e, record)}>
              <Menu.Item key="groupName">管理组用户</Menu.Item>
              <Menu.Item key="del">删除</Menu.Item>
            </Menu>
          )
          return (
            <Dropdown.Button overlay={menu} onClick={() => this.handlEditGroup(record)}>
              编辑
            </Dropdown.Button>
          )
        },
      },
    ]
    const formItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 16 },
    }
    const { editData, editGroup, groupInfo, groupsDetailVisible } = this.state
    return (
      <div className="zone-groups">
        <div className="layout-content-btns" key="btns">
          <Button icon="plus" type="primary" onClick={this.handleAddGroup}>添加组</Button>
          <Button icon="reload" onClick={this.loadGroupList}>刷新</Button>
          <Search
            placeholder="请输入组名搜索"
            style={{ width: 200 }}
            onChange={e => this.setState({ inputValue: e.target.value })}
            onSearch={this.loadGroupList}
          />
          <div className={classNames('page-box', { hide: !totalResults })}>
            <span className="total">共 {totalResults} 条</span>
          </div>
        </div>
        <div className="layout-content-body" key="body">
          <Table
            columns={columns}
            pagination={pagination}
            loading={isFetching}
            dataSource={resources || []}
            rowKey={key => key.id} />
        </div>
        {
          groupsDetailVisible &&
          <GroupsDetailDock
            groupInfo={groupInfo}
            visible={groupsDetailVisible}
            onVisibleChange={visible => this.setState({ groupsDetailVisible: visible })}
          />
        }
        <Modal
          title={`${editGroup ? '编辑组' : '添加组'}`}
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <FormItem {...formItemLayout} label="组名称">
            {
              getFieldDecorator('groupName', {
                initialValue: editGroup ? editData.displayName : '',
              })(
                <Input placeholder="请输入组名称" />
              )
            }
          </FormItem>
          <FormItem {...formItemLayout} label="描述">
            {
              getFieldDecorator('desc', {
                initialValue: editGroup ? editData.description : '',
              })(
                <Input placeholder="请输入描述" />
              )
            }
          </FormItem>
        </Modal>
      </div>
    )
  }
}

const mapStateToProps = state => {
  const { certification } = state
  const { zoneGroups } = certification
  const { data, isFetching } = zoneGroups
  const dataList = data || []
  return {
    dataList,
    isFetching,
  }
}

export default connect(mapStateToProps, {
  createGroup,
  updateGroup,
  deleteGroup,
  getGroupList,
})(Form.create()(Groups))

