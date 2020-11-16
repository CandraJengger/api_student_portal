const responseHelper = require('../helper/response-helper')
const SkillsModel = require('../models/SkillsModel')
const { isExist: studentExist } = require('./student-account-service')
const { upload: uploadHelper, removeFromDir } = require('../helper/upload-helper')

const isExist = async (id) => {
  const skillsResult = await SkillsModel
    .query()
    .where('kode_keterampilan', '=', id)
  return skillsResult
}

const findAll = async (req, res) => {
  try {
    const skillsResult = await SkillsModel
      .query()
      .orderBy('npm', 'ASC')
    return responseHelper.responseOk(skillsResult, 'Success', res)
  } catch (err) {
    return responseHelper.responseNotFound('', 'Error Not Found', res)
  }
}

const findById = async (req, res) => {
  try {
    let { skills } = req.body
    skills = JSON.parse(skills)
    const skillsResult = await isExist(skills.kode_keterampilan)
    if (skillsResult.length === 0) {
      throw new Error('Not found')
    }

    return responseHelper.responseOk(skillsResult, 'Success', res)
  } catch (err) {
    return responseHelper.responseNotFound('', 'Skills not found', res)
  }
}

const insert = async (req, res) => {
  try {
    let fileSkills = ''

    req.files ? fileSkills = req.files.fileSkills : fileSkills = undefined

    let { skills } = req.body
    skills = JSON.parse(skills)

    const skillsIsExist = await isExist(skills.kode_keterampilan)
    const studentIsExist = await studentExist(skills.npm)

    if (studentIsExist.length === 0) {
      throw new Error('Student not found')
    }
    if (skillsIsExist.length > 0) {
      throw new Error('Exist')
    }

    if (fileSkills !== undefined) {
      uploadHelper({
        file: fileSkills,
        filename: `${skills.npm}-${new Date().toLocaleDateString().replace(/\//g, '')}-${fileSkills.name.replace(/ /g, '')}`,
        dir: 'bukti_keterampilan'
      })
    } else {
      throw new Error('You haven\'t selected a file')
    }

    const newSkills = await SkillsModel
      .query()
      .insert({
        kode_keterampilan: skills.kode_keterampilan,
        npm: skills.npm,
        nama_keterampilan: skills.nama_keterampilan,
        jenis_keterampilan: skills.jenis_keterampilan,
        tingkat_keterampilan: skills.tingkat_keterampilan,
        bukti_keterampilan: `${skills.npm}-${new Date().toLocaleDateString().replace(/\//g, '')}-${fileSkills.name.replace(/ /g, '')}`
      })
    return responseHelper.responseOk(newSkills, 'Successfully add skills', res)
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
      return responseHelper.responseBadRequest('', 'Skills is exist', res)
    }
    return responseHelper.responseBadRequest('', 'Bad Request', res)
  }
}

const update = async (req, res) => {
  try {
    let fileSkills = ''

    req.files ? fileSkills = req.files.fileSkills : fileSkills = undefined

    let { skills } = req.body
    skills = JSON.parse(skills)

    const skillsIsExist = await isExist(skills.kode_keterampilan)
    const studentIsExist = await studentExist(skills.npm)

    if (studentIsExist.length === 0) {
      throw new Error('Student not found')
    }
    if (skillsIsExist.length === 0) {
      throw new Error('Not found')
    }

    if (fileSkills !== undefined) {
      removeFromDir(`bukti_keterampilan/${skillsIsExist[0].BUKTI_KETERAMPILAN}`)
    }

    const skillsResult = await SkillsModel
      .query()
      .where('kode_keterampilan', '=', skills.kode_keterampilan)
      .patch({
        kode_keterampilan: skills.kode_keterampilan,
        npm: skills.npm,
        nama_keterampilan: skills.nama_keterampilan,
        jenis_keterampilan: skills.jenis_keterampilan,
        tingkat_keterampilan: skills.tingkat_keterampilan,
        bukti_keterampilan: `${skills.npm}-${new Date().toLocaleDateString().replace(/\//g, '')}-${fileSkills.name.replace(/ /g, '')}`
      })

    fileSkills &&
    uploadHelper({
      file: fileSkills,
      filename: `${skills.npm}-${new Date().toLocaleDateString().replace(/\//g, '')}-${fileSkills.name.replace(/ /g, '')}`,
      dir: 'bukti_keterampilan'
    })

    return responseHelper.responseOk(skillsResult, 'Successfully update skills', res)
  } catch (err) {
    if (err.message === 'Student not found') {
      return responseHelper.responseNotFound('', 'Student not found', res)
    }
    if (err.message === 'Not found') {
      return responseHelper.responseNotFound('', 'Skills not found', res)
    }
    return responseHelper.responseBadRequest('', 'Bad Request', res)
  }
}

const destroy = async (req, res) => {
  try {
    let { skills } = req.body
    skills = JSON.parse(skills)
    const skillsIsExist = await isExist(skills.kode_keterampilan)
    if (skillsIsExist.length === 0) {
      throw new Error('Not found')
    }

    removeFromDir(`bukti_keterampilan/${skillsIsExist[0].BUKTI_KETERAMPILAN}`)
    const skillsResult = await SkillsModel
      .query()
      .delete()
      .where('kode_keterampilan', '=', skills.kode_keterampilan)
    return responseHelper.responseOk(skillsResult, 'Successfully delete skills', res)
  } catch (err) {
    console.log(err)
    return responseHelper.responseNotFound('', 'Skills not found', res)
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
