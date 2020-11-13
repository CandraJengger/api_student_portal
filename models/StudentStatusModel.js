const { Model } = require('objection')
const knex = require('../db/connection')
const BatchModel = require('./BatchModel')
const StudentAccountModel = require('./StudentAccountModel')

Model.knex(knex)

class StudentStatusModel extends Model {
  static get tableName () {
    return 't_status_mhs'
  }

  static get relationMappings () {
    return {
      bacths: {
        relation: Model.BelongsToOneRelation,
        modelClass: BatchModel,
        join: {
          from: 't_status_mhs.kode_angkatan',
          to: 't_angkatan.kode_angkatan'
        }
      },
      students: {
        relation: Model.BelongsToOneRelation,
        modelClass: StudentAccountModel,
        join: {
          from: 't_status_mhs.npm',
          to: 't_akun_mhs.npm'
        }
      }
    }
  }
}

module.exports = StudentStatusModel