/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * MsaList
 *
 * 2017-09-12
 * @author zhangxuan
 */
import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import QueueAnim from 'rc-queue-anim'
import {
  Button, Icon, Input, Table, Card, notification, Tooltip,
  Dropdown, Menu, Badge, Tabs, Radio,
} from 'antd'
import {
  getMsaList,
  getRpcList,
  searchRpcList,
  delManualrules,
  addExpulsionsManualrules,
  delExpulsionsManualrules,
} from '../../../actions/msa'
import { getZkhost } from '../../../actions/globalConfig'
import {
  msaListSlt,
} from '../../../selectors/msa'
import {
  MSA_TYPE_MAN,
  MSA_TYPE_AUTO,
  MSA_TYPES_TEXT,
} from '../../../constants'
import confirm from '../../../components/Modal/confirm'
import { toQuerystring, formatDate } from '../../../common/utils'
import './style/msaList.less'
import { withNamespaces } from 'react-i18next'

const Search = Input.Search
const DropdownButton = Dropdown.Button
const MenuItem = Menu.Item
const TabPane = Tabs.TabPane
const RadioButton = Radio.Button
const RadioGroup = Radio.Group

@withNamespaces('MsaList')
class MsaList extends React.Component {
  state = {
    keyword: '',
    classify: 'providersSet',
    hasZkhost: false,
  }

  componentDidMount() {
    this.loadMsaList()
  }

  registerMsa = () => {
    this.props.history.push('/msa-manage/register')
  }

  loadMsaList = () => {
    const { getMsaList, clusterID } = this.props
    getMsaList(clusterID)
  }

  hideService = record => {
    const { addExpulsionsManualrules, clusterID, t } = this.props
    const self = this
    confirm({
      className: 'msa-list-hide',
      title: t('list.confirmHideService', {
        replace: {
          appName: record.appName,
        },
      }),
      content: '',
      onOk() {
        return new Promise((resolve, reject) => {
          const body = [{
            appName: record.appName,
          }]
          addExpulsionsManualrules(clusterID, body).then(res => {
            if (res.error) {
              return reject()
            }
            // 1s timeout for backend
            setTimeout(() => {
              resolve()
              notification.success({
                message: t('list.addExpulsionsManualrulesSucc'),
              })
              self.loadMsaList()
            }, 3000)
          })
        })
      },
    })
  }

  cancelHideService = record => {
    const { delExpulsionsManualrules, clusterID, t } = this.props
    const self = this
    confirm({
      title: t('list.confirmShowApp', {
        replace: {
          appName: record.appName,
        },
      }),
      content: '',
      onOk() {
        return new Promise((resolve, reject) => {
          delExpulsionsManualrules(clusterID, record.id).then(res => {
            if (res.error) {
              return reject()
            }
            // 1s timeout for backend
            setTimeout(() => {
              resolve()
              notification.success({
                message: t('list.delExpulsionsManualrulesSucc'),
              })
              self.loadMsaList()
            }, 3000)
          })
        })
      },
    })
  }

  removeRegister = record => {
    const { delManualrules, clusterID, t } = this.props
    const ruleIds = record.id
    const self = this
    confirm({
      modalTitle: t('list.removeRegisterTitle'),
      title: t('list.confirmRemoveRegister', {
        replace: {
          appName: record.appName,
        },
      }),
      className: 'removeRegisterConfirm',
      // content: record.instances.length > 1 ? '' : <div className="hint"> <Icon type="exclamation-circle-o" /> 服务中唯一实例移除后，服务也将移除</div>,
      onOk() {
        return new Promise((resolve, reject) => {
          delManualrules(clusterID, ruleIds).then(res => {
            if (res.error) {
              return reject()
            }
            resolve()
            notification.success({
              message: t('list.removeRegisterSucc'),
            })
            self.loadMsaList()
          })
        })
      },
    })
  }

