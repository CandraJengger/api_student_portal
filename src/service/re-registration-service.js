const fs = require('fs')
const path = require('path')

const responseHelper = require('../helper/response-helper')
const { upload: uploadHelper, removeFromDir } = require('../helper/upload-helper')

const ReRegistrationModel = require('../models/Re-registrationModel')
const { isExist: adminExist } = require('./admin-account-service')
const { isExist: studentExist } = require('./student-account-service')
const { isExist: semesterExist } = require('./semester-service')

const isExist = async (id) => {
  const reRegisResult = await ReRegistrationModel
    .query()
    .where('id_daftar_ulang', '=', id)
  return reRegisResult
}

const semesterAlready = async (id) => {
  const semesterResult = await ReRegistrationModel
    .query()
    .where('semester_daftar_ulang', '=', id)

  return semesterResult
}

const studentAlready = async (npm) => {
  const npmResult = await ReRegistrationModel
    .query()
    .where('npm_daftar_ulang', '=', npm)

  return npmResult
}

const handlerErrorMessange = (error, response) => {
  if (error.message === 'You haven\'t selected a file') {
    return responseHelper.responseBadRequest('', 'You haven\'t selected a file', response)
  }
  if (error.message === 'Semester already') {
    return responseHelper.responseBadRequest('', 'Semester already', response)
  }
  if (error.message === 'Admin not found') {
    return responseHelper.responseNotFound('', 'Admin not found', response)
  }
  if (error.message === 'Student not found') {
    return responseHelper.responseNotFound('', 'Student not found', response)
  }
  if (error.message === 'Semester not found') {
    return responseHelper.responseNotFound('', 'Semester not found', response)
  }
  if (error.message === 'Exist') {
    return responseHelper.responseBadRequest('', 'reRegistration is exist', response)
  }
}

const findAll = async (req, res) => {
  try {
    const reRegisResult = await ReRegistrationModel
      .query()
      .orderBy('semester_daftar_ulang', 'ASC')
    return responseHelper.responseOk(reRegisResult, 'Success', res)
  } catch (err) {
    return responseHelper.responseNotFound('', 'Error Not Found', res)
  }
}

const findById = async (req, res) => {
  try {
    let { reRegistration } = req.body
    reRegistration = JSON.parse(reRegistration)
    const reRegistrationResult = await isExist(reRegistration.id_daftar_ulang)
    if (reRegistrationResult.length === 0) {
      throw new Error('Not found')
    }

    return responseHelper.responseOk(reRegistrationResult, 'Success', res)
  } catch (err) {
    return responseHelper.responseNotFound('', 're-registration not found', res)
  }
}

const findByNPM = async (req, res) => {
  const baseUrl = `${process.env.APP_HOST}:${process.env.APP_PORT}/reRegistrations/krs/`
  const directoryPath = path.resolve(__dirname, '../../public/uploads/krs/')
  let krsFiles = []
  try {
    let { reRegistration } = req.body
    reRegistration = JSON.parse(reRegistration)

    fs.readdir(directoryPath, (err, files) => {
      if (err) {
        throw new Error('Unable to scan files')
      }

      krsFiles = files.filter(file => file.includes(`${reRegistration.npm_daftar_ulang}`))
    })

    const reRegistrationResult = await studentAlready(reRegistration.npm_daftar_ulang)
    if (reRegistrationResult.length === 0) {
      throw new Error('Not found')
    }

    if (krsFiles.length === reRegistrationResult.length) {
      for (let i = 0; i < krsFiles.length; i++) {
        reRegistrationResult[i].url = baseUrl + krsFiles[i]
      }
    }
    return responseHelper.responseOk(reRegistrationResult, 'Success', res)
  } catch (err) {
    if (err.message === 'Unable to scan files') {
      return responseHelper.responseInternalServerError('', 'Unable to scan files', res)
    }
    return responseHelper.responseNotFound('', 'Student not found', res)
  }
}

const download = (req, res) => {
  const filename = req.params.name
  const directoryPath = path.resolve(__dirname, '../../public/uploads/krs/')

  res.download(`${directoryPath}/${filename}`, filename, err => {
    if (err) {
      console.log(err)
      return responseHelper.responseInternalServerError('', 'Could not download the file', res)
    }
  })
}

