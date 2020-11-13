const responseHelper = require('../helper/response-helper')
const ClassScheduleModel = require('../models/ClassScheduleModel')
const { isExist: coursesExist } = require('./courses-service')
const { isExist: lecturerAccountExist } = require('./lecturer-account-service')

const isExist = async (id) => {
  const scheduleResult = await ClassScheduleModel
    .query()
    .where('kode_jadwal', '=', id)
    .withGraphJoined('courses')
  return scheduleResult
}

const findAll = async (req, res) => {
  try {
    const schedulesResult = await ClassScheduleModel
      .query()
      .orderBy('kode_jadwal', 'ASC')
    return responseHelper.responseOk(schedulesResult, 'Success', res)
  } catch (err) {
    return responseHelper.responseNotFound('', 'Error Not Found', res)
  }
}

const findById = async (req, res) => {
  try {
    const { classSchedule } = req.body
    const scheduleResult = await isExist(classSchedule.kode_jadwal)
    if (scheduleResult.length === 0) {
      throw new Error('Not found')
    }

    return responseHelper.responseOk(scheduleResult, 'Success', res)
  } catch (err) {
    return responseHelper.responseNotFound('', 'Class Schedule not found', res)
  }
}

const insert = async (req, res) => {
  try {
    const { classSchedule } = req.body
    const scheduleIsExist = await isExist(classSchedule.kode_jadwal)
    const lecturerAccountIsExist = await lecturerAccountExist(classSchedule.NIP_dosen)
    const coursesIsExist = await coursesExist(classSchedule.kode_mk)

    if (lecturerAccountIsExist.length === 0) {
      throw new Error('Account not found')
    }
    if (coursesIsExist.length === 0) {
      throw new Error('Courses not found')
    }
    if (scheduleIsExist.length > 0) {
      throw new Error('Exist')
    }

    const newSchedule = await ClassScheduleModel
      .query()
      .insert({
        kode_jadwal: classSchedule.kode_jadwal,
        NIP_dosen: classSchedule.NIP_dosen,
        kode_mk: classSchedule.kode_mk,
        jam_mulai: classSchedule.jam_mulai,
        jam_selesai: classSchedule.jam_selesai
      })
    return responseHelper.responseOk(newSchedule, 'Successfully add class schedule', res)
  } catch (err) {
    if (err.message === 'Account not found') {
      return responseHelper.responseNotFound('', 'Lecturer Account not found', res)
    }
    if (err.message === 'Courses not found') {
      return responseHelper.responseNotFound('', 'Courses not found', res)
    }
    if (err.message === 'Exist') {
      return responseHelper.responseBadRequest('', 'Class Schedule is exist', res)
    }
    return responseHelper.responseBadRequest('', 'Bad Request', res)
  }
}

const update = async (req, res) => {
  try {
    const { classSchedule } = req.body
    const scheduleIsExist = await isExist(classSchedule.kode_jadwal)
    const lecturerAccountIsExist = await lecturerAccountExist(classSchedule.NIP_dosen)
    const coursesIsExist = await coursesExist(classSchedule.kode_mk)

    if (lecturerAccountIsExist.length === 0) {
      throw new Error('Account not found')
    }
    if (coursesIsExist.length === 0) {
      throw new Error('Courses not found')
    }
    if (scheduleIsExist.length === 0) {
      throw new Error('Not found')
    }

    const scheduleResult = await ClassScheduleModel
      .query()
      .where('kode_jadwal', '=', classSchedule.kode_jadwal)
      .patch({
        kode_jadwal: classSchedule.kode_jadwal,
        NIP_dosen: classSchedule.NIP_dosen,
        kode_mk: classSchedule.kode_mk,
        jam_mulai: classSchedule.jam_mulai,
        jam_selesai: classSchedule.jam_selesai
      })
    return responseHelper.responseOk(scheduleResult, 'Successfully update class schedule', res)
  } catch (err) {
    if (err.message === 'Account not found') {
      return responseHelper.responseNotFound('', 'Account not found', res)
    }
    if (err.message === 'Courses not found') {
      return responseHelper.responseNotFound('', 'Courses not found', res)
    }
    if (err.message === 'Not found') {
      return responseHelper.responseNotFound('', 'Class Schedule not found', res)
    }
    return responseHelper.responseBadRequest('', 'Bad Request', res)
  }
}

const destroy = async (req, res) => {
  try {
    const { classSchedule } = req.body
    const scheduleIsExist = await isExist(classSchedule.kode_jadwal)
    if (scheduleIsExist.length === 0) {
      throw new Error('Not found')
    }

    const scheduleResult = await ClassScheduleModel
      .query()
      .delete()
      .where('kode_jadwal', '=', classSchedule.kode_jadwal)
    return responseHelper.responseOk(scheduleResult, 'Successfully delete class schedule', res)
  } catch (err) {
    return responseHelper.responseNotFound('', 'Class Schedule not found', res)
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
