/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * Store prod for redux
 *
 * 2017-08-16
 * @author zhangpc
 */

import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import api from '../middleware/api'
import rootReducer from '../reducers'
import { composeWithDevTools } from 'redux-devtools-extension/logOnlyInProduction'
import { routerMiddleware } from 'react-router-redux'

const configureStore = (history, preloadedState) => createStore(
  rootReducer,
  preloadedState,
  composeWithDevTools(applyMiddleware(routerMiddleware(history), thunk, api))
)

export default configureStore
