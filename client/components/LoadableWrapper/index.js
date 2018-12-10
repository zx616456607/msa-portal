/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2018 TenxCloud. All Rights Reserved.
 */

/**
 * Loadable component wrapper
 *
 * 2018-12-06
 * @author zhangpc
 */
import React from 'react'
import Loadable from 'react-loadable'
import Loader from '@tenx-ui/loader'

const LoaderWrapper = () => {
  /* if (props.error) {
    return <div>Error! <button onClick={ props.retry }>Retry</button></div>
  } */
  return <Loader spinning={true} fullScreen={true} />
}

const LoadableWrapper = ({ loader }) => Loadable({
  loader,
  loading: LoaderWrapper,
})

export default LoadableWrapper
