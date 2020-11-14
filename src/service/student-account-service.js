const responseHelper = require('../helper/response-helper')
const hashHelper = require('../helper/hash-helper')
const StudentAccountModel = require('../models/StudentAccountModel')

const isExist = async (id) => {
  const studentAccountResult = await StudentAccountModel
    .query()
    .where('npm', '=', id)
  return studentAccountResult
}

let encryptionPassword = ''

const findAll = async (req, res) => {
  try {
    const studentAccountsResult = await StudentAccountModel
      .query()
      .orderBy('npm', 'ASC')
    return responseHelper.responseOk(studentAccountsResult, 'Success', res)
  } catch (err) {
    return responseHelper.responseNotFound('', 'Student Account not found', res)
  }
}

const findById = async (req, res) => {
  try {
    const { studentAccount } = req.body
    const studentAccountResult = await isExist(studentAccount.npm)
    if (studentAccountResult.length === 0) {
      throw new Error('Not found')
    }

    return responseHelper.responseOk(studentAccountResult, 'Success', res)
  } catch (err) {
    return responseHelper.responseNotFound('', 'Student Account not found', res)
  }
}

const insert = async (req, res) => {
  try {
    const { studentAccount } = req.body

    const studentAccountIsExist = await isExist(studentAccount.npm)
    if (studentAccountIsExist.length > 0) {
      throw new Error('Exist')
    }

    encryptionPassword = hashHelper.generateHash(studentAccount.password_mhs)

    const newStudentAccount = await StudentAccountModel
      .query()
      .insert({
        npm: studentAccount.npm,
        password_mhs: encryptionPassword,
        status_mhs: studentAccount.status_mhs
      })
    return responseHelper.responseOk(newStudentAccount, 'Successfully add student account', res)
  } catch (err) {
    if (err.message === 'Exist') {
      return responseHelper.responseBadRequest('', 'Student Account is exist', res)
    }
    return responseHelper.responseBadRequest('', 'Bad Request', res)
  }
}

const update = async (req, res) => {
  try {
    const { studentAccount } = req.body
    const studentAccountIsExist = await isExist(studentAccount.npm)
    if (studentAccountIsExist.length === 0) {
      throw new Error('Not found')
    }

    encryptionPassword = hashHelper.generateHash(studentAccount.password_mhs)

    const studentAccountResult = await StudentAccountModel
      .query()
      .where('npm', '=', studentAccount.npm)
      .patch({
        npm: studentAccount.npm,
        password_mhs: encryptionPassword,
        status_mhs: studentAccount.status_mhs
      })
    return responseHelper.responseOk(studentAccountResult, 'Successfully update student account', res)
  } catch (err) {
    if (err.message === 'Not found') {
      return responseHelper.responseNotFound('', 'Student Account not found', res)
    }
    return responseHelper.responseBadRequest('', 'Bad Request', res)
  }
}

const destroy = async (req, res) => {
  try {
    const { studentAccount } = req.body
    const studentAccountIsExist = await isExist(studentAccount.npm)
    if (studentAccountIsExist.length === 0) {
      throw new Error('Error')
    }

    const studentAccountResult = await StudentAccountModel
      .query()
      .delete()
      .where('npm', '=', studentAccount.npm)
    return responseHelper.responseOk(studentAccountResult, 'Successfully delete student account', res)
  } catch (err) {
    return responseHelper.responseNotFound('', 'Student Account not found', res)
  }
}

module.exports = {
  isExist,
  findAll,
  findById,
  insert,
  update,
  destroy
}