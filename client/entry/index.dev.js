/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * Index dev entry
 *
 * 2017-08-16
 * @author zhangpc
 */

import React from 'react'
import ReactDOM from 'react-dom'
import createHistory from 'history/createBrowserHistory'
import { AppContainer } from 'react-hot-loader'
import Root from '../containers/Root/'
import configureStore from '../store/configureStore'
import '../common/lib'
import '../common/style'

// Create a history of your choosing (we're using a browser history in this case)
const history = createHistory()
const initialState = window.__INITIAL_STATE__
const store = configureStore(history, initialState)

const render = Component => {
  ReactDOM.render(
    <AppContainer>
      {Component}
    </AppContainer>,
    document.getElementById('root')
  )
}

render(<Root store={store} history={history} />)

if (module.hot) {
  module.hot.accept('../containers/Root/', () => {
    render(<Root store={store} history={history} />)
  })
}
