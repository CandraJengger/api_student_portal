const responseHelper = require('../helper/response-helper')
const AnnouncementModel = require('../models/AnnouncementModel')
const { isExist: adminExist } = require('./admin-account-service')

const isExist = async (id) => {
  const announcementResult = await AnnouncementModel
    .query()
    .where('id_pengumuman', '=', id)
  return announcementResult
}

const queryCategory = async (category) => {
  const announcementResult = await AnnouncementModel
    .query()
    .where('kategori_pengumuman', '=', category)
  return announcementResult
}

const findAll = async (req, res) => {
  try {
    const announcementResult = await AnnouncementModel
      .query()
      .orderBy('kategori_pengumuman', 'ASC')
    return responseHelper.responseOk(announcementResult, 'Success', res)
  } catch (err) {
    return responseHelper.responseNotFound('', 'Error Not Found', res)
  }
}

const findByCategory = async (req, res) => {
  try {
    const { category: announcement } = req.params
    const announcementResult = await queryCategory(announcement)
    if (announcementResult.length === 0) {
      throw new Error('Not found')
    }

    return responseHelper.responseOk(announcementResult, 'Success', res)
  } catch (err) {
    return responseHelper.responseNotFound('', 'Announcement not found', res)
  }
}

const findById = async (req, res) => {
  try {
    const { id: announcement } = req.params
    const announcementResult = await isExist(announcement)
    if (announcementResult.length === 0) {
      throw new Error('Not found')
    }

    return responseHelper.responseOk(announcementResult, 'Success', res)
  } catch (err) {
    return responseHelper.responseNotFound('', 'Announcement not found', res)
  }
}

const insert = async (req, res) => {
  try {
    const { announcement } = req.body
    console.log(announcement)
    const announcementIsExist = await isExist(announcement.id_pengumuman)
    const adminIsExist = await adminExist(announcement.id_admin)

    if (adminIsExist.length === 0) {
      throw new Error('Admin not found')
    }
    if (announcementIsExist.length > 0) {
      throw new Error('Exist')
    }

    const newAnnouncement = await AnnouncementModel
      .query()
      .insert({
        id_pengumuman: announcement.id_pengumuman,
        id_admin: announcement.id_admin,
        judul_pengumuman: announcement.judul_pengumuman,
        isi_pengumuman: announcement.isi_pengumuman,
        tanggal_pengumuman: new Date().toLocaleDateString(),
        kategori_pengumuman: announcement.kategori_pengumuman,
        pengirim_pengumuman: announcement.pengirim_pengumuman
      })
    return responseHelper.responseOk(newAnnouncement, 'Successfully add announcement', res)
  } catch (err) {
    console.log(err)
    if (err.message === 'Admin not found') {
      return responseHelper.responseNotFound('', 'Admin not found', res)
    }
    if (err.message === 'Exist') {
      return responseHelper.responseBadRequest('', 'Announcement is exist', res)
    }
    return responseHelper.responseBadRequest('', 'Bad Request', res)
  }
}

const update = async (req, res) => {
  try {
    const { announcement } = req.body
    const announcementIsExist = await isExist(announcement.id_pengumuman)
    const adminIsExist = await adminExist(announcement.id_admin)

    if (adminIsExist.length === 0) {
      throw new Error('Admin not found')
    }
    if (announcementIsExist.length === 0) {
      throw new Error('Not found')
    }

    const announcementResult = await AnnouncementModel
      .query()
      .where('id_pengumuman', '=', announcement.id_pengumuman)
      .patch({
        id_pengumuman: announcement.id_pengumuman,
        id_admin: announcement.id_admin,
        judul_pengumuman: announcement.judul_pengumuman,
        isi_pengumuman: announcement.isi_pengumuman,
        tanggal_pengumuman: new Date().toLocaleDateString(),
        kategori_pengumuman: announcement.kategori_pengumuman,
        pengirim_pengumuman: announcement.pengirim_pengumuman
      })
    return responseHelper.responseOk(announcementResult, 'Successfully update announcement', res)
  } catch (err) {
    if (err.message === 'Admin not found') {
      return responseHelper.responseNotFound('', 'Admin not found', res)
    }
    if (err.message === 'Not found') {
      return responseHelper.responseNotFound('', 'Announcement not found', res)
    }
    return responseHelper.responseBadRequest('', 'Bad Request', res)
  }
}

const destroy = async (req, res) => {
  try {
    const { announcement } = req.body
    const announcementIsExist = await isExist(announcement.id_pengumuman)
    if (announcementIsExist.length === 0) {
      throw new Error('Not found')
    }

    const announcementResult = await AnnouncementModel
      .query()
      .delete()
      .where('id_pengumuman', '=', announcement.id_pengumuman)
    return responseHelper.responseOk(announcementResult, 'Successfully delete announcement', res)
  } catch (err) {
    console.log(err)
    return responseHelper.responseNotFound('', 'Announcement not found', res)
  }
}

module.exports = {
  isExist,
  findAll,
  findById,
  findByCategory,
  insert,
  update,
  destroy
}