  handleMenuClick = (record, { key }) => {
    if (key === 'add') {
      const query = {
        mode: 'add',
        id: record.id,
        appName: record.appName,
      }
      this.props.history.push(`/msa-manage/register?${toQuerystring(query)}`)
    }
  }

  // rpc related
  classify = e => {
    this.setState({
      classify: e.target.value,
    })
  }
  toggleTab = key => {

    if (key === 'RPC') {
      const { getRpcList, getZkhost, clusterID, rpcList } = this.props
      if (!rpcList.providersSet) {
        getZkhost(clusterID).then(res => {
          if (res.response.result.code === 200) {
            this.setState({
              hasZkhost: true,
            })
            getRpcList(clusterID, { side: 'provider' })// 参数side传什么，后台都会全部返回
          }
        })
      }

    }
  }
  rpcSearch = val => {
    const testIpAndPort = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\:([0-9]|[1-9]\d{1,3}|[1-5]\d{4}|6[0-5]{2}[0-3][0-5])$/
    const testIp = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])/
    let searchVal = 'serviceName'
    if (testIp.test(val) || testIpAndPort.test(val)) {
      searchVal = 'ip'
    }
    this.props.searchRpcList({ [searchVal]: val }, this.state.classify)
  }
  rpcReload = () => {
    if (this.state.hasZkhost) {
      const { getRpcList, clusterID } = this.props
      getRpcList(clusterID, { side: 'provider' })
    }
  }
  render() {
    const { msaList, msaListLoading, rpcList, rpcLoading, t } = this.props
    const { keyword } = this.state
    const msaData = msaList.filter(msa => msa.appName.indexOf(keyword) > -1)
    const restColumns = [
      {
        title: t('list.appName'),
        dataIndex: 'appName',
        width: '20%',
        render: (text, record) => {
          if (record.discoverable) {
            return <Link to={`/msa-manage/detail/${text}`}>{text}</Link>
          }
          return (
            <Tooltip title={t('list.noFound')}>
              <span>{text}</span>
            </Tooltip>
          )
        },
      }, {
        title: t('list.upSum'),
        dataIndex: 'upSum',
        width: '20%',
        render: (text, record) => `${text}/${record.instances.length}`,
      }, {
        title: t('list.type'),
        dataIndex: 'type',
        width: '20%',
        render: text => MSA_TYPES_TEXT[text],
      }, {
        title: t('list.discoverable'),
        dataIndex: 'discoverable',
        width: '20%',
        render: text =>
          <span>
            <Badge
              status={text ? 'success' : 'default'}
              text={text ? t('list.discover') : t('list.cover')}
            />
          </span>,
      }, {
        title: t('list.oprea'),
        width: '20%',
        render: record => {
          const isMsaAutomatic = record.type === MSA_TYPE_AUTO
          const isShow = !record.id || (record.id && record.deletedAt)
          const isHide = record.id && !record.deletedAt
          const menu = (
            <Menu onClick={this.handleMenuClick.bind(this, record)} style={{ width: 103 }}>
              <MenuItem key="add" disabled={isMsaAutomatic}>
                <Tooltip title={isMsaAutomatic && t('list.isMsaAutomatic')}>
                  {t('list.add')}
                </Tooltip>
              </MenuItem>
            </Menu>
          )
          return (
            <div>
              {
                isMsaAutomatic && isShow && (
                  <DropdownButton
                    overlay={menu}
                    onClick={this.hideService.bind(this, record)}
                  >
                    {t('list.hideService')}
                  </DropdownButton>
                )
              }
              {
                isMsaAutomatic && isHide && (
                  <DropdownButton
                    overlay={menu}
                    onClick={this.cancelHideService.bind(this, record)}
                  >
                    {t('list.cancelHideService')}
                  </DropdownButton>
                )
              }
              {
                record.type === MSA_TYPE_MAN &&
                <DropdownButton
                  overlay={menu}
                  onClick={this.removeRegister.bind(this, record)}
                >
                  {t('list.removeRegister')}
                </DropdownButton>
              }
            </div>
          )
        },
      },
    ]
    const rpcColumns = [
      {
        title: t('list.serviceName'),
        dataIndex: 'serviceName',
      }, {
        title: t('list.version'),
        dataIndex: 'version',
      }, {
        title: t('list.side'),
        dataIndex: 'side',
      }, {
        title: t('list.group'),
        dataIndex: 'group',
      }, {
        title: t('list.ip'),
        dataIndex: 'ip',
      }, {
        title: t('list.creationTime'),
        dataIndex: 'creationTime',
        render: time => formatDate(time),
      },
    ]
    /* const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows)
      },
      getCheckboxProps: record => ({
        disabled: record.name === 'Disabled User',
      }),
    } */
    const pagination = {
      simple: true,
    }
    return (
      <QueueAnim className="msa">
        <Tabs type="card" animated onChange={this.toggleTab}>
          <TabPane tab={t('list.restService')} key="REST">
            <div className="msa-btn-box layout-content-btns" key="btns">
              <Button type="primary" onClick={this.registerMsa}><Icon type="plus" />{t('list.registerMsa')}</Button>
              {/* <Button icon="poweroff">注销微服务</Button> */}
              <Button icon="sync" onClick={() => this.loadMsaList()}>{t('list.reflesh')}</Button>
              <Search
                className="msa-search"
                placeholder={t('list.searchPlaceholder')}
                onSearch={keyword => this.setState({ keyword })}
              />
              <span className="float-right msa-btn-box-total">{t('list.total', {
                replace: {
                  total: msaData.length,
                },
              })}</span>
            </div>
            <div className="layout-content-body" key="body">
              <Card>
                <Table
                  className="msa-table"
                  pagination={pagination}
                  // rowSelection={rowSelection}
                  columns={restColumns}
                  dataSource={msaData}
                  loading={msaListLoading}
                  rowKey={row => row.appName}
                />
              </Card>
            </div>

          </TabPane>
          <TabPane tab={t('list.rpc')} key="RPC">
            <div className="msa-option">
              <div className="msa-classify">
                <div className="title">{t('list.classify')}</div>
                <RadioGroup onChange={this.classify} defaultValue="providersSet">
                  <RadioButton value="providersSet">{t('list.provider')}</RadioButton>
                  <RadioButton value="consumersSet">{t('list.customer')}</RadioButton>
                </RadioGroup>
              </div>
              <span className="float-right msa-btn-box-total">{t('list.total', {
                replace: {
                  total: rpcList[this.state.classify] ? rpcList[this.state.classify].length : 0,
                },
              })}</span>
            </div>
            <Card>
              <div className="msa-rpc-table-filter">
                <Button type="primary" onClick={this.rpcReload}>{t('list.reflesh')}</Button>
                <Input.Search
                  placeholder={t('list.searchByName')}
                  onSearch={this.rpcSearch}
                />
              </div>
              <Table
                className="msa-rpc-table"
                columns={rpcColumns}
                loading={rpcLoading}
                dataSource={rpcList[this.state.classify]}
                rowKey={row => row.timestamp}
                pagination={{
                  simple: true,
                }}
              />
            </Card>
          </TabPane>
        </Tabs>
      </QueueAnim>
    )
  }
}

const mapStateToProps = state => {
  const { current, msa } = state
  const { id } = current.config.cluster

  const { rpcList } = msa

  return {
    clusterID: id,
    ...msaListSlt(state),
    rpcList: rpcList || {},
    rpcLoading: rpcList.isFetching || false,
  }
}

export default connect(mapStateToProps, {
  getMsaList,
  getRpcList,
  getZkhost,
  searchRpcList,
  delManualrules,
  addExpulsionsManualrules,
  delExpulsionsManualrules,
})(MsaList)
