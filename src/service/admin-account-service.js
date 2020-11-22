const responseHelper = require('../helper/response-helper')
const hashHelper = require('../helper/hash-helper')
const AdminAccountModel = require('../models/AdminAccountModel')

const isExist = async (id) => {
  const adminAccountResult = await AdminAccountModel
    .query()
    .where('id_admin', '=', id)
  return adminAccountResult
}

const findByUsername = async (username) => {
  const adminAccountResult = await AdminAccountModel
    .query()
    .where('username_admin', '=', username)
  return adminAccountResult
}

const findAll = async (req, res) => {
  try {
    let adminAccountsResult = await AdminAccountModel
      .query()
      .orderBy('nama_admin', 'ASC')

    adminAccountsResult = adminAccountsResult.map(admin => {
      admin.PASSWORD_ADMIN = hashHelper.generateHash(admin.PASSWORD_ADMIN)
      return admin
    })
    return responseHelper.responseOk(adminAccountsResult, 'Success', res)
  } catch (err) {
    return responseHelper.responseNotFound('', 'Admin Account not found', res)
  }
}

const findById = async (req, res) => {
  try {
    const { adminAccount } = req.body
    let adminAccountResult = await isExist(adminAccount.id_admin)
    if (adminAccountResult.length === 0) {
      throw new Error('Not found')
    }

    adminAccountResult = adminAccountResult.map(admin => {
      admin.PASSWORD_ADMIN = hashHelper.generateHash(admin.PASSWORD_ADMIN)
      return admin
    })
    return responseHelper.responseOk(adminAccountResult, 'Success', res)
  } catch (err) {
    return responseHelper.responseNotFound('', 'Admin Account not found', res)
  }
}

const insert = async (req, res) => {
  try {
    const { adminAccount } = req.body

    const adminAccountIsExist = await isExist(adminAccount.id_admin)
    if (adminAccountIsExist.length > 0) {
      throw new Error('Exist')
    }

    const newAdminAccount = await AdminAccountModel
      .query()
      .insert({
        id_admin: adminAccount.id_admin,
        nama_admin: adminAccount.nama_admin,
        username_admin: adminAccount.username_admin,
        alamat_admin: adminAccount.alamat_admin,
        password_admin: adminAccount.password_admin,
        email_admin: adminAccount.email_admin,
        status_admin: adminAccount.status_admin
      })
    return responseHelper.responseOk(newAdminAccount, 'Successfully add admin account', res)
  } catch (err) {
    if (err.message === 'Exist') {
      return responseHelper.responseBadRequest('', 'Admin Account is exist', res)
    }
    return responseHelper.responseBadRequest('', 'Bad Request', res)
  }
}

const update = async (req, res) => {
  try {
    const { adminAccount } = req.body
    const adminAccountIsExist = await isExist(adminAccount.id_admin)
    if (adminAccountIsExist.length === 0) {
      throw new Error('Not found')
    }

    const adminAccountResult = await AdminAccountModel
      .query()
      .where('id_admin', '=', adminAccount.id_admin)
      .patch({
        id_admin: adminAccount.id_admin,
        nama_admin: adminAccount.nama_admin,
        username_admin: adminAccount.username_admin,
        alamat_admin: adminAccount.alamat_admin,
        password_admin: adminAccount.password_admin,
        email_admin: adminAccount.email_admin,
        status_admin: adminAccount.status_admin
      })
    return responseHelper.responseOk(adminAccountResult, 'Successfully update admin account', res)
  } catch (err) {
    if (err.message === 'Not found') {
      return responseHelper.responseNotFound('', 'Admin Account not found', res)
    }
    return responseHelper.responseBadRequest('', 'Bad Request', res)
  }
}

const destroy = async (req, res) => {
  try {
    const { adminAccount } = req.body
    const adminAccountIsExist = await isExist(adminAccount.id_admin)
    if (adminAccountIsExist.length === 0) {
      throw new Error('Error')
    }

    const adminAccountResult = await AdminAccountModel
      .query()
      .delete()
      .where('id_admin', '=', adminAccount.id_admin)
    return responseHelper.responseOk(adminAccountResult, 'Successfully delete admin account', res)
  } catch (err) {
    console.log(err)
    return responseHelper.responseNotFound('', 'Admin Account not found', res)
  }
}

module.exports = {
  isExist,
  findAll,
  findById,
  insert,
  update,
  destroy,
  findByUsername
}