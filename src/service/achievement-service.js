const responseHelper = require('../helper/response-helper')
const AchievementModel = require('../models/AchievementModel')
const { isExist: studentExist } = require('./student-account-service')
const { upload: uploadHelper, removeFromDir } = require('../helper/upload-helper')

const isExist = async (id) => {
  const achievementResult = await AchievementModel
    .query()
    .where('kode_prestasi', '=', id)
  return achievementResult
}

const npmIsExist = async (npm) => {
  const achievementResult = await AchievementModel
    .query()
    .where('npm', '=', npm)
  return achievementResult
}

const findAll = async (req, res) => {
  try {
    const achievementResult = await AchievementModel
      .query()
      .orderBy('npm', 'ASC')
    return responseHelper.responseOk(achievementResult, 'Success', res)
  } catch (err) {
    return responseHelper.responseNotFound('', 'Error Not Found', res)
  }
}

const findById = async (req, res) => {
  try {
    let { npm: achievement } = req.params
    achievement = JSON.parse(achievement)
    const achievementResult = await npmIsExist(achievement)
    if (achievementResult.length === 0) {
      throw new Error('Not found')
    }

    return responseHelper.responseOk(achievementResult, 'Success', res)
  } catch (err) {
    return responseHelper.responseNotFound('', 'Achievement not found', res)
  }
}

const insert = async (req, res) => {
  try {
    let fileAchievement = ''

    req.files ? fileAchievement = req.files.fileAchievement : fileAchievement = undefined

    let { achievement } = req.body
    achievement = JSON.parse(achievement)

    const achievementIsExist = await isExist(achievement.kode_prestasi)
    const studentIsExist = await studentExist(achievement.npm)

    if (studentIsExist.length === 0) {
      throw new Error('Student not found')
    }
    if (achievementIsExist.length > 0) {
      throw new Error('Exist')
    }

    if (fileAchievement !== undefined) {
      uploadHelper({
        file: fileAchievement,
        filename: `${achievement.npm}-${new Date().toLocaleDateString().replace(/\//g, '')}-${fileAchievement.name.replace(/ /g, '')}`,
        dir: 'bukti_prestasi'
      })
    } else {
      throw new Error('You haven\'t selected a file')
    }

    const newAchiement = await AchievementModel
      .query()
      .insert({
        kode_prestasi: achievement.kode_prestasi,
        npm: achievement.npm,
        tahun_prestasi: achievement.tahun_prestasi,
        juara: achievement.juara,
        jenis_prestasi: achievement.jenis_prestasi,
        tingkat_prestasi: achievement.tingkat_prestasi,
        bukti_prestasi: `${achievement.npm}-${new Date().toLocaleDateString().replace(/\//g, '')}-${fileAchievement.name.replace(/ /g, '')}`
      })
    return responseHelper.responseOk(newAchiement, 'Successfully add achievement', res)
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
      return responseHelper.responseBadRequest('', 'Achievement is exist', res)
    }
    return responseHelper.responseBadRequest('', 'Bad Request', res)
  }
}

const update = async (req, res) => {
  try {
    let fileAchievement = ''

    req.files ? fileAchievement = req.files.fileAchievement : fileAchievement = undefined

    let { achievement } = req.body
    achievement = JSON.parse(achievement)

    const achievementIsExist = await isExist(achievement.kode_prestasi)
    const studentIsExist = await studentExist(achievement.npm)

    if (studentIsExist.length === 0) {
      throw new Error('Student not found')
    }
    if (achievementIsExist.length === 0) {
      throw new Error('Not found')
    }

    if (fileAchievement !== undefined) {
      removeFromDir(`bukti_prestasi/${achievementIsExist[0].BUKTI_PRESTASI}`)
    }

    const achievementResult = await AchievementModel
      .query()
      .where('kode_prestasi', '=', achievement.kode_prestasi)
      .patch({
        kode_prestasi: achievement.kode_prestasi,
        npm: achievement.npm,
        tahun_prestasi: achievement.tahun_prestasi,
        juara: achievement.juara,
        jenis_prestasi: achievement.jenis_prestasi,
        tingkat_prestasi: achievement.tingkat_prestasi,
        bukti_prestasi: fileAchievement
          ? `${achievement.npm}-${new Date().toLocaleDateString().replace(/\//g, '')}-${fileAchievement.name.replace(/ /g, '')}`
          : achievementIsExist[0].BUKTI_PRESTASI
      })

    fileAchievement &&
    uploadHelper({
      file: fileAchievement,
      filename: `${achievement.npm}-${new Date().toLocaleDateString().replace(/\//g, '')}-${fileAchievement.name.replace(/ /g, '')}`,
      dir: 'bukti_prestasi'
    })

    return responseHelper.responseOk(achievementResult, 'Successfully update achievement', res)
  } catch (err) {
    console.log(err)
    if (err.message === 'Student not found') {
      return responseHelper.responseNotFound('', 'Student not found', res)
    }
    if (err.message === 'Not found') {
      return responseHelper.responseNotFound('', 'Achievement not found', res)
    }
    return responseHelper.responseBadRequest('', 'Bad Request', res)
  }
}

const destroy = async (req, res) => {
  try {
    let { achievement } = req.body
    achievement = JSON.parse(achievement)
    const achievementIsExist = await isExist(achievement.kode_prestasi)
    if (achievementIsExist.length === 0) {
      throw new Error('Not found')
    }

    removeFromDir(`bukti_prestasi/${achievementIsExist[0].BUKTI_PRESTASI}`)
    const achievementResult = await AchievementModel
      .query()
      .delete()
      .where('kode_prestasi', '=', achievement.kode_prestasi)
    return responseHelper.responseOk(achievementResult, 'Successfully delete achievement', res)
  } catch (err) {
    console.log(err)
    return responseHelper.responseNotFound('', 'Achievement not found', res)
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
