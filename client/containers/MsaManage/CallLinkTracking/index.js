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
  Checkbox, Icon, Select, DatePicker, Input, Button,
  Card, Table, Form, Col, Row, Badge, Tooltip
} from 'antd'
import QueueAnim from 'rc-queue-anim'
import { DEFAULT, DEFAULT_PAGESIZE, DEFAULT_PAGE } from '../../../constants/index'
import cloneDeep from 'lodash/cloneDeep'
import './style/index.less'
import { formatFromnow, formatDate } from '../../../common/utils'
import { Chart, Geom, Axis, G2 } from 'bizcharts'
import { getZipkinTracesList, getZipkinServices, getZipkinSpans } from '../../../actions/callLinkTrack'

const FormItem = Form.Item
const { RangePicker } = DatePicker
const Option = Select.Option
const colorMap = {
  'success': G2.Global.colors[0],
  'error': G2.Global.colors[7],
};

class CallLinkTracking extends React.Component {

  state = {
    checked: false,
    spanList: [],
    current: DEFAULT_PAGE,
  }

  componentDidMount() {
    const { clusterID, getZipkinServices, getZipkinTracesList } = this.props
    getZipkinServices(clusterID)
    getZipkinTracesList(clusterID)
  }

  handleSearch = () => {
    const { form, clusterID, getZipkinTracesList } = this.props
    const { validateFields } = form
    validateFields((error, value) => {
      if (error) return
      let query
      if (value.traceId) {
        query = {
          traceId: value.traceId
        }
      } else {
        query = {
          serviceName: value.serviceName,
          spanName: value.spanName,
          endTs: value.endTs,
          minDuration: value.minDuration,
          limit: value.limit,
          lookback: '',
        }
      }
      getZipkinTracesList(clusterID, query)
    })
  }

  handleServer = (value) => {
    const { getZipkinSpans, clusterID } = this.props
    const query = {
      serviceName: value
    }
    getZipkinSpans(clusterID, query).then((res, error) => {
      if (error) return
      this.setState({
        spanList: res.response.result.data
      })
    })
  }

  fliterChartData = (data) => {
    if (data.length <= 0) return
    let dataAry = []
    data.forEach(item => {
      let columns = {
        gender: "female",
        continent: item.success ? 'success' : 'error',
        traceId: item.traceId,
        success: item.success,
        serviceName: item.serviceName,
        duration: item.duration,
        startTime: formatDate(item.startTime, 'YY-MM-DD hh'),
        spanCount: item.spanCount
      }
      dataAry.push(columns)
    })
    return dataAry
  }

  handleReset = () => {
    this.props.form.resetFields()
  }

