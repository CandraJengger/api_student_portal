const responseOk = (values, message, result) => {
  return result
    .status(200)
    .header('Content-Type', 'application/json; charset=utf-8')
    .send({
      code: 200,
      values: values,
      message: message
    })
}

const responseNotFound = (values, message, result) => {
  return result
    .status(200)
    .header('Content-Type', 'application/json; charset=utf-8')
    .send({
      code: 404,
      values: values,
      message: message
    })
}

const responseBadRequest = (values, message, result) => {
  return result
    .status(200)
    .header('Content-Type', 'application/json; charset=utf-8')
    .send({
      code: 400,
      values: values,
      message: message
    })
}

const responseForbidden = (values, message, result) => {
  return result
    .status(200)
    .header('Content-Type', 'application/json; charset=utf-8')
    .send({
      code: 403,
      values: values,
      message: message
    })
}

const responseInternalServerError = (values, message, result) => {
  return result
    .status(200)
    .header('Content-Type', 'application/json; charset=utf-8')
    .send({
      code: 403,
      values: values,
      message: message
    })
}

module.exports = {
  responseOk,
  responseNotFound,
  responseInternalServerError,
  responseForbidden,
  responseBadRequest
}