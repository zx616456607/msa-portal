import React from 'react'
import { Card } from 'antd'
import { connect } from 'react-redux'
import TenxIcon from '@tenx-ui/icon'
import ReturnButton from '@tenx-ui/return-button'
import { getDubboDetail } from '../../../actions/dubbo'

@connect(state => {
  const { dubbo } = state
  const { dubboDetail } = dubbo
  return { dubboDetail }
}, {
  getDubboDetail,
})
class DubboDetail extends React.Component {
  componentDidMount() {
    const { getDubboDetail, match } = this.props
    getDubboDetail(match.params.id)
  }
  render() {
    const { dubboDetail } = this.props
    return <div className="dubbo-detail">
      <div className="top">
        <ReturnButton onClick={() => this.props.history.push('/dubbo/dubbo-manage')}>返回</ReturnButton>
      </div>
      <Card>
        <div className="top-left">
          <div className="icon">
            <TenxIcon type="apps-o"/>
          </div>
          <div className="dubbo-info">
            <h2 className="name">{dubboDetail.serviceName}</h2>
            <div className="version">{dubboDetail.version}</div>
            <div className="version">{dubboDetail.version}</div>
          </div>
        </div>

      </Card>
      detail
    </div>
  }
}

export default DubboDetail
