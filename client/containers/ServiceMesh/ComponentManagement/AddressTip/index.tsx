/*
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2018 TenxCloud. All Rights Reserved.
 * ----
 * index.ts page
 *
 * @author zhangtao
 * @date Wednesday October 24th 2018
 */
import * as React from 'react'
import { Popover, Timeline, Spin, Tooltip } from 'antd'
import './styles/index.less'
import TenxIcon from '@tenx-ui/icon/es/_old'
import { connect } from 'react-redux';
import * as serviceMeshActions from '../../../../actions/serviceMesh'
import { getDeepValue } from '../../../../common/utils';
// import { Tooltip } from 'bizcharts';
interface Tipprops {
  dataList: any[];
  componentName: string;
  parentNode: string;
}
interface Tipstate {
  addressList: string[];
  show: boolean;
}

export default class AddressTip extends React.Component<Tipprops, Tipstate> {
  state = {
    addressList: [],
    show: false,
  }
  async componentDidMount() {
    const { dataList = [], componentName } = this.props;
    const addressList = dataList
      .filter(({ metadata }) => metadata.name === componentName)
      .map(({ metadata }) => metadata.annotations && Object.keys(metadata.annotations).
        map(name => name.split('/')[1]))[0]
    this.setState({ addressList })
  }
  showPop = () => {
    const { show } = this.state
    this.setState({
      show: !show
    })
  }
  render() {
    const { addressList } = this.state
    return (
      <div className="AddressTip">
        {
          addressList && addressList.length === 0 ?
            <span>-</span> :
            <Popover
              placement='right'
              content={
                <CTips
                  addressList={this.state.addressList}
                />
              }
              trigger='click'
              onVisibleChange={this.showPop}
              arrowPointAtCenter={true}
            // getTooltipContainer=
            // {(triggerNode) => triggerNode}
            >
              <span className="checkAddress">查看访问地址</span>
            </Popover>
        }
      </div>
    )
  }
}

interface TipProps {
  config: {
    name: string;
    routerAddress?: { address: string, matchType: string, netType: string }[];
    innerAddress: { containerPort: number, domain: string }[];
  };
}
interface TipState {
  copyStatus: boolean;
}
class Tip extends React.Component<TipProps, TipState> {
  state = {
    copyStatus: false,
  }
  copyCode = (e) => {
    let code = document.getElementById('ServiceMeshTipsRouterAddress')
    code.select();
    document.execCommand('Copy', false);
    this.setState({
      copyStatus: true
    });
  }
  startCopyCode = (address) => {
    let code = document.getElementById('ServiceMeshTipsRouterAddress')
    code.value = address;
  }
  returnDefaultTooltip = () => {
    setTimeout(
      () => this.setState({
        copyStatus: false
      }), 500
    )
  }
  render() {
    const { name = '-', routerAddress = [], innerAddress = [] } = this.props.config
    return (
      <div className="Tip">
        <div className="primary">{name}</div>
        <Timeline>
          <Timeline.Item
            dot={<div style={{ height: 5, width: 5, backgroundColor: '#2db7f5', margin: '0 auto' }}>
            </div>}
          >
          </Timeline.Item>
          {
            innerAddress.map(({ containerPort, domain }) =>
              <Timeline.Item dot={<div></div>}>
                <TenxIcon type="branch" className='branchSvg' />
                <span className="primary">
                  {`容器端口:${containerPort} 集群内:${domain}:${containerPort}`}
                  <Tooltip title={this.state.copyStatus === false ? '点击复制' : '复制成功'} >
                    <TenxIcon type="copy"
                      className="marginCopy"
                      onClick={this.copyCode}
                      onMouseEnter={() => this.startCopyCode(`${domain}:${containerPort}`)}
                      onMouseLeave={this.returnDefaultTooltip}
                    />
                  </Tooltip>
                </span>
              </Timeline.Item>)
          }
          <Timeline.Item dot={<div></div>}>
            <TenxIcon type="branch" className='branchSvg' />
            <span className="primary">路由地址</span>
            <div className="primary">
              <div>
                {
                  routerAddress.length !== 0 ?
                    routerAddress.map(({ address, matchType, netType }) =>
                      <div className="routerAddress">
                        {`${netType}:`}
                        {address}
                        <Tooltip title={this.state.copyStatus === false ? '点击复制' : '复制成功'} >
                          <TenxIcon type="copy"
                            className="marginCopy"
                            onClick={this.copyCode}
                            onMouseEnter={() => this.startCopyCode(address)}
                            onMouseLeave={this.returnDefaultTooltip}
                          />
                        </Tooltip>
                        {
                          matchType === 'prefix' &&
                          <Tooltip title='匹配前缀'>
                            <TenxIcon type="match" className="marginCopy" />
                          </Tooltip>
                        }
                      </div>) : <div className="noRouterAddress">未设置路由规则暂无地址</div>
                }
              </div>
            </div>
          </Timeline.Item>
        </Timeline>
        <div className="line"></div>
      </div>
    )
  }
}

