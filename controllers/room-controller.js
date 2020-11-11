const responseHelper = require('../helper/response-helper')
const roomModel = require('../models/RoomModel')

const getAll = async (req, res) => {
  const buildings = await roomModel
    .query()
    .orderBy('kode_ruang', 'ASC')
  return responseHelper.responseOk(buildings, 'Success', res)
}

module.exports = {
  getAll
}