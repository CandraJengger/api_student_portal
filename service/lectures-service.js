const responseHelper = require('../helper/response-helper')
const LecturesModel = require('../models/LecturesModel')
const { isExist: semesterExist } = require('./semester-service')
const { isExist: classExist } = require('./class-service')
const { isExist: roomExist } = require('./room-service')
const { isExist: scheduleExist } = require('./class-schedule-service')

const isExist = async (id) => {
  const lecturesResult = await LecturesModel
    .query()
    .where('kode_perkuliahan', '=', id)
    .withGraphJoined('[semesters, classSchedules, class]')
  return lecturesResult
}

const findAll = async (req, res) => {
  try {
    const lecturesResult = await LecturesModel
      .query()
      .orderBy('kode_kelas', 'ASC')
    return responseHelper.responseOk(lecturesResult, 'Success', res)
  } catch (err) {
    console.log(err)
    return responseHelper.responseNotFound('', 'Error Not Found', res)
  }
}

const findById = async (req, res) => {
  try {
    const { lectures } = req.body
    const lecturesResult = await isExist(lectures.kode_perkuliahan)
    if (lecturesResult.length === 0) {
      throw new Error('Not found')
    }

    return responseHelper.responseOk(lecturesResult, 'Success', res)
  } catch (err) {
    return responseHelper.responseNotFound('', 'Lectures not found', res)
  }
}

const insert = async (req, res) => {
  try {
    const { lectures } = req.body
    const lecturesIsExist = await isExist(lectures.kode_perkuliahan)
    const scheduleIsExist = await scheduleExist(lectures.kode_jadwal)
    const semesterIsExist = await semesterExist(lectures.kode_semester)
    const roomIsExist = await roomExist(lectures.kode_ruang)
    const classIsExist = await classExist(lectures.kode_kelas)

    if (scheduleIsExist.length === 0) {
      throw new Error('Schedule not found')
    }
    if (semesterIsExist.length === 0) {
      throw new Error('Semester not found')
    }
    if (roomIsExist.length === 0) {
      throw new Error('Room not found')
    }
    if (classIsExist.length === 0) {
      throw new Error('Class not found')
    }
    if (lecturesIsExist.length > 0) {
      throw new Error('Exist')
    }

    const newLectures = await LecturesModel
      .query()
      .insert({
        kode_perkuliahan: lectures.kode_perkuliahan,
        kode_semester: lectures.kode_semester,
        kode_kelas: lectures.kode_kelas,
        kode_ruang: lectures.kode_ruang,
        kode_jadwal: lectures.kode_jadwal
      })
    return responseHelper.responseOk(newLectures, 'Successfully add lectures', res)
  } catch (err) {
    if (err.message === 'Schedule not found') {
      return responseHelper.responseNotFound('', 'Schedule not found', res)
    }
    if (err.message === 'Semester not found') {
      return responseHelper.responseNotFound('', 'Semester not found', res)
    }
    if (err.message === 'Room not found') {
      return responseHelper.responseNotFound('', 'Room not found', res)
    }
    if (err.message === 'Class not found') {
      return responseHelper.responseNotFound('', 'Class not found', res)
    }
    if (err.message === 'Exist') {
      return responseHelper.responseBadRequest('', 'Lectures is exist', res)
    }
    return responseHelper.responseBadRequest('', 'Bad Request', res)
  }
}

const update = async (req, res) => {
  try {
    const { lectures } = req.body
    const lecturesIsExist = await isExist(lectures.kode_perkuliahan)
    const scheduleIsExist = await scheduleExist(lectures.kode_jadwal)
    const semesterIsExist = await semesterExist(lectures.kode_semester)
    const roomIsExist = await roomExist(lectures.kode_ruang)
    const classIsExist = await classExist(lectures.kode_kelas)

    if (scheduleIsExist.length === 0) {
      throw new Error('Schedule not found')
    }
    if (semesterIsExist.length === 0) {
      throw new Error('Semester not found')
    }
    if (roomIsExist.length === 0) {
      throw new Error('Room not found')
    }
    if (classIsExist.length === 0) {
      throw new Error('Class not found')
    }
    if (lecturesIsExist.length === 0) {
      throw new Error('Not found')
    }

    const lecturesResult = await LecturesModel
      .query()
      .where('kode_perkuliahan', '=', lectures.kode_perkuliahan)
      .patch({
        kode_perkuliahan: lectures.kode_perkuliahan,
        kode_semester: lectures.kode_semester,
        kode_kelas: lectures.kode_kelas,
        kode_ruang: lectures.kode_ruang,
        kode_jadwal: lectures.kode_jadwal
      })
    return responseHelper.responseOk(lecturesResult, 'Successfully update lectures', res)
  } catch (err) {
    if (err.message === 'Schedule not found') {
      return responseHelper.responseNotFound('', 'Schedule not found', res)
    }
    if (err.message === 'Semester not found') {
      return responseHelper.responseNotFound('', 'Semester not found', res)
    }
    if (err.message === 'Room not found') {
      return responseHelper.responseNotFound('', 'Room not found', res)
    }
    if (err.message === 'Class not found') {
      return responseHelper.responseNotFound('', 'Class not found', res)
    }
    if (err.message === 'Not found') {
      return responseHelper.responseNotFound('', 'Lectures not found', res)
    }
    return responseHelper.responseBadRequest('', 'Bad Request', res)
  }
}

const destroy = async (req, res) => {
  try {
    const { lectures } = req.body
    const lecturesIsExist = await isExist(lectures.kode_perkuliahan)
    if (lecturesIsExist.length === 0) {
      throw new Error('Not found')
    }

    const lecturesResult = await LecturesModel
      .query()
      .delete()
      .where('kode_jadwal', '=', lectures.kode_perkuliahan)
    return responseHelper.responseOk(lecturesResult, 'Successfully delete lectures', res)
  } catch (err) {
    return responseHelper.responseNotFound('', 'Lectures not found', res)
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
