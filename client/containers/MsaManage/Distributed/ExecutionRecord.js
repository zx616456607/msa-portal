import React from 'react'
import { Card, Row, Col, Table, Button } from 'antd'
import { Chart, Geom, Axis, Tooltip, Coord, Legend } from 'bizcharts'
import DataSet from '@antv/data-set'
import { formatDate } from '../../../common/utils';
import './style/ExecutionRecord.less'
class ExecutionRecord extends React.Component {
  state = {
    historyRecord: [
      {
        item: '成功事务',
        count: 40,
      },
      {
        item: '回滚事务',
        count: 60,
      }],
    currentRecord: [
      {
        item: '成功事务',
        count: 13,
      },
      {
        item: '回滚事务',
        count: 80,
      }],
    columns: [
      {
        title: '事务记录ID',
        dataIndex: 'recordId',
      },
      {
        title: <span>父事务名称</span>,
        dataIndex: 'parentName',
      },
      {
        title: '父事务别名',
        dataIndex: 'parentOtherName',
      },
      {
        title: '父事务地址',
        dataIndex: 'parentAddress',
      },
      {
        title: '子事务数量',
        dataIndex: 'subNum',
      },
      {
        title: '状态',
        dataIndex: 'status',
        render: text => <span className={this.compiledStatusClassName(text)}>{text}</span>,
      },
      {
        title: '开始时间',
        dataIndex: 'startTime',
        render: text => <span>{formatDate(text)}</span>,
      },
      {
        title: '运行持续时间',
        dataIndex: 'runTime',
      },
      {
        title: '操作',
        dataIndex: 'operation',
        render: () => <Button type="primary">执行详情</Button>,
      },
    ],
  }
  executionChartRender = data => {
    for (const v of data) {
      v.item = `${v.item}：${v.count}个`
    }
    const { DataView } = DataSet;
    const dv = new DataView();
    const colors = [ 'item', [ '#2abe84', '#f6575e' ]]
    const deviceWidth = document.documentElement.clientWidth
    let paddings = [ 0, 330, 0, 0 ]
    let legendOffsetX = 0
    let legendOffsetY = -70
    if (deviceWidth >= 1200 && deviceWidth <= 1500) {
      paddings = [ 0, 260, 0, 0 ]
      legendOffsetX = 50
      legendOffsetY = -70
    }
    const legendTextStyle = {
      fontSize: '17',
      textAlign: 'left',
    }
    dv.source(data).transform({
      type: 'percent',
      field: 'count',
      dimension: 'item',
      as: 'percent',
    });
    const cols = {
      percent: {
        formatter: val => {
          val = val * 100 + '%';
          return val;
        },
      },
    };
    return (
      <div>
        <Chart
          height={200}
          data={dv}
          scale={cols}
          padding={paddings}
          forceFit
        >
          <Coord type={'theta'} radius={0.65} innerRadius={0.75} />
          <Axis name="percent" />
          <Legend
            position="right"
            marker="square"
            offsetY={legendOffsetY}
            offsetX={legendOffsetX}
            textStyle = { legendTextStyle }
          />
          <Tooltip
            showTitle={false}
            itemTpl="<li><span style=&quot;background-color:{color};&quot; class=&quot;g2-tooltip-marker&quot;></span>{name}</li>"
          />
          <Geom
            type="intervalStack"
            position="percent"
            color={colors}
            tooltip={[
              'item*percent',
              (item, percent) => {
                percent = percent * 100 + '%';
                return {
                  name: item,
                  value: percent,
                };
              },
            ]}
            style={{
              lineWidth: 1,
              stroke: '#fff',
            }}
          >
          </Geom>
        </Chart>
      </div>
    )
  }
  compiledStatusClassName = text => {
    switch (text) {
      case 0:
        return 'success'
      case 1:
        return 'failed'
      default:
        return 'default'
    }
  }
  render() {
    const { historyRecord, currentRecord, columns } = this.state
    return <div className="execution-record">
      <div className="overview">
        <div className="title">
          事务执行记录概览
        </div>
        <Row className="content" gutter={16}>
          <Col span={12}>
            <Card
              className="content-card"
              title="历史事务执行概览"
            >
              { this.executionChartRender(historyRecord) }
            </Card>
          </Col>
          <Col span={12}>
            <Card
              className="content-card"
              title="当天事务执行概览"
            >
              { this.executionChartRender(currentRecord) }
            </Card>
          </Col>
        </Row>
      </div>
      <div className="execution-record">
        <div className="title">
          事务执行记录
        </div>
        <Card>
          <Table
            columns={columns}
          />
        </Card>
      </div>
    </div>
  }
}

export default ExecutionRecord
