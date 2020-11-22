const responseHelper = require('../helper/response-helper')
const hashHelper = require('../helper/hash-helper')
const auth = require('../helper/auth-helper')
const { findByUsername: adminIsExist } = require('./admin-account-service')
const { isExist: studentIsExist } = require('./student-account-service')

const loginAdmin = async (req, res) => {
  try {
    const { username, password } = req.body

    if (!username || !password) {
      return responseHelper.responseNotFound('', 'Admin not found', res)
    }

    const admin = await adminIsExist(username)
    let encrytionPassword = ''
    if (admin[0] !== undefined) {
      encrytionPassword = hashHelper.generateHash(admin[0].PASSWORD_ADMIN)
    }
    if (!hashHelper.compareHash(password, encrytionPassword)) {
      return responseHelper.responseNotFound('', 'Admin not found', res)
    }
    if (!admin[0]) {
      return responseHelper.responseNotFound('', 'Admin not found', res)
    }

    const tokenadmin = auth.signAdmin(admin[0])
    return res.json({ token: tokenadmin })
  } catch (err) {
    console.log(err)
    return responseHelper.responseForbidden('', 'unauthenticated', res)
  }
}

const loginStudent = async (req, res) => {
  try {
    const { npm, password } = req.body

    if (!npm || !password) {
      return responseHelper.responseNotFound('', 'Student not found', res)
    }

    const student = await studentIsExist(npm)
    let encrytionPassword = ''
    if (student[0] !== undefined) {
      encrytionPassword = hashHelper.generateHash(student[0].PASSWORD_MHS)
    }
    if (!hashHelper.compareHash(password, encrytionPassword)) {
      return responseHelper.responseNotFound('', 'Student not found', res)
    }
    if (!student[0]) {
      return responseHelper.responseNotFound('', 'Student not found', res)
    }

    const tokenstudent = auth.signAdmin(student[0])
    return res.json({ token: tokenstudent })
  } catch (err) {
    console.log(err)
    return responseHelper.responseForbidden('', 'unauthenticated', res)
  }
}

const logout = async (req, res) => {
  try {
    console.log(req.context.user)
    if (!req.context.user) {
      return responseHelper.responseForbidden('', 'Forbidden', res)
    }

    req.context.user = {}
    return responseHelper.responseOk('', 'OK', res)
  } catch (err) {
    console.log(err)
    return responseHelper.responseInternalServerError('', 'Internal Server Error', res)
  }
}

module.exports = {
  loginAdmin,
  loginStudent,
  logout
}