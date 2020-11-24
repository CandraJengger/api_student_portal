const responseHelper = require('../helper/response-helper')
const PresenceModel = require('../models/PresenceModel')
const { isExist: adminExist } = require('./admin-account-service')
const { isExist: semesterExist } = require('./semester-service')
const { isExist: lecturesExist } = require('./lectures-service')
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

const weekSearch = async (npm, semester, week) => {
  const weekResult = await PresenceModel
    .query()
    .where('npm_presensi', '=', npm)
    .where('kode_semester_presensi', '=', semester)
    .where('minggu_presensi', '=', week)
  return weekResult
}

const semesterSearch = async (npm, semester) => {
  const weekResult = await PresenceModel
    .query()
    .where('npm_presensi', '=', npm)
    .where('kode_semester_presensi', '=', semester)
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
    const { npm, semester, week } = req.params
    const presenceResult = await weekSearch(npm, semester, week)
    if (presenceResult.length === 0) {
      throw new Error('Not found')
    }

    return responseHelper.responseOk(presenceResult, 'Success', res)
  } catch (err) {
    return responseHelper.responseNotFound('', 'Presence not found', res)
  }
}

const findBySemester = async (req, res) => {
  try {
    const { npm, semester } = req.params
    const presenceResult = await semesterSearch(npm, semester)
    if (presenceResult.length === 0) {
      throw new Error('Not found')
    }

    return responseHelper.responseOk(presenceResult, 'Success', res)
  } catch (err) {
    console.log(err)
    return responseHelper.responseNotFound('', 'Presence not found', res)
  }
}

const getTotalPrecenceBySemester = async (req, res) => {
  try {
    const { npm, semester } = req.params
    const presenceResult = await semesterSearch(npm, semester)
    if (presenceResult.length === 0) {
      throw new Error('Not found')
    }

    let resultHadir = presenceResult.filter(presence => presence.KETERANGAN_PRESENSI === 'hadir')
    let resultIzin = presenceResult.filter(presence => presence.KETERANGAN_PRESENSI === 'izin')
    let resultAlpha = presenceResult.filter(presence => presence.KETERANGAN_PRESENSI === 'alpha')
    let resultKosong = presenceResult.filter(presence => presence.KETERANGAN_PRESENSI === 'kosong')

    if (resultHadir.length !== 0) {
      resultHadir = resultHadir.map(presence => presence.TOTAL_JAM).reduce((acc, cur) => acc + cur)
    }
    if (resultAlpha.length !== 0) {
      resultAlpha = resultAlpha.map(presence => presence.TOTAL_JAM).reduce((acc, cur) => acc + cur)
    }
    if (resultIzin.length !== 0) {
      resultIzin = resultIzin.map(presence => presence.TOTAL_JAM).reduce((acc, cur) => acc + cur)
    }
    if (resultKosong.length !== 0) {
      resultKosong = resultKosong.map(presence => presence.TOTAL_JAM).reduce((acc, cur) => acc + cur)
    }
    const resTotalPresence = {
      hadir: resultHadir.length === 0 ? 0 : resultHadir,
      izin: resultIzin.length === 0 ? 0 : resultIzin,
      alpha: resultAlpha.length === 0 ? 0 : resultAlpha,
      kosong: resultKosong.length === 0 ? 0 : resultKosong
    }

    return responseHelper.responseOk(resTotalPresence, 'Success', res)
  } catch (err) {
    console.log(err)
    return responseHelper.responseNotFound('', 'Presence not found', res)
  }
}

const insert = async (req, res) => {
  try {
    const { presence } = req.body
    const presenceIsExist = await isExist(presence.id_presensi)
    const adminIsExist = await adminExist(presence.id_admin)
    const studentIsExist = await studentExist(presence.npm_presensi)
    const semesterIsExist = await semesterExist(presence.kode_semester_presensi)
    const lecturesIsExist = await lecturesExist(presence.kode_perkuliahan_presensi)

    if (adminIsExist.length === 0) {
      throw new Error('Admin not found')
    }
    if (studentIsExist.length === 0) {
      throw new Error('Student not found')
    }
    if (semesterIsExist.length === 0) {
      throw new Error('Semester not found')
    }
    if (lecturesIsExist.length === 0) {
      throw new Error('Lectures not found')
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
        total_jam: presence.total_jam,
        kode_semester_presensi: presence.kode_semester_presensi,
        kode_perkuliahan_presensi: presence.kode_perkuliahan_presensi
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
    if (err.message === 'Semester not found') {
      return responseHelper.responseNotFound('', 'Semester not found', res)
    }
    if (err.message === 'Lectures not found') {
      return responseHelper.responseNotFound('', 'Lectures not found', res)
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
    const semesterIsExist = await semesterExist(presence.kode_semester_presensi)
    const lecturesIsExist = await lecturesExist(presence.kode_perkuliahan_presensi)

    if (adminIsExist.length === 0) {
      throw new Error('Admin not found')
    }
    if (studentIsExist.length === 0) {
      throw new Error('Student not found')
    }
    if (semesterIsExist.length === 0) {
      throw new Error('Semester not found')
    }
    if (lecturesIsExist.length === 0) {
      throw new Error('Lectures not found')
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
        total_jam: presence.total_jam,
        kode_semester_presensi: presence.kode_semester_presensi,
        kode_perkuliahan_presensi: presence.kode_perkuliahan_presensi
      })
    return responseHelper.responseOk(presenceResult, 'Successfully update presence', res)
  } catch (err) {
    if (err.message === 'Admin not found') {
      return responseHelper.responseNotFound('', 'Admin not found', res)
    }
    if (err.message === 'Student not found') {
      return responseHelper.responseNotFound('', 'Student not found', res)
    }
    if (err.message === 'Semester not found') {
      return responseHelper.responseNotFound('', 'Semester not found', res)
    }
    if (err.message === 'Lectures not found') {
      return responseHelper.responseNotFound('', 'Lectures not found', res)
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
  findBySemester,
  getTotalPrecenceBySemester,
  insert,
  update,
  destroy
}
