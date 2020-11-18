const responseHelper = require('../helper/response-helper')
const ClassModel = require('../models/ClassModel')

const isExist = async (id) => {
  const classResult = await ClassModel
    .query()
    .where('kode_kelas', '=', id)
  return classResult
}

const findAll = async (req, res) => {
  try {
    const classResult = await ClassModel
      .query()
      .orderBy('nama_kelas', 'ASC')
    return responseHelper.responseOk(classResult, 'Success', res)
  } catch (err) {
    return responseHelper.responseNotFound('', 'Class not found', res)
  }
}

const findById = async (req, res) => {
  try {
    const { id: classLectures } = req.params
    const classResult = await isExist(classLectures)
    if (classResult.length === 0) {
      throw new Error('Not found')
    }

    return responseHelper.responseOk(classResult, 'Success', res)
  } catch (err) {
    return responseHelper.responseNotFound('', 'Class not found', res)
  }
}

const insert = async (req, res) => {
  try {
    const { classLectures } = req.body

    const classIsExist = await isExist(classLectures.kode_kelas)
    if (classIsExist.length > 0) {
      throw new Error('Exist')
    }

    const newClassLectures = await ClassModel
      .query()
      .insert({
        kode_kelas: classLectures.kode_kelas,
        nama_kelas: classLectures.nama_kelas
      })
    return responseHelper.responseOk(newClassLectures, 'Successfully add class', res)
  } catch (err) {
    if (err.message === 'Exist') {
      return responseHelper.responseBadRequest('', 'Class is exist', res)
    }
    return responseHelper.responseBadRequest('', 'Bad Request', res)
  }
}

const update = async (req, res) => {
  try {
    const { classLectures } = req.body
    const classIsExist = await isExist(classLectures.kode_kelas)
    if (classIsExist.length === 0) {
      throw new Error('Not found')
    }

    const classResult = await ClassModel
      .query()
      .where('kode_kelas', '=', classLectures.kode_kelas)
      .patch({
        kode_kelas: classLectures.kode_kelas,
        nama_kelas: classLectures.nama_kelas
      })
    return responseHelper.responseOk(classResult, 'Successfully update class', res)
  } catch (err) {
    if (err.message === 'Not found') {
      return responseHelper.responseNotFound('', 'Class not found', res)
    }
    return responseHelper.responseBadRequest('', 'Bad Request', res)
  }
}

const destroy = async (req, res) => {
  try {
    const { classLectures } = req.body
    const classIsExist = await isExist(classLectures.kode_kelas)
    if (classIsExist.length === 0) {
      throw new Error('Error')
    }

    const classResult = await ClassModel
      .query()
      .delete()
      .where('kode_kelas', '=', classLectures.kode_kelas)
    return responseHelper.responseOk(classResult, 'Successfully delete class', res)
  } catch (err) {
    return responseHelper.responseNotFound('', 'Class not ound', res)
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