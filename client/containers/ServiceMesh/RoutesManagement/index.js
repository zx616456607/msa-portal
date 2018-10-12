/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2018 TenxCloud. All Rights Reserved.
 */

/**
 * RoutesManagement container
 *
 * 2018-10-10
 * @author zhouhaitao
 */

import React from 'react'
import QueueAnim from 'rc-queue-anim'
import { connect } from 'react-redux'
import { Button, Input, Table, Card, Pagination, Dropdown, Menu, notification } from 'antd'
import { loadVirtualServiceList, deleteVirtualService } from '../../../actions/serviceMesh'
import { formatDate } from '../../../common/utils'
import confirm from '../../../components/Modal/confirm'
import './style/index.less'

const Search = Input.Search
const data = [
  {
    "apiVersion": "networking.istio.io/v1alpha3",  // 固定值
    "kind": "VirtualService",  // 固定值
    "metadata": {
        "annotations": {  // 这个是个字符串对字符串的结构，可以按需要存一些东西，也可以干脆就没有这个 key
            "anyKeyYouWant": "anyValue",
            "blablabla": "lalalala"
        },
        "labels": {  // 同 annotations
            "sameAsAnnotations": "what_every_you_want"
        },
        "name": "the_routing_rule_name"  // 名，不能带中文，如果需要中文，这里生成一个名，然后在 annotations 里找个 key 存，具体参考这个 wiki 页面其他创建接口
    },
    "spec": {
        "gateways": [
            "gatewayA",  // 引用哪些 gateway（gateway.metadata.name）
            "gatewayB"
        ],
        "hosts": [
            "service.test.io",  // 服务域名
            "service.debug.io"
        ],
        "http": [
            {  // 情况一（基于请求内容，前缀匹配）
                "match": [{
                    "uri": {
                        "prefix": "/lalala"  // 这是前缀匹配
                    }
                }],
                "route": [{  // 这是数组
                    "destination": {
                        "host": "appGroupA",  // 这是组件 destination.spec.host
                        "subset": "v3"  // 这是组件里的那个版本。就是说如果界面上选多个版本，这个 route 就应该有多个元素，这些元素的 host 相同，是选择的组件，subset 不同，分别对应选中的版本
                    }
                }]
            },
            {  // 情况二（基于请求内容，完全匹配，同情况一）
                "match": [{
                    "uri": {
                        "exact": "/blablabla"  // 注意这个完全匹配的 key 跟前缀匹配的 key 不一样
                    }
                }],
                "route": [{
                    "destination": {
                        "host": "appGroupA",
                        "subset": "v2"
                    }
                }]
            },
            {  // 情况三（基于流量比）
                "route": [{  // 数组，对应同一组件不同版本，然后带个 weight 字段，route 数组内的各个元素的 weight 的加和必须是 100，比如说选了一个组件的 3 个版本，然后平均分，那只能是 33、33、34，不能有小数加和还得是 100
                    "destination": {
                        "host": "appGroupA",
                        "subset": "v1"
                    },
                    "weight": 100
                }]
            }
        ]
    }
}
]

