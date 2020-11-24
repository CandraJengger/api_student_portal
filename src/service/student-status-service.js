const responseHelper = require('../helper/response-helper')
const StudentStatusModel = require('../models/StudentStatusModel')
const { isExist: semesterExist } = require('./semester-service')
const { isExist: classExist } = require('./class-service')
const { isExist: studyProgramExist } = require('./study-program-service')
const { isExist: studentExist } = require('./student-account-service')
const { isExist: adminExist } = require('./admin-account-service')
const { isExist: batchExist } = require('./batch-service')

const isExist = async (id) => {
  const studentStatusResult = await StudentStatusModel
    .query()
    .where('kode_status', '=', id)
    // .withGraphJoined('[semesters, classSchedules, class]')
  return studentStatusResult
}

const studentInTheClass = async (npm) => {
  const studentResult = await StudentStatusModel
    .query()
    .where('npm', '=', npm)
  return studentResult
}

const findAll = async (req, res) => {
  try {
    const studentStatusResult = await StudentStatusModel
      .query()
      .orderBy('npm', 'ASC')
    return responseHelper.responseOk(studentStatusResult, 'Success', res)
  } catch (err) {
    console.log(err)
    return responseHelper.responseNotFound('', 'Error Not Found', res)
  }
}

const findById = async (req, res) => {
  try {
    const { studentStatus } = req.body
    const studentStatusResult = await isExist(studentStatus.kode_status)
    if (studentStatusResult.length === 0) {
      throw new Error('Not found')
    }

    return responseHelper.responseOk(studentStatusResult, 'Success', res)
  } catch (err) {
    return responseHelper.responseNotFound('', 'Student Status not found', res)
  }
}

const findByNPM = async (req, res) => {
  try {
    const { npm: studentStatus } = req.params
    const studentStatusResult = await studentInTheClass(studentStatus)
    if (studentStatusResult.length === 0) {
      throw new Error('Not found')
    }

    return responseHelper.responseOk(studentStatusResult, 'Success', res)
  } catch (err) {
    return responseHelper.responseNotFound('', 'Student Status not found', res)
  }
}

const insert = async (req, res) => {
  try {
    const { studentStatus } = req.body
    const studentStatusIsExist = await isExist(studentStatus.kode_status)
    const batchIsExist = await batchExist(studentStatus.kode_angkatan)
    const semesterIsExist = await semesterExist(studentStatus.kode_semester)
    const studyProgramIsExist = await studyProgramExist(studentStatus.id_prodi)
    const classIsExist = await classExist(studentStatus.kode_kelas)
    const studentAccountIsExist = await studentExist(studentStatus.npm)
    const adminAccountIsExist = await adminExist(studentStatus.id_admin)

    const studentAlreadyInClass = await studentInTheClass(studentStatus.npm)
    let npmExist = ''
    if (studentAlreadyInClass[0] !== undefined) {
      const { NPM } = studentAlreadyInClass[0]
      npmExist = NPM
    }

    if (npmExist === studentStatus.npm) {
      throw new Error('Student already in class')
    }

    if (batchIsExist.length === 0) {
      throw new Error('Batch not found')
    }
    if (semesterIsExist.length === 0) {
      throw new Error('Semester not found')
    }
    if (studyProgramIsExist.length === 0) {
      throw new Error('Study Program not found')
    }
    if (classIsExist.length === 0) {
      throw new Error('Class not found')
    }
    if (studentAccountIsExist.length === 0) {
      throw new Error('Student not found')
    }
    if (adminAccountIsExist.length === 0) {
      throw new Error('Admin not found')
    }
    if (studentStatusIsExist.length > 0) {
      throw new Error('Exist')
    }

    const newStudentStatus = await StudentStatusModel
      .query()
      .insert({
        kode_status: studentStatus.kode_status,
        kode_semester: studentStatus.kode_semester,
        kode_kelas: studentStatus.kode_kelas,
        kode_angkatan: studentStatus.kode_angkatan,
        id_prodi: studentStatus.id_prodi,
        id_admin: studentStatus.id_admin,
        npm: studentStatus.npm
      })
    return responseHelper.responseOk(newStudentStatus, 'Successfully add student status', res)
  } catch (err) {
    console.log(err)
    if (err.message === 'Student already in class') {
      return responseHelper.responseBadRequest('', 'Student already in class', res)
    }
    if (err.message === 'Batch not found') {
      return responseHelper.responseNotFound('', 'Batch not found', res)
    }
    if (err.message === 'Semester not found') {
      return responseHelper.responseNotFound('', 'Semester not found', res)
    }
    if (err.message === 'Study Program not found') {
      return responseHelper.responseNotFound('', 'Study Program not found', res)
    }
    if (err.message === 'Class not found') {
      return responseHelper.responseNotFound('', 'Class not found', res)
    }
    if (err.message === 'Student not found') {
      return responseHelper.responseNotFound('', 'Student not found', res)
    }
    if (err.message === 'Admin not found') {
      return responseHelper.responseNotFound('', 'Admin not found', res)
    }
    if (err.message === 'Exist') {
      return responseHelper.responseBadRequest('', 'Student Status is exist', res)
    }
    return responseHelper.responseBadRequest('', 'Bad Request', res)
  }
}

