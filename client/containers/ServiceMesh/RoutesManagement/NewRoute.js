/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2018 TenxCloud. All Rights Reserved.
 */

/**
 * NewRoute container
 *
 * 2018-10-10
 * @author zhouhaitao
 */

import React from 'react'
import ReturnButton from '@tenx-ui/return-button'
import { Card, Form, Input, Select, Radio, Button, Tag, Icon, Tooltip, Checkbox } from 'antd'
import { connect } from 'react-redux'
import { getMeshGateway } from '../../../actions/meshGateway'
import { loadComponent } from '../../../actions/serviceMesh'
import './style/NewRoute.less'

const FormItem = Form.Item
const Option = Select.Option
const RadioGroup = Radio.Group
const CheckboxGroup = Checkbox.Group
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 2 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 10, push: 1 },
  },
}
const dynamicFormItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 2 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 13, push: 1 },
  },
};
let hostUuid = 1;
let routeUuid = 9999;
let routeConditionUuid = 30000
const mapStateToProps = state => {
  return {
    meshGatewayList: state.meshGateway.meshGatewayList,
    clusterID: state.current && state.current.config.cluster.id,
    componentList: state.serviceMesh.componentList,
  }
}
@connect(mapStateToProps, {
  getMeshGateway,
  loadComponent,
})
class NewRouteComponent extends React.Component {
  state = {
    ruleName: '',
    visitType: 'pub',
    routeType: 'content',
    gateways: [],
    actionVersionOptions: [],
    hosts: [
      {},
    ],
  }
  componentDidMount() {
    const { clusterID, getMeshGateway, loadComponent } = this.props
    getMeshGateway(clusterID)// 获取网关
    loadComponent(clusterID)// 获取组件
  }
  // 表单校验相关
  nameProps = () => {
    const { getFieldDecorator } = this.props.form
    return getFieldDecorator('ruleName', {
      onChange: e => this.setState({ ruleName: e.target.value }),
      rules: [
        { required: true, message: '请输入规则名称' },
      ],
      trigger: 'onChange',
    })
  }
  componentProps = () => {
    const { getFieldDecorator } = this.props.form
    const { componentList } = this.props
    return getFieldDecorator('componentSelected', {
      onChange: val => {
        // 选择组件时，动态设置路由类型 -> 作用版本中选项
        const actionVersionArr = []
        componentList.data.forEach(v => {
          if (v.spec.host === val) {
            for (const k of v.spec.subsets) {
              actionVersionArr.push({
                label: k.name,
                value: k.labels.version,
              })
            }
          }
        })
        this.setState({ actionVersionOptions: actionVersionArr })
      },
      rules: [
        { required: true, message: '请选择组件' },
      ],
      trigger: 'onChange',
    })
  }
  visitTypeProps = () => {
    const { getFieldDecorator } = this.props.form
    return getFieldDecorator('visitType', {
      initialValue: this.state.visitType,
      onChange: e => this.setState({ visitType: e.target.value }),
    })
  }
  gatewayProps = () => {
    const { getFieldDecorator } = this.props.form
    const defaultGateways = [ 'ssz-test23', 'ssz12d' ] // 回显时根据props设置
    return getFieldDecorator('gateways', {
      initialValue: defaultGateways,
      // onChange: e => this.setState({ visitType: e.target.value }),
    })
  }

