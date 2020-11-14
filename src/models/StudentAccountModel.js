const { Model } = require('objection')
const knex = require('../db/connection')
const StudentStatusModel = require('./StudentStatusModel')

Model.knex(knex)

class StudentAccountModel extends Model {
  static get tableName () {
    return 't_akun_mhs'
  }

  static get relationMappings () {
    return {
      studentStatus: {
        relation: Model.HasManyRelation,
        modelClass: StudentStatusModel,
        join: {
          from: 't_akun_mhs.npm',
          to: 't_status_mhs.npm'
        }
      }
    }
  }
}

module.exports = StudentAccountModel