const responseHelper = require('../helper/response-helper')
const StudentProfileModel = require('../models/StudentProfileModel')
const { isExist: studentExist } = require('./student-account-service')
const { upload: uploadHelper, removeFromDir } = require('../helper/upload-helper')

const isExist = async (id) => {
  const spResult = await StudentProfileModel
    .query()
    .where('nik_mhs', '=', id)
  return spResult
}

const npmIsExist = async (npm) => {
  const npmResult = await StudentProfileModel
    .query()
    .where('npm', '=', npm)
  return npmResult
}

const findAll = async (req, res) => {
  try {
    const spResult = await StudentProfileModel
      .query()
      .orderBy('npm', 'ASC')
    return responseHelper.responseOk(spResult, 'Success', res)
  } catch (err) {
    return responseHelper.responseNotFound('', 'Error Not Found', res)
  }
}

const findById = async (req, res) => {
  try {
    let { npm: studentProfile } = req.params
    studentProfile = JSON.parse(studentProfile)
    const spResult = await npmIsExist(studentProfile)
    if (spResult.length === 0) {
      throw new Error('Not found')
    }

    return responseHelper.responseOk(spResult, 'Success', res)
  } catch (err) {
    return responseHelper.responseNotFound('', 'Student Profile data not found', res)
  }
}

const uploadKTP = async (req, res) => {
  try {
    let fileKTP = ''
    req.files ? fileKTP = req.files.fileKTP : fileKTP = undefined

    let { studentProfile } = req.body
    studentProfile = JSON.parse(studentProfile)

    const npmExist = await npmIsExist(studentProfile.npm)
    if (npmExist.length === 0) {
      throw new Error('Not found')
    }

    if (fileKTP !== undefined) {
      removeFromDir(`ktp_mahasiswa/${npmExist[0].SCAN_KTP_MHS}`)
    }
    const newKTP = await StudentProfileModel
      .query()
      .where('npm', '=', studentProfile.npm)
      .patch({
        scan_ktp_mhs: fileKTP !== undefined
          ? `${studentProfile.npm}-ktp-${new Date().toLocaleDateString().replace(/\//g, '')}-${fileKTP.name.replace(/ /g, '')}`
          : npmExist[0].SCAN_KTP_MHS
      })

    fileKTP &&
    uploadHelper({
      file: fileKTP,
      filename: `${studentProfile.npm}-ktp-${new Date().toLocaleDateString().replace(/\//g, '')}-${fileKTP.name.replace(/ /g, '')}`,
      dir: 'ktp_mahasiswa'
    })
    return responseHelper.responseOk(newKTP, 'Successfully update student profile', res)
  } catch (err) {
    console.log(err)
    if (err.message === 'Not found') {
      return responseHelper.responseNotFound('', 'Student profile not found', res)
    }
    return responseHelper.responseBadRequest('', 'Bad Request', res)
  }
}

const uploadProfileImg = async (req, res) => {
  try {
    let fileProfileImg = ''
    req.files ? fileProfileImg = req.files.fileProfileImg : fileProfileImg = undefined

    let { studentProfile } = req.body
    studentProfile = JSON.parse(studentProfile)

    const npmExist = await npmIsExist(studentProfile.npm)
    if (npmExist.length === 0) {
      throw new Error('Not found')
    }

    if (fileProfileImg !== undefined) {
      removeFromDir(`foto_mahasiswa/${npmExist[0].FOTO_PROFIL}`)
    }
    const newKTP = await StudentProfileModel
      .query()
      .where('npm', '=', studentProfile.npm)
      .patch({
        foto_profil: fileProfileImg
          ? `${studentProfile.npm}-fotoProfil-${new Date().toLocaleDateString().replace(/\//g, '')}-${fileProfileImg.name.replace(/ /g, '')}`
          : npmExist[0].FOTO_PROFIL
      })

    fileProfileImg &&
    uploadHelper({
      file: fileProfileImg,
      filename: `${studentProfile.npm}-fotoProfil-${new Date().toLocaleDateString().replace(/\//g, '')}-${fileProfileImg.name.replace(/ /g, '')}`,
      dir: 'foto_mahasiswa'
    })
    return responseHelper.responseOk(newKTP, 'Successfully update student profile', res)
  } catch (err) {
    console.log(err)
    if (err.message === 'Not found') {
      return responseHelper.responseNotFound('', 'Student profile not found', res)
    }
    return responseHelper.responseBadRequest('', 'Bad Request', res)
  }
}

