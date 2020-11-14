const responseHelper = require('../helper/response-helper')
const UKTModel = require('../models/UKTModel')
const { isExist: adminExist } = require('./admin-account-service')
const { isExist: studentExist } = require('./student-account-service')

const isExist = async (id) => {
  const uktResult = await UKTModel
    .query()
    .where('kode_ukt', '=', id)
  return uktResult
}

const studentHaveUKT = async (npm) => {
  const studentResult = await UKTModel
    .query()
    .where('npm_ukt', '=', npm)

  return studentResult
}

const findAll = async (req, res) => {
  try {
    const UKTResult = await UKTModel
      .query()
      .orderBy('npm_ukt', 'ASC')
    return responseHelper.responseOk(UKTResult, 'Success', res)
  } catch (err) {
    return responseHelper.responseNotFound('', 'Error Not Found', res)
  }
}

const findById = async (req, res) => {
  try {
    const { ukt } = req.body
    const uktResult = await isExist(ukt.kode_ukt)
    if (uktResult.length === 0) {
      throw new Error('Not found')
    }

    return responseHelper.responseOk(uktResult, 'Success', res)
  } catch (err) {
    return responseHelper.responseNotFound('', 'UKT not found', res)
  }
}

const insert = async (req, res) => {
  try {
    const { ukt } = req.body
    const uktIsExist = await isExist(ukt.kode_ukt)
    const adminIsExist = await adminExist(ukt.id_admin)
    const studentIsExist = await studentExist(ukt.npm_ukt)

    const studentAlreadyHaveUKT = await studentHaveUKT(ukt.npm_ukt)
    let npmExist = ''
    if (studentAlreadyHaveUKT[0] !== undefined) {
      const { NPM_UKT } = studentAlreadyHaveUKT[0]
      npmExist = NPM_UKT
    }
    if (npmExist === ukt.npm_ukt) {
      throw new Error('Student already have ukt')
    }
    if (adminIsExist.length === 0) {
      throw new Error('Admin not found')
    }
    if (studentIsExist.length === 0) {
      throw new Error('Student not found')
    }
    if (uktIsExist.length > 0) {
      throw new Error('Exist')
    }

    const newUKT = await UKTModel
      .query()
      .insert({
        kode_ukt: ukt.kode_ukt,
        id_admin: ukt.id_admin,
        golongan_ukt: ukt.golongan_ukt,
        jumlah_ukt: ukt.jumlah_ukt,
        npm_ukt: ukt.npm_ukt
      })
    return responseHelper.responseOk(newUKT, 'Successfully add ukt', res)
  } catch (err) {
    console.log(err)
    if (err.message === 'Student already have ukt') {
      return responseHelper.responseBadRequest('', 'Student already have ukt', res)
    }
    if (err.message === 'Admin not found') {
      return responseHelper.responseNotFound('', 'Admin not found', res)
    }
    if (err.message === 'Student not found') {
      return responseHelper.responseNotFound('', 'Student not found', res)
    }
    if (err.message === 'Exist') {
      return responseHelper.responseBadRequest('', 'UKT is exist', res)
    }
    return responseHelper.responseBadRequest('', 'Bad Request', res)
  }
}

const update = async (req, res) => {
  try {
    const { ukt } = req.body
    const uktIsExist = await isExist(ukt.kode_ukt)
    const adminIsExist = await adminExist(ukt.id_admin)
    const studentIsExist = await studentExist(ukt.npm_ukt)

    if (adminIsExist.length === 0) {
      throw new Error('Admin not found')
    }
    if (studentIsExist.length === 0) {
      throw new Error('Student not found')
    }
    if (uktIsExist.length === 0) {
      throw new Error('Not found')
    }

    const uktResult = await UKTModel
      .query()
      .where('npm_ukt', '=', ukt.npm_ukt)
      .patch({
        id_admin: ukt.id_admin,
        golongan_ukt: ukt.golongan_ukt,
        jumlah_ukt: ukt.jumlah_ukt,
        npm_ukt: ukt.npm_ukt
      })
    return responseHelper.responseOk(uktResult, 'Successfully update ukt', res)
  } catch (err) {
    if (err.message === 'Admin not found') {
      return responseHelper.responseNotFound('', 'Admin not found', res)
    }
    if (err.message === 'Student not found') {
      return responseHelper.responseNotFound('', 'Student not found', res)
    }
    if (err.message === 'Not found') {
      return responseHelper.responseNotFound('', 'UKT not found', res)
    }
    return responseHelper.responseBadRequest('', 'Bad Request', res)
  }
}

const destroy = async (req, res) => {
  try {
    const { ukt } = req.body
    const uktIsExist = await isExist(ukt.kode_ukt)
    if (uktIsExist.length === 0) {
      throw new Error('Not found')
    }

    const uktResult = await UKTModel
      .query()
      .delete()
      .where('kode_ukt', '=', ukt.kode_ukt)
    return responseHelper.responseOk(uktResult, 'Successfully delete ukt', res)
  } catch (err) {
    return responseHelper.responseNotFound('', 'UKT not found', res)
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
