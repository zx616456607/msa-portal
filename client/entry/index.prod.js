/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * Index prod entry
 *
 * 2017-08-16
 * @author zhangpc
 */

import React from 'react'
import { render } from 'react-dom'
import createHistory from 'history/createBrowserHistory'
import Root from '../containers/Root'
import configureStore from '../store/configureStore'
import '../common/lib'
import '../common/style'

// Create a history of your choosing (we're using a browser history in this case)
const history = createHistory()
const initialState = window.__INITIAL_STATE__
const store = configureStore(history, initialState)

render(
  <Root store={store} history={history} />,
  document.getElementById('root')
)
