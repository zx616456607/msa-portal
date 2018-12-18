/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2018 TenxCloud. All Rights Reserved.
 */

/**
 * Loadable component wrapper
 * dev for hot replace
 *
 * 2018-12-17
 * @author zhangpc
 */

// path 是相对于 src/containers 的一个地址，且不能以 '/' 开头，仅用于开发时的热更新
const LoadableWrapper = ({ path }) => {
  if (!path) {
    throw new Error('path is required in development mode')
  }
  if (path.startsWith('/')) {
    throw new Error('path 是相对于 src/containers 的一个地址，且不能以 \'/\' 开头')
  }
  return require(`../../containers/${path}`).default
}

export default LoadableWrapper
