const responseHelper = require('../helper/response-helper')
const SemesterModel = require('../models/SemesterModel')

const isExist = async (id) => {
  const semesterResult = await SemesterModel
    .query()
    .where('kode_semester', '=', id)
  return semesterResult
}

const findAll = async (req, res) => {
  try {
    const semestersResult = await SemesterModel
      .query()
      .orderBy('nama_semester', 'ASC')
    return responseHelper.responseOk(semestersResult, 'Success', res)
  } catch (err) {
    return responseHelper.responseNotFound('', 'Semester not found', res)
  }
}

const findById = async (req, res) => {
  try {
    const { semester } = req.body
    const semesterResult = await isExist(semester.kode_semester)
    if (semesterResult.length === 0) {
      throw new Error('Not found')
    }

    return responseHelper.responseOk(semesterResult, 'Success', res)
  } catch (err) {
    return responseHelper.responseNotFound('', 'Semester not found', res)
  }
}

const insert = async (req, res) => {
  try {
    const { semester } = req.body

    const semesterIsExist = await isExist(semester.kode_semester)
    if (semesterIsExist.length > 0) {
      throw new Error('Exist')
    }

    const newSemester = await SemesterModel
      .query()
      .insert({
        kode_semester: semester.kode_semester,
        nama_semester: semester.nama_semester
      })
    return responseHelper.responseOk(newSemester, 'Successfully add semester', res)
  } catch (err) {
    if (err.message === 'Exist') {
      return responseHelper.responseBadRequest('', 'Semester is exist', res)
    }
    return responseHelper.responseBadRequest('', 'Bad Request', res)
  }
}

const update = async (req, res) => {
  try {
    const { semester } = req.body
    const semesterIsExist = await isExist(semester.kode_semester)
    if (semesterIsExist.length === 0) {
      throw new Error('Not found')
    }

    const semesterResult = await SemesterModel
      .query()
      .where('kode_semester', '=', semester.kode_semester)
      .patch({
        kode_semester: semester.kode_semester,
        nama_semester: semester.nama_semester
      })
    return responseHelper.responseOk(semesterResult, 'Successfully update semester', res)
  } catch (err) {
    if (err.message === 'Not found') {
      return responseHelper.responseNotFound('', 'Semester not found', res)
    }
    return responseHelper.responseBadRequest('', 'Bad Request', res)
  }
}

const destroy = async (req, res) => {
  try {
    const { semester } = req.body
    const semesterIsExist = await isExist(semester.kode_semester)
    if (semesterIsExist.length === 0) {
      throw new Error('Error')
    }

    const semesterResult = await SemesterModel
      .query()
      .delete()
      .where('kode_semester', '=', semester.kode_semester)
    return responseHelper.responseOk(semesterResult, 'Successfully delete semester', res)
  } catch (err) {
    return responseHelper.responseNotFound('', 'Semester not ound', res)
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