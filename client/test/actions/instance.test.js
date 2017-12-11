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
import * as ActionsAndTypes from '../../actions/instance'
import { toQuerystring } from '../../common/utils'
import { API_CONFIG } from '../../constants'

describe('CSB instances actions', () => {
  afterEach(() => {
    fetchMock.reset()
    fetchMock.restore()
  })

  it('should get instances', () => {
    const clusterID = 'test'
    const userID = 'test'
    const query = {
      flag: '1',
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
      `${API_CONFIG.PAAS_API_URL}/clusters/${clusterID}/instance/${userID}?${toQuerystring(query)}`,
      {
        body: csbInstancesData,
        headers: { 'content-type': 'application/json' },
      }
    )

    const expectedActions = [
      {
        clusterID,
        query,
        type: ActionsAndTypes.CSB_INSTANCES_REQUEST,
      },
      {
        clusterID,
        query,
        type: ActionsAndTypes.CSB_INSTANCES_SUCCESS,
        response: {
          entities: {
            csbInstances: {
              [csbInstancesData.data[0].id]: csbInstancesData.data[0],
            },
          },
          result: {
            data: [ csbInstancesData.data[0].id ],
          },
        },
      },
    ]

    return store
      .dispatch(ActionsAndTypes.fetchInstances(clusterID, userID, query))
      .then(() => {
        // return of async actions
        expect(store.getActions()).toEqual(expectedActions)
      })
  })
})
