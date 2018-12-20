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
import { Button, Input, Table, notification, Tooltip, Icon } from 'antd'
import confirm from '../../../../../components/Modal/confirm'
import {
  delInstanceManualRules,
} from '../../../../../actions/msa'
import {
  MSA_TYPE_MAN,
  MSA_TYPE_AUTO,
  MSA_TYPES_TEXT,
} from '../../../../../constants'
import {
  toQuerystring, formatDate,
} from '../../../../../common/utils'
import './style/index.less'
import { withNamespaces } from 'react-i18next'

const Search = Input.Search

@withNamespaces('MsaList')
class MsaDetailList extends React.Component {
  state = {
    keyword: '',
  }

  removeRegister = record => {
    const { t, delInstanceManualRules, clusterID, loadMsaDetail, instances } = this.props
    confirm({
      modalTitle: t('detail.MsaDetailList.removeRegisterTitle'),
      title: t('detail.MsaDetailList.removeRegisterContent', {
        replace: {
          name: record.instanceId,
        },
      }),
      content: instances.length > 1 ? '' : <div style={{ color: 'red' }}> <Icon type="exclamation-circle-o" /> {t('detail.MsaDetailList.onlyHint')}</div>,
      onOk() {
        return new Promise((resolve, reject) => {
          delInstanceManualRules(clusterID, record.id).then(res => {
            if (res.error) {
              return reject()
            }
            notification.success({
              message: t('detail.MsaDetailList.removeSucc'),
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
    const { t, instances, loadMsaDetail, msaDetail, loading } = this.props
    const { keyword } = this.state
    const instancesData = instances.filter(instance => instance.instanceId.indexOf(keyword) > -1)
    const pagination = {
      simple: true,
    }
    const columns = [{
      title: t('detail.MsaDetailList.instanceId'),
      dataIndex: 'instanceId',
      width: '25%',
    }, {
      title: t('detail.MsaDetailList.status'),
      dataIndex: 'status',
      width: '10%',
    }, {
      title: t('detail.MsaDetailList.addr'),
      dataIndex: 'ip',
      width: '15%',
    }, {
      title: t('detail.MsaDetailList.port'),
      dataIndex: 'port',
      width: '10%',
    }, {
      title: t('detail.MsaDetailList.type'),
      dataIndex: 'type',
      width: '10%',
      render: () => MSA_TYPES_TEXT[msaDetail.type],
    }, {
      title: t('detail.MsaDetailList.lastHeartbeatAt'),
      dataIndex: 'lastHeartbeatAt',
      width: '15%',
      render: time => formatDate(time),
    }, {
      title: t('detail.MsaDetailList.opera'),
      width: '15%',
      render: record => {
        return (
          <div>
            {
              msaDetail.type === MSA_TYPE_MAN ?
                <Button onClick={this.removeRegister.bind(this, record)}>
                  {t('detail.MsaDetailList.removeRegister')}
                </Button>
                :
                '-'
            }
          </div>
        )
      },
    }]
    const isMsaAutomatic = msaDetail.type === MSA_TYPE_AUTO
    return (
      <div className="msa-detail-list">
        <div className="layout-content-btns">
          <Tooltip title={isMsaAutomatic && t('detail.MsaDetailList.autoRegister')}>
            <Button
              type="primary"
              icon="plus"
              onClick={this.addInstances}
              disabled={isMsaAutomatic}
            >
              {t('detail.MsaDetailList.add')}
            </Button>
          </Tooltip>
          <Button icon="sync" onClick={loadMsaDetail}>
            {t('detail.MsaDetailList.reflesh')}
          </Button>
          <Search
            className="msa-detail-list-search"
            placeholder={t('detail.MsaDetailList.searchPlaceholder')}
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
  delInstanceManualRules,
})(MsaDetailList)
