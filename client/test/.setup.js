import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import fetchMock from 'fetch-mock'
import api from '../middleware/api'

const middlewares = [ thunk, api ]
const mockStore = configureMockStore(middlewares)
const initStore = () => mockStore({
  entities: {
    /* auth: {
      jwt: {
        token: 'test',
      },
    }, */
  },
  current: {
    config: {},
  },
})

global.fetchMock = fetchMock
global.mockStore = mockStore
global.initStore = initStore
