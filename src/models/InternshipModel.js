const { Model } = require('objection')
const knex = require('../db/connection')
const StudentAccountModel = require('./StudentAccountModel')

Model.knex(knex)

class InternshipModel extends Model {
  static get tableName () {
    return 't_magang'
  }

  static get relationMappings () {
    return {
      admin: {
        relation: Model.BelongsToOneRelation,
        modelClass: StudentAccountModel,
        join: {
          from: 't_magang.npm',
          to: 't_akun_mhs.npm'
        }
      }
    }
  }
}

module.exports = InternshipModel
