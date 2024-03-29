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
  Select, Input, Button, InputNumber,
  Card, Table, Form, Col, Row, Badge,
} from 'antd'
import QueueAnim from 'rc-queue-anim'
import { DEFAULT, DEFAULT_PAGE, DEFAULT_TIME_FORMAT } from '../../../constants/index'
import cloneDeep from 'lodash/cloneDeep'
import './style/index.less'
import isEmpty from 'lodash/isEmpty'
import { formatDate } from '../../../common/utils'
import { Chart, Geom, Axis, G2, Tooltip } from 'bizcharts'
import {
  getZipkinTracesList, getZipkinServices, getZipkinSpans,
} from '../../../actions/callLinkTrack'
import ApmTimePicker from '../../../components/ApmTimePicker'
import moment from 'moment'
import { withNamespaces } from 'react-i18next'

const FormItem = Form.Item
const Option = Select.Option
const colorMap = {
  success: G2.Global.colors['#2db7f5'],
  error: G2.Global.colors[7],
}

@withNamespaces('callLinkTracking')
class CallLinkTracking extends React.Component {

  state = {
    isFliter: false,
    spanList: [],
    filterList: [],
    rangeDateTime: [],
    filterSuccess: '',
    current: DEFAULT_PAGE,
  }

  btnArr = [{
    key: 'fiveMin',
    text: this.props.t('index.last5min'),
  }, {
    key: 'thirty',
    text: this.props.t('index.last30Min'),
  }, {
    key: 'anHour',
    text: this.props.t('index.last1Hour'),
  }]

  componentDidMount() {
    const { clusterID, getZipkinServices } = this.props
    getZipkinServices(clusterID)
    this.load()
  }

  load = () => {
    const { rangeDateTime } = this.state
    const { clusterID, getZipkinTracesList } = this.props
    const time = new Date().getTime()
    const five = Date.parse(new Date(new Date() - 300 * 1000))
    const query = {
      endTs: rangeDateTime.length > 0 ? Date.parse(formatDate(rangeDateTime[1])) : time,
      lookback: rangeDateTime.length > 0 ? rangeDateTime[1] - rangeDateTime[0] : time - five,
    }
    getZipkinTracesList(clusterID, query)
  }