const update = async (req, res) => {
  try {
    const { studentStatus } = req.body
    const studentStatusIsExist = await isExist(studentStatus.kode_status)
    const batchIsExist = await batchExist(studentStatus.kode_angkatan)
    const semesterIsExist = await semesterExist(studentStatus.kode_semester)
    const studyProgramIsExist = await studyProgramExist(studentStatus.id_prodi)
    const classIsExist = await classExist(studentStatus.kode_kelas)
    const studentAccountIsExist = await studentExist(studentStatus.npm)
    const adminAccountIsExist = await adminExist(studentStatus.id_admin)

    if (batchIsExist.length === 0) {
      throw new Error('Batch not found')
    }
    if (semesterIsExist.length === 0) {
      throw new Error('Semester not found')
    }
    if (studyProgramIsExist.length === 0) {
      throw new Error('Study Program not found')
    }
    if (classIsExist.length === 0) {
      throw new Error('Class not found')
    }
    if (studentAccountIsExist === 0) {
      throw new Error('Student not found')
    }
    if (adminAccountIsExist === 0) {
      throw new Error('Admin not found')
    }
    if (studentStatusIsExist.length === 0) {
      throw new Error('Not found')
    }

    const studentStatusResult = await StudentStatusModel
      .query()
      .where('npm', '=', studentStatus.npm)
      .patch({
        kode_status: studentStatus.kode_status,
        kode_semester: studentStatus.kode_semester,
        kode_kelas: studentStatus.kode_kelas,
        kode_angkatan: studentStatus.kode_angkatan,
        id_prodi: studentStatus.id_prodi,
        id_admin: studentStatus.id_admin,
        npm: studentStatus.npm
      })
    return responseHelper.responseOk(studentStatusResult, 'Successfully update student status', res)
  } catch (err) {
    if (err.message === 'Batch not found') {
      return responseHelper.responseNotFound('', 'Batch not found', res)
    }
    if (err.message === 'Semester not found') {
      return responseHelper.responseNotFound('', 'Semester not found', res)
    }
    if (err.message === 'Study Program not found') {
      return responseHelper.responseNotFound('', 'Study Program not found', res)
    }
    if (err.message === 'Class not found') {
      return responseHelper.responseNotFound('', 'Class not found', res)
    }
    if (err.message === 'Student not found') {
      return responseHelper.responseNotFound('', 'Student not found', res)
    }
    if (err.message === 'Admin not found') {
      return responseHelper.responseNotFound('', 'Admin not found', res)
    }
    if (err.message === 'Not found') {
      return responseHelper.responseNotFound('', 'Student Status not found', res)
    }
    return responseHelper.responseBadRequest('', 'Bad Request', res)
  }
}

const destroy = async (req, res) => {
  try {
    const { studentStatus } = req.body
    const studentStatusIsExist = await isExist(studentStatus.kode_status)
    if (studentStatusIsExist.length === 0) {
      throw new Error('Not found')
    }

    const studentStatusResult = await StudentStatusModel
      .query()
      .delete()
      .where('npm', '=', studentStatus.npm)
    return responseHelper.responseOk(studentStatusResult, 'Successfully delete student status', res)
  } catch (err) {
    return responseHelper.responseNotFound('', 'Student Status not found', res)
  }
}

module.exports = {
  isExist,
  findAll,
  findById,
  findByNPM,
  insert,
  update,
  destroy
}
