/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * CallLinkTracking container
 *
 * 2017-09-12
 * @author zhangpc
 */

import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import {
  Select, DatePicker, Input, Button,
  Card, Table, Form, Col, Row, Badge,
} from 'antd'
import QueueAnim from 'rc-queue-anim'
import { DEFAULT, DEFAULT_PAGE } from '../../../constants/index'
import cloneDeep from 'lodash/cloneDeep'
import './style/index.less'
import isEmpty from 'lodash/isEmpty'
import { formatFromnow, formatDate } from '../../../common/utils'
import { Chart, Geom, Axis, G2, Tooltip } from 'bizcharts'
import {
  getZipkinTracesList, getZipkinServices, getZipkinSpans } from '../../../actions/callLinkTrack'

const FormItem = Form.Item
const { RangePicker } = DatePicker
const Option = Select.Option
const ButtonGroup = Button.Group
const colorMap = {
  success: G2.Global.colors['#2db7f5'],
  error: G2.Global.colors[7],
}

class CallLinkTracking extends React.Component {

  state = {
    endTs: '',
    isFliter: false,
    spanList: [],
    filterList: [],
    isTimerShow: true,
    filterSuccess: '',
    btnFive: 'primary',
    btnAnHour: 'default',
    btnHalFhour: 'default',
    current: DEFAULT_PAGE,
  }

  componentDidMount() {
    const { clusterID, getZipkinServices } = this.props
    getZipkinServices(clusterID)
    this.load()
  }

  load = () => {
    const { clusterID, getZipkinTracesList } = this.props
    const time = new Date().getTime() - 5 * 1000 * 60
    const query = {
      endTs: time,
      lookback: new Date().getTime() - time,
    }
    getZipkinTracesList(clusterID, query)
  }

  handleSearch = () => {
    const { form, clusterID, getZipkinTracesList } = this.props
    const { validateFields } = form
    const { endTs } = this.state
    validateFields((error, value) => {
      if (error) return
      let query
      if (value.traceId) {
        query = {
          traceId: value.traceId,
        }
      } else {
        query = {
          serviceName: value.serviceName,
          spanName: value.spanName,
          endTs: endTs ? endTs : value.endTs && value.endTs[1].valueOf(),
          minDuration: value.minDuration * 1000,
          limit: value.limit,
          lookback: value.endTs && value.endTs[1] - value.endTs[0],
        }
        if (value.serviceName === 'all') {
          delete query.serviceName
        }
        if (value.spanName === 'all') {
          delete query.spanName
        }
      }
      getZipkinTracesList(clusterID, query)
    })
  }

  handleServer = value => {
    const { getZipkinSpans, clusterID } = this.props
    const query = {
      serviceName: value,
    }
    getZipkinSpans(clusterID, query).then((res, error) => {
      if (error) return
      this.setState({
        spanList: res.response.result.data,
      })
    })
  }

  fliterChartData = data => {
    if (!data) return
    let dataAry = []
    data.forEach(item => {
      const columns = {
        gender: 'female',
        continent: item.success ? 'success' : 'error',
        traceId: item.traceId,
        success: item.success ? '成功' : '失败',
        serviceName: item.serviceName,
        duration: item.duration / 1000,
        startTime: `${formatDate(item.startTime, 'hh:mm:ss')} pm`, // item.startTime
        spanCount: item.spanCount,
      }
      dataAry.push(columns)
    })
    dataAry = dataAry.sort()
    return dataAry
  }

  handleReset = () => {
    const { clusterID, getZipkinTracesList } = this.props
    this.props.form.resetFields()
    getZipkinTracesList(clusterID)
  }

  handleTimer = () => {
    const { isTimerShow } = this.state
    if (isTimerShow) {
      this.setState({
        isTimerShow: false,
      })
    } else {
      this.setState({
        isTimerShow: true,
      }, () => {
        this.load()
      })
    }
  }

  handleLatelyTimer = key => {
    switch (key) {
      case 'five':
        this.setState({
          btnFive: 'primary',
          btnAnHour: 'default',
          btnHalFhour: 'default',
          endTs: Date.parse(new Date(new Date() - 300 * 1000)),
        })
        break
      case 'halFhour':
        this.setState({
          btnFive: 'default',
          btnAnHour: 'default',
          btnHalFhour: 'primary',
          endTs: Date.parse(new Date(new Date() - 30 * 60 * 1000)),
        })
        break
      case 'anHour':
        this.setState({
          btnFive: 'default',
          btnAnHour: 'primary',
          btnHalFhour: 'default',
          endTs: Date.parse(new Date(new Date() - 60 * 60 * 1000)),
        })
        break
      default:
        break
    }
  }

