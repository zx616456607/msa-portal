import React from 'react'
import { Button, Input, Pagination, Table, Card, Spin, Tooltip, Icon } from 'antd'
import { connect } from 'react-redux'
import Ellipsis from '@tenx-ui/ellipsis'
import { getDistributeList, getChildTranscation } from '../../../actions/msa'
import { formatDate } from '../../../common/utils';
import './style/DistributedList.less'

const Search = Input.Search

@connect(state => {
  const { current, msa } = state
  const { cluster } = current.config
  const { distributeList, childTranscation } = msa
  const clusterID = cluster.id
  return {
    clusterID,
    distributeList,
    childTranscation,
  }
}, {
  getDistributeList,
  getChildTranscation,
})
class DistributedList extends React.Component {
  state = {
    columns: [
      {
        title: <span>
          <span style={{ marginRight: 8 }}>父事务名称</span>
          <Tooltip title="事务发起者方法名">
            <Icon type="question-circle-o"/>
          </Tooltip>
        </span>,
        dataIndex: 'methodName',
        width: 200,
      },
      {
        title: '父事务别名',
        dataIndex: 'txName',
        width: 200,
      },
      {
        title: '子事务数量',
        dataIndex: 'detailCount',
        sorter: (a, b) => a.detailCount - b.detailCount,
        width: 200,
      },
      {
        title: '超时时间(ms)',
        dataIndex: 'timeout',
        render: text => text || '-',
        width: 200,
      },
      {
        title: '首次运行时间',
        dataIndex: 'firstRunTime',
        render: text => formatDate(text),
        sorter: (a, b) => a.firstRunTime - b.firstRunTime,
        defaultSortOrder: 'descend',
        width: 200,
      },
      {
        title: '最新运行时间',
        dataIndex: 'newRunTime',
        render: text => formatDate(text),
        sorter: (a, b) => a.newRunTime - b.newRunTime,
        width: 200,
      },
    ],
    page: 1,
    size: 20,
    txName: '',
  }
  componentDidMount() {
    this.getData()
  }
  getData = () => {
    const { page, size, txName } = this.state
    const { clusterID, getDistributeList } = this.props
    const query = { page, size, txName }
    getDistributeList(clusterID, query)
  }
  changePage = (page, size) => {
    this.setState({
      page,
      size,
    }, () => {
      this.getData()
    })
  }
  expandedRow = () => {
    const { childTranscation } = this.props
    const { isFetching, data } = childTranscation
    // console.log(childTranscation);
    if (isFetching) {
      return <div className="spinning">
        <Spin/>
      </div>
    }
    if (data) {
      return <div className="child-transcation">
        <div className="record child-transcation-content">
          <div className="title">该事务执行记录</div>
          <ul className="content">
            <li className="successCount">成功 {data.successCount} 个</li>
            <li className="failCount">回滚 {data.failCount} 个</li>
          </ul>
        </div>
        <div className="name child-transcation-content">
          <div className="title">子事务别名（方法名）</div>
          <ul className="content">
            {
              data.transLogDetails.map(v => <li className="tx-name">
                <Ellipsis>
                  {v.txName}
                </Ellipsis>
                <span className="method-name">
                  (
                  <Ellipsis>
                    <span>
                      {v.methodName}
                    </span>
                  </Ellipsis>
                  )
                </span>
              </li>)
            }
          </ul>
        </div>
      </div>
    }
  }
  onExpand = (expended, record) => {
    if (expended) {
      const { txName } = record
      const { clusterID, getChildTranscation } = this.props
      getChildTranscation(clusterID, txName);
    }
  }
  render() {
    const { columns, page, size } = this.state
    const { distributeList } = this.props
    return <div className="distributed-list">
      <div className="top">
        <div className="top-left">
          <Button icon="sync" onClick={this.getData}>刷新</Button>
          <Search
            style={{ width: 200 }}
            placeholder="请输入父事务别名搜索"
            onChange={e => {
              this.setState({
                txName: e.target.value,
              })
            }}
            onSearch={() => this.getData()}
          />
        </div>
        <div className="top-right">
          <Pagination
            simple
            current={page}
            onChange={this.changePage}
            pageSize={size}
            total={distributeList.count || 0}/>
        </div>
      </div>

      <Card>
        <Table
          columns={columns}
          loading={distributeList.isFetching}
          expandedRowRender={record => this.expandedRow(record)}
          onExpand={(expended, record) => { this.onExpand(expended, record) }}
          dataSource={distributeList.data || []}
          pagination={false}
        />
      </Card>
    </div>
  }
}

export default DistributedList