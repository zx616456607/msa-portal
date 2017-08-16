/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * service for json web token
 *
 * @author zhangpc
 * @date 2017-08-15
 */
import urllib from 'urllib'
import { basic } from '../../config'
import { API_URL } from '../../client/constants'

/**
 * get json web token from api server
 *
 * @param {object} authInfo { jwtid, expiresIn }
 * - expiresIn: expressed in seconds or a string describing a time span `zeit/ms`.
 *              Eg: `60`, `"2 days"`, `"10h"`, `"7d"`
 * @export
 * @return {Promise} data
 */
export function getJwt({ jwtid, expiresIn }) {
  const url = `${API_URL}/auth`
  const options = {
    method: 'POST',
    dataType: 'json',
    auth: basic,
    data: { jwtid, expiresIn },
  }
  return urllib.request(url, options)
}
