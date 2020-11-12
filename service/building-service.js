const { responseNotFound } = require('../helper/response-helper')
const responseHelper = require('../helper/response-helper')
const BuildingModel = require('../models/BuildingModel')

const isExist = async (id) => {
  const buildingResult = await BuildingModel
    .query()
    .where('kode_gedung', '=', id)
  return buildingResult
}

const findAll = async (req, res) => {
  try {
    const buildingsResult = await BuildingModel
      .query()
      .orderBy('kode_gedung', 'ASC')
    return responseHelper.responseOk(buildingsResult, 'Success', res)
  } catch (err) {
    return responseNotFound.responseOk('', 'Error Not Found', res)
  }
}

const findById = async (req, res) => {
  try {
    const { building } = req.body
    const buildingResult = await isExist(building.kode_gedung)
    if (buildingResult.length === 0) {
      throw new Error('Not found')
    }

    return responseHelper.responseOk(buildingResult, 'Success', res)
  } catch (err) {
    return responseHelper.responseNotFound('', 'Error Not Found', res)
  }
}

const insert = async (req, res) => {
  try {
    const { building } = req.body
    const buildingIsExist = await isExist(building.kode_gedung)
    if (buildingIsExist.length > 0) {
      throw new Error('Exist')
    }

    const newBuilding = await BuildingModel
      .query()
      .insert({
        kode_gedung: building.kode_gedung,
        nama_gedung: building.nama_gedung
      })
    return responseHelper.responseOk(newBuilding, 'Successfully add building', res)
  } catch (err) {
    if (err.message === 'Exist') {
      return responseHelper.responseBadRequest('', 'Building is exist', res)
    }
    return responseHelper.responseBadRequest('', 'Bad Request', res)
  }
}

const update = async (req, res) => {
  try {
    const { building } = req.body
    const buildingIsExist = await isExist(building.kode_gedung)
    if (buildingIsExist.length === 0) {
      throw new Error('Not found')
    }

    const buildingResult = await BuildingModel
      .query()
      .where('kode_gedung', '=', building.kode_gedung)
      .patch({
        kode_gedung: building.kode_gedung,
        nama_gedung: building.nama_gedung
      })
    return responseHelper.responseOk(buildingResult, 'Successfully update building', res)
  } catch (err) {
    if (err.message === 'Not found') {
      return responseHelper.responseBadRequest('', 'Not Found', res)
    }
    return responseHelper.responseBadRequest('', 'Bad Request', res)
  }
}

const destroy = async (req, res) => {
  try {
    const { building } = req.body
    const buildingIsExist = await isExist(building.kode_gedung)
    if (buildingIsExist.length === 0) {
      throw new Error('Error')
    }

    const buildingResult = await BuildingModel
      .query()
      .delete()
      .where('kode_gedung', '=', building.kode_gedung)
    return responseHelper.responseOk(buildingResult, 'Successfully delete building', res)
  } catch (err) {
    console.log(err)
    return responseHelper.responseNotFound('', 'Error Not Found', res)
  }
}

module.exports = {
  findAll,
  findById,
  insert,
  update,
  destroy
}