const bcrypt = require('bcrypt')

const HashHelper = {
  generateHash (password) {
    return bcrypt.hashSync(password, 10)
  },

  compareHash (password, hash) {
    return bcrypt.compareSync(password, hash)
  }
}

module.exports = HashHelper