class RoutesManagement extends React.Component {
  state = {
    tempList: [],
    allList: [],
    searchValue: '',
    loading: false,
    currentPage: 0,
  }
  componentDidMount() {
    this.loadData()
  }
  loadData = () => {
    this.setState({
      loading: true,
    }, () => {
      const { loadVirtualServiceList, clusterId } = this.props
      const query = {
        clusterId,
      }
      loadVirtualServiceList(query).then(res => {
        const temp = {
          loading: false,
        }
        if (res.response.result) {
          temp.tempList = Object.values(res.response.result)
          temp.allList = Object.values(res.response.result)
        }
        this.setState(temp)
      })
    })
  }
  filterData = () => {
    const { searchValue } = this.state
    const { allList } = this.state
    const tempList = []
    allList.map(item => {
      if (item.name.indexOf(searchValue) > -1) {
        tempList.push(item)
      }
      return item
    })
    this.setState({
      tempList,
    })
  }
  onClickUpdate = record => {
    this.props.history.push('/service-mesh/routes-management/new-route/' + record.metadata.name)
  }
  onClickDelete = record => {
    const name = record.metadata.name
    const { deleteVirtualService, clusterId } = this.props
    confirm({
      modalTitle: '删除操作',
      title: '删除路由规则后，该路由规则关联的服务仅支持集群内访问，不可对外访问',
      content: `确定删除服务组 ${name} 吗？`,
      onOk: () => {
        return new Promise((resolve, reject) => {
          deleteVirtualService(clusterId, name).then(res => {
            if (res.error) {
              notification.error({
                message: '删除失败',
              })
              return reject()
            }
            resolve()
            notification.success({
              message: '删除路由规则成功',
            })
            this.loadData()
          })
        })
      },
    })
  }
  render() {
    const columns = [
      {
        dataIndex: 'name',
        title: '路由规则名称',
        render: (text, row) => row.metadata.name,
      },
      {
        dataIndex: 'visitType',
        title: '访问方式',
        render: (text, row) => (row.spec.gateways ? '公网' : '仅集群内'),
      },
      {
        dataIndex: 'net',
        title: '网关',
        render: (text, row) => (row.spec.gateways ? (row.spec.gateways.join(' / ')) : '-'),
      },
      {
        dataIndex: 'type',
        title: '路由类型',
        render: (text, row) => {
          let res = '-'
          if (row.spec.http && row.spec.http[0]) {
            if (row.spec.http[0].route) {
              res = '基于请求内容'
            } else if (row.spec.http[0].route[0].weight) {
              res = '基于流量比例'
            }
          }
          return res
        },
      },
      {
        dataIndex: 'plugins',
        title: '组件',
        render: (text, record) => {
          return record.spec.http.map(item => {
            return item.route[0].destination.host
          }).join(' / ')
        },
      },
      {
        dataIndex: 'version',
        title: '作用版本',
        render: (text, record) => {
          return record.spec.http.map(item => {
            return item.route[0].destination.subset
          }).join(' / ')
        },
      },
      {
        dataIndex: 'creationTime',
        title: '创建时间',
        render: (text, row) => formatDate(row.metadata.creationTimestamp),
      },
      {
        dataIndex: 'operation',
        title: '操作',
        render: (text, record) => <div>
          <Dropdown.Button onClick={() => this.onClickUpdate(record)} overlay={
            <Menu onClick={() => this.onClickDelete(record)} style={{ width: 85 }}>
              <Menu.Item key="delete">删除</Menu.Item>
            </Menu>
          }>编辑</Dropdown.Button>
        </div>,
      },
    ]
    const { tempList, searchValue, currentPage } = this.state
    const pagination = {
      defaultCurrent: 1,
      total: tempList.length || 0,
      size: 10,
      current: currentPage,
      onChange: currentPage => this.setState({ currentPage }),
    }
    return <QueueAnim id="routes-management">
      <div className="options-wrapper" key="options-wrapper">
        <div className="left">
          <Button type="primary" icon="plus" onClick={() => this.props.history.push('/service-mesh/routes-management/new-route/3')}>创建路由规则</Button>
          <Button icon="sync" onClick={() => {
            this.setState({ searchValue: '' }); this.loadData()
          }}>刷新</Button>
          <Search
            placeholder="请输入路由名称搜索"
            style={{ width: 200 }}
            value={searchValue}
            onChange={e => this.setState({ searchValue: e.target.value })}
            onSearch={() => this.filterData()}
          />
        </div>
        <div className="right">
          <Pagination simple {...pagination}/>
        </div>
      </div>
      <Card key="table-wrapper">
        <Table
          columns={columns}
          dataSource={tempList}
        />
      </Card>
    </QueueAnim>

  }
}

const mapStateToProps = state => {
  const { current } = state
  return {
    clusterId: current.config.cluster.id,
  }
}

export default connect(mapStateToProps, {
  loadVirtualServiceList,
  deleteVirtualService,
})(RoutesManagement)

