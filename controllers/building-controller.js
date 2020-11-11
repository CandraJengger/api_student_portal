const responseHelper = require('../helper/response-helper')
const buildingModel = require('../models/BuildingModel')

const getAll = async (req, res) => {
  const buildings = await buildingModel
    .query()
    .orderBy('kode_gedung', 'ASC')
  return responseHelper.responseOk(buildings, 'Success', res)
}

module.exports = {
  getAll
}