const insert = async (req, res) => {
  try {
    let fileKrs = ''
    req.files ? fileKrs = req.files.krs : fileKrs = undefined

    let { reRegistration } = req.body
    reRegistration = JSON.parse(reRegistration)

    const reRegistrationIsExist = await isExist(reRegistration.id_daftar_ulang)
    const adminIsExist = await adminExist(reRegistration.id_admin)
    const studentIsExist = await studentExist(reRegistration.npm_daftar_ulang)
    const semesterIsExist = await semesterExist(reRegistration.semester_daftar_ulang)

    const semesterAlreadyInList = await semesterAlready(reRegistration.semester_daftar_ulang)
    const studentAlreadyInList = await studentAlready(reRegistration.npm_daftar_ulang)

    let smExist = ''
    let npmExist = ''

    if (studentAlreadyInList[0] !== undefined) {
      const { NPM_DAFTAR_ULANG } = studentAlreadyInList[0]
      npmExist = NPM_DAFTAR_ULANG
    }

    if (npmExist === reRegistration.npm_daftar_ulang) {
      if (semesterAlreadyInList[0] !== undefined) {
        const { SEMESTER_DAFTAR_ULANG } = semesterAlreadyInList[0]
        smExist = SEMESTER_DAFTAR_ULANG
      }

      if (smExist === reRegistration.semester_daftar_ulang) {
        throw new Error('Semester already')
      }
    }

    if (adminIsExist.length === 0) {
      throw new Error('Admin not found')
    }
    if (studentIsExist.length === 0) {
      throw new Error('Student not found')
    }
    if (semesterIsExist.length === 0) {
      throw new Error('Semester not found')
    }
    if (reRegistrationIsExist.length > 0) {
      throw new Error('Exist')
    }

    if (fileKrs !== undefined) {
      uploadHelper({
        file: fileKrs,
        filename: `${reRegistration.npm_daftar_ulang}-sm${reRegistration.semester_daftar_ulang}-${new Date().toLocaleDateString().replace(/\//g, '')}-${fileKrs.name}`,
        dir: 'krs'
      })
    } else {
      throw new Error('You haven\'t selected a file')
    }

    const newReRegistration = await ReRegistrationModel
      .query()
      .insert({
        id_daftar_ulang: reRegistration.id_daftar_ulang,
        id_admin: reRegistration.id_admin,
        krs: `${reRegistration.npm_daftar_ulang}-sm${reRegistration.semester_daftar_ulang}-${new Date().toLocaleDateString().replace(/\//g, '')}-${fileKrs.name}`,
        status_daftar_ulang: reRegistration.status_daftar_ulang,
        npm_daftar_ulang: reRegistration.npm_daftar_ulang,
        semester_daftar_ulang: reRegistration.semester_daftar_ulang
      })
    return responseHelper.responseOk(newReRegistration, 'Successfully add reRegistration', res)
  } catch (err) {
    console.log(err)
    handlerErrorMessange(err, res)
    return responseHelper.responseBadRequest('', 'Bad Request', res)
  }
}

const update = async (req, res) => {
  try {
    let fileKrs = ''
    req.files ? fileKrs = req.files.krs : fileKrs = undefined

    let { reRegistration } = req.body
    reRegistration = JSON.parse(reRegistration)

    const reRegistrationIsExist = await isExist(reRegistration.id_daftar_ulang)
    const adminIsExist = await adminExist(reRegistration.id_admin)
    const studentIsExist = await studentExist(reRegistration.npm_daftar_ulang)
    const semesterIsExist = await semesterExist(reRegistration.semester_daftar_ulang)

    const semesterAlreadyInList = await semesterAlready(reRegistration.semester_daftar_ulang)
    const studentAlreadyInList = await studentAlready(reRegistration.npm_daftar_ulang)

    let smExist = ''
    let npmExist = ''
    let krsExist = ''

    if (studentAlreadyInList[0] !== undefined) {
      const { NPM_DAFTAR_ULANG } = studentAlreadyInList[0]
      npmExist = NPM_DAFTAR_ULANG
    }

    if (npmExist === reRegistration.npm_daftar_ulang) {
      if (semesterAlreadyInList[0] !== undefined) {
        const { SEMESTER_DAFTAR_ULANG, KRS } = semesterAlreadyInList[0]
        smExist = SEMESTER_DAFTAR_ULANG

        if (smExist === reRegistration.semester_daftar_ulang) {
          krsExist = KRS
        }
      }
    } else {
      throw new Error('Not found')
    }

    if (adminIsExist.length === 0) {
      throw new Error('Admin not found')
    }
    if (studentIsExist.length === 0) {
      throw new Error('Student not found')
    }
    if (semesterIsExist.length === 0) {
      throw new Error('Semester not found')
    }
    if (reRegistrationIsExist.length === 0) {
      throw new Error('Not found')
    }

    if (fileKrs !== undefined) {
      removeFromDir(`krs/${reRegistrationIsExist[0].KRS}`)
    }

    const reResgitrationResult = await ReRegistrationModel
      .query()
      .where('id_daftar_ulang', '=', reRegistration.id_daftar_ulang)
      .patch({
        id_daftar_ulang: reRegistration.id_daftar_ulang,
        id_admin: reRegistration.id_admin,
        krs: fileKrs
          ? `${reRegistration.npm_daftar_ulang}-sm${reRegistration.semester_daftar_ulang}-${new Date().toLocaleDateString().replace(/\//g, '')}-${fileKrs.name}`
          : krsExist,
        status_daftar_ulang: reRegistration.status_daftar_ulang,
        npm_daftar_ulang: reRegistration.npm_daftar_ulang,
        semester_daftar_ulang: reRegistration.semester_daftar_ulang
      })

    fileKrs &&
    uploadHelper({
      file: fileKrs,
      filename: `${reRegistration.npm_daftar_ulang}-sm${reRegistration.semester_daftar_ulang}-${new Date().toLocaleDateString().replace(/\//g, '')}-${fileKrs.name}`,
      dir: 'krs'
    })

    return responseHelper.responseOk(reResgitrationResult, 'Successfully update reRegistration', res)
  } catch (err) {
    console.log(err)
    handlerErrorMessange(err, res)
    return responseHelper.responseBadRequest('', 'Bad Request', res)
  }
}

const destroy = async (req, res) => {
  try {
    let { reRegistration } = req.body
    reRegistration = JSON.parse(reRegistration)
    const reRegistrationIsExist = await isExist(reRegistration.id_daftar_ulang)
    if (reRegistrationIsExist.length === 0) {
      throw new Error('Not found')
    }

    removeFromDir(`krs/${reRegistrationIsExist[0].KRS}`)
    const reRegistrationResult = await ReRegistrationModel
      .query()
      .delete()
      .where('id_daftar_ulang', '=', reRegistration.id_daftar_ulang)

    return responseHelper.responseOk(reRegistrationResult, 'Successfully delete reRegistration', res)
  } catch (err) {
    return responseHelper.responseNotFound('', 'reRegistration not found', res)
  }
}

module.exports = {
  isExist,
  findAll,
  findById,
  findByNPM,
  insert,
  update,
  download,
  destroy
}
