const responseHelper = require('../helper/response-helper')
const CoursesModel = require('../models/CoursesModel')

const isExist = async (id) => {
  const coursesResult = await CoursesModel
    .query()
    .where('kode_mk', '=', id)
  return coursesResult
}

const findAll = async (req, res) => {
  try {
    const coursesResult = await CoursesModel
      .query()
      .orderBy('nama_mk', 'ASC')
    return responseHelper.responseOk(coursesResult, 'Success', res)
  } catch (err) {
    return responseHelper.responseNotFound('', 'Courses not found', res)
  }
}

const findById = async (req, res) => {
  try {
    const { courses } = req.body
    const coursesResult = await isExist(courses.kode_mk)
    if (coursesResult.length === 0) {
      throw new Error('Not found')
    }

    return responseHelper.responseOk(coursesResult, 'Success', res)
  } catch (err) {
    return responseHelper.responseNotFound('', 'Courses not found', res)
  }
}

const insert = async (req, res) => {
  try {
    const { courses } = req.body

    const coursesIsExist = await isExist(courses.kode_mk)
    if (coursesIsExist.length > 0) {
      throw new Error('Exist')
    }

    const newCourses = await CoursesModel
      .query()
      .insert({
        kode_mk: courses.kode_mk,
        nama_mk: courses.nama_mk,
        sks: courses.sks
      })
    return responseHelper.responseOk(newCourses, 'Successfully add courses', res)
  } catch (err) {
    if (err.message === 'Exist') {
      return responseHelper.responseBadRequest('', 'Courses is exist', res)
    }
    return responseHelper.responseBadRequest('', 'Bad Request', res)
  }
}

const update = async (req, res) => {
  try {
    const { courses } = req.body
    const coursesIsExist = await isExist(courses.kode_mk)
    if (coursesIsExist.length === 0) {
      throw new Error('Not found')
    }

    const coursesResult = await CoursesModel
      .query()
      .where('kode_mk', '=', courses.kode_mk)
      .patch({
        kode_mk: courses.kode_mk,
        nama_mk: courses.nama_mk,
        sks: courses.sks
      })
    return responseHelper.responseOk(coursesResult, 'Successfully update courses', res)
  } catch (err) {
    if (err.message === 'Not found') {
      return responseHelper.responseNotFound('', 'Courses not found', res)
    }
    return responseHelper.responseBadRequest('', 'Bad Request', res)
  }
}

const destroy = async (req, res) => {
  try {
    const { courses } = req.body
    const coursesIsExist = await isExist(courses.kode_mk)
    if (coursesIsExist.length === 0) {
      throw new Error('Error')
    }

    const coursesResult = await CoursesModel
      .query()
      .delete()
      .where('kode_mk', '=', courses.kode_mk)
    return responseHelper.responseOk(coursesResult, 'Successfully delete courses', res)
  } catch (err) {
    return responseHelper.responseNotFound('', 'Courses not ound', res)
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