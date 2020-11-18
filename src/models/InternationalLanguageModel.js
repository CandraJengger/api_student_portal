const { Model } = require('objection')
const knex = require('../db/connection')
const StudentAccountModel = require('./StudentAccountModel')

Model.knex(knex)

class InternationalLanguageModel extends Model {
  static get tableName () {
    return 't_b_internasional'
  }

  static get relationMappings () {
    return {
      students: {
        relation: Model.BelongsToOneRelation,
        modelClass: StudentAccountModel,
        join: {
          from: 't_b_internasional.npm',
          to: 't_akun_mhs.npm'
        }
      }
    }
  }
}

module.exports = InternationalLanguageModel