const insert = async (req, res) => {
  try {
    let fileKTP = ''
    let fileProfileImg = ''

    req.files ? fileKTP = req.files.fileKTP : fileKTP = undefined
    req.files ? fileProfileImg = req.files.fileProfileImg : fileProfileImg = undefined

    let { studentProfile } = req.body
    studentProfile = JSON.parse(studentProfile)

    const spIsExist = await isExist(studentProfile.nik_mhs)
    const studentIsExist = await studentExist(studentProfile.npm)

    let npmExist = ''
    if (spIsExist[0] !== undefined) {
      const { NPM } = spIsExist[0]
      npmExist = NPM
    }

    if (npmExist === studentProfile.npm) {
      throw new Error('NPM Already')
    }
    if (studentIsExist.length === 0) {
      throw new Error('Student not found')
    }
    if (spIsExist.length > 0) {
      throw new Error('Exist')
    }

    if (fileKTP !== undefined) {
      uploadHelper({
        file: fileKTP,
        filename: `${studentProfile.npm}-ktp-${new Date().toLocaleDateString().replace(/\//g, '')}-${fileKTP.name.replace(/ /g, '')}`,
        dir: 'ktp_mahasiswa'
      })
    }
    if (fileProfileImg !== undefined) {
      uploadHelper({
        file: fileProfileImg,
        filename: `${studentProfile.npm}-fotoProfil-${new Date().toLocaleDateString().replace(/\//g, '')}-${fileProfileImg.name.replace(/ /g, '')}`,
        dir: 'foto_mahasiswa'
      })
    }

    const newSP = await StudentProfileModel
      .query()
      .insert({
        nik_mhs: studentProfile.nik_mhs,
        npm: studentProfile.npm,
        nama_mhs: studentProfile.nama_mhs,
        no_hp_mhs: studentProfile.no_hp_mhs,
        kota_asal_mhs: studentProfile.kota_asal_mhs,
        alamat_asal_mhs: studentProfile.alamat_asal_mhs,
        alamat_sekarang_mhs: studentProfile.alamat_sekarang_mhs,
        agama_mhs: studentProfile.agama_mhs,
        jenis_kelamin_mhs: studentProfile.jenis_kelamin_mhs,
        tempat_lahir_mhs: studentProfile.tempat_lahir_mhs,
        tanggal_lahir_mhs: studentProfile.tanggal_lahir_mhs,
        email_mhs: studentProfile.email_mhs,
        scan_ktp_mhs: fileKTP !== undefined
          ? `${studentProfile.npm}-ktp-${new Date().toLocaleDateString().replace(/\//g, '')}-${fileKTP.name.replace(/ /g, '')}`
          : '',
        foto_profil: fileProfileImg
          ? `${studentProfile.npm}-fotoProfil-${new Date().toLocaleDateString().replace(/\//g, '')}-${fileProfileImg.name.replace(/ /g, '')}`
          : ''
      })

    return responseHelper.responseOk(newSP, 'Successfully add student profile', res)
  } catch (err) {
    console.log(err)
    if (err.message === 'NPM Already') {
      return responseHelper.responseBadRequest('', 'NPM Already', res)
    }
    if (err.message === 'You haven\'t selected a file') {
      return responseHelper.responseBadRequest('', 'You haven\'t selected a file', res)
    }
    if (err.message === 'Student not found') {
      return responseHelper.responseNotFound('', 'Student not found', res)
    }
    if (err.message === 'Exist') {
      return responseHelper.responseBadRequest('', 'Students Profile is exist', res)
    }
    return responseHelper.responseBadRequest('', 'Bad Request', res)
  }
}

