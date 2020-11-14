const { Model } = require('objection')
const knex = require('../db/connection')
const ClassScheduleModel = require('./ClassScheduleModel')

Model.knex(knex)

class CoursesModel extends Model {
  static get tableName () {
    return 't_matakuliah'
  }

  static get relationMappings () {
    return {
      studenStatus: {
        relation: Model.HasManyRelation,
        modelClass: ClassScheduleModel,
        join: {
          from: 't_matakuliah.kode_mk',
          to: 't_jadwal_kuliah.kode_mk'
        }
      }
    }
  }
}

module.exports = CoursesModel