/**
 * Licensed Materials - Property of tenxcloud.com
 * (C) Copyright 2017 TenxCloud. All Rights Reserved.
 */

/**
 * Schemas
 *
 * 2017-08-16
 * @author zhangpc
 */

import { schema } from 'normalizr'

// We use this Normalizr schemas to transform API responses from a nested form
// to a flat form where repos and users are placed in `entities`, and nested
// JSON objects are replaced with their IDs. This is very convenient for
// consumption by reducers, because we can easily build a normalized tree
// and keep it updated as we fetch more data.

// Read more about Normalizr: https://github.com/paularmstrong/normalizr

// GitHub's API may return results with uppercase letters while the query
// doesn't contain any. For example, "someuser" could result in "SomeUser"
// leading to a frozen UI as it wouldn't find "someuser" in the entities.
// That's why we're forcing lower cases down there.

// const userSchema = new schema.Entity('users', {}, {
//   idAttribute: user => user.login.toLowerCase(),
// })

// const repoSchema = new schema.Entity('repos', {
//   owner: userSchema,
// }, {
//   idAttribute: repo => repo.fullName.toLowerCase(),
// })

const appSchema = new schema.Entity('apps', {}, {
  idAttribute: 'uid',
})

// Schemas for Github API responses.
export const Schemas = {
  APP: appSchema,
  APP_ARRAY: [ appSchema ],
  // USER: userSchema,
  // USER_ARRAY: [ userSchema ],
  // REPO: repoSchema,
  // REPO_ARRAY: [ repoSchema ],
}