const update = async (req, res) => {
  try {
    let fileKTP = ''
    let fileProfileImg = ''

    req.files ? fileKTP = req.files.fileKTP : fileKTP = undefined
    req.files ? fileProfileImg = req.files.fileProfileImg : fileProfileImg = undefined

    let { studentProfile } = req.body
    studentProfile = JSON.parse(studentProfile)

    const spIsExist = await isExist(studentProfile.nik_mhs)
    const studentIsExist = await studentExist(studentProfile.npm)

    let npmExist = ''
    if (spIsExist[0] !== undefined) {
      const { NPM } = spIsExist[0]
      npmExist = NPM
    }

    if (npmExist !== studentProfile.npm) {
      throw new Error('Not found')
    }
    if (studentIsExist.length === 0) {
      throw new Error('Student not found')
    }
    if (spIsExist.length === 0) {
      throw new Error('Not found')
    }

    if (fileKTP !== undefined) {
      removeFromDir(`ktp_mahasiswa/${spIsExist[0].SCAN_KTP_MHS}`)
    }
    if (fileProfileImg !== undefined) {
      removeFromDir(`foto_mahasiswa/${spIsExist[0].FOTO_PROFIL}`)
    }

    const spResult = await StudentProfileModel
      .query()
      .where('nik_mhs', '=', studentProfile.nik_mhs)
      .patch({
        nik_mhs: studentProfile.nik_mhs,
        npm: studentProfile.npm,
        nama_mhs: studentProfile.nama_mhs,
        no_hp_mhs: studentProfile.no_hp_mhs,
        kota_asal_mhs: studentProfile.kota_asal_mhs,
        alamat_asal_mhs: studentProfile.alamat_asal_mhs,
        alamat_sekarang_mhs: studentProfile.alamat_sekarang_mhs,
        agama_mhs: studentProfile.agama_mhs,
        jenis_kelamin_mhs: studentProfile.jenis_kelamin_mhs,
        tempat_lahir_mhs: studentProfile.tempat_lahir_mhs,
        tanggal_lahir_mhs: studentProfile.tanggal_lahir_mhs,
        email_mhs: studentProfile.email_mhs,
        scan_ktp_mhs: fileKTP !== undefined
          ? `${studentProfile.npm}-ktp-${new Date().toLocaleDateString().replace(/\//g, '')}-${fileKTP.name.replace(/ /g, '')}`
          : spIsExist[0].SCAN_KTP_MHS,
        foto_profil: fileProfileImg
          ? `${studentProfile.npm}-fotoProfil-${new Date().toLocaleDateString().replace(/\//g, '')}-${fileProfileImg.name.replace(/ /g, '')}`
          : spIsExist[0].FOTO_PROFIL
      })

    fileKTP &&
    uploadHelper({
      file: fileKTP,
      filename: `${studentProfile.npm}-ktp-${new Date().toLocaleDateString().replace(/\//g, '')}-${fileKTP.name.replace(/ /g, '')}`,
      dir: 'ktp_mahasiswa'
    })

    fileProfileImg &&
    uploadHelper({
      file: fileProfileImg,
      filename: `${studentProfile.npm}-fotoProfil-${new Date().toLocaleDateString().replace(/\//g, '')}-${fileProfileImg.name.replace(/ /g, '')}`,
      dir: 'foto_mahasiswa'
    })

    return responseHelper.responseOk(spResult, 'Successfully update student profile', res)
  } catch (err) {
    console.log(err)
    if (err.message === 'Student not found') {
      return responseHelper.responseNotFound('', 'Student not found', res)
    }
    if (err.message === 'Not found') {
      return responseHelper.responseNotFound('', 'Student profile not found', res)
    }
    return responseHelper.responseBadRequest('', 'Bad Request', res)
  }
}

const destroy = async (req, res) => {
  try {
    let { studentProfile } = req.body
    studentProfile = JSON.parse(studentProfile)
    const spIsExist = await isExist(studentProfile.nik_mhs)
    if (spIsExist.length === 0) {
      throw new Error('Not found')
    }

    removeFromDir(`ktp_mahasiswa/${spIsExist[0].SCAN_KTP_MHS}`)
    removeFromDir(`foto_mahasiswa/${spIsExist[0].FOTO_PROFIL}`)
    const spResult = await StudentProfileModel
      .query()
      .delete()
      .where('nik_mhs', '=', studentProfile.nik_mhs)
    return responseHelper.responseOk(spResult, 'Successfully delete student profile', res)
  } catch (err) {
    console.log(err)
    return responseHelper.responseNotFound('', 'Student Profile data not found', res)
  }
}

module.exports = {
  isExist,
  findAll,
  findById,
  insert,
  update,
  destroy,
  uploadKTP,
  uploadProfileImg
}