  handleSearch = () => {
    const { form, clusterID, getZipkinTracesList } = this.props
    const { validateFields } = form
    const { rangeDateTime } = this.state
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
          endTs: Date.parse(formatDate(rangeDateTime[1])),
          minDuration: value.minDuration ? value.minDuration * 1000 : undefined,
          limit: value.limit,
          lookback: rangeDateTime[1] - rangeDateTime[0],
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
    const { t } = this.props
    data.forEach(item => {
      const columns = {
        gender: 'female',
        continent: item.success ? 'success' : 'error',
        traceId: item.traceId,
        success: item.success ? t('index.success') : t('index.fail'),
        serviceName: item.serviceName,
        duration: item.duration / 1000,
        startTime: `${formatDate(item.startTime)}`, // item.startTime
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
    const time = new Date().getTime()
    const fiveMin = 5 * 60 * 1000
    const five = Date.parse(new Date(new Date() - fiveMin))

    const query = {
      endTs: time,
      lookback: time - five,
    }
    this.setState({
      rangeDateTime: [ moment(time - fiveMin), moment(new Date().getTime()) ],
      resetTime: true,
      currentRadio: this.btnArr[0].key,
    }, () => this.setState({ resetTime: false })
    )
    getZipkinTracesList(clusterID, query)
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
      spanList, isFliter, filterList, rangeDateTime, resetTime } = this.state
    const { history, form, dataList, isFetching, servicesList, t } = this.props
    const { getFieldDecorator } = form
    const cols = {
      traceId: {
        alias: 'TraceID',
      },
      serviceName: {
        alias: t('index.msName'),
      },
      success: {
        alias: t('index.status'),
      },
      duration: {
        alias: t('index.callAllTime'),
        tickCount: 3,
      },
      startTime: {
        alias: t('index.startTime'),
        // type: 'timeCat',
        mask: DEFAULT_TIME_FORMAT,
        tickCount: 5,
      },
    }
    const columns = [{
      title: 'Trace ID',
      dataIndex: 'traceId',
      width: '13%',
      render: id => <Link to={`/msa-manage/call-link-tracking/${id}`}>{id}</Link>,
    }, {
      title: t('index.msName'),
      dataIndex: 'spans',
      width: '15%',
      render: keys => this.filterSpans(keys),
    }, {
      title: t('index.status'),
      dataIndex: 'success',
      width: '10%',
      filterMultiple: false,
      filters: [{
        text: t('index.success'), value: true,
      }, {
        text: t('index.fail'), value: false,
      }],
      render: status => <div className={status ? 'success-status' : 'error-status'}>
        <Badge status={status ? 'success' : 'error'} />
        {status ? t('index.success') : t('index.fail')}
      </div>,
    }, {
      title: t('index.allSpan'),
      dataIndex: 'spanCount',
      width: '10%',
      sorter: (a, b) => a.spanCount - b.spanCount,
    }, {
      title: t('index.allTime'),
      width: '13%',
      dataIndex: 'duration',
      sorter: (a, b) => a.duration - b.duration,
      render: text => <div>{text / 1000}</div>,
    }, {
      title: t('index.startTime'),
      width: '15%',
      dataIndex: 'startTime',
      sorter: (a, b) => a.startTime - b.startTime,
      render: time => formatDate(time),
    }, {
      title: t('index.action'),
      width: '10%',
      render: record => <Button
        type={'primary'}
        onClick={() => history.push(`/msa-manage/call-link-tracking/${record.traceId}`)}
      >
        {t('index.lookDetail')}
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
                    placeholder={t('index.chooseMS')}
                    className="select-style"
                    showSearch={true}
                  >
                    <Option value="all">{t('index.allService')}</Option>
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
                  <Select placeholder={t('index.sltSpan')}
                    className="select-style"
                    showSearch={true}>
                    <Option value="all">{t('index.allSpan')}</Option>
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
                  <InputNumber min={1} max={900} placeholder={t('index.rtnItems10')} className="resCount" />
                )}
              </FormItem>
            </Col>
            <Col span={5}>
              <FormItem>
                {getFieldDecorator('minDuration', {})(
                  <InputNumber min={1} max={3600000} placeholder={t('index.timeMSLarge')} className="input-style" />
                )}
              </FormItem>
            </Col>
            <Col span={4}>
              <FormItem>
                {getFieldDecorator('traceId', {
                  rules: [
                    {
                      validator: (rule, value, cb) => {
                        const reg = /[g-zA-Z\x21-\x2f\x3a-\x40\x5b-\x60\x7B-\x7F\u4e00-\u9fa5]/g
                        if (value && reg.test(value)) cb(t('index.only16Str'))
                        if (value && value.length > 32) cb(t('index.lth32max'))
                        cb()
                      },
                    },
                  ],

                })(
                  <div>
                    <Input placeholder={t('index.traceOtherUseless')} className="trace" />
                  </div>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <ApmTimePicker
                value={rangeDateTime}
                resetTime={resetTime}
                onChange={rangeDateTime => this.setState({ rangeDateTime })}
                timeArr={this.btnArr}
              />
            </Col>
            <Col>
              <Button type={'primary'} icon={'search'} className="search"
                onClick={() => this.handleSearch()}>{t('index.search')}</Button>
              <Button type={'primary'} icon={'rollback'}
                onClick={() => this.handleReset()}>{t('index.reset')}</Button>
              {
                dataList && <span className="total">{
                  t('index.allElements', {
                    replace: {
                      allElements: isFliter ? filterList.length : dataList.length || 0,
                    },
                  })
                }</span>
              }
            </Col>
          </Row>
        </div>
        <div className="chart" key="chart">
          <Chart height="225" padding={{ top: 40, right: '4%', bottom: '25%', left: '4%' }}
            scale={cols} data={isFliter ?
              this.fliterChartData(filterList) : this.fliterChartData(dataList)} forceFit>
            <Tooltip crosshairs={{ type: 'cross' }} />
            {/* <View data={isFliter ? filterList : this.fliterChartData(dataList)}> */}
            <Axis name="startTime" />
            <Axis name="duration" label={{ formatter: val => `${parseInt(val)}` }}/>
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
          <div className="kaing">{t('index.timeMs')}</div>
          <div className="sTime">{t('index.bronTime')}</div>
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
