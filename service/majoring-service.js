const responseHelper = require('../helper/response-helper')
const MajoringModel = require('../models/MajoringModel')

const isExist = async (id) => {
  const majoringResult = await MajoringModel
    .query()
    .where('id_jurusan', '=', id)
  return majoringResult
}

const findAll = async (req, res) => {
  try {
    const majoringsResult = await MajoringModel
      .query()
      .orderBy('nama_jurusan', 'ASC')
    return responseHelper.responseOk(majoringsResult, 'Success', res)
  } catch (err) {
    return responseHelper.responseNotFound('', 'Majoring not found', res)
  }
}

const findById = async (req, res) => {
  try {
    const { majoring } = req.body
    const majoringResult = await isExist(majoring.id_jurusan)
    if (majoringResult.length === 0) {
      throw new Error('Not found')
    }

    return responseHelper.responseOk(majoringResult, 'Success', res)
  } catch (err) {
    return responseHelper.responseNotFound('', 'Majoring not found', res)
  }
}

const insert = async (req, res) => {
  try {
    const { majoring } = req.body

    const majoringIsExist = await isExist(majoring.id_jurusan)
    if (majoringIsExist.length > 0) {
      throw new Error('Exist')
    }

    const newMajoring = await MajoringModel
      .query()
      .insert({
        id_jurusan: majoring.id_jurusan,
        nama_jurusan: majoring.nama_jurusan
      })
    return responseHelper.responseOk(newMajoring, 'Successfully add majoring', res)
  } catch (err) {
    if (err.message === 'Exist') {
      return responseHelper.responseBadRequest('', 'Majoring is exist', res)
    }
    return responseHelper.responseBadRequest('', 'Bad Request', res)
  }
}

const update = async (req, res) => {
  try {
    const { majoring } = req.body
    const majoringIsExist = await isExist(majoring.id_jurusan)
    if (majoringIsExist.length === 0) {
      throw new Error('Not found')
    }

    const majoringResult = await MajoringModel
      .query()
      .where('id_jurusan', '=', majoring.id_jurusan)
      .patch({
        id_jurusan: majoring.id_jurusan,
        nama_jurusan: majoring.nama_jurusan
      })
    return responseHelper.responseOk(majoringResult, 'Successfully update majoring', res)
  } catch (err) {
    if (err.message === 'Not found') {
      return responseHelper.responseNotFound('', 'Majoring not found', res)
    }
    return responseHelper.responseBadRequest('', 'Bad Request', res)
  }
}

const destroy = async (req, res) => {
  try {
    const { majoring } = req.body
    const majoringIsExist = await isExist(majoring.id_jurusan)
    if (majoringIsExist.length === 0) {
      throw new Error('Error')
    }

    const majoringResult = await MajoringModel
      .query()
      .delete()
      .where('id_jurusan', '=', majoring.id_jurusan)
    return responseHelper.responseOk(majoringResult, 'Successfully delete majoring', res)
  } catch (err) {
    return responseHelper.responseNotFound('', 'Majoring not ound', res)
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