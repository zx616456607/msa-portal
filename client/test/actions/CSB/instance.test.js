/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * Test for instances actions
 *
 * 2017-12-11
 * @author zhangpc
 */

import expect from 'expect'
import * as ActionsAndTypes from '../../../actions/CSB/instance'
import { toQuerystring } from '../../../common/utils'
import {
  API_CONFIG,
  CSB_PUBLIC_INSTANCES_FLAG,
  CSB_AVAILABLE_INSTANCES_FLAG,
  CSB_OM_INSTANCES_FLAG,
} from '../../../constants'

const { CSB_API_URL } = API_CONFIG

describe('CSB instances actions', () => {
  afterEach(() => {
    fetchMock.reset()
    fetchMock.restore()
  })

  it('should get public instances', () => {
    const store = initStore()
    const clusterID = 'test'
    const query = {
      flag: CSB_PUBLIC_INSTANCES_FLAG,
      userId: 'test',
    }
    const csbInstancesData = {
      data: [
        {
          id: 33,
          name: 'instance7',
          description: '33333',
        },
      ],
    }

    fetchMock.getOnce(
      `${CSB_API_URL}/clusters/${clusterID}/instance?${toQuerystring(query)}`,
      {
        body: csbInstancesData,
        headers: { 'content-type': 'application/json' },
      }
    )

    const expectedActions = [
      {
        clusterID,
        query,
        type: ActionsAndTypes.CSB_PUBLIC_INSTANCES_REQUEST,
      },
      {
        clusterID,
        query,
        type: ActionsAndTypes.CSB_PUBLIC_INSTANCES_SUCCESS,
        response: {
          entities: {},
          result: csbInstancesData,
        },
      },
    ]

    return store
      .dispatch(ActionsAndTypes.fetchInstances(clusterID, query))
      .then(() => {
        // return of async actions
        expect(store.getActions()).toEqual(expectedActions)
      })
  })

  it('should get available instances', () => {
    const store = initStore()
    const clusterID = 'test'
    const query = {
      flag: CSB_AVAILABLE_INSTANCES_FLAG,
      userId: 'test',
    }
    const csbInstancesData = {
      data: {
        content: [
          {
            instance: {
              id: 33,
              name: 'instance7',
              description: '33333',
            },
            user: {
              name: 'wanglei',
              email: 'wanglei@tenxcloud.com',
            },
            role: 1,
            id: 43,
            new: false,
          },
        ],
      },
    }

    fetchMock.getOnce(
      `${CSB_API_URL}/clusters/${clusterID}/instance?${toQuerystring(query)}`,
      {
        body: csbInstancesData,
        headers: { 'content-type': 'application/json' },
      }
    )

    const expectedActions = [
      {
        clusterID,
        query,
        type: ActionsAndTypes.CSB_AVAILABLE_INSTANCES_REQUEST,
      },
      {
        clusterID,
        query,
        type: ActionsAndTypes.CSB_AVAILABLE_INSTANCES_SUCCESS,
        response: {
          entities: {},
          result: csbInstancesData,
        },
      },
    ]

    return store
      .dispatch(ActionsAndTypes.fetchInstances(clusterID, query))
      .then(() => {
        // return of async actions
        expect(store.getActions()).toEqual(expectedActions)
      })
  })

  it('should get OM instances', () => {
    const store = initStore()
    const clusterID = 'test'
    const query = {
      flag: CSB_OM_INSTANCES_FLAG,
      userId: 'test',
    }
    const csbInstancesData = {
      data: {
        content: [
          {
            name: 'test8',
            clusterId: 'CID-90eb6ec7b55a',
            description: 'test3-description',
            systemCallKey: 'wdfaflasdf',
            creationTime: '2017-12-14 14:10:53',
            creator: {
              name: '王3',
              email: 'wmy@qq.com',
            },
            id: 9,
            new: false,
          },
        ],
      },
    }

    fetchMock.getOnce(
      `${CSB_API_URL}/clusters/${clusterID}/instance?${toQuerystring(query)}`,
      {
        body: csbInstancesData,
        headers: { 'content-type': 'application/json' },
      }
    )

    const expectedActions = [
      {
        clusterID,
        query,
        type: ActionsAndTypes.CSB_OM_INSTANCES_REQUEST,
      },
      {
        clusterID,
        query,
        type: ActionsAndTypes.CSB_OM_INSTANCES_SUCCESS,
        response: {
          entities: {},
          result: csbInstancesData,
        },
      },
    ]

    return store
      .dispatch(ActionsAndTypes.fetchInstances(clusterID, query))
      .then(() => {
        // return of async actions
        expect(store.getActions()).toEqual(expectedActions)
      })
  })
})
