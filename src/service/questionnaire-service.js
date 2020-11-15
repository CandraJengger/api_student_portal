const responseHelper = require('../helper/response-helper')
const QuestionnaireModel = require('../models/QuestionnaireModel')
const { isExist: adminExist } = require('./admin-account-service')

const isExist = async (id) => {
  const questionnaireResult = await QuestionnaireModel
    .query()
    .where('id_kuesioner', '=', id)
  return questionnaireResult
}

const findAll = async (req, res) => {
  try {
    const questionnaireResult = await QuestionnaireModel
      .query()
      .orderBy('id_kuesioner', 'ASC')
    return responseHelper.responseOk(questionnaireResult, 'Success', res)
  } catch (err) {
    return responseHelper.responseNotFound('', 'Error Not Found', res)
  }
}

const findById = async (req, res) => {
  try {
    const { questionnaire } = req.body
    const questionnaireResult = await isExist(questionnaire.id_kuesioner)
    if (questionnaireResult.length === 0) {
      throw new Error('Not found')
    }

    return responseHelper.responseOk(questionnaireResult, 'Success', res)
  } catch (err) {
    return responseHelper.responseNotFound('', 'questionnaire not found', res)
  }
}

const insert = async (req, res) => {
  try {
    const { questionnaire } = req.body
    const questionnaireIsExist = await isExist(questionnaire.id_kuesioner)
    const adminIsExist = await adminExist(questionnaire.id_admin)

    if (adminIsExist.length === 0) {
      throw new Error('Admin not found')
    }
    if (questionnaireIsExist.length > 0) {
      throw new Error('Exist')
    }

    const newQuestionnaire = await QuestionnaireModel
      .query()
      .insert({
        id_kuesioner: questionnaire.id_kuesioner,
        id_admin: questionnaire.id_admin,
        data_kuesioner: questionnaire.data_kuesioner
      })
    return responseHelper.responseOk(newQuestionnaire, 'Successfully add questionnaire', res)
  } catch (err) {
    console.log(err)
    if (err.message === 'Admin not found') {
      return responseHelper.responseNotFound('', 'Admin not found', res)
    }
    if (err.message === 'Exist') {
      return responseHelper.responseBadRequest('', 'questionnaire is exist', res)
    }
    return responseHelper.responseBadRequest('', 'Bad Request', res)
  }
}

const update = async (req, res) => {
  try {
    const { questionnaire } = req.body
    const questionnaireIsExist = await isExist(questionnaire.id_kuesioner)
    const adminIsExist = await adminExist(questionnaire.id_admin)

    if (adminIsExist.length === 0) {
      throw new Error('Admin not found')
    }
    if (questionnaireIsExist.length === 0) {
      throw new Error('Not found')
    }

    const questionnaireResult = await QuestionnaireModel
      .query()
      .where('id_kuesioner', '=', questionnaire.id_kuesioner)
      .patch({
        id_kuesioner: questionnaire.id_kuesioner,
        id_admin: questionnaire.id_admin,
        data_kuesioner: questionnaire.data_kuesioner
      })
    return responseHelper.responseOk(questionnaireResult, 'Successfully update questionnaire', res)
  } catch (err) {
    if (err.message === 'Admin not found') {
      return responseHelper.responseNotFound('', 'Admin not found', res)
    }
    if (err.message === 'Not found') {
      return responseHelper.responseNotFound('', 'Questionnaire not found', res)
    }
    return responseHelper.responseBadRequest('', 'Bad Request', res)
  }
}

const destroy = async (req, res) => {
  try {
    const { questionnaire } = req.body
    const questionnaireIsExist = await isExist(questionnaire.id_kuesioner)
    if (questionnaireIsExist.length === 0) {
      throw new Error('Not found')
    }

    const questionnaireResult = await QuestionnaireModel
      .query()
      .delete()
      .where('id_kuesioner', '=', questionnaire.id_kuesioner)
    return responseHelper.responseOk(questionnaireResult, 'Successfully delete questionnaire', res)
  } catch (err) {
    console.log(err)
    return responseHelper.responseNotFound('', 'Questionnaire not found', res)
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
