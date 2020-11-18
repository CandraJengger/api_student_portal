const responseHelper = require('../helper/response-helper')
const GraduationModel = require('../models/GraduationModel')
const { isExist: studentExist } = require('./student-account-service')

const isExist = async (id) => {
  const graduationResult = await GraduationModel
    .query()
    .where('id_wisuda', '=', id)
  return graduationResult
}

const npmIsExist = async (npm) => {
  const graduationResult = await GraduationModel
    .query()
    .where('npm', '=', npm)
  return graduationResult
}

const studentInTheClass = async (npm) => {
  const studentResult = await GraduationModel
    .query()
    .where('npm', '=', npm)
  return studentResult
}

const findAll = async (req, res) => {
  try {
    const graduationResult = await GraduationModel
      .query()
      .orderBy('npm', 'ASC')
    return responseHelper.responseOk(graduationResult, 'Success', res)
  } catch (err) {
    return responseHelper.responseNotFound('', 'Error Not Found', res)
  }
}

const findById = async (req, res) => {
  try {
    const { npm: graduation } = req.params
    const graduationResult = await npmIsExist(graduation)
    if (graduationResult.length === 0) {
      throw new Error('Not found')
    }

    return responseHelper.responseOk(graduationResult, 'Success', res)
  } catch (err) {
    return responseHelper.responseNotFound('', 'Graduation not found', res)
  }
}

const insert = async (req, res) => {
  try {
    const { graduation } = req.body
    const graduationIsExist = await isExist(graduation.id_wisuda)
    const studentIsExist = await studentExist(graduation.npm)

    const studentAlreadyInClass = await studentInTheClass(graduation.npm)
    let npmExist = ''
    if (studentAlreadyInClass[0] !== undefined) {
      const { NPM } = studentAlreadyInClass[0]
      npmExist = NPM
    }

    if (npmExist === graduation.npm) {
      throw new Error('Student already')
    }
    if (studentIsExist.length === 0) {
      throw new Error('Student not found')
    }
    if (graduationIsExist.length > 0) {
      throw new Error('Exist')
    }

    const newGraduation = await GraduationModel
      .query()
      .insert({
        id_wisuda: graduation.id_wisuda,
        npm: graduation.npm,
        status_wisuda: graduation.status_wisuda
      })
    return responseHelper.responseOk(newGraduation, 'Successfully add graduation', res)
  } catch (err) {
    console.log(err)
    if (err.message === 'Student already') {
      return responseHelper.responseBadRequest('', 'Student already', res)
    }
    if (err.message === 'Student not found') {
      return responseHelper.responseNotFound('', 'Student not found', res)
    }
    if (err.message === 'Exist') {
      return responseHelper.responseBadRequest('', 'Graduation is exist', res)
    }
    return responseHelper.responseBadRequest('', 'Bad Request', res)
  }
}

const update = async (req, res) => {
  try {
    const { graduation } = req.body
    const graduationIsExist = await isExist(graduation.id_wisuda)
    const studentIsExist = await studentExist(graduation.npm)

    if (studentIsExist.length === 0) {
      throw new Error('Student not found')
    }
    if (graduationIsExist.length === 0) {
      throw new Error('Not found')
    }

    const graduationResult = await GraduationModel
      .query()
      .where('id_wisuda', '=', graduation.id_wisuda)
      .patch({
        id_wisuda: graduation.id_wisuda,
        npm: graduation.npm,
        status_wisuda: graduation.status_wisuda
      })
    return responseHelper.responseOk(graduationResult, 'Successfully update graduation', res)
  } catch (err) {
    if (err.message === 'Student not found') {
      return responseHelper.responseNotFound('', 'Student not found', res)
    }
    if (err.message === 'Not found') {
      return responseHelper.responseNotFound('', 'Graduation not found', res)
    }
    return responseHelper.responseBadRequest('', 'Bad Request', res)
  }
}

const destroy = async (req, res) => {
  try {
    const { graduation } = req.body
    const graduationIsExist = await isExist(graduation.id_wisuda)
    if (graduationIsExist.length === 0) {
      throw new Error('Not found')
    }

    const graduationResult = await GraduationModel
      .query()
      .delete()
      .where('id_wisuda', '=', graduation.id_wisuda)
    return responseHelper.responseOk(graduationResult, 'Successfully delete graduation', res)
  } catch (err) {
    console.log(err)
    return responseHelper.responseNotFound('', 'Graduation not found', res)
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
