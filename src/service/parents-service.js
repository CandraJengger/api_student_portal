const responseHelper = require('../helper/response-helper')
const ParentsModel = require('../models/ParentsModel')
const { isExist: studentExist } = require('./student-account-service')

const isExist = async (id) => {
  const parentsResult = await ParentsModel
    .query()
    .where('nik_ortu', '=', id)
  return parentsResult
}

const npmIsExist = async (npm) => {
  const npmResult = await ParentsModel
    .query()
    .where('npm', '=', npm)
  return npmResult
}

const findAll = async (req, res) => {
  try {
    const parentsResult = await ParentsModel
      .query()
      .orderBy('npm', 'ASC')
    return responseHelper.responseOk(parentsResult, 'Success', res)
  } catch (err) {
    return responseHelper.responseNotFound('', 'Error Not Found', res)
  }
}

const findById = async (req, res) => {
  try {
    const { npm } = req.params
    const parentsResult = await npmIsExist(npm)
    if (parentsResult.length === 0) {
      throw new Error('Not found')
    }

    return responseHelper.responseOk(parentsResult, 'Success', res)
  } catch (err) {
    return responseHelper.responseNotFound('', 'Parents data not found', res)
  }
}

const insert = async (req, res) => {
  try {
    const { parents } = req.body

    const parentsIsExist = await isExist(parents.nik_ortu)
    const studentIsExist = await studentExist(parents.npm)

    if (studentIsExist.length === 0) {
      throw new Error('Student not found')
    }
    if (parentsIsExist.length > 0) {
      throw new Error('Exist')
    }

    const newParents = await ParentsModel
      .query()
      .insert({
        nik_ortu: parents.nik_ortu,
        npm: parents.npm,
        nama_ortu: parents.nama_ortu,
        pendidikan_ortu: parents.pendidikan_ortu,
        pekerjaan_ortu: parents.pekerjaan_ortu,
        NIP_ortu: parents.NIP_ortu,
        pangkat_ortu: parents.pangkat_ortu,
        penghasilan_ortu: parents.penghasilan_ortu,
        instansi_ortu: parents.instansi_ortu,
        tanggal_lahir_ortu: parents.tanggal_lahir_ortu,
        status_ortu: parents.status_ortu
      })
    return responseHelper.responseOk(newParents, 'Successfully add parents data', res)
  } catch (err) {
    console.log(err)
    if (err.message === 'Student not found') {
      return responseHelper.responseNotFound('', 'Student not found', res)
    }
    if (err.message === 'Exist') {
      return responseHelper.responseBadRequest('', 'Parents data is exist', res)
    }
    return responseHelper.responseBadRequest('', 'Bad Request', res)
  }
}

const update = async (req, res) => {
  try {
    const { parents } = req.body
    const parentsIsExist = await isExist(parents.nik_ortu)
    const studentIsExist = await studentExist(parents.npm)

    if (studentIsExist.length === 0) {
      throw new Error('Student not found')
    }
    if (parentsIsExist.length === 0) {
      throw new Error('Not found')
    }

    const parentsResult = await ParentsModel
      .query()
      .where('nik_ortu', '=', parents.nik_ortu)
      .patch({
        nik_ortu: parents.nik_ortu,
        npm: parents.npm,
        nama_ortu: parents.nama_ortu,
        pendidikan_ortu: parents.pendidikan_ortu,
        pekerjaan_ortu: parents.pekerjaan_ortu,
        NIP_ortu: parents.NIP_ortu,
        pangkat_ortu: parents.pangkat_ortu,
        penghasilan_ortu: parents.penghasilan_ortu,
        instansi_ortu: parents.instansi_ortu,
        tanggal_lahir_ortu: parents.tanggal_lahir_ortu,
        status_ortu: parents.status_ortu
      })
    return responseHelper.responseOk(parentsResult, 'Successfully update parents data', res)
  } catch (err) {
    if (err.message === 'Student not found') {
      return responseHelper.responseNotFound('', 'Student not found', res)
    }
    if (err.message === 'Not found') {
      return responseHelper.responseNotFound('', 'Parents data not found', res)
    }
    return responseHelper.responseBadRequest('', 'Bad Request', res)
  }
}

const destroy = async (req, res) => {
  try {
    const { parents } = req.body
    const parentsIsExist = await isExist(parents.nik_ortu)
    if (parentsIsExist.length === 0) {
      throw new Error('Not found')
    }

    const parentsResult = await ParentsModel
      .query()
      .delete()
      .where('nik_ortu', '=', parents.nik_ortu)
    return responseHelper.responseOk(parentsResult, 'Successfully delete parents data', res)
  } catch (err) {
    console.log(err)
    return responseHelper.responseNotFound('', 'Parents data not found', res)
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
