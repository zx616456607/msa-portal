import { treeCorrectedForClockSkew } from './skew'
import { traceSummary, traceSummariesToMustache } from './traceSummary'
import { traceToMustache } from './traceToMustache';
import cloneDeep from 'lodash/cloneDeep'

export function convertSuccessResponse(rawResponse, serviceName, utc = false) {
  const summaries = [];
  rawResponse.forEach(raw => {
    if (raw.length === 0) return;
    const corrected = treeCorrectedForClockSkew(raw);
    try {
      summaries.push(traceSummary(corrected));
    } catch (e) {
      /* eslint-disable no-console */
      console.log(e.toString());
    }
  });
  // Take the summaries and convert them to template parameters for index.mustache
  let traces = [];
  if (summaries.length > 0) {
    traces = traceSummariesToMustache(serviceName, summaries, utc);
  }
  // return { traces, apiURL, rawResponse };
  traces.forEach((node, index) => {
    const serviceSummaries = node.serviceSummaries
    const spans = {}
    serviceSummaries.forEach(({ serviceName, spanCount }) => {
      spans[serviceName] = spanCount
    })
    node.spans = spans
    node.success = !node.infoClass
    node.startTime = parseInt(node.timestamp / 1000)
    const entry = rawResponse[index].filter(({ parentId }) => !parentId) || []
    const serviceNameI = entry[0] && entry[0].localEndpoint.serviceName
    node.serviceName = serviceNameI
  })
  return traces
}

export function convertSuccessResponseDetail(rawResponse, logsUrl) {
  const corrected = treeCorrectedForClockSkew(rawResponse);
  const modelview = traceToMustache(corrected, logsUrl);
  // 以下方法是为了适配我们以前的数据结构
  const servicesI = modelview.serviceNameAndSpanCounts || []
  const services = {}
  servicesI.forEach(({ serviceName, spanCount }) => {
    services[serviceName] = spanCount
  })
  const mymodelView = {}
  mymodelView.traceId = modelview.traceId
  mymodelView.spanCount = modelview.spans.length
  mymodelView.services = services
  const newModelNode = Object.assign({}, modelview.spans[0], mymodelView)
  Copy(newModelNode, modelview.spans[0])
  function deepTreeNode(node) {
    const childrenOperation = node.childIds || []
    const children = modelview.spans.filter(({ spanId }) => childrenOperation.includes(spanId))
    const newChildren = cloneDeep(children)
    newChildren.forEach((node, index) => {
      Copy(node, children[index])
    })
    node.children = newChildren
    node.children.forEach(node => deepTreeNode(node))
  }
  deepTreeNode(newModelNode)
  return newModelNode
}

function Copy(operationModel, node) {
  operationModel.id = node.spanId
  operationModel.name = node.spanName
  operationModel.timestamp = node.timestamp
  operationModel.annotations = node.annotations
  operationModel.binaryAnnotations = node.tags
  operationModel.success = node.errorType === 'none'
  operationModel.serverName = node.serviceName
  operationModel.timestamp = node.timestamp
  operationModel.duration = node.duration
}
