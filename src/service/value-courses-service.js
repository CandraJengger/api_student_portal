const responseHelper = require('../helper/response-helper')
const ValueCoursesModel = require('../models/ValueCoursesModel')
const { isExist: adminExist } = require('./admin-account-service')
const { isExist: studentExist } = require('./student-account-service')
const { isExist: coursesExist } = require('./courses-service')
const { isExist: semesterExist } = require('./semester-service')

const isExist = async (id) => {
  const vcResult = await ValueCoursesModel
    .query()
    .where('id_nilai', '=', id)
  return vcResult
}

const npmIsExist = async (npm) => {
  const vcResult = await ValueCoursesModel
    .query()
    .where('npm_nilai', '=', npm)
  return vcResult
}

const studentHaveCourses = async (npm, mk) => {
  const studentResult = await ValueCoursesModel
    .query()
    .where('npm_nilai', '=', npm)
    .where('kode_mk_nilai', '=', mk)

  return studentResult
}

const findAll = async (req, res) => {
  try {
    const vcResult = await ValueCoursesModel
      .query()
      .orderBy('npm_nilai', 'ASC')
    return responseHelper.responseOk(vcResult, 'Success', res)
  } catch (err) {
    console.log(err)
    return responseHelper.responseNotFound('', 'Error Not Found', res)
  }
}

const findById = async (req, res) => {
  try {
    const { npm } = req.params
    const vcResult = await npmIsExist(npm)
    if (vcResult.length === 0) {
      throw new Error('Not found')
    }

    return responseHelper.responseOk(vcResult, 'Success', res)
  } catch (err) {
    return responseHelper.responseNotFound('', 'Student not found', res)
  }
}

const insert = async (req, res) => {
  try {
    const { valueCourses } = req.body
    const valueCoursesIsExist = await isExist(valueCourses.id_nilai)
    const adminIsExist = await adminExist(valueCourses.id_admin)
    const studentIsExist = await studentExist(valueCourses.npm_nilai)
    const coursesIsExist = await coursesExist(valueCourses.kode_mk_nilai)
    const semesterIsExist = await semesterExist(valueCourses.kode_semester_nilai)

    const studentAlreadyHaveCourses = await studentHaveCourses(valueCourses.npm_nilai, valueCourses.kode_mk_nilai)

    let npmAlready = ''
    let coursesAlready = ''
    if (studentAlreadyHaveCourses[0] !== undefined) {
      const { NPM_NILAI, KODE_MK_NILAI } = studentAlreadyHaveCourses[0]
      npmAlready = NPM_NILAI
      coursesAlready = KODE_MK_NILAI
    }

    if (studentAlreadyHaveCourses.length > 0) {
      throw new Error('Student already have courses')
    }
    if (npmAlready === valueCourses.npm_nilai) {
      throw new Error('Student already have courses')
    }
    if (coursesAlready === valueCourses.kode_mk_nilai) {
      throw new Error('Student already have courses')
    }
    if (adminIsExist.length === 0) {
      throw new Error('Admin not found')
    }
    if (studentIsExist.length === 0) {
      throw new Error('Student not found')
    }
    if (coursesIsExist.length === 0) {
      throw new Error('Courses not found')
    }
    if (semesterIsExist.length === 0) {
      throw new Error('Semester not found')
    }
    if (valueCoursesIsExist.length > 0) {
      throw new Error('Exist')
    }

    const newVC = await ValueCoursesModel
      .query()
      .insert({
        id_nilai: valueCourses.id_nilai,
        id_admin: valueCourses.id_admin,
        kode_mk_nilai: valueCourses.kode_mk_nilai,
        kode_semester_nilai: valueCourses.kode_semester_nilai,
        npm_nilai: valueCourses.npm_nilai,
        nilai: valueCourses.nilai
      })
    return responseHelper.responseOk(newVC, 'Successfully add value courses', res)
  } catch (err) {
    console.log(err)
    if (err.message === 'Student already have courses') {
      return responseHelper.responseBadRequest('', 'Student already have courses', res)
    }
    if (err.message === 'Admin not found') {
      return responseHelper.responseNotFound('', 'Admin not found', res)
    }
    if (err.message === 'Student not found') {
      return responseHelper.responseNotFound('', 'Student not found', res)
    }
    if (err.message === 'Courses not found') {
      return responseHelper.responseNotFound('', 'Courses not found', res)
    }
    if (err.message === 'Semester not found') {
      return responseHelper.responseNotFound('', 'Semester not found', res)
    }
    if (err.message === 'Exist') {
      return responseHelper.responseBadRequest('', 'Value courses is exist', res)
    }
    return responseHelper.responseBadRequest('', 'Bad Request', res)
  }
}

