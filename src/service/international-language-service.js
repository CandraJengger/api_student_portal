const responseHelper = require('../helper/response-helper')
const ILModel = require('../models/InternationalLanguageModel')
const { isExist: studentExist } = require('./student-account-service')
const { upload: uploadHelper, removeFromDir } = require('../helper/upload-helper')

const isExist = async (id) => {
  const ilResult = await ILModel
    .query()
    .where('kode_bi', '=', id)
  return ilResult
}

const npmIsExist = async (npm) => {
  const ilResult = await ILModel
    .query()
    .where('npm', '=', npm)
  return ilResult
}

const findAll = async (req, res) => {
  try {
    const ilResult = await ILModel
      .query()
      .orderBy('npm', 'ASC')
    return responseHelper.responseOk(ilResult, 'Success', res)
  } catch (err) {
    return responseHelper.responseNotFound('', 'Error Not Found', res)
  }
}

const findById = async (req, res) => {
  try {
    let { npm: internationalLanguage } = req.params
    internationalLanguage = JSON.parse(internationalLanguage)
    const ilResult = await npmIsExist(internationalLanguage)
    if (ilResult.length === 0) {
      throw new Error('Not found')
    }

    return responseHelper.responseOk(ilResult, 'Success', res)
  } catch (err) {
    return responseHelper.responseNotFound('', 'International Language not found', res)
  }
}

const insert = async (req, res) => {
  try {
    let fileInternationalLanguage = ''

    req.files ? fileInternationalLanguage = req.files.fileInternationalLanguage : fileInternationalLanguage = undefined

    let { internationalLanguage } = req.body
    internationalLanguage = JSON.parse(internationalLanguage)

    const ilIsExist = await isExist(internationalLanguage.kode_bi)
    const studentIsExist = await studentExist(internationalLanguage.npm)

    if (studentIsExist.length === 0) {
      throw new Error('Student not found')
    }
    if (ilIsExist.length > 0) {
      throw new Error('Exist')
    }

    if (fileInternationalLanguage !== undefined) {
      uploadHelper({
        file: fileInternationalLanguage,
        filename: `${internationalLanguage.npm}-${internationalLanguage.nama_bi.replace(/ /g, '')}-${new Date().toLocaleDateString().replace(/\//g, '')}-${fileInternationalLanguage.name.replace(/ /g, '')}`,
        dir: 'bukti_bi'
      })
    } else {
      throw new Error('You haven\'t selected a file')
    }

    const newLi = await ILModel
      .query()
      .insert({
        kode_bi: internationalLanguage.kode_bi,
        npm: internationalLanguage.npm,
        nama_bi: internationalLanguage.nama_bi,
        skor: internationalLanguage.skor,
        tanggal_tes: internationalLanguage.tanggal_tes,
        bukti_bi: `${internationalLanguage.npm}-${internationalLanguage.nama_bi.replace(/ /g, '')}-${new Date().toLocaleDateString().replace(/\//g, '')}-${fileInternationalLanguage.name.replace(/ /g, '')}`
      })
    return responseHelper.responseOk(newLi, 'Successfully add international language', res)
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
      return responseHelper.responseBadRequest('', 'International language is exist', res)
    }
    return responseHelper.responseBadRequest('', 'Bad Request', res)
  }
}

const update = async (req, res) => {
  try {
    let fileInternationalLanguage = ''

    req.files ? fileInternationalLanguage = req.files.fileInternationalLanguage : fileInternationalLanguage = undefined

    let { internationalLanguage } = req.body
    internationalLanguage = JSON.parse(internationalLanguage)

    const ilIsExist = await isExist(internationalLanguage.kode_bi)
    const studentIsExist = await studentExist(internationalLanguage.npm)

    if (studentIsExist.length === 0) {
      throw new Error('Student not found')
    }
    if (ilIsExist.length === 0) {
      throw new Error('Not found')
    }

    if (fileInternationalLanguage !== undefined) {
      removeFromDir(`bukti_bi/${ilIsExist[0].BUKTI_BI}`)
    }

    const ilResult = await ILModel
      .query()
      .where('kode_bi', '=', internationalLanguage.kode_bi)
      .patch({
        kode_bi: internationalLanguage.kode_bi,
        npm: internationalLanguage.npm,
        nama_bi: internationalLanguage.nama_bi,
        skor: internationalLanguage.skor,
        tanggal_tes: internationalLanguage.tanggal_tes,
        bukti_bi: fileInternationalLanguage
          ? `${internationalLanguage.npm}-${internationalLanguage.nama_bi.replace(/ /g, '')}-${new Date().toLocaleDateString().replace(/\//g, '')}-${fileInternationalLanguage.name.replace(/ /g, '')}`
          : ilIsExist[0].BUKTI_BI
      })

    fileInternationalLanguage &&
    uploadHelper({
      file: fileInternationalLanguage,
      filename: `${internationalLanguage.npm}-${internationalLanguage.nama_bi.replace(/ /g, '')}-${new Date().toLocaleDateString().replace(/\//g, '')}-${fileInternationalLanguage.name.replace(/ /g, '')}`,
      dir: 'bukti_bi'
    })

    return responseHelper.responseOk(ilResult, 'Successfully update international language', res)
  } catch (err) {
    console.log(err)
    if (err.message === 'Student not found') {
      return responseHelper.responseNotFound('', 'Student not found', res)
    }
    if (err.message === 'Not found') {
      return responseHelper.responseNotFound('', 'International language not found', res)
    }
    return responseHelper.responseBadRequest('', 'Bad Request', res)
  }
}

const destroy = async (req, res) => {
  try {
    let { internationalLanguage } = req.body
    internationalLanguage = JSON.parse(internationalLanguage)
    const ilIsExist = await isExist(internationalLanguage.kode_bi)
    if (ilIsExist.length === 0) {
      throw new Error('Not found')
    }

    removeFromDir(`bukti_bi/${ilIsExist[0].BUKTI_BI}`)
    const ilResult = await ILModel
      .query()
      .delete()
      .where('kode_bi', '=', internationalLanguage.kode_bi)
    return responseHelper.responseOk(ilResult, 'Successfully delete international language', res)
  } catch (err) {
    console.log(err)
    return responseHelper.responseNotFound('', 'International language not found', res)
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
