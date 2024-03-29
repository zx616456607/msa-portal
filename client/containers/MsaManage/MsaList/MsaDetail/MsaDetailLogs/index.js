/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * MsaDetailLogs
 *
 * 2017-09-13
 * @author zhangxuan
 */

import React from 'react'
import { connect } from 'react-redux'
import './style/index.less'
import { getMsaLogs } from '../../../../../actions/msa'
import LogTemplate from '../../../../../components/Log'
import { MSA_TYPE_MAN } from '../../../../../constants'
import { withNamespaces } from 'react-i18next'

@withNamespaces('MsaList')
class MsaDetailLogs extends React.Component {

  componentDidMount() {
    this.loadData()
  }

  loadData = (query = {}) => {
    const { getMsaLogs, clusterID, msaDetail } = this.props
    const { appName } = msaDetail
    getMsaLogs(clusterID, appName, query)
  }

  render() {
    const { t, msaLogs, registryType } = this.props
    const { data = {}, isFetching } = msaLogs
    const locale = {
      emptyText: t('detail.MsaDetailLogs.noLogs'),
    };
    if (registryType === MSA_TYPE_MAN) {
      locale.emptyText = t('detail.MsaDetailLogs.errorMessage')
    }
    return (
      <div>
        <LogTemplate
          loadData={this.loadData}
          data={data && data.logs || []}
          isFetching={isFetching}
          locale={locale}
        />
      </div>
    )
  }
}

const mapStateToProps = state => {
  const { msa } = state
  const { msaLogs } = msa
  return {
    msaLogs,
  }
}

export default connect(mapStateToProps, {
  getMsaLogs,
})(MsaDetailLogs)