  tableChange = (pagination, filters) => {
    const { dataList } = this.props
    if (!isEmpty(filters)) {
      if (filters.success.length > 0) {
        const status = filters.success[0].indexOf('false') === 0
        this.setState({
          isFliter: true,
          filterList: dataList.filter(item => item.success !== status),
          filterSuccess: filters.success[0],
        })
      } else {
        this.setState({
          isFliter: false,
        }, () => {
          this.load()
        })
      }
    }
  }

  filterSpans = list => {
    if (!list) return
    return Object.keys(list).map(item => {
      return <div className="serviceName">
        <span className="names">
          {`${item} (${list[item]})`}
        </span>
      </div>
    })
  }

  render() {
    const {
      spanList, isTimerShow, isFliter, filterList, btnFive, btnHalFhour, btnAnHour } = this.state
    const { history, form, dataList, isFetching, servicesList } = this.props
    const { getFieldDecorator } = form
    // const pagination = {
    //   simple: true,
    //   total: 10 || 0,
    //   pageSize: DEFAULT_PAGESIZE,
    //   current,
    //   // onChange: current => this.setState({ current }),
    // }
    const cols = {
      traceId: {
        alias: 'TraceID',
      },
      serviceName: {
        alias: '微服务名称',
      },
      success: {
        alias: '状态',
      },
      duration: {
        alias: '总调用耗时',
        tickCount: 3,
      },
      startTime: {
        alias: '开始时间',
        // type: 'timeCat',
        // mask: 'hh:mm:ss',
        tickCount: 5,
      },
    }
    const columns = [{
      title: 'Trace ID',
      dataIndex: 'traceId',
      width: '13%',
      render: id => <Link to={`/msa-manage/call-link-tracking/${id}`}>{id}</Link>,
    }, {
      title: '微服务名称',
      dataIndex: 'spans',
      width: '15%',
      render: keys => this.filterSpans(keys),
    }, {
      title: '状态',
      dataIndex: 'success',
      width: '10%',
      filters: [{
        text: '成功', value: true,
      }, {
        text: '失败', value: false,
      }],
      render: status => <div className={status ? 'success-status' : 'error-status'}>
        <Badge status={status ? 'success' : 'error'} />
        {status ? '成功' : '失败'}
      </div>,
    }, {
      title: '总span数',
      dataIndex: 'spanCount',
      width: '10%',
      sorter: (a, b) => a.spanCount - b.spanCount,
    }, {
      title: '总耗时数（ms）',
      width: '13%',
      dataIndex: 'duration',
      sorter: (a, b) => a.duration - b.duration,
      render: text => <div>{text / 1000}</div>,
    }, {
      title: '开始时间',
      width: '10%',
      dataIndex: 'startTime',
      sorter: (a, b) => a.startTime - b.startTime,
      render: time => formatFromnow(time),
    }, {
      title: '操作',
      width: '10%',
      render: record => <Button
        type={'primary'}
        onClick={() => history.push(`/msa-manage/call-link-tracking/${record.traceId}`)}
      >
        查看详情
      </Button>,
    }]

    return (
      <QueueAnim className="msa-call-link-tracking">
        <div className="layout-content-btns" key="btns">
          <Row>
            <Col span={5}>
              <FormItem>
                {getFieldDecorator('serviceName', {
                  initialValue: 'all',
                  onChange: e => this.handleServer(e),
                })(
                  <Select
                    placeholder="选择微服务"
                    className="select-style"
                    showSearch={true}
                  >
                    <Option value="all">所有服务</Option>
                    {
                      servicesList && servicesList.map(item => {
                        return <Option key={item}>{item}</Option>
                      })
                    }
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={5}>
              <FormItem>
                {getFieldDecorator('spanName', {
                  initialValue: 'all',
                })(
                  <Select placeholder="选择span"
                    className="select-style"
                    showSearch={true}>
                    <Option value="all">所有span</Option>
                    {
                      spanList.length > 1 && spanList.map(item => {
                        return <Option key={item}>{item}</Option>
                      })
                    }
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={5}>
              <FormItem>
                {getFieldDecorator('limit', {})(
                  <Input placeholder="返回条数" className="resCount" />
                )}
              </FormItem>
            </Col>
            <Col span={5}>
              <FormItem>
                {getFieldDecorator('minDuration', {})(
                  <Input placeholder="耗时（ms）>=" className="input-style" />
                )}
              </FormItem>
            </Col>
            <Col span={4}>
              <FormItem>
                {getFieldDecorator('traceId', {})(
                  <div>
                    <Input placeholder="Trace ID，其他条件设置无效" className="trace" />
                  </div>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={9}>
              <ButtonGroup className="timer" onChange={() => this.handleBtn()}>
                <Button icon="calendar" onClick={() => this.handleTimer()}>
                  自定义日期
                </Button>
                {
                  isTimerShow ?
                    <Row>
                      <Button className="btn" type={btnFive} onClick={() => this.handleLatelyTimer('five')} >最近5分钟</Button>
                      <Button className="btn" type={btnHalFhour} onClick={() => this.handleLatelyTimer('halFhour')}>最近30分钟</Button>
                      <Button className="btn" type={btnAnHour} onClick={() => this.handleLatelyTimer('anHour')}>最近1小时</Button>
                    </Row> :
                    <FormItem>
                      {getFieldDecorator('endTs', {})(
                        <RangePicker
                          style={{ width: 270 }}
                          showTime={{ format: 'HH:mm' }}
                          format="YYYY-MM-DD HH:mm"
                          className="endTs"
                          placeholder={[ '开始时间', '结束时间' ]}
                        />
                      )}
                    </FormItem>
                }
              </ButtonGroup>
            </Col>
            <Col>
              <Button type={'primary'} icon={'search'} className="search"
                onClick={() => this.handleSearch()}>搜索</Button>
              <Button type={'primary'} icon={'rollback'}
                onClick={() => this.handleReset()}>重置</Button>
              {
                dataList && <span className="total">共 {
                  isFliter ? filterList.length : dataList.length || 0} 条</span>
              }
            </Col>
          </Row>
        </div>
        <div className="chart" key="chart">
          <Chart height="225" padding={{ top: 40, right: '4%', bottom: '25%', left: '6%' }}
            scale={cols} data={isFliter ? filterList : this.fliterChartData(dataList)} forceFit>
            <Tooltip crosshairs={{ type: 'cross' }} />
            {/* <View data={isFliter ? filterList : this.fliterChartData(dataList)}> */}
            <Axis name="startTime" />
            <Axis name="duration" />
            <Geom type="point" position="startTime*duration" opacity={0.65}
              shape="circle" size={[ 'spanCount', [ 4, 10 ]]}
              tooltip="traceId*serviceName*success*duration*startTime"
              color={[ 'continent', val => { return colorMap[val] } ]} style={[ 'continent', {
                lineWidth: 1,
                stroke: val => {
                  return colorMap[val]
                },
              }]} />
            {/* </View> */}
          </Chart>
          <div className="kaing">耗时(ms)</div>
          <div className="sTime">产生时间</div>
        </div>
        <div className="layout-content-body" key="body">
          <Card>
            <Table
              pagination={false}
              loading={isFetching}
              dataSource={isFliter ? filterList : dataList}
              columns={columns}
              onChange={this.tableChange}
              rowKey={row => row.traceId}
            />
          </Card>
        </div>
      </QueueAnim>
    )
  }
}

const mapStateToProps = state => {
  const { current, zipkin } = state
  const currentConfig = cloneDeep(current.config)
  const { cluster } = current.config
  const currentUser = current.user.info
  const clusterID = cluster.id
  const { tracesList, servicesList } = zipkin
  const { data, isFetching } = tracesList
  if (currentConfig.project.namespace === DEFAULT) {
    currentConfig.project.namespace = currentUser.namespace
  }
  return {
    currentConfig,
    currentUser,
    clusterID,
    isFetching,
    dataList: data || [],
    servicesList: servicesList.data,
  }
}

export default connect(mapStateToProps, {
  getZipkinSpans,
  getZipkinServices,
  getZipkinTracesList,
})(Form.create()(CallLinkTracking))
