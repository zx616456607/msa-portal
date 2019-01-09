import React from 'react'
import { Card, Tabs, Table, Button, Input } from 'antd'
import { connect } from 'react-redux'
import DubboIcon from '../../../assets/img/dubbo/dubbo.png'
import ReturnButton from '@tenx-ui/return-button'
import Ellipsis from '@tenx-ui/ellipsis'
import { getDubboDetail, getSupplierList, getConsumerList, searchConsumerOrProvider } from '../../../actions/dubbo'
import InstanceDetailDock from './InstanceDetail/Dock'
import './style/DubboDetail.less'

const TabPane = Tabs.TabPane
const Search = Input.Search;
@connect(state => {
  const { dubbo } = state
  const { cluster } = state.current.config
  const { dubboDetail, supplierList, consumerList } = dubbo
  return { dubboDetail,
    supplierList,
    consumerList,
    clusterId: cluster.id }
}, {
  getDubboDetail,
  getSupplierList,
  getConsumerList,
  searchConsumerOrProvider,
})
class DubboDetail extends React.Component {
  state = {
    dubboInstanceDetailVisible: false,
    currentInstance: '',
    columns: [
      {
        dataIndex: 'podName',
        title: '容器实例名',
        width: 200,
        render: (text, row) => {
          return <div className="container-name">
            <Ellipsis>
              <span className="container-name-inner" onClick={() => {
                this.setState({
                  dubboInstanceDetailVisible: true,
                  currentInstance: row,
                })
              }}>{text}</span>
            </Ellipsis>
          </div>
        },
      },
      {
        dataIndex: 'podIp',
        title: '容器实例地址',
        width: 300,
        render: text => {
          return <div className="container-address">
            <Ellipsis>{text}</Ellipsis>
          </div>
        },
      },
      {
        dataIndex: 'serviceName',
        title: '所属服务',
      },
      {
        dataIndex: 'serviceAddress',
        title: '服务地址',
        render: text => <div className="service-address">
          <Ellipsis>{text}</Ellipsis>
        </div>,
      },
    ],
    defaultDetailData: {},
  }
  componentDidMount() {
    const { getDubboDetail, match, clusterId } = this.props
    const { name, groupVersion } = match.params

    getDubboDetail(clusterId, name, groupVersion).then(res => {
      if (res.response) {
        this.setState({
          defaultDetailData: JSON.parse(JSON.stringify(res.response.result.data)),
        })
      }
    })
  }
  onClose = () => {
    this.setState({ visible: false })
  }
  serviceStatus = status => {
    if (!status) return
    if (status.consumers === 0 && status.providers === 0) {
      return <span>无提供者 及 消费者</span>
    }
    if (status.consumers === 0) {
      return <span>无消费者</span>
    }
    if (status.providers === 0) {
      return <span>无提供者</span>
    }
    return <span>提供者、消费者均有</span>
  }
  search = (type, value) => {
    const defaultDetailData = JSON.parse(JSON.stringify(this.state.defaultDetailData))
    const { searchConsumerOrProvider } = this.props
    if (value === '') {
      searchConsumerOrProvider(type, value, defaultDetailData)
    }
    searchConsumerOrProvider(type, value)

  }
  render() {
    const { dubboDetail, clusterId } = this.props
    const { dubboInstanceDetailVisible, currentInstance } = this.state
    return dubboDetail.data && <div className="dubbo-detail">
      <div className="top">
        <ReturnButton onClick={() => this.props.history.push('/dubbo/dubbo-manage')}>返回</ReturnButton>
        <span className="title">{dubboDetail.data.name} 服务详情</span>
      </div>
      <Card className="base-info-wrapper">
        <div className="icon">
          <img src={DubboIcon} alt=""/>
        </div>
        <div className="right">
          <h2>{dubboDetail.data.name}</h2>
          <div className="base-info">
            <div>
              <div className="version">服务版本: {dubboDetail.data.groupVersion && dubboDetail.data.groupVersion.split(':')[1]}</div>
              <div className="status">服务状态: {this.serviceStatus(dubboDetail.data.status)}</div>
            </div>
            <div className="belong">所属应用: {dubboDetail.data.applications && dubboDetail.data.applications.join(',') || '无'}</div>
            <div className="group">所属分组: {dubboDetail.data.groupVersion && dubboDetail.data.groupVersion.split(':')[0]}</div>
          </div>
        </div>
      </Card>
      <Card className="dubbo-detail-tabs">
        <Tabs>
          <TabPane tab="提供者" key="supplier">
            <div className="table-operation">
              <Button icon="sync">刷新</Button>
              <Search
                style={{ width: 200 }}
                onSearch={val => this.search('providers', val)}
                onChange={e => this.search('providers', e.target.value)}
                placeholder="请按容器实例名搜索"/>
            </div>
            <Table
              columns={this.state.columns}
              pagination={false}
              dataSource={dubboDetail.data.providers || []}
              locale={{ emptyText: '该服务无提供者' }}
            />
          </TabPane>
          <TabPane tab="消费者" key="consumer">
            <div className="table-operation">
              <Button icon="sync">刷新</Button>
              <Search
                onSearch={val => this.search('consumers', val)}
                onChange={e => this.search('consumers', e.target.value)}
                style={{ width: 200 }}
                placeholder="请按容器实例名搜索"/>
            </div>
            <Table
              columns={this.state.columns}
              pagination={false}
              dataSource={dubboDetail.data.consumers || []}
              locale={{ emptyText: '该服务无消费者' }}
            />
          </TabPane>
        </Tabs>
      </Card>

      {dubboInstanceDetailVisible && <InstanceDetailDock
        detail={currentInstance}
        callback={this.handerConfirm}
        visible={dubboInstanceDetailVisible}
        clusterId={clusterId}
        onVisibleChange={visible => this.setState({ dubboInstanceDetailVisible: visible })}
      />}

    </div>
  }
}

export default DubboDetail
