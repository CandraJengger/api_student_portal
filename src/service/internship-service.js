const responseHelper = require('../helper/response-helper')
const InternshipModel = require('../models/InternshipModel')
const { isExist: studentExist } = require('./student-account-service')
const { upload: uploadHelper, removeFromDir } = require('../helper/upload-helper')

const isExist = async (id) => {
  const internshipResult = await InternshipModel
    .query()
    .where('kode_magang', '=', id)
  return internshipResult
}

const npmIsExist = async (npm) => {
  const internshipResult = await InternshipModel
    .query()
    .where('npm', '=', npm)
  return internshipResult
}

const studentInList = async (npm) => {
  const studentResult = await InternshipModel
    .query()
    .where('npm', '=', npm)
  return studentResult
}

const findAll = async (req, res) => {
  try {
    const internshipResult = await InternshipModel
      .query()
      .orderBy('npm', 'ASC')
    return responseHelper.responseOk(internshipResult, 'Success', res)
  } catch (err) {
    return responseHelper.responseNotFound('', 'Error Not Found', res)
  }
}

const findById = async (req, res) => {
  try {
    const { npm: internship } = req.params
    const internshipResult = await npmIsExist(internship)
    if (internshipResult.length === 0) {
      throw new Error('Not found')
    }

    return responseHelper.responseOk(internshipResult, 'Success', res)
  } catch (err) {
    return responseHelper.responseNotFound('', 'Internship not found', res)
  }
}

const insert = async (req, res) => {
  try {
    let fileInternship = ''
    let internshipReport = ''

    req.files ? fileInternship = req.files.fileInternship : fileInternship = undefined
    req.files ? internshipReport = req.files.internshipReport : internshipReport = undefined

    let { internship } = req.body
    internship = JSON.parse(internship)

    const internshipIsExist = await isExist(internship.kode_magang)
    const studentIsExist = await studentExist(internship.npm)

    const studentAlreadyInList = await studentInList(internship.npm)
    let npmExist = ''
    if (studentAlreadyInList[0] !== undefined) {
      const { NPM } = studentAlreadyInList[0]
      npmExist = NPM
    }

    if (npmExist === internship.npm) {
      throw new Error('Student already')
    }
    if (studentIsExist.length === 0) {
      throw new Error('Student not found')
    }
    if (internshipIsExist.length > 0) {
      throw new Error('Exist')
    }

    if (fileInternship !== undefined) {
      uploadHelper({
        file: fileInternship,
        filename: `${internship.npm}-${new Date().toLocaleDateString().replace(/\//g, '')}-${fileInternship.name.replace(/ /g, '')}`,
        dir: 'bukti_magang'
      })
    } else {
      throw new Error('You haven\'t selected a file')
    }

    if (internshipReport !== undefined) {
      uploadHelper({
        file: internshipReport,
        filename: `${internship.npm}-${new Date().toLocaleDateString().replace(/\//g, '')}-${internshipReport.name.replace(/ /g, '')}`,
        dir: 'laporan_magang'
      })
    } else {
      throw new Error('You haven\'t selected a file')
    }

    const newInternship = await InternshipModel
      .query()
      .insert({
        kode_magang: internship.kode_magang,
        npm: internship.npm,
        tempat_magang: internship.tempat_magang,
        provinsi_magang: internship.provinsi_magang,
        kota_magang: internship.kota_magang,
        tanggal_mulai: internship.tanggal_mulai,
        tanggal_selesai: internship.tanggal_selesai,
        bukti_magang: `${internship.npm}-${new Date().toLocaleDateString().replace(/\//g, '')}-${fileInternship.name.replace(/ /g, '')}`,
        laporan_magang: `${internship.npm}-${new Date().toLocaleDateString().replace(/\//g, '')}-${internshipReport.name.replace(/ /g, '')}`
      })
    return responseHelper.responseOk(newInternship, 'Successfully add internship', res)
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
      return responseHelper.responseBadRequest('', 'Internship is exist', res)
    }
    return responseHelper.responseBadRequest('', 'Bad Request', res)
  }
}

const update = async (req, res) => {
  try {
    let fileInternship = ''
    let internshipReport = ''

    req.files ? fileInternship = req.files.fileInternship : fileInternship = undefined
    req.files ? internshipReport = req.files.internshipReport : internshipReport = undefined

    let { internship } = req.body
    internship = JSON.parse(internship)

    const internshipIsExist = await isExist(internship.kode_magang)
    const studentIsExist = await studentExist(internship.npm)

    if (studentIsExist.length === 0) {
      throw new Error('Student not found')
    }
    if (internshipIsExist.length === 0) {
      throw new Error('Not found')
    }

    if (fileInternship !== undefined) {
      removeFromDir(`bukti_magang/${internshipIsExist[0].BUKTI_MAGANG}`)
    }
    if (internshipReport !== undefined) {
      removeFromDir(`laporan_magang/${internshipIsExist[0].LAPORAN_MAGANG}`)
    }

    const internshipResult = await InternshipModel
      .query()
      .where('kode_magang', '=', internship.kode_magang)
      .patch({
        kode_magang: internship.kode_magang,
        npm: internship.npm,
        tempat_magang: internship.tempat_magang,
        provinsi_magang: internship.provinsi_magang,
        kota_magang: internship.kota_magang,
        tanggal_mulai: internship.tanggal_mulai,
        tanggal_selesai: internship.tanggal_selesai,
        bukti_magang: fileInternship
          ? `${internship.npm}-${new Date().toLocaleDateString().replace(/\//g, '')}-${fileInternship.name.replace(/ /g, '')}`
          : internshipIsExist[0].BUKTI_MAGANG,
        laporan_magang: internshipReport
          ? `${internship.npm}-${new Date().toLocaleDateString().replace(/\//g, '')}-${internshipReport.name.replace(/ /g, '')}`
          : internshipIsExist[0].LAPORAN_MAGANG
      })

    fileInternship &&
    uploadHelper({
      file: fileInternship,
      filename: `${internship.npm}-${new Date().toLocaleDateString().replace(/\//g, '')}-${fileInternship.name.replace(/ /g, '')}`,
      dir: 'bukti_magang'
    })
    internshipReport &&
    uploadHelper({
      file: internshipReport,
      filename: `${internship.npm}-${new Date().toLocaleDateString().replace(/\//g, '')}-${internshipReport.name.replace(/ /g, '')}`,
      dir: 'laporan_magang'
    })

    return responseHelper.responseOk(internshipResult, 'Successfully update internship', res)
  } catch (err) {
    if (err.message === 'Student not found') {
      return responseHelper.responseNotFound('', 'Student not found', res)
    }
    if (err.message === 'Not found') {
      return responseHelper.responseNotFound('', 'Internship not found', res)
    }
    return responseHelper.responseBadRequest('', 'Bad Request', res)
  }
}

const destroy = async (req, res) => {
  try {
    let { internship } = req.body
    internship = JSON.parse(internship)
    const internshipIsExist = await isExist(internship.kode_magang)
    if (internshipIsExist.length === 0) {
      throw new Error('Not found')
    }

    removeFromDir(`bukti_magang/${internshipIsExist[0].BUKTI_MAGANG}`)
    removeFromDir(`laporan_magang/${internshipIsExist[0].LAPORAN_MAGANG}`)
    const internshipResult = await InternshipModel
      .query()
      .delete()
      .where('kode_magang', '=', internship.kode_magang)
    return responseHelper.responseOk(internshipResult, 'Successfully delete internship', res)
  } catch (err) {
    console.log(err)
    return responseHelper.responseNotFound('', 'Internship not found', res)
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
