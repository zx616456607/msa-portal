import * as React from 'react'
import { Link } from 'react-router-dom'
import { Button, Input, Table, Pagination, Menu, Dropdown, Icon } from 'antd'
import QueueAnim from 'rc-queue-anim'
import './style/apiManage.less'

const Search = Input.Search

interface ApiManageProps {

}

class ApiManage extends React.Component<ApiManageProps> {

  state = {
    keyWord: '',
  }

  onSearch = value => {
    this.setState({
      keyWord: value,
    }, () => {
    })
  }
  onMenuClick = () => {
  }
  onDropdownBtnClick = () => {
  }
  render() {
    const operationMenu = (
      <Menu onClick={this.onMenuClick}>
        <Menu.Item key="stop">停止</Menu.Item>
        <Menu.Item key="edit">
          <Link to="/api-gateway/api-manage-edit">编辑</Link>
        </Menu.Item>
        <Menu.Item key="debug">API调试</Menu.Item>
        <Menu.Item key="release">发布API</Menu.Item>
        <Menu.Item key="offline">下线</Menu.Item>
        <Menu.Item key="delete">删除</Menu.Item>
      </Menu>
    );
    const data = [
      {
        apiName: 'api1',
        apiGroup: 'group1',
        wayOfVisit: 'way1',
        env: '环境1',
        creatTime: '20190564',
        updateTime: '99885465',
      },
    ]
    const columns = [
      {
        title: 'API 名称',
        dataIndex: 'apiName',
        key: 'apiName',
        render: text => <Link to="/api-gateway/api-detail">{text}</Link>,
      },
      {
        title: '所属API组',
        dataIndex: 'apiGroup',
        key: 'apiGroup',
      },
      {
        title: '访问控制方式',
        dataIndex: 'wayOfVisit',
        key: 'wayOfVisit',
      },
      {
        title: '发布环境',
        dataIndex: 'env',
        key: 'env',
      },
      {
        title: '创建时间',
        dataIndex: 'creatTime',
        key: 'creatTime',
      },
      {
        title: '更新时间',
        dataIndex: 'updateTime',
        key: 'updateTime',
      },
      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        render: () => <Dropdown.Button
          overlay={operationMenu}
          onClick={this.onDropdownBtnClick}
        >
          管理
        </Dropdown.Button>,
      },

    ]
    return <QueueAnim className="api-manage">
      <div className="operation-box">
        <div className="left">
          <Link to="/api-gateWay/api-manage-edit">
            <Button icon="plus" type="primary">
              创建 API
            </Button>
          </Link>
          <Button icon="sync">
            刷新
          </Button>
          <Search
            placeholder="请输入 API名称搜索"
            onSearch={this.onSearch}
            style={{ width: 200 }}
          />
        </div>
        <div className="right">
          <span>共计 {50} 条</span>
          <Pagination
            simple
            total={50}
          />
        </div>
      </div>
      <Table
        columns={columns}
        dataSource={data}
        pagination={false}
      />
    </QueueAnim>
  }
}

export default ApiManage