interface TipsProps {
  addressList: string[];
  getServiceListServiceMeshStatus:
  (clusterId: string, serviceList: string[], query: any, callback?: any) => any;
  clusterId: string;
}
interface TipsState {
  addressMessage:
  {
    name: string;
    routerAddress?: { address: string, matchType: string }[];
    innerAddress: { containerPort: number, domain: string }[];
  }[] | undefined;
}
function mapStateToProps(state) {
  const { current: { config: { cluster: { id: clusterId = '' } = {} } = {} } = {} } = state
  return { clusterId }
}

class Tips extends React.Component<TipsProps, TipsState> {
  state = {
    addressMessage: undefined,
  }
  async componentDidMount() {
    const { getServiceListServiceMeshStatus, clusterId, addressList } = this.props
    const addressInfo =
      await getServiceListServiceMeshStatus(clusterId, addressList, { withAccessPoints: 'something' })
    const { result = {} } = addressInfo.response
    const addressMessage = Object.entries(result)
      .map(([name, value]) => {
        // 获取内网地址
        const domain = getDeepValue(value, ['metadata', 'labels', 'tenxcloud.com/svcName'])
        const portArray =
          getDeepValue(value, ['spec', 'template', 'spec', 'containers', 0, 'ports']) || []
        const innerAddress = portArray.map(({ containerPort }) => ({ domain, containerPort }))
        const returnMessage = { name, innerAddress }
        // 获取服务网格相关的地址
        if (!value.accessPoints) {
          return returnMessage
        }
        const accessPointsAddress = value.accessPoints
          .map(({ hosts, match }) => {
            const Exact = match.uri.MatchType.Exact;
            const Prefix = match.uri.MatchType.Prefix;
            const netType = (hosts[0].ips || []).length === 0 ? '集群内' : '公网'
            if (Exact) {
              return { address: `${hosts[0].host}${Exact}`, matchType: 'exact', netType }
            }
            if (Prefix) {
              return { address: `${hosts[0].host}${Prefix}`, matchType: 'prefix', netType }
            }
            return {}
          })
        return { ...returnMessage, routerAddress: accessPointsAddress }
      })
    this.setState({ addressMessage })
  }
  render() {
    return (
      <div className="Tips">
        <input id="ServiceMeshTipsRouterAddress"
          style={{ position: 'absolute', opacity: 0 }}
        />
        {this.state.addressMessage === undefined && <Spin />}
        {this.state.addressMessage !== undefined &&
          (this.state.addressMessage || []).map((config) => <Tip config={config} />)
        }
      </div>
    )
  }
}

const CTips = connect(mapStateToProps, {
  getServiceListServiceMeshStatus: serviceMeshActions.getServiceListServiceMeshStatus
})(Tips)

interface ServiceTipprops {
  dataList: any[];
  parentNode: string;
}
interface ServiceTipstate {
  show: boolean;
}
export class ServiceAddressTip extends React.Component<ServiceTipprops, ServiceTipstate> {
  state = {
    show: false,
  }
  showPop = () => {
    const { show } = this.state
    this.setState({
      show: !show
    })
  }
  render() {
    return (
      <div className="AddressTip">
        <Popover
          placement='right'
          content={
            <CTips
              addressList={this.props.dataList}
            />
          }
          trigger='click'
          onVisibleChange={this.showPop}
          arrowPointAtCenter={true}
        // getTooltipContainer=
        // {(triggerNode) => triggerNode}
        >
          <span className="checkAddress">查看访问地址</span>
        </Popover>
      </div>
    )
  }
}