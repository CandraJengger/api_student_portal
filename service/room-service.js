const responseHelper = require('../helper/response-helper')
const RoomRepo = require('../models/RoomModel')

const findAll = async (req, res) => {
  const buildings = await RoomRepo
    .query()
    .orderBy('kode_ruang', 'ASC')
  return responseHelper.responseOk(buildings, 'Success', res)
}

module.exports = {
  findAll
}