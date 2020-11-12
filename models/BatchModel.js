const { Model } = require('objection')
const knex = require('../db/connection')
const StudentStatusModel = require('./StudentStatusModel')

Model.knex(knex)

class BatchModel extends Model {
  static get tableName () {
    return 't_angkatan'
  }

  static get relationMappings () {
    return {
      studenStatus: {
        relation: Model.HasManyRelation,
        modelClass: StudentStatusModel,
        join: {
          from: 't_angkatan.kode_angkatan',
          to: 't_status_mhs.kode_angkatan'
        }
      }
    }
  }
}

module.exports = BatchModel