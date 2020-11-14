const responseHelper = require('../helper/response-helper')
const BatchModel = require('../models/BatchModel')

const isExist = async (id) => {
  const batchResult = await BatchModel
    .query()
    .where('kode_angkatan', '=', id)
  return batchResult
}

const findAll = async (req, res) => {
  try {
    const batchsResult = await BatchModel
      .query()
      .orderBy('deskripsi', 'ASC')
    return responseHelper.responseOk(batchsResult, 'Success', res)
  } catch (err) {
    return responseHelper.responseNotFound('', 'Batch not found', res)
  }
}

const findById = async (req, res) => {
  try {
    const { batch } = req.body
    const batchResult = await isExist(batch.kode_angkatan)
    if (batchResult.length === 0) {
      throw new Error('Not found')
    }

    return responseHelper.responseOk(batchResult, 'Success', res)
  } catch (err) {
    return responseHelper.responseNotFound('', 'Batch not found', res)
  }
}

const insert = async (req, res) => {
  try {
    const { batch } = req.body

    const batchIsExist = await isExist(batch.kode_angkatan)
    if (batchIsExist.length > 0) {
      throw new Error('Exist')
    }

    const newBatch = await BatchModel
      .query()
      .insert({
        kode_angkatan: batch.kode_angkatan,
        deskripsi: batch.deskripsi
      })
    return responseHelper.responseOk(newBatch, 'Successfully add batch', res)
  } catch (err) {
    if (err.message === 'Exist') {
      return responseHelper.responseBadRequest('', 'Batch is exist', res)
    }
    return responseHelper.responseBadRequest('', 'Bad Request', res)
  }
}

const update = async (req, res) => {
  try {
    const { batch } = req.body
    const batchIsExist = await isExist(batch.kode_angkatan)
    if (batchIsExist.length === 0) {
      throw new Error('Not found')
    }

    const batchResult = await BatchModel
      .query()
      .where('kode_angkatan', '=', batch.kode_angkatan)
      .patch({
        kode_angkatan: batch.kode_angkatan,
        deskripsi: batch.deskripsi
      })
    return responseHelper.responseOk(batchResult, 'Successfully update batch', res)
  } catch (err) {
    if (err.message === 'Not found') {
      return responseHelper.responseNotFound('', 'Batch not found', res)
    }
    return responseHelper.responseBadRequest('', 'Bad Request', res)
  }
}

const destroy = async (req, res) => {
  try {
    const { batch } = req.body
    const batchIsExist = await isExist(batch.kode_angkatan)
    if (batchIsExist.length === 0) {
      throw new Error('Error')
    }

    const batchResult = await BatchModel
      .query()
      .delete()
      .where('kode_angkatan', '=', batch.kode_angkatan)
    return responseHelper.responseOk(batchResult, 'Successfully delete batch', res)
  } catch (err) {
    return responseHelper.responseNotFound('', 'Batch not found', res)
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