  // 页面渲染相关
  addItem = (key, thisKey) => {
    const { form } = this.props;
    let keys = form.getFieldValue(key);
    let currentKey = key
    if (key === 'routeConditionkeys') {
      keys = form.getFieldValue(`routeConditionkeys[${thisKey}]`);
      currentKey = `routeConditionkeys[${thisKey}]`
    }
    let uid
    switch (key) {
      case 'hostKeys':
        hostUuid++;
        uid = hostUuid
        break
      case 'routeKeys':
        routeUuid++;
        uid = routeUuid
        break
      case 'routeConditionkeys':
        routeConditionUuid++
        uid = routeConditionUuid
        break
      default:
        break
    }
    const nextKeys = keys.concat(uid);
    form.setFieldsValue({
      [currentKey]: nextKeys,
    });
  }
  removeItem = (k, key) => {
    const { form } = this.props;
    let keys = form.getFieldValue(key);
    let currentKey = key
    if (key === 'routeConditionkeys') {
      keys = form.getFieldValue(`routeConditionkeys[${routeUuid}]`);
      currentKey = `routeConditionkeys[${routeUuid}]`
    }
    if (keys.length === 1) {
      return;
    }
    // can use data-binding to set
    form.setFieldsValue({
      [currentKey]: keys.filter(keyItem => keyItem !== k),
    });

  }
  renderHosts = () => {
    const formItemLayoutWithOutLabel = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 20, offset: 3 },
      },
    };
    const { getFieldDecorator, getFieldValue } = this.props.form;
    getFieldDecorator('hostKeys', { initialValue: [ 0 ] });
    const hostList = getFieldValue('hostKeys');
    const hostItems = hostList.map((k, index) => {
      return (
        <FormItem
          {...(index === 0 ? dynamicFormItemLayout : formItemLayoutWithOutLabel)}
          label={index === 0 ? <span>服务域名
            <Tooltip title= "服务对外访问地址，用户需自行申请，并确保所填域名能解析到所选网关的服务地址（在选择的网关中添加该域名）">
              <Icon style={{ marginLeft: 8 }} type="question-circle" theme="outlined" />
            </Tooltip>
          </span> : ''}
          required={false}
          key={k}
        >
          {getFieldDecorator(`host[${k}]`, {
            validateTrigger: [ 'onChange', 'onBlur' ],
            rules: [{
              required: true,
              whitespace: true,
              message: '请输入服务域名',
            }],
          })(
            <Input
              addonAfter={<Icon type="plus" onClick={() => this.addItem('hostKeys')}/>}
              placeholder="passenger name"
              style={{ width: '200px', marginRight: 8 }} />
          )}
          {hostList.length > 1 ? (
            <Button
              icon="minus"
              style={{ marginLeft: 16 }}
              disabled={hostList.length === 1}
              onClick={() => this.removeItem(k, 'hostKeys')}
            />
          ) : null}
        </FormItem>
      );
    });
    return hostItems
  }
  renderRouteItem = () => {
    const formItemLayoutWithOutLabel = {
      wrapperCol: {
        sm: { span: 13, offset: 3 },
      },
    };
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const { actionVersionOptions } = this.state;
    getFieldDecorator('routeKeys', { initialValue: [ 9999 ] });
    const routeList = getFieldValue('routeKeys');
    const routeConditionsItem = uniqueKey => {
      getFieldDecorator(`routeConditionkeys[${uniqueKey}]`, { initialValue: [ uniqueKey ] });
      const routeConditionList = getFieldValue(`routeConditionkeys[${uniqueKey}]`);
      const conditionFormItemLayout = {
        labelCol: {
          sm: { span: 2 },
        },
        wrapperCol: {
          sm: { span: 20, push: 1 },
        },
      };
      const conditionFormItemLayoutWithoutLabel = {
        wrapperCol: {
          sm: { span: 10, offset: 3 },
        },
      };
      const routeConditionsDomList = routeConditionList.map((k, index) => {
        return (
          <FormItem
            label= { index === 0 ? '路由条件' : ''}
            key={k}
            {...(index === 0 ? conditionFormItemLayout : conditionFormItemLayoutWithoutLabel)}
          >
            <div className="condition-item">
              <div>
                {
                  index === 0 &&
                  <FormItem>
                    {
                      getFieldDecorator(`matchValue[${k}]`, {
                        initialValue: 'all',
                      })(
                        <RadioGroup>
                          <Radio value="all">全部</Radio>
                          <Radio value="any">任何</Radio>
                        </RadioGroup>
                      )
                    }
                    <span>以下条件</span>
                  </FormItem>
                }
              </div>
              <div className="condition-input">
                <FormItem>
                  {getFieldDecorator(`condition[${k}]`, {
                    initialValue: 'Header',
                  })(
                    <Select
                      style={{ width: 100 }}
                    >
                      <Option value="Header">Header</Option>
                      <Option value="Url">Url</Option>
                    </Select>
                  )}
                </FormItem>
                <FormItem>
                  {getFieldDecorator(`matchRule[${k}]`, {
                    initialValue: 'prefix',
                  })(
                    <Select
                      style={{ width: 100 }}
                    >
                      <Option value="prefix">前缀匹配</Option>
                      <Option value="exact">完全匹配</Option>
                    </Select>
                  )}
                </FormItem>
                <FormItem>
                  {getFieldDecorator(`rule[${k}]`, {
                    initialValue: '',
                  })(
                    <Input style={{ width: 100 }} placeholder="请输入规则"/>
                  )}
                </FormItem>
                <Button icon="plus" onClick={() => {
                  this.addItem('routeConditionkeys', uniqueKey)
                }}/>
                <Button type="danger" icon="close" onClick={() => this.removeItem(k, `routeConditionkeys[${uniqueKey}]`)} />
              </div>
            </div>
          </FormItem>
        )
      })
      return routeConditionsDomList
    }
    const routesBasedReqContent = routeList.map((k, index) => {
      return (
        <FormItem
          {...(index === 0 ? dynamicFormItemLayout : formItemLayoutWithOutLabel)}
          label={index === 0 ? '路由类型' : ''}
          required={false}
          key={k}
        >
          {
            index === 0 && <div className="route-type-wrapper">
              <RadioGroup
                value={this.state.routeType}
                onChange={e => this.setState({ routeType: e.target.value })}>
                <Radio value="content">基于请求内容</Radio>
                <Radio value="traffic" disabled>基于流量比例</Radio>
              </RadioGroup>
              <div className="route-type-tip">
                <span>
                  <Icon type="question"/>
                  选择“基于请求内容类型”，您以前配置的【基于流量比例规则】将全部删除
                </span>
                <Icon type="close"/>
              </div>
              添加路由项
            </div>
          }
          <div className="route-type-item">
            <div className="remove-route-item" onClick={() => this.removeItem(k, 'routeKeys')}>
              <Icon type="delete" theme="outlined" />
            </div>

            <div>{routeConditionsItem(k)}</div>
            <FormItem
              label="作用版本"
              {...dynamicFormItemLayout}
            >
              {actionVersionOptions.length === 0 ? '请选择组件' : getFieldDecorator(`version[${k}]`, {
              })(<CheckboxGroup options={actionVersionOptions}/>)}
              <div className="route-item-tip">
                当HTTP Header“User-Agent”包含“Chrome”且“User-Agent”包含“Nexus 6P”时，
                所有请求将被发送到 ["1.0.1（service1）"]
              </div>
            </FormItem>
          </div>
          {
            index === routeList.length - 1 && <div className="add-new-route" onClick={() => this.addItem('routeKeys')}><Icon type="plus-circle"/>添加一个路由项</div>
          }
        </FormItem>
      );
    });
    return <div className="route-rules-wrapper">
      {this.state.routeType === 'content' ? routesBasedReqContent : ''}
    </div>
  }
  handleSubmit = () => {
    const { validateFields } = this.props.form
    validateFields((err, values) => {
      if (!err) {
        // console.log(values);
      }

      // 根据作用版本来判断添加了多少个路由项
      const { routeConditionkeys, matchRule, condition, rule, version, componentSelected } = values
      // 分割数据方法
      const chunk = (arr, anotherArr) => {
        if (anotherArr.length === 0) {
          return arr
        }
        const arr2 = [];
        for (let i = 0; i < anotherArr.length; i++) {
          if (i === 0) {
            const tempArr = arr.slice(0, anotherArr[i].length)
            arr2.push(tempArr)
          } else {
            const newTempArr = arr.slice(anotherArr[i - 1].length,
              anotherArr[i].length + anotherArr[i - 1].length)
            arr2.push(newTempArr)
          }
        }
        return arr2;
      }
      const matchRuleData = chunk(Object.values(matchRule), Object.values(routeConditionkeys));
      const conditionData = chunk(Object.values(condition), Object.values(routeConditionkeys));
      const rulesData = chunk(Object.values(rule), Object.values(routeConditionkeys));
      const http = []
      rulesData.forEach((v, i) => {
        const match = []
        const route = []
        v.forEach((j, k) => {
          match.push({
            [conditionData[i][k]]: {
              [matchRuleData[i][k]]: rulesData[i][k],
            },
          })
          route.push({
            destination: {
              host: componentSelected,
              subset: Object.values(version)[i][k],
            },
          })
        })
        http.push({ match, route })
      })
      const postData = {
        apiVersion: 'networking.istio.io/v1alpha3',
        kind: 'VirtualService',
        metadata: {
          name: values.ruleName,
        },
        spec: {
          hosts: values.host,
          http,
        },
      }
      if (this.state.visitType === 'pub') {
        postData.spec.gateways = values.gateways
      }
    })
  }
  componentSelection = () => {
    const { componentList } = this.props
    const selections = []
    if (componentList.data && componentList.data.length !== 0) {
      for (const v of componentList.data) {
        selections.push({
          host: v.spec.host,
          versionNum: v.spec.subsets.length,
        })
      }
    }
    return selections
  }
  render() {
    const { meshGatewayList } = this.props
    const { nameProps, visitTypeProps, componentProps, gatewayProps } = this
    const { gateways } = this.state
    const { visitType } = this.state
    const children = [];
    for (let i = 10; i < 36; i++) {
      children.push(<Option key={i.toString(36) + i}>{i.toString(36) + i}</Option>);
    }
    return <div id="new-route">
      <div className="top">
        <ReturnButton onClick={() => this.props.history.push('/service-mesh/routes-management')}>返回路由管理列表</ReturnButton>
        <span>
          {
            this.props.match.params.id ? '创建路由规则' : '编辑路由规则'
          }
        </span>
      </div>
      <Card>
        <Form style={{ marginTop: 16 }}>
          <FormItem
            label="规则名称"
            {...formItemLayout}
          >
            {nameProps()(<Input placeholder="请输入规则名称"/>)}
          </FormItem>
          <FormItem
            label="选择组件"
            {...formItemLayout}
          >
            {componentProps()(<Select
              placeholder="请选择组件"
              style={{ width: 200 }}
            >
              {
                this.componentSelection().map(v => <Option value={v.host} key={v.host}>{`${v.host} (${v.versionNum})`}</Option>)
              }
            </Select>)}
          </FormItem>
          <FormItem
            label="访问方式"
            {...formItemLayout}
          >
            {
              visitTypeProps()(
                <RadioGroup>
                  <Radio value="pub">公网访问</Radio>
                  <Radio value="inner">仅在集群内访问</Radio>
                </RadioGroup>
              )
            }
            <div className="visit-type-inner">
              {
                visitType === 'pub' ?
                  <div className="pub-content">
                    <div className="tip">该规则中的服务可通过网关访问，请选择网络出口</div>
                    <div className="selection">
                      <FormItem>
                        {
                          gatewayProps()(
                            <Select
                              mode="multiple"
                              placeholder="选择网关（gateway）"
                              style={{ width: 200 }}
                            >
                              {
                                (meshGatewayList.data && meshGatewayList.data.length !== 0) &&
                                  meshGatewayList.data.map(v => <Option value={v} key={v}>
                                    {v}</Option>)
                              }
                            </Select>
                          )
                        }
                      </FormItem>
                      <Button icon="sync"/>
                      <a href="/service-mesh/mesh-gateway" target="_blank">去创建网关 >></a>
                      <div>
                        {
                          gateways && gateways.map(v => <Tag closable key={ v.id }>{v.text}</Tag>)
                        }
                      </div>
                    </div>
                  </div>
                  :
                  <div className="inner-content">
                    该规则中的服务仅提供给集群内其他服务访问
                  </div>
              }
            </div>
          </FormItem>
          {this.renderHosts()}
          {this.renderRouteItem()}

        </Form>
        <div className="new-route-footer">
          <Button>取消</Button>
          <Button type="primary" onClick={this.handleSubmit}>确定</Button>
        </div>
      </Card>
    </div>
  }
}

const NewRoute = Form.create()(NewRouteComponent)
export default NewRoute