  render() {
    const { spanList, checked } = this.state
    const { history, form, dataList, isFetching, servicesList } = this.props
    const { getFieldDecorator } = form
    if(checked) {
      dataList = dataList.filter(val => val.success !== true)
    }
    // const pagination = {
    //   simple: true,
    //   total: 10 || 0,
    //   pageSize: DEFAULT_PAGESIZE,
    //   current,
    //   // onChange: current => this.setState({ current }),
    // }
    const cols = {
      traceId: {
        alias: 'TraceID'
      },
      serviceName: {
        alias: '微服务名称'
      },
      success: {
        alias: '状态'
      },
      duration: {
        alias: '总调用耗时'
      },
      startTime: {
        alias: '产生时间'
      }
    }
    const columns = [{
      title: 'Trace ID',
      dataIndex: 'traceId',
      width: '15%',
      render: id => <Link to={`/msa-manage/call-link-tracking/${id}`}>{id}</Link>,
    }, {
      title: '微服务名称',
      dataIndex: 'serviceName',
      width: '20%',
    }, {
      title: '状态',
      dataIndex: 'success',
      width: '10%',
      render: status => <div className={status ? 'success-status' : 'error-status'}>
        <Badge status={status ? 'success' : 'error'} />
        {status ? '成功' : '失败'}
      </div>,
    }, {
      title: '总span数',
      dataIndex: 'spanCount',
      width: '10%',
    }, {
      title: '总耗时数（ms）',
      width: '10%',
      dataIndex: 'duration',
    }, {
      title: '开始时间',
      width: '10%',
      dataIndex: 'startTime',
      render: time => formatFromnow(time),
    }, {
      title: '操作',
      width: '10%',
      render: (record) => <Button
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
            <Col span={4}>
              <FormItem>
                {getFieldDecorator('serviceName', {
                  initialValue: servicesList && servicesList[0],
                  onChange: (e) => this.handleServer(e),
                })(
                  <Select
                    style={{ width: 200 }}
                    placeholder="选择微服务"
                  >
                    {
                      servicesList && servicesList.map(item => {
                        return <Option key={item}>{item}</Option>
                      })
                    }
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={4}>
              <FormItem>
                {getFieldDecorator('spanName', {
                  ininialValue: spanList.length > 1 && spanList[0],
                })(
                  <Select style={{ width: 200 }} placeholder="选择span">
                    {
                      spanList.length > 1 && spanList.map(item => {
                        return <Option key={item}>{item}</Option>
                      })
                    }
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem>
                {getFieldDecorator('endTs', {})(
                  <RangePicker
                    style={{ width: 400 }}
                    showTime={{ format: 'HH:mm' }}
                    format="YYYY-MM-DD HH:mm"
                    placeholder={['开始时间', '结束时间']}
                  />
                )}
              </FormItem>
            </Col>
            <Col span={4}>
              <FormItem>
                {getFieldDecorator('minDuration', {})(
                  <Input placeholder="耗时（ms）>=" style={{ width: 200 }} />
                )}
              </FormItem>
            </Col>
            <Col span={4}>
              <FormItem>
                {getFieldDecorator('limit', {})(
                  <Input placeholder="返回条数" style={{ width: 250 }} />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={4}>
              <FormItem>
                {getFieldDecorator('traceId', {})(
                  <div>
                    <Input placeholder="Trace ID" style={{ width: 200, marginRight: 10 }} />
                    <Tooltip title="在使用TraceID搜索时，其他条件设置无效。">
                      <Icon type="question-circle-o" />
                    </Tooltip>
                  </div>
                )}
              </FormItem>
            </Col>
            <Col span={6}>
              <Checkbox
                checked={this.state.checked}
                onChange={e => this.setState({ checked: e.target.checked })}
              >
                只查失败
              </Checkbox>
              <Button type={'primary'} icon={'search'} style={{ marginRight: 10 }}
                onClick={() => this.handleSearch()}>搜索</Button>
              <Button type={'primary'} icon={'rollback'}
                onClick={() => this.handleReset()}>重置</Button>
            </Col>
          </Row>
          <div className="page-box">
            <span className="total">共 {dataList &&
              dataList.length} 条</span>
            {/* <Pagination {...pagination} /> */}
          </div>
        </div>
        <div className="chart" key="chart">
          <Chart height="200" data={this.fliterChartData(dataList)} scale={cols} forceFit={true}>
            <Tooltip showTitle={false} crosshairs={{ type: 'cross' }} />
            <Axis name='startTime' />
            <Axis name='spanCount' />
            <Geom active={true} type='point' position="startTime*spanCount" opacity={0.65} shape="circle"
              size={['spanCount', [4, 20]]} tooltip='traceId*serviceName*success*duration*startTime'
              color={['continent', val => { return colorMap[val] }]} style={['continent', {
                lineWidth: 1,
                stroke: val => {
                  return colorMap[val];
                }
              }]} />
          </Chart>
        </div>
        <div className="layout-content-body" key="body">
          <Card>
            <Table
              pagination={false}
              loading={isFetching}
              dataSource={dataList}
              columns={columns}
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
    dataList: data,
    servicesList: servicesList.data,
  }
}

export default connect(mapStateToProps, {
  getZipkinSpans,
  getZipkinServices,
  getZipkinTracesList,
})(Form.create()(CallLinkTracking))
