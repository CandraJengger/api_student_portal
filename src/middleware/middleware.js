const auth = require('../helper/auth-helper')
const responseHelper = require('../helper/response-helper')

exports.authenticate = (req, res, next) => {
  const bearerHeader = req.headers.authorization
  if (!bearerHeader) {
    return responseHelper.responseForbidden('', 'Forbidden', res)
  }

  const bearer = bearerHeader.split(' ')
  if (bearer.length !== 2) {
    return responseHelper.responseForbidden('', 'Invalid token', res)
  }

  const bearerToken = bearer[1]
  const token = bearerToken
  try {
    const decode = auth.verify(token)
    console.log(decode)
    if (!req.context) {
      req.context = {}
    }

    if (!decode) {
      return responseHelper.responseForbidden('', 'Invalid token', res)
    }

    if (decode.STATUS_ADMIN !== undefined) {
      if (decode.STATUS_ADMIN !== 'Aktif') {
        return responseHelper.responseForbidden('', 'Admin not active', res)
      }
    }

    if (decode.STATUS_MHS !== undefined) {
      console.log(decode.STATUS_MHS)
      if (decode.STATUS_MHS !== 'Aktif') {
        return responseHelper.responseForbidden('', 'Student not active', res)
      }
    }

    if (decode.STATUS_DOSEN !== undefined) {
      if (decode.STATUS_DOSEN !== 'Aktif') {
        return responseHelper.responseForbidden('', 'Lecturer not active', res)
      }
    }

    req.context.user = decode

    next()
  } catch (err) {
    console.error(err)
    return responseHelper.responseForbidden('', 'Forbidden', res)
  }
}

module.exports = exports