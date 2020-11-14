const responseHelper = require('../helper/response-helper')
const RoomModel = require('../models/RoomModel')
const { isExist: buildingExist } = require('./building-service')

const isExist = async (id) => {
  const roomResult = await RoomModel
    .query()
    .where('kode_ruang', '=', id)
  return roomResult
}

const findAll = async (req, res) => {
  try {
    const roomsResult = await RoomModel
      .query()
      .orderBy('kode_ruang', 'ASC')
    return responseHelper.responseOk(roomsResult, 'Success', res)
  } catch (err) {
    return responseHelper.responseNotFound('', 'Error Not Found', res)
  }
}

const findById = async (req, res) => {
  try {
    const { room } = req.body
    const roomResult = await isExist(room.kode_ruang)
    if (roomResult.length === 0) {
      throw new Error('Not found')
    }

    return responseHelper.responseOk(roomResult, 'Success', res)
  } catch (err) {
    return responseHelper.responseNotFound('', 'Room not found', res)
  }
}

const insert = async (req, res) => {
  try {
    const { room } = req.body
    const roomIsExist = await isExist(room.kode_ruang)
    const buildingIsExist = await buildingExist(room.kode_gedung)

    if (buildingIsExist.length === 0) {
      throw new Error('Building not found')
    }
    if (roomIsExist.length > 0) {
      throw new Error('Exist')
    }

    const newRoom = await RoomModel
      .query()
      .insert({
        kode_ruang: room.kode_ruang,
        kode_gedung: room.kode_gedung,
        nama_ruang: room.nama_ruang
      })
    return responseHelper.responseOk(newRoom, 'Successfully add room', res)
  } catch (err) {
    if (err.message === 'Building not found') {
      return responseHelper.responseNotFound('', 'Building not found', res)
    }
    if (err.message === 'Exist') {
      return responseHelper.responseBadRequest('', 'Room is exist', res)
    }
    return responseHelper.responseBadRequest('', 'Bad Request', res)
  }
}

const update = async (req, res) => {
  try {
    const { room } = req.body
    const roomIsExist = await isExist(room.kode_ruang)
    const buildingIsExist = await buildingExist(room.kode_gedung)

    if (buildingIsExist.length === 0) {
      throw new Error('Building not found')
    }
    if (roomIsExist.length === 0) {
      throw new Error('Not found')
    }

    const roomResult = await RoomModel
      .query()
      .where('kode_ruang', '=', room.kode_ruang)
      .patch({
        kode_ruang: room.kode_ruang,
        kode_gedung: room.kode_gedung,
        nama_ruang: room.nama_ruang
      })
    return responseHelper.responseOk(roomResult, 'Successfully update room', res)
  } catch (err) {
    if (err.message === 'Building not found') {
      return responseHelper.responseNotFound('', 'Building not found', res)
    }
    if (err.message === 'Not found') {
      return responseHelper.responseNotFound('', 'Room not found', res)
    }
    return responseHelper.responseBadRequest('', 'Bad Request', res)
  }
}

const destroy = async (req, res) => {
  try {
    const { room } = req.body
    const roomIsExist = await isExist(room.kode_ruang)
    if (roomIsExist.length === 0) {
      throw new Error('Not found')
    }

    const roomResult = await RoomModel
      .query()
      .delete()
      .where('kode_ruang', '=', room.kode_ruang)
    return responseHelper.responseOk(roomResult, 'Successfully delete room', res)
  } catch (err) {
    return responseHelper.responseNotFound('', 'Room not found', res)
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
