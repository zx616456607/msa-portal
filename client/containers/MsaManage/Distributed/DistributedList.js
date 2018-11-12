import React from 'react'
import { Button, Input, Pagination, Table, Card } from 'antd'
import { connect } from 'react-redux'
import { getDistributedList } from '../../../actions/msa'
import './style/DistributedList.less'
const Search = Input.Search

@connect(state => {
  return state
}, {
  getDistributedList,
})
class DistributedList extends React.Component {
  state = {
    columns: [
      {
        title: '父事务方法名',
        dataIndex: 'name',
      },
      {
        title: '父事务别名',
        dataIndex: 'txName',
      },
      {
        title: '子事务数量',
        dataIndex: 'subNum',
      },
      {
        title: '超时时间(ms)',
        dataIndex: 'overTime',
      },
      {
        title: '首次运行时间',
        dataIndex: 'startTime',
      },
      {
        title: '最新运行时间',
        dataIndex: 'endTime',
      },
      {
        title: '操作',
        dataIndex: 'option',
      },
    ],
    page: 1,
    size: 10,
  }
  changePage = () => {
    // console.log(page, size);
  }
  render() {
    const { columns, page, size } = this.state
    return <div className="distributed-list">
      <div className="top">
        <div className="top-left">
          <Button icon="sync">刷新</Button>
          <Search
            style={{ width: 200 }}
            placeholder="请输入事务名称搜索"
          />
        </div>
        <div className="top-right">
          <Pagination
            simple
            current={page}
            onChange={this.changePage}
            pageSize={size}
            total={5}/>
        </div>
      </div>
      <Card>
        <Table
          columns={columns}
        />
      </Card>
    </div>
  }
}

export default DistributedList
