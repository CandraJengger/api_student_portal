const responseHelper = require('../helper/response-helper')
const hashHelper = require('../helper/hash-helper')
const LecturerModel = require('../models/LecturerAccountModel')

const isExist = async (id) => {
  const lecturerAccountResult = await LecturerModel
    .query()
    .where('NIP_dosen', '=', id)
  return lecturerAccountResult
}

const emailIsExist = async (email) => {
  const emailExist = await LecturerModel
    .query()
    .where('email_dosen', '=', email)
  return emailExist
}

const findAll = async (req, res) => {
  try {
    let lecturerAccountsResult = await LecturerModel
      .query()
      .orderBy('nama_dosen', 'ASC')

    lecturerAccountsResult = lecturerAccountsResult.map(lecturer => {
      lecturer.PASSWORD_DOSEN = hashHelper.generateHash(lecturer.PASSWORD_DOSEN)
      return lecturer
    })
    return responseHelper.responseOk(lecturerAccountsResult, 'Success', res)
  } catch (err) {
    return responseHelper.responseNotFound('', 'Lecturer Account not found', res)
  }
}

const findById = async (req, res) => {
  try {
    const { lecturerAccount } = req.body
    let lecturerAccountResult = await isExist(lecturerAccount.NIP_dosen)
    if (lecturerAccountResult.length === 0) {
      throw new Error('Not found')
    }

    lecturerAccountResult = lecturerAccountResult.map(lecturer => {
      lecturer.PASSWORD_DOSEN = hashHelper.generateHash(lecturer.PASSWORD_DOSEN)
      return lecturer
    })
    return responseHelper.responseOk(lecturerAccountResult, 'Success', res)
  } catch (err) {
    return responseHelper.responseNotFound('', 'Lecturer Account not found', res)
  }
}

const insert = async (req, res) => {
  try {
    const { lecturerAccount } = req.body

    const lecturerAccountIsExist = await isExist(lecturerAccount.NIP_dosen)
    if (lecturerAccountIsExist.length > 0) {
      throw new Error('Exist')
    }

    const newLecturerAccount = await LecturerModel
      .query()
      .insert({
        NIP_dosen: lecturerAccount.NIP_dosen,
        nama_dosen: lecturerAccount.nama_dosen,
        password_dosen: lecturerAccount.password_dosen,
        status_dosen: lecturerAccount.status_dosen,
        email_dosen: lecturerAccount.email_dosen
      })
    return responseHelper.responseOk(newLecturerAccount, 'Successfully add lecturer account', res)
  } catch (err) {
    if (err.message === 'Exist') {
      return responseHelper.responseBadRequest('', 'Lecturer Account is exist', res)
    }
    return responseHelper.responseBadRequest('', 'Bad Request', res)
  }
}

const update = async (req, res) => {
  try {
    const { lecturerAccount } = req.body
    const lecturerAccountIsExist = await isExist(lecturerAccount.NIP_dosen)
    if (lecturerAccountIsExist.length === 0) {
      throw new Error('Not found')
    }

    const lecturerAccountResult = await LecturerModel
      .query()
      .where('NIP_dosen', '=', lecturerAccount.NIP_dosen)
      .patch({
        NIP_dosen: lecturerAccount.NIP_dosen,
        nama_dosen: lecturerAccount.nama_dosen,
        password_dosen: lecturerAccount.password_dosen,
        status_dosen: lecturerAccount.status_dosen,
        email_dosen: lecturerAccount.email_dosen
      })
    return responseHelper.responseOk(lecturerAccountResult, 'Successfully update lecturer account', res)
  } catch (err) {
    if (err.message === 'Not found') {
      return responseHelper.responseNotFound('', 'Lecturer Account not found', res)
    }
    return responseHelper.responseBadRequest('', 'Bad Request', res)
  }
}

const destroy = async (req, res) => {
  try {
    const { lecturerAccount } = req.body
    const lecturerAccountIsExist = await isExist(lecturerAccount.NIP_dosen)
    if (lecturerAccountIsExist.length === 0) {
      throw new Error('Error')
    }

    const lecturerAccountResult = await LecturerModel
      .query()
      .delete()
      .where('NIP_dosen', '=', lecturerAccount.NIP_dosen)
    return responseHelper.responseOk(lecturerAccountResult, 'Successfully delete lecturer account', res)
  } catch (err) {
    return responseHelper.responseNotFound('', 'Lecturer Account not ound', res)
  }
}

module.exports = {
  isExist,
  findAll,
  findById,
  emailIsExist,
  insert,
  update,
  destroy
}