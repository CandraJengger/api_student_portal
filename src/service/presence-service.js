const responseHelper = require('../helper/response-helper')
const PresenceModel = require('../models/PresenceModel')
const { isExist: adminExist } = require('./admin-account-service')
const { isExist: studentExist } = require('./student-account-service')

const isExist = async (id) => {
  const presenceResult = await PresenceModel
    .query()
    .where('id_presensi', '=', id)
  return presenceResult
}

const npmIsExist = async (npm) => {
  const npmResult = await PresenceModel
    .query()
    .where('npm_presensi', '=', npm)
  return npmResult
}

const weekSearch = async (npm, week) => {
  const weekResult = await PresenceModel
    .query()
    .where('npm_presensi', '=', npm)
    .where('minggu_presensi', '=', week)
  return weekResult
}

const findAll = async (req, res) => {
  try {
    const presenceResult = await PresenceModel
      .query()
      .orderBy('npm_presensi', 'ASC')
    return responseHelper.responseOk(presenceResult, 'Success', res)
  } catch (err) {
    return responseHelper.responseNotFound('', 'Error Not Found', res)
  }
}

const findById = async (req, res) => {
  try {
    const { presence } = req.params
    const presenceResult = await isExist(presence)
    if (presenceResult.length === 0) {
      throw new Error('Not found')
    }

    return responseHelper.responseOk(presenceResult, 'Success', res)
  } catch (err) {
    return responseHelper.responseNotFound('', 'Presence not found', res)
  }
}

const findByNPM = async (req, res) => {
  try {
    const { npm: presence } = req.params
    const presenceResult = await npmIsExist(presence)
    if (presenceResult.length === 0) {
      throw new Error('Not found')
    }

    return responseHelper.responseOk(presenceResult, 'Success', res)
  } catch (err) {
    return responseHelper.responseNotFound('', 'Presence not found', res)
  }
}

const findByWeek = async (req, res) => {
  try {
    const { npm, week } = req.params
    const presenceResult = await weekSearch(npm, week)
    if (presenceResult.length === 0) {
      throw new Error('Not found')
    }

    return responseHelper.responseOk(presenceResult, 'Success', res)
  } catch (err) {
    return responseHelper.responseNotFound('', 'Presence not found', res)
  }
}

const insert = async (req, res) => {
  try {
    const { presence } = req.body
    const presenceIsExist = await isExist(presence.id_presensi)
    const adminIsExist = await adminExist(presence.id_admin)
    const studentIsExist = await studentExist(presence.npm_presensi)

    if (adminIsExist.length === 0) {
      throw new Error('Admin not found')
    }
    if (studentIsExist.length === 0) {
      throw new Error('Student not found')
    }
    if (presenceIsExist.length > 0) {
      throw new Error('Exist')
    }

    const newPresence = await PresenceModel
      .query()
      .insert({
        id_presensi: presence.id_presensi,
        id_admin: presence.id_admin,
        minggu_presensi: presence.minggu_presensi,
        tanggal_presensi: presence.tanggal_presensi,
        keterangan_presensi: presence.keterangan_presensi,
        npm_presensi: presence.npm_presensi,
        total_jam: presence.total_jam
      })
    return responseHelper.responseOk(newPresence, 'Successfully add presence', res)
  } catch (err) {
    console.log(err)
    if (err.message === 'Admin not found') {
      return responseHelper.responseNotFound('', 'Admin not found', res)
    }
    if (err.message === 'Student not found') {
      return responseHelper.responseNotFound('', 'Student not found', res)
    }
    if (err.message === 'Exist') {
      return responseHelper.responseBadRequest('', 'Presence is exist', res)
    }
    return responseHelper.responseBadRequest('', 'Bad Request', res)
  }
}

const update = async (req, res) => {
  try {
    const { presence } = req.body
    const presenceIsExist = await isExist(presence.id_presensi)
    const adminIsExist = await adminExist(presence.id_admin)
    const studentIsExist = await studentExist(presence.npm_presensi)

    if (adminIsExist.length === 0) {
      throw new Error('Admin not found')
    }
    if (studentIsExist.length === 0) {
      throw new Error('Student not found')
    }
    if (presenceIsExist.length === 0) {
      throw new Error('Not found')
    }

    const presenceResult = await PresenceModel
      .query()
      .where('id_presensi', '=', presence.id_presensi)
      .patch({
        id_presensi: presence.id_presensi,
        id_admin: presence.id_admin,
        minggu_presensi: presence.minggu_presensi,
        tanggal_presensi: presence.tanggal_presensi,
        keterangan_presensi: presence.keterangan_presensi,
        npm_presensi: presence.npm_presensi,
        total_jam: presence.total_jam
      })
    return responseHelper.responseOk(presenceResult, 'Successfully update presence', res)
  } catch (err) {
    if (err.message === 'Admin not found') {
      return responseHelper.responseNotFound('', 'Admin not found', res)
    }
    if (err.message === 'Student not found') {
      return responseHelper.responseNotFound('', 'Student not found', res)
    }
    if (err.message === 'Not found') {
      return responseHelper.responseNotFound('', 'Presence not found', res)
    }
    return responseHelper.responseBadRequest('', 'Bad Request', res)
  }
}

const destroy = async (req, res) => {
  try {
    const { presence } = req.body
    const presenceIsExist = await isExist(presence.id_presensi)
    if (presenceIsExist.length === 0) {
      throw new Error('Not found')
    }

    const presenceResult = await PresenceModel
      .query()
      .delete()
      .where('id_presensi', '=', presence.id_presensi)
    return responseHelper.responseOk(presenceResult, 'Successfully delete presence', res)
  } catch (err) {
    console.log(err)
    return responseHelper.responseNotFound('', 'Presence not found', res)
  }
}

module.exports = {
  isExist,
  findAll,
  findById,
  findByNPM,
  findByWeek,
  insert,
  update,
  destroy
}
