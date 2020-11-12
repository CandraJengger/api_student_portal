const { Model } = require('objection')
const knex = require('../db/connection')
const BatchModel = require('./BatchModel')

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
      }
    }
  }
}

module.exports = StudentStatusModel