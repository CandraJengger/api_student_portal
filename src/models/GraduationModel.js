const { Model } = require('objection')
const knex = require('../db/connection')
const StudentAccountModel = require('./StudentAccountModel')

Model.knex(knex)

class GraduationModel extends Model {
  static get tableName () {
    return 't_wisuda'
  }

  static get relationMappings () {
    return {
      admin: {
        relation: Model.BelongsToOneRelation,
        modelClass: StudentAccountModel,
        join: {
          from: 't_wisuda.npm',
          to: 't_akun_mhs.npm'
        }
      }
    }
  }
}

module.exports = GraduationModel
