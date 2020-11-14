const { Model } = require('objection')
const knex = require('../db/connection')
const ClassScheduleModel = require('./ClassScheduleModel')

Model.knex(knex)

class LecturerAccountModel extends Model {
  static get tableName () {
    return 't_akun_dosen'
  }

  static get relationMappings () {
    return {
      studenStatus: {
        relation: Model.HasManyRelation,
        modelClass: ClassScheduleModel,
        join: {
          from: 't_akun_dosen.NIP_dosen',
          to: 't_jadwal_kuliah.NIP_dosen'
        }
      }
    }
  }
}

module.exports = LecturerAccountModel