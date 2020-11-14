const bcrypt = require('bcrypt')
const saltRounds = 10

const HashHelper = {
  generateHash (password) {
    return bcrypt.hashSync(password, this._generateSalt())
  },

  compareHash (password, hash) {
    return bcrypt.compareSync(password, hash)
  },

  _generateSalt () {
    return bcrypt.genSaltSync(saltRounds)
  }
}

module.exports = HashHelper