const responseHelper = require('../helper/response-helper')
const OrgModel = require('../models/OrganizationModel')
const { isExist: studentExist } = require('./student-account-service')
const { upload: uploadHelper, removeFromDir } = require('../helper/upload-helper')

const isExist = async (id) => {
  const orgResult = await OrgModel
    .query()
    .where('kode_org', '=', id)
  return orgResult
}

const npmIsExist = async (npm) => {
  const npmResult = await OrgModel
    .query()
    .where('npm', '=', npm)
  return npmResult
}

const orgIsExist = async (npm) => {
  const npmResult = await OrgModel
    .query()
    .where('npm', '=', npm)
  return npmResult
}

const findAll = async (req, res) => {
  try {
    const orgResult = await OrgModel
      .query()
      .orderBy('npm', 'ASC')
    return responseHelper.responseOk(orgResult, 'Success', res)
  } catch (err) {
    return responseHelper.responseNotFound('', 'Error Not Found', res)
  }
}

const findById = async (req, res) => {
  try {
    let { organization } = req.body
    organization = JSON.parse(organization)
    const orgResult = await npmIsExist(organization.npm)
    if (orgResult.length === 0) {
      throw new Error('Not found')
    }

    return responseHelper.responseOk(orgResult, 'Success', res)
  } catch (err) {
    return responseHelper.responseNotFound('', 'Organization not found', res)
  }
}

const findByNameOrg = async (req, res) => {
  try {
    const { npm } = req.params

    const orgResult = await orgIsExist(npm)
    console.log(orgResult)
    if (orgResult.length === 0) {
      throw new Error('Not found')
    }

    return responseHelper.responseOk(orgResult, 'Success', res)
  } catch (err) {
    return responseHelper.responseNotFound('', 'Organization not found', res)
  }
}

const insert = async (req, res) => {
  try {
    let fileOrganization = ''

    req.files ? fileOrganization = req.files.fileOrganization : fileOrganization = undefined

    let { organization } = req.body
    organization = JSON.parse(organization)

    const orgIsExist = await isExist(organization.kode_org)
    const studentIsExist = await studentExist(organization.npm)

    if (studentIsExist.length === 0) {
      throw new Error('Student not found')
    }
    if (orgIsExist.length > 0) {
      throw new Error('Exist')
    }

    if (fileOrganization !== undefined) {
      uploadHelper({
        file: fileOrganization,
        filename: `${organization.npm}-${new Date().toLocaleDateString().replace(/\//g, '')}-${fileOrganization.name.replace(/ /g, '')}`,
        dir: 'bukti_organisasi'
      })
    } else {
      throw new Error('You haven\'t selected a file')
    }

    const newOrg = await OrgModel
      .query()
      .insert({
        kode_org: organization.kode_org,
        npm: organization.npm,
        nama_org: organization.nama_org,
        tempat_org: organization.tempat_org,
        tahun_masuk_org: organization.tahun_masuk_org,
        tahun_keluar_org: organization.tahun_keluar_org,
        jabatan_org: organization.jabatan_org,
        bukti_org: `${organization.npm}-${new Date().toLocaleDateString().replace(/\//g, '')}-${fileOrganization.name.replace(/ /g, '')}`
      })
    return responseHelper.responseOk(newOrg, 'Successfully add organization', res)
  } catch (err) {
    console.log(err)
    if (err.message === 'You haven\'t selected a file') {
      return responseHelper.responseBadRequest('', 'You haven\'t selected a file', res)
    }
    if (err.message === 'Student already') {
      return responseHelper.responseBadRequest('', 'Student already', res)
    }
    if (err.message === 'Student not found') {
      return responseHelper.responseNotFound('', 'Student not found', res)
    }
    if (err.message === 'Exist') {
      return responseHelper.responseBadRequest('', 'Organization is exist', res)
    }
    return responseHelper.responseBadRequest('', 'Bad Request', res)
  }
}

const update = async (req, res) => {
  try {
    let fileOrganization = ''

    req.files ? fileOrganization = req.files.fileOrganization : fileOrganization = undefined

    let { organization } = req.body
    organization = JSON.parse(organization)

    const orgIsExist = await isExist(organization.kode_org)
    const studentIsExist = await studentExist(organization.npm)

    if (studentIsExist.length === 0) {
      throw new Error('Student not found')
    }
    if (orgIsExist.length === 0) {
      throw new Error('Not found')
    }

    if (fileOrganization !== undefined) {
      removeFromDir(`bukti_organisasi/${orgIsExist[0].BUKTI_ORG}`)
    }

    const orgResult = await OrgModel
      .query()
      .where('kode_org', '=', organization.kode_org)
      .patch({
        kode_org: organization.kode_org,
        npm: organization.npm,
        nama_org: organization.nama_org,
        tempat_org: organization.tempat_org,
        tahun_masuk_org: organization.tahun_masuk_org,
        tahun_keluar_org: organization.tahun_keluar_org,
        jabatan_org: organization.jabatan_org,
        bukti_org: fileOrganization
          ? `${organization.npm}-${new Date().toLocaleDateString().replace(/\//g, '')}-${fileOrganization.name.replace(/ /g, '')}`
          : orgIsExist[0].BUKTI_ORG
      })

    fileOrganization &&
    uploadHelper({
      file: fileOrganization,
      filename: `${organization.npm}-${new Date().toLocaleDateString().replace(/\//g, '')}-${fileOrganization.name.replace(/ /g, '')}`,
      dir: 'bukti_organisasi'
    })

    return responseHelper.responseOk(orgResult, 'Successfully update organization', res)
  } catch (err) {
    console.log(err)
    if (err.message === 'Student not found') {
      return responseHelper.responseNotFound('', 'Student not found', res)
    }
    if (err.message === 'Not found') {
      return responseHelper.responseNotFound('', 'Organization not found', res)
    }
    return responseHelper.responseBadRequest('', 'Bad Request', res)
  }
}

const destroy = async (req, res) => {
  try {
    let { organization } = req.body
    organization = JSON.parse(organization)
    const orgIsExist = await isExist(organization.kode_org)
    if (orgIsExist.length === 0) {
      throw new Error('Not found')
    }

    removeFromDir(`bukti_organisasi/${orgIsExist[0].BUKTI_ORG}`)
    const orgResult = await OrgModel
      .query()
      .delete()
      .where('kode_org', '=', organization.kode_org)
    return responseHelper.responseOk(orgResult, 'Successfully delete organization', res)
  } catch (err) {
    console.log(err)
    return responseHelper.responseNotFound('', 'Organization not found', res)
  }
}

module.exports = {
  isExist,
  findAll,
  findById,
  findByNameOrg,
  insert,
  update,
  destroy
}
