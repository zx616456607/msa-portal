/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * MsaDetail-list
 *
 * 2017-09-13
 * @author zhangxuan
 */

import React from 'react'
import { connect } from 'react-redux'
import { Button, Input, Table, notification, Tooltip } from 'antd'
import confirm from '../../../../../components/Modal/confirm'
import {
  delManualrules,
} from '../../../../../actions/msa'
import {
  MSA_TYPE_MAN,
  MSA_TYPE_AUTO,
  MSA_TYPES_TEXT,
} from '../../../../../constants'
import {
  toQuerystring,
} from '../../../../../common/utils'
import './style/index.less'

const Search = Input.Search

class MsaDetailList extends React.Component {
  state = {
    keyword: '',
  }

  removeRegister = record => {
    const { delManualrules, clusterID, loadMsaDetail } = this.props
    confirm({
      title: `确认将实例 ${record.instanceId} 移除注册吗？`,
      content: '',
      onOk() {
        return new Promise((resolve, reject) => {
          delManualrules(clusterID, record.id).then(res => {
            if (res.error) {
              return reject()
            }
            notification.success({
              message: '移除注册成功',
            })
            resolve()
            loadMsaDetail()
          })
        })
      },
    })
  }

  addInstances = () => {
    const { msaDetail, history } = this.props
    const query = {
      mode: 'add',
      id: msaDetail.id,
      appName: msaDetail.appName,
    }
    history.push(`/msa-manage/register?${toQuerystring(query)}`)
  }

  render() {
    const { instances, loadMsaDetail, msaDetail, loading } = this.props
    const { keyword } = this.state
    const instancesData = instances.filter(instance => instance.instanceId.indexOf(keyword) > -1)
    const pagination = {
      simple: true,
    }
    const columns = [{
      title: '微服务实例 ID',
      dataIndex: 'instanceId',
      width: '25%',
    }, {
      title: '实例状态',
      dataIndex: 'status',
      width: '10%',
    }, {
      title: '服务地址',
      dataIndex: 'ip',
      width: '15%',
    }, {
      title: '服务端口',
      dataIndex: 'port',
      width: '10%',
    }, {
      title: '注册类型',
      dataIndex: 'type',
      width: '15%',
      render: () => MSA_TYPES_TEXT[msaDetail.type],
    }, {
      title: '操作',
      width: '15%',
      render: record => {
        return (
          <div>
            {
              msaDetail.type === MSA_TYPE_MAN &&
              <Button onClick={this.removeRegister.bind(this, record)}>
              移除注册
              </Button>
            }
          </div>
        )
      },
    }]
    const isMsaAutomatic = msaDetail.type === MSA_TYPE_AUTO
    return (
      <div className="msa-detail-list">
        <div className="layout-content-btns">
          <Tooltip title={isMsaAutomatic && '自动注册的微服务不支持添加实例'}>
            <Button
              type="primary"
              icon="plus"
              onClick={this.addInstances}
              disabled={isMsaAutomatic}
            >
            添加实例
            </Button>
          </Tooltip>
          <Button icon="sync" onClick={loadMsaDetail}>
          刷新
          </Button>
          <Search
            className="msa-detail-list-search"
            placeholder="按实例 ID 搜索"
            onSearch={keyword => this.setState({ keyword })}
          />
        </div>
        <Table
          className="msa-detail-list-table"
          pagination={pagination}
          columns={columns}
          dataSource={instancesData}
          rowKey={row => row.instanceId}
          loading={loading}
        />
      </div>
    )
  }
}

const mapStateToProps = () => {
  return {}
}

export default connect(mapStateToProps, {
  delManualrules,
})(MsaDetailList)
