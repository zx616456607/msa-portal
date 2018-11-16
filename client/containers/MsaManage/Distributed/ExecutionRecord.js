import React from 'react'
import { Card, Row, Col, Table, Button, Spin, Icon, Input, Tooltip as AntdTooltip, Pagination, Modal } from 'antd'
import { Chart, Geom, Axis, Tooltip, Coord, Legend } from 'bizcharts'
import { connect } from 'react-redux'
import DataSet from '@antv/data-set'
import Ellipsis from '@tenx-ui/ellipsis'
import { formatDate } from '../../../common/utils'
import { getExecuctionRecordOverview, getExecuctionRecordList, getExecuctionRecordDetail } from '../../../actions/msa'
import './style/ExecutionRecord.less'

const Search = Input.Search
const AUTO_FETCH_INTERVAL = 60 * 1000
let autoFetch
@connect(state => {
  const { current, msa } = state
  const { cluster } = current.config
  const { executionRecordOverview, executionRecordList, executionRecordDetail } = msa
  const clusterID = cluster.id
  return {
    clusterID,
    executionRecordOverview,
    executionRecordList,
    executionRecordDetail,
  }
}, {
  getExecuctionRecordOverview,
  getExecuctionRecordList,
  getExecuctionRecordDetail,
})
class ExecutionRecord extends React.Component {
  state = {
    historyRecord: [
      {
        item: '成功事务',
        count: 0,
      },
      {
        item: '回滚事务',
        count: 0,
      }],
    currentRecord: [
      {
        item: '成功事务',
        count: 0,
      },
      {
        item: '回滚事务',
        count: 0,
      }],
    columns: [
      {
        title: '事务记录ID',
        dataIndex: 'groupId',
      },
      {
        title: <span>
          <span style={{ marginRight: 8 }}>父事务名称</span>
          <AntdTooltip title="事务发起者方法名">
            <Icon type="question-circle-o"/>
          </AntdTooltip>
        </span>,
        dataIndex: 'methodName',
      },
      {
        title: '父事务别名',
        dataIndex: 'txName',
      },
      {
        title: '父事务地址',
        dataIndex: 'address',
        render: text => <Ellipsis>{text}</Ellipsis>,
      },
      {
        title: '子事务数量',
        dataIndex: 'detailCount',
      },
      {
        title: '状态',
        dataIndex: 'state',
        render: text => <span className={this.transformStatusClassName(text)}>
          {this.transformStatusText(text)}
        </span>,
      },
      {
        title: '开始时间',
        dataIndex: 'startTime',
        render: text => <span>{formatDate(text)}</span>,
      },
      {
        title: '运行持续时间(ms)',
        dataIndex: 'runTime',
        render: (col, row) => {
          return (row.endTime - row.startTime) < 0 ? '-' : (row.endTime - row.startTime)
        },
        width: 90,
      },
      {
        title: '操作',
        dataIndex: 'operation',
        render: (col, row) => <Button type="primary" onClick={() => this.getRecordDetail(row)} >执行详情</Button>,
        width: 85,
      },
    ],
    detailColumns: [
      {
        title: '子事务方法名',
        dataIndex: 'methodName',
        render: text => this.fixedWidthContent(text),
        width: 100,
      },
      {
        title: '子事务别名',
        dataIndex: 'txName',
        render: text => this.fixedWidthContent(text),
        width: 100,
      },
      {
        title: '子事务服务名',
        dataIndex: 'txName',
        render: text => this.fixedWidthContent(text),
        width: 100,
      },
      {
        title: '子事务地址',
        dataIndex: 'appIpAddress',
        render: text => this.fixedWidthContent(text),
        width: 100,
      },
    ],
    page: 1,
    size: 20,
    txName: '',
    detailVisible: false,
    transactionStatus: '',
  }
  componentDidMount() {
    this.getOverviewData()
    this.getListData()
    autoFetch = setInterval(() => {
      this.getOverviewData()
      this.getListData()
    }, AUTO_FETCH_INTERVAL)
  }
  fixedWidthContent = text => <div className="child-table-fixed-width">
    <Ellipsis>{text}</Ellipsis>
  </div>
  getOverviewData = () => {
    const { getExecuctionRecordOverview, clusterID } = this.props
    getExecuctionRecordOverview(clusterID).then(res => {
      if (!res.error) {
        this.convertOverviewData()
      }
    })
  }
  getListData = () => {
    const { txName, size, page } = this.state
    const { clusterID, getExecuctionRecordList } = this.props
    const query = { txName, size, page }
    getExecuctionRecordList(clusterID, query)
  }
  getRecordDetail = data => {
    const { id, state } = data
    const { clusterID, getExecuctionRecordDetail } = this.props
    this.setState({
      transactionStatus: state,
    })
    getExecuctionRecordDetail(clusterID, id)
    this.setState({ detailVisible: true })
  }
  convertOverviewData = () => {
    const { executionRecordOverview } = this.props
    const { isFetching, data } = executionRecordOverview
    if (!isFetching && Object.keys(data).length !== 0) {
      const history = [
        {
          item: '成功事务',
          count: data.hisSuccess,
        },
        {
          item: '回滚事务',
          count: data.hisFail,
        },
      ]
      const current = [
        {
          item: '成功事务',
          count: data.todaySuccess,
        },
        {
          item: '回滚事务',
          count: data.todayFail,
        },
      ]
      this.setState({
        historyRecord: history,
        currentRecord: current,
      })
    }
  }
  executionChartRender = chartData => {
    let data = []
    data = JSON.parse(JSON.stringify(chartData))
    for (const v of data) {
      v.item = `${v.item}：${v.count}个`
    }
    const { DataView } = DataSet;
    const dv = new DataView();
    const colors = [ 'item', [ '#2abe84', '#f6575e' ]]
    const deviceWidth = document.documentElement.clientWidth
    let paddings = [ 0, 330, 0, 0 ]
    let legendOffsetX = 0
    let legendOffsetY = -70
    if (deviceWidth >= 1200 && deviceWidth <= 1500) {
      paddings = [ 0, 260, 0, 0 ]
      legendOffsetX = 50
      legendOffsetY = -70
    }
    const legendTextStyle = {
      fontSize: '17',
      textAlign: 'left',
    }
    dv.source(data).transform({
      type: 'percent',
      field: 'count',
      dimension: 'item',
      as: 'percent',
    });
    const cols = {
      percent: {
        formatter: val => {
          val = val * 100 + '%';
          return val;
        },
      },
    };
    const noData = data.filter(v => v.count !== 0).length === 0
    return (
      <div>
        {
          noData ?
            <div className="no-data"><Icon type="frown-o" /> 暂无数据</div>
            :
            <Chart
              height={200}
              data={dv}
              scale={cols}
              padding={paddings}
              forceFit
            >
              <Coord type={'theta'} radius={0.65} innerRadius={0.75} />
              <Axis name="percent" />
              <Legend
                position="right"
                marker="square"
                offsetY={legendOffsetY}
                offsetX={legendOffsetX}
                textStyle = { legendTextStyle }
              />
              <Tooltip
                showTitle={false}
                itemTpl="<li><span style=&quot;background-color:{color};&quot; class=&quot;g2-tooltip-marker&quot;></span>{name}</li>"
              />
              <Geom
                type="intervalStack"
                position="percent"
                color={colors}
                tooltip={[
                  'item*percent',
                  (item, percent) => {
                    percent = percent * 100 + '%';
                    return {
                      name: item,
                      value: percent,
                    };
                  },
                ]}
                style={{
                  lineWidth: 1,
                  stroke: '#fff',
                }}
              >
              </Geom>
            </Chart>
        }
      </div>
    )
  }
  transformStatusClassName = text => {
    switch (text) {
      case 1:
        return 'execution-record-status execution-record-success'
      case 0:
        return 'execution-record-status execution-record-failed'
      default:
        return 'execution-record-status execution-record-default'
    }
  }
  transformStatusText = text => {
    switch (text) {
      case 1:
        return '成功'
      case 0:
        return '回滚'
      default:
        return '未知'
    }
  }
  changePage = (page, size) => {
    this.setState({
      page,
      size,
    }, () => {
      this.getListData()
    })
  }
  componentWillUnmount() {
    clearInterval(autoFetch)
  }
  render() {
    const {
      historyRecord,
      currentRecord,
      columns,
      size,
      page,
      detailVisible,
      detailColumns,
      transactionStatus } = this.state
    const { executionRecordOverview, executionRecordList, executionRecordDetail } = this.props
    const { isFetching } = executionRecordOverview
    return <div className="execution-record">
      <div className="overview">
        <div className="title">
          事务执行记录概览  <Button icon="sync" style={{ marginLeft: 16 }} onClick={this.getOverviewData}>刷新</Button>
        </div>
        <Row className="content" gutter={16}>
          <Col span={12}>
            <Card
              className="content-card"
              title="历史事务执行概览"
            >
              {
                isFetching ?
                  <div className="spinning"><Spin/></div>
                  :
                  this.executionChartRender(historyRecord)
              }
            </Card>
          </Col>
          <Col span={12}>
            <Card
              className="content-card"
              title="当天事务执行概览"
            >
              {
                isFetching ?
                  <div className="spinning"><Spin/></div>
                  :
                  this.executionChartRender(currentRecord)
              }
            </Card>
          </Col>
        </Row>
      </div>
      <div className="execution-record">
        <div className="title">
          事务执行记录
        </div>
        <Card>
          <div className="operation">
            <div className="left">
              <Button icon="sync" onClick={this.getListData}>刷新</Button>
              <Search
                placeholder="请输入父事务别名搜索"
                style={{ width: 200 }}
                onChange={e => {
                  this.setState({
                    txName: e.target.value,
                  })
                }}
                onSearch={() => this.getListData()}
              />
            </div>
            <div className="right">
              <span>共计 {executionRecordList.count} 条</span>
              <Pagination
                simple
                current={page}
                onChange={this.changePage}
                pageSize={size}
                total={executionRecordList.count || 0}/>
            </div>
          </div>
          <Table
            columns={columns}
            loading={executionRecordList.isFetching}
            dataSource={executionRecordList.data}
            pagination={false}
          />
        </Card>
      </div>
      <Modal
        title="执行详情"
        visible={detailVisible}
        onCancel={() => this.setState({ detailVisible: false })}
        width={800}
        footer={[
          <Button type="primary" onClick={() => this.setState({ detailVisible: false })}>知道了</Button>,
        ]}
      >
        <div className="execution-record-detail-modal">
          <div className="transaction-status">
            <span style={{ marginRight: 40 }}>事务状态</span>
            <span className={this.transformStatusClassName(transactionStatus)}>
              {this.transformStatusText(transactionStatus)}
            </span>
          </div>
          <Table
            columns={detailColumns}
            loading={executionRecordDetail.isFetching}
            dataSource={executionRecordDetail.data}
            scroll={{ y: 300 }}
            pagination={false}
          />
        </div>
      </Modal>
    </div>
  }
}

export default ExecutionRecord
