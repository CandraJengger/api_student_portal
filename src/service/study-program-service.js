const responseHelper = require('../helper/response-helper')
const StudyProgramModel = require('../models/StudyProgramModel')
const { isExist: majoringExist } = require('./majoring-service')

const isExist = async (id) => {
  const studyProgramResult = await StudyProgramModel
    .query()
    .where('id_prodi', '=', id)
  return studyProgramResult
}

const findAll = async (req, res) => {
  try {
    const studyProgramsResult = await StudyProgramModel
      .query()
      .orderBy('nama_prodi', 'ASC')
    return responseHelper.responseOk(studyProgramsResult, 'Success', res)
  } catch (err) {
    return responseHelper.responseNotFound('', 'Error Not Found', res)
  }
}

const findById = async (req, res) => {
  try {
    const { studyProgram } = req.body
    const studyProgramResult = await isExist(studyProgram.id_prodi)
    if (studyProgramResult.length === 0) {
      throw new Error('Not found')
    }

    return responseHelper.responseOk(studyProgramResult, 'Success', res)
  } catch (err) {
    return responseHelper.responseNotFound('', 'StudyProgram not found', res)
  }
}

const insert = async (req, res) => {
  try {
    const { studyProgram } = req.body
    const studyProgramIsExist = await isExist(studyProgram.id_prodi)
    const majoringIsExist = await majoringExist(studyProgram.id_jurusan)

    if (majoringIsExist.length === 0) {
      throw new Error('Majoring not found')
    }
    if (studyProgramIsExist.length > 0) {
      throw new Error('Exist')
    }

    const newStudyProgram = await StudyProgramModel
      .query()
      .insert({
        id_prodi: studyProgram.id_prodi,
        id_jurusan: studyProgram.id_jurusan,
        nama_prodi: studyProgram.nama_prodi
      })
    return responseHelper.responseOk(newStudyProgram, 'Successfully add studyProgram', res)
  } catch (err) {
    if (err.message === 'Majoring not found') {
      return responseHelper.responseNotFound('', 'Majoring not found', res)
    }
    if (err.message === 'Exist') {
      return responseHelper.responseBadRequest('', 'StudyProgram is exist', res)
    }
    return responseHelper.responseBadRequest('', 'Bad Request', res)
  }
}

const update = async (req, res) => {
  try {
    const { studyProgram } = req.body
    const studyProgramIsExist = await isExist(studyProgram.id_prodi)
    const majoringIsExist = await majoringExist(studyProgram.id_jurusan)

    if (majoringIsExist.length === 0) {
      throw new Error('Majoring not found')
    }
    if (studyProgramIsExist.length === 0) {
      throw new Error('Not found')
    }

    const studyProgramResult = await StudyProgramModel
      .query()
      .where('id_prodi', '=', studyProgram.id_prodi)
      .patch({
        id_prodi: studyProgram.id_prodi,
        id_jurusan: studyProgram.id_jurusan,
        nama_prodi: studyProgram.nama_prodi
      })
    return responseHelper.responseOk(studyProgramResult, 'Successfully update studyProgram', res)
  } catch (err) {
    if (err.message === 'Majoring not found') {
      return responseHelper.responseNotFound('', 'Majoring not found', res)
    }
    if (err.message === 'Not found') {
      return responseHelper.responseNotFound('', 'StudyProgram not found', res)
    }
    return responseHelper.responseBadRequest('', 'Bad Request', res)
  }
}

const destroy = async (req, res) => {
  try {
    const { studyProgram } = req.body
    const studyProgramIsExist = await isExist(studyProgram.id_prodi)
    if (studyProgramIsExist.length === 0) {
      throw new Error('Not found')
    }

    const studyProgramResult = await StudyProgramModel
      .query()
      .delete()
      .where('id_prodi', '=', studyProgram.id_prodi)
    return responseHelper.responseOk(studyProgramResult, 'Successfully delete studyProgram', res)
  } catch (err) {
    return responseHelper.responseNotFound('', 'StudyProgram not found', res)
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