const update = async (req, res) => {
  try {
    const { valueCourses } = req.body
    const valueCoursesIsExist = await isExist(valueCourses.id_nilai)
    const adminIsExist = await adminExist(valueCourses.id_admin)
    const studentIsExist = await studentExist(valueCourses.npm_nilai)
    const coursesIsExist = await coursesExist(valueCourses.kode_mk_nilai)
    const semesterIsExist = await semesterExist(valueCourses.kode_semester_nilai)

    const studentAlreadyHaveCourses = await studentHaveCourses(valueCourses.npm_nilai, valueCourses.kode_mk_nilai)

    if (studentAlreadyHaveCourses.length > 0) {
      throw new Error('Student already have courses')
    }
    if (adminIsExist.length === 0) {
      throw new Error('Admin not found')
    }
    if (studentIsExist.length === 0) {
      throw new Error('Student not found')
    }
    if (coursesIsExist.length === 0) {
      throw new Error('Courses not found')
    }
    if (semesterIsExist.length === 0) {
      throw new Error('Semester not found')
    }
    if (valueCoursesIsExist.length === 0) {
      throw new Error('Not found')
    }

    const vcResult = await ValueCoursesModel
      .query()
      .where('id_nilai', '=', valueCourses.id_nilai)
      .patch({
        id_nilai: valueCourses.id_nilai,
        id_admin: valueCourses.id_admin,
        kode_mk_nilai: valueCourses.kode_mk_nilai,
        kode_semester_nilai: valueCourses.kode_semester_nilai,
        npm_nilai: valueCourses.npm_nilai,
        nilai: valueCourses.nilai
      })
    return responseHelper.responseOk(vcResult, 'Successfully update value courses', res)
  } catch (err) {
    console.log(err)
    if (err.message === 'Student already have courses') {
      return responseHelper.responseBadRequest('', 'Student already have courses', res)
    }
    if (err.message === 'Admin not found') {
      return responseHelper.responseNotFound('', 'Admin not found', res)
    }
    if (err.message === 'Student not found') {
      return responseHelper.responseNotFound('', 'Student not found', res)
    }
    if (err.message === 'Courses not found') {
      return responseHelper.responseNotFound('', 'Courses not found', res)
    }
    if (err.message === 'Semester not found') {
      return responseHelper.responseNotFound('', 'Semester not found', res)
    }
    if (err.message === 'Not found') {
      return responseHelper.responseNotFound('', 'Value courses not found', res)
    }
    return responseHelper.responseBadRequest('', 'Bad Request', res)
  }
}

const destroy = async (req, res) => {
  try {
    const { valueCourses } = req.body
    const vcIsExist = await isExist(valueCourses.id_nilai)
    if (vcIsExist.length === 0) {
      throw new Error('Not found')
    }

    const vcResult = await ValueCoursesModel
      .query()
      .delete()
      .where('id_nilai', '=', valueCourses.id_nilai)
    return responseHelper.responseOk(vcResult, 'Successfully delete value courses', res)
  } catch (err) {
    return responseHelper.responseNotFound('', 'Value courses not found', res)
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
