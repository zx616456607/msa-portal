/**
 * errors handler
 * @author Zhangpc
 * @date 2017-7-8 12:25:45
 */

class ClientError extends Error {
  constructor(message, status) {
    super()
    this.message = message
    this.status = status || 400
  }
}

class InvalidDataError extends ClientError {
  constructor(message, status) {
    super(message, status)
    this.status = 400
  }
}

// 认证错误
class AuthenticationError extends ClientError {
  constructor(message, status) {
    super(message, status)
    this.status = 401
  }
}

// 授权错误
class AuthorizationError extends ClientError {
  constructor(message, status) {
    super(message, status)
    this.status = 403
  }
}

class NotFoundError extends ClientError {
  constructor(message, status) {
    super(message, status)
    this.status = 404
  }
}

class ServerError extends Error {
  constructor(err) {
    super(err)
    this.status = 500
    switch (err.code) {
      case 'ENOTFOUND':
        this.message = `Request ${err.host} ENOTFOUND`
        break
      default:
        this.message = 'Internal server error'
    }
  }
}

class InvalidHttpCodeError extends Error {
  constructor(err) {
    super(err)
    this.message = err.message
    switch (err.name) {
      case 'ResponseTimeoutError':
      case 'ConnectionTimeoutError':
        this.status = 504
        this.message = 'Gateway Timeout'
        break
      case 'RequestError':
        this.status = 503
        break
      default:
        this.status = 500
    }
    // For request error
    if (err.code === 'ETIMEDOUT') {
      this.message = 'Gateway Timeout'
      this.status = 504
    } else if (err.code === 'ETIMEDOUT') {
      this.message = 'The connection could not be established'
      this.status = 501
    }
  }
}

function format(error) {
  if (!error) {
    error = new Error('undefined error')
    error.status = 500
  }
  const status = error.status
  const message = error.message || 'bad error'
  switch (status) {
    case 400:
      return new InvalidDataError(message)
    case 401:
      return new AuthenticationError(message)
    case 403:
      return new AuthorizationError(message)
    case 404:
      return new NotFoundError(message)
    case 500:
      return new ServerError(error)
    case -1:
      return new InvalidHttpCodeError(error)
    default:
      return new ClientError(message, status)
  }
}

exports.ClientError = ClientError
exports.InvalidDataError = InvalidDataError
exports.AuthenticationError = AuthenticationError
exports.AuthorizationError = AuthorizationError
exports.NotFoundError = NotFoundError
exports.ServerError = ServerError
exports.InvalidHttpCodeError = InvalidHttpCodeError
exports.format = format
