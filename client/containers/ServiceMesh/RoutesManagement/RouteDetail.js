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
import { Card, Form, Input, Select, Row, Col, Radio, Button, Tag, Icon, Tooltip, notification, Checkbox } from 'antd'
import { connect } from 'react-redux'
import { getMeshGateway } from '../../../actions/meshGateway'
import { loadComponent } from '../../../actions/serviceMesh'
import { createNewRoute, getMeshRouteDetail, updateMeshRoute } from '../../../actions/meshRouteManagement'
import './style/NewRoute.less'
import { MESH_ROUTE_RULE_NAME_REG,
  MESH_ROUTE_RULE_NAME_REG_NOTICE,
  IP_REG,
  ROUTE_REG } from '../../../constants';

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
const routeItemInnerLayout = {
  labelCol: {
    sm: { span: 3 },
  },
  wrapperCol: {
    sm: { span: 20, push: 1 },
  },
};
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
    originalMeshGatewayList: state.entities.meshGatewayList,
    meshRouteDetail: state.meshRouteManagement.meshRouteDetail,
    meshGatewayList: state.meshGateway.meshGatewayList,
    clusterID: state.current && state.current.config.cluster.id,
    project: state.current && state.current.config.project.namespace,
    componentList: state.serviceMesh.componentList,
  }
}
@connect(mapStateToProps, {
  getMeshGateway,
  loadComponent,
  createNewRoute,
  getMeshRouteDetail,
  updateMeshRoute,
})
class NewRouteComponent extends React.Component {
  state = {
    ruleName: '',
    visitType: 'pub',
    routeType: 'content',
    serviceHost: [],
    gateways: [],
    actionVersionOptions: [],
    hosts: [
      {},
    ],
  }
  componentDidMount() {
    const { clusterID,
      getMeshGateway,
      loadComponent,
      getMeshRouteDetail,
      match,
      project } = this.props
    const promises = [ getMeshGateway(clusterID), loadComponent(clusterID, project) ]
    if (match.params.name) {
      promises.push(getMeshRouteDetail(clusterID, match.params.name))
    }
    Promise.all(promises).then(() => {
      this.setInitialValue()
      const selectedGateways = this.setInitialValue().defaltGateways
      const { meshRouteDetail } = this.props
      const data = meshRouteDetail.data
      this.setSelectableHosts(selectedGateways)
      if (data && match.params.name) {
        const { spec } = data
        this.setActionVersion(data.spec.http[0].route[0].destination.host)
        this.setState({ visitType: spec.gateways ? 'pub' : 'inner' })
      }
    })
  }
  setInitialValue = () => {
    const { meshRouteDetail, match, componentList } = this.props
    let initialValues = {}
    if (match.params.name && meshRouteDetail.data) {
      const { spec } = meshRouteDetail.data
      const selectedCom = spec.http[0].route[0].destination.host
      initialValues.defaultHostList = []
      initialValues.host = []
      initialValues.defaultRouteKeys = []
      initialValues.routeConditionkeys = []
      initialValues.defaltGateways = spec.gateways || []
      initialValues.defaultVisitType = spec.gateways ? 'pub' : 'inner'
      spec.hosts.forEach((v, i) => {
        const hostIndex = 1000 - i
        initialValues.defaultHostList.push(hostIndex)
        initialValues.host[hostIndex] = v
      })
      spec.http.forEach((k, j) => {
        const routeIndex = 9999 - j
        const { route } = k
        const defaultVersion = []
        route.forEach(item => defaultVersion.push(item.destination.subset))
        // 当选择的组件被删除的时候，默认选择的作用版本被置空
        if (componentList.data &&
          Object.values(componentList.data).findIndex(v => v.metadata.name === selectedCom) < 0) {
          defaultVersion.splice(0)
        }
        initialValues.defaultRouteKeys.push(routeIndex)
        initialValues.routeConditionkeys[routeIndex] = {
          matchRule: Object.keys(k.match[0].uri)[0],
          rule: k.match[0].uri[Object.keys(k.match[0].uri)[0]],
          version: defaultVersion,
        }
      })
    } else {
      initialValues = {
        defaultHostList: [ 0 ],
        host: [ '' ],
        defaultRouteKeys: [ 9999 ],
        defaltGateways: [],
        defaultVisitType: 'pub',
        routeConditionkeys: [
          {
            matchRule: 'prefix',
            rule: '',
            version: [],
          },
        ],
      }
    }
    return initialValues
  }
  setSelectableHosts = currentHosts => {
    const { originalMeshGatewayList } = this.props
    const serviceHost = []
    for (const k in originalMeshGatewayList) {
      currentHosts.forEach(v => {
        if (v === k) {
          const currentServers = originalMeshGatewayList[k].spec.servers[0]
          currentServers.hosts.forEach(j => {
            if (!serviceHost.includes(j)) {
              serviceHost.push({ host: j, parent: k })
            }
          })
        }
      })
    }
    this.setState({ serviceHost })

  }
  // 设置作用版本
  setActionVersion = val => {
    const { componentList } = this.props
    const actionVersionArr = []
    const dataAry = componentList.data || {}
    Object.keys(dataAry).forEach(v => {
      if (dataAry[v].spec.host === val) {
        for (const k of dataAry[v].spec.subsets) {
          actionVersionArr.push({
            label: k.labels.version,
            value: k.labels.version,
          })
        }
      }
    })
    this.setState({ actionVersionOptions: actionVersionArr })

  }
  // 表单校验相关
  routeNameCheck = (rules, value, callback) => {
    if (!value) {
      return callback()
    }
    if (!MESH_ROUTE_RULE_NAME_REG.test(value)) {
      return callback(MESH_ROUTE_RULE_NAME_REG_NOTICE)
    }
    callback()
  }
  nameProps = () => {
    const { getFieldDecorator } = this.props.form
    return getFieldDecorator('ruleName', {
      initialValue: this.props.match.params.name || '',
      onChange: e => this.setState({ ruleName: e.target.value }),
      rules: [
        { required: true, message: '请输入规则名称' },
        {
          validator: this.routeNameCheck,
        }],
      trigger: 'onChange',
    })
  }
  componentProps = () => {
    const { getFieldDecorator } = this.props.form
    const { meshRouteDetail, match, componentList } = this.props
    let defaultComponent = []
    if (match.params.name && meshRouteDetail.data) {
      const { spec } = meshRouteDetail.data
      const selectedCom = spec.http[0].route[0].destination.host
      if (componentList.data) {
        if (Object.values(componentList.data)
          .findIndex(v => v.metadata.name === selectedCom) >= 0) {
          defaultComponent = [ selectedCom ]
        }
      }
    }
    return getFieldDecorator('componentSelected', {
      initialValue: defaultComponent,
      onChange: val => {
        this.setActionVersion(val)
      },
      rules: [
        { required: true, message: '请选择组件' },
      ],
      trigger: 'onChange',
    })
  }
  visitTypeProps = () => {
    const { getFieldDecorator, resetFields, setFieldsValue } = this.props.form
    return getFieldDecorator('visitType', {
      initialValue: this.setInitialValue().defaultVisitType,
      onChange: e => {
        resetFields([ 'host' ])
        setFieldsValue({ hostKeys: [ 1 ] })
        this.setState({
          visitType: e.target.value,
          serviceHost: [],
        })
      },
    })
  }
  gatewayProps = () => {
    const { getFieldDecorator } = this.props.form
    return getFieldDecorator('gateways', {
      initialValue: this.setInitialValue().defaltGateways,
      onChange: gateways => {
        this.setSelectableHosts(gateways)
      },
      rules: [{ required: true, message: '请选择网关' }],
    })
  }
  domainValidator = (rule, value, cb) => {
    const { visitType } = this.state
    const { getFieldValue } = this.props.form
    if (!value) return cb()
    const domainReg = /^[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z0-9]{1,}\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/
    if (visitType !== 'pub') {
      if (!(domainReg.test(value) || IP_REG.test(value))) {
        cb('请填写正确的服务域名')
      }
    }
    let hostList = getFieldValue('host')
    hostList = hostList.filter(v => typeof v === 'string')
    if (hostList.length > 1) {
      const existHostList = hostList.slice(0, hostList.length - 1)
      if (existHostList.includes(hostList[hostList.length - 1])) {
        cb('服务域名不能重复')
      }
    }

    cb()

  }
  ruleOfRouteValidator = (rule, value, cb) => {
    const values = this.props.form.getFieldsValue()
    const routeRules = values.rule.filter(v => typeof v === 'string')
    if (routeRules.length > 1) {
      const existRouteRules = routeRules.slice(0, routeRules.length - 1)
      if (existRouteRules.includes(routeRules[routeRules.length - 1])) {
        cb('路由规则不能重复')
      }
    }
    if (!value) cb('请填写路由规则')
    if (!ROUTE_REG.test(value)) cb('请填写正确的路由规则')
    cb()
  }
  versionValidator = (rule, value, cb) => {
    if (!value || value.length === 0) {
      cb('请至少选择一个版本')
    }
    cb()
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
    getFieldDecorator('hostKeys', { initialValue: this.setInitialValue().defaultHostList });
    const hostList = getFieldValue('hostKeys');
    const { visitType, serviceHost } = this.state
    const hostTip = visitType === 'pub' ? `服务对外访问地址，用户需自行申请，
    并确保所填域名或主机名能解析到所选网关的出口ip地址
    （在选择的网关中添加该域名或主机名）` : '服务集群内访问地址，请填写不冲突的服务名或域名'
    const hostItems = hostList.map((k, index) => {
      return (
        <FormItem
          {...(index === 0 ? dynamicFormItemLayout : formItemLayoutWithOutLabel)}
          className="host-wrapper"
          label={index === 0 ? <span>服务域名
            <Tooltip title= {hostTip}>
              <Icon style={{ marginLeft: 8 }} type="question-circle" theme="outlined" />
            </Tooltip>
          </span> : ''}
          required={false}
          key={k}
        >
          {
            visitType === 'pub' ?
              <span>
                {getFieldDecorator(`host[${k}]`, {
                  validateTrigger: [ 'onChange', 'onBlur' ],
                  initialValue: this.setInitialValue().host[k],
                  rules: [{
                    required: true,
                    whitespace: true,
                    message: '请选择服务域名',
                  }, {
                    validator: this.domainValidator,
                  }],
                })(
                  <Select
                    placeholder="请选择服务域名"
                    style={{ width: '200px', marginRight: 16 }}
                  >
                    {
                      serviceHost.map(v => <Select className="Option" value={v.host} key={v.parent}>
                        {`${v.host} (${v.parent})`}
                      </Select>)
                    }
                  </Select>
                )}
                <Button icon="plus" onClick={() => this.addItem('hostKeys')}/>

              </span>
              :
              <span>
                {getFieldDecorator(`host[${k}]`, {
                  validateTrigger: [ 'onChange', 'onBlur' ],
                  initialValue: this.setInitialValue().host[k],
                  rules: [{
                    required: true,
                    whitespace: true,
                    message: '请输入服务域名',
                  }, {
                    validator: this.domainValidator,
                  }],
                })(
                  <Input
                    addonAfter={<Icon type="plus" onClick={() => this.addItem('hostKeys')}/>}
                    placeholder="请输入服务域名"
                    style={{ width: '200px', marginRight: 8 }} />
                )}
              </span>
          }
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
    const { name } = this.props.match.params
    getFieldDecorator('routeKeys', { initialValue: this.setInitialValue().defaultRouteKeys });
    const routeList = getFieldValue('routeKeys');
    const routeConditionkeys = this.setInitialValue().routeConditionkeys
    const routeConditionsItem = uniqueKey => {
      getFieldDecorator(`routeConditionkeys[${uniqueKey}]`, { initialValue: [ uniqueKey ] });
      const routeConditionList = getFieldValue(`routeConditionkeys[${uniqueKey}]`);
      const conditionFormItemLayoutWithoutLabel = {
        wrapperCol: {
          sm: { span: 10, offset: 3 },
        },
      };
      let matchPrefix,
        matchWay,
        matchRule
      const routeConditionsDomList = routeConditionList.map((k, index) => {
        matchPrefix = getFieldValue(`condition[${k}]`) || 'uri';
        matchWay = getFieldValue(`matchRule[${k}]`) === 'exact' ? '完全匹配' : '前缀匹配';
        matchRule = getFieldValue(`rule[${k}]`) || '-';

        return (
          <div className="route-item">
            <FormItem
              label= { index === 0 ? '路由条件' : ''}
              key={k}
              {...(index === 0 ? routeItemInnerLayout : conditionFormItemLayoutWithoutLabel)}
            >
              <div className="condition-item">
                <div>
                  { // 匹配规则暂时隐藏
                    false &&
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
                      initialValue: 'uri',
                    })(
                      <Select
                        style={{ width: 100 }}
                      >
                        {/* <Option value="Header">Header</Option>*/}
                        <Option value="uri">uri</Option>
                      </Select>
                    )}
                  </FormItem>
                  <FormItem>
                    {getFieldDecorator(`matchRule[${k}]`, {
                      initialValue: name ? (routeConditionkeys[uniqueKey] && routeConditionkeys[uniqueKey].matchRule) : 'prefix',
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
                      initialValue: routeConditionkeys[uniqueKey] &&
                      routeConditionkeys[uniqueKey].rule,
                      validateTrigger: [ 'onChange', 'onBlur' ],
                      rules: [{ validator: this.ruleOfRouteValidator }],
                    })(
                      <Input style={{ width: 100 }} placeholder="请输入规则"/>
                    )}
                  </FormItem>
                  {/* 暂时不需要添加和删除按钮
                <Button icon="plus" onClick={() => {
                  this.addItem('routeConditionkeys', uniqueKey)
                }}/>
                <Button type="danger" icon="close" onClick={() => this.removeItem(k, `routeConditionkeys[${uniqueKey}]`)} />
                */}
                </div>
              </div>
            </FormItem>
          </div>
        )
      })
      return { routeConditionsDomList, matchPrefix, matchWay, matchRule }
    }
    const routesBasedReqContent = routeList.map((k, index) => {
      const componentSelected = getFieldValue('componentSelected')
      const versions = componentSelected.length !== 0 ? getFieldValue(`version[${k}]`) || '-' : '-'
      const tip = `当${routeConditionsItem(k).matchPrefix}${routeConditionsItem(k).matchWay}
              <${routeConditionsItem(k).matchRule}>，请求将被均衡的发送到 ${JSON.stringify(versions)}`
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
              {/* <div className="route-type-tip">
                <span>
                  <Icon type="question"/>
                  选择“基于请求内容类型”，您以前配置的【基于流量比例规则】将全部删除
                </span>
                <Icon type="close"/>
              </div>*/}
              <div>添加路由项</div>
            </div>
          }
          <div className="route-type-item">
            <div className="remove-route-item" onClick={() => this.removeItem(k, 'routeKeys')}>
              <Icon type="delete" theme="outlined" />
            </div>
            <div>{routeConditionsItem(k).routeConditionsDomList}</div>
            <div className="action-version">
              <FormItem
                label="作用版本"
                {...routeItemInnerLayout}
              >
                {actionVersionOptions.length === 0 ? '请选择组件' : getFieldDecorator(`version[${k}]`, {
                  initialValue: routeConditionkeys[k] &&
                  routeConditionkeys[k].version,
                  validateTrigger: [ 'onChange' ],
                  rules: [{ validator: this.versionValidator }],
                })(<CheckboxGroup options={actionVersionOptions}/>)}
              </FormItem>
            </div>
            <Row>
              <Col span={3}></Col>
              <Col span={20} push={1}>
                <div className="route-item-tip">
                  {tip}
                </div>
              </Col>
            </Row>
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
    const { clusterID, createNewRoute, match, meshRouteDetail, updateMeshRoute } = this.props
    const { validateFields } = this.props.form
    validateFields((err, values) => {
      if (!err) {
        const { routeConditionkeys,
          matchRule, condition, rule, version, componentSelected } = values
        // 分割数据方法
        const chunk = (arr, anotherArr) => {
          if (anotherArr.length === 0) {
            return arr
          }
          const arr2 = [];
          let start = 0
          for (let i = 0; i < anotherArr.length; i++) {

            const newTempArr = arr.slice(start, start + anotherArr[i].length)
            start += anotherArr[i].length
            arr2.push(newTempArr)
          }
          return arr2;
        }
        const matchRuleData = chunk(Object.values(matchRule), Object.values(routeConditionkeys));
        const conditionData = chunk(Object.values(condition), Object.values(routeConditionkeys));
        const rulesData = chunk(Object.values(rule), Object.values(routeConditionkeys));

        const http = []
        const weightArr = []
        const filteredVersion = version.filter(v => v)
        rulesData.forEach((v, i) => {
          const match = []
          const route = []
          if (v.length !== 0) {
            v.forEach((j, k) => {
              match.push({
                [conditionData[i][k]]: {
                  [matchRuleData[i][k]]: rulesData[i][k],
                },
              })
              const versionSelected = Object.values(filteredVersion)[i]
              const weightItem = []
              const remainder = versionSelected ? 100 % versionSelected.length : 0
              weightArr.push(weightItem)
              versionSelected && versionSelected.forEach((item, n) => {
                if (remainder !== 0) {
                  if (n === versionSelected.length - 1) {
                    weightItem.push(Math.floor(100 / versionSelected.length) + remainder)
                  } else {
                    weightItem.push(Math.floor(100 / versionSelected.length))
                  }
                } else {
                  weightItem.push(100 / versionSelected.length)
                }
                route.push({
                  destination: {
                    host: typeof componentSelected === 'object' ? componentSelected[0] : componentSelected,
                    subset: item,
                  },
                  weight: weightArr[i][n],
                })
              })
            })
            http.push({ match, route })
          }
        })
        const postData = {
          apiVersion: 'networking.istio.io/v1alpha3',
          kind: 'VirtualService',
          metadata: {
            name: values.ruleName,
          },
          spec: {
            hosts: values.host.filter(v => typeof v === 'string'),
            http,
          },
        }
        if (this.state.visitType === 'pub') {
          postData.spec.gateways = values.gateways
        }

        if (match.params.name) {
          const meshRouteDetailData = meshRouteDetail.data
          postData.metadata = meshRouteDetailData.metadata
          postData.referencedGateways = meshRouteDetailData.referencedGateways
          updateMeshRoute(clusterID, postData).then(res => {
            if (res.error) {
              notification.warn({ message: '修改失败' })
              return
            }
            notification.success({ message: '修改成功' })
            this.props.history.push('/service-mesh/routes-management')

          })
        } else {
          createNewRoute(clusterID, postData).then(res => {
            if (res.status === 409) {
              notification.warn({
                message: '规则名称已存在',
              })
              return
            }
            if (res.type === 'NEW_MESH_ROUTE_SUCCESS') {
              notification.success({ message: '创建成功' })
              this.props.history.push('/service-mesh/routes-management')
            }
          })
        }
      }
    })
  }
  componentSelection = () => {
    const { componentList } = this.props
    const selections = []
    const dataAry = componentList.data || {}
    Object.keys(dataAry).forEach(key => {
      selections.push({
        host: dataAry[key].spec.host,
        versionNum: dataAry[key].spec.subsets.length,
      })
    })
    return selections
  }
  componentWillUnmount = () => {
    this.setState = () => {
      return;
    };
  }
  render() {
    const { meshGatewayList, getMeshGateway, clusterID } = this.props

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
            {nameProps()(<Input placeholder="请输入规则名称" disabled={!!this.props.match.params.name}/>)}
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
                      <Button icon="sync" onClick={() => getMeshGateway(clusterID)}/>
                      <a href="/service-mesh/mesh-gateway" target="_blank">去创建网关 >></a>
                      <div>
                        {
                          gateways && gateways.map(v => <Tag closable key={ v.id }>{v.text}</Tag>)
                        }
                      </div>
                    </div>
                  </div>
                  :
                  <div className="tip">
                    该规则中的服务仅提供给集群内其他服务访问
                  </div>
              }
            </div>
          </FormItem>
          {this.renderHosts()}
          {this.renderRouteItem()}

        </Form>
        <div className="new-route-footer">
          <Button onClick={() => this.props.history.push('/service-mesh/routes-management')}>取消</Button>
          <Button type="primary" onClick={this.handleSubmit}>确定</Button>
        </div>
      </Card>
    </div>
  }
}

const RouteDetail = Form.create()(NewRouteComponent)
export default RouteDetail
