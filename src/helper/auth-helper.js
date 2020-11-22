const jwt = require('jsonwebtoken')

const secretKey = 'secret'

const signAdmin = user => {
  if (user.PASSWORD_ADMIN) {
    delete user.PASSWORD_ADMIN
  }

  console.log({ ...user })
  return jwt.sign({ ...user }, secretKey)
}

const verify = token => {
  try {
    return jwt.verify(token, secretKey)
  } catch (err) {
    console.error(err)
    return false
  }
}

module.exports = {
  signAdmin, verify
}