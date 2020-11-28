const jwt = require('jsonwebtoken')

const secretKey = 'secret'

const signAdmin = user => {
  if (user.PASSWORD_ADMIN) {
    delete user.PASSWORD_ADMIN
  }

  console.log({ ...user })
  return jwt.sign({ ...user }, secretKey)
}

const signStudent = user => {
  if (user.PASSWORD_MHS) {
    delete user.PASSWORD_MHS
  }

  console.log({ ...user })
  return jwt.sign({ ...user }, secretKey)
}

const signLecturer = user => {
  if (user.PASSWORD_DOSEN) {
    delete user.PASSWORD_DOSEN
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
  signAdmin,
  signStudent,
  signLecturer,
  verify
}