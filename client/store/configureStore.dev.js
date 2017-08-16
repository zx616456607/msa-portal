/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * Store dev for redux
 *
 * 2017-08-16
 * @author zhangpc
 */

import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { createLogger } from 'redux-logger'
import { composeWithDevTools } from 'redux-devtools-extension'
import { routerMiddleware } from 'react-router-redux'
import api from '../middleware/api'
import rootReducer from '../reducers'

// Use redux-devtools-extension
// https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd
const configureStore = history => {
  const middlewares = [ routerMiddleware(history), thunk, api, createLogger() ]
  const store = createStore(
    rootReducer,
    composeWithDevTools(
      applyMiddleware(...middlewares)
    )
  )

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      const nextRootReducer = require('../reducers').default
      store.replaceReducer(nextRootReducer)
    })
  }

  return store
}

export default configureStore
