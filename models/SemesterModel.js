const { Model } = require('objection')
const knex = require('../db/connection')
const LecturesModel = require('./LecturesModel')
const StudentStatusModel = require('./StudentStatusModel')

Model.knex(knex)

class SemesterModel extends Model {
  static get tableName () {
    return 't_semester'
  }

  static get relationMappings () {
    return {
      lectures: {
        relation: Model.HasManyRelation,
        modelClass: LecturesModel,
        join: {
          from: 't_semester.kode_semester',
          to: 't_perkuliahan.kode_semester'
        }
      },
      studentStatus: {
        relation: Model.HasManyRelation,
        modelClass: StudentStatusModel,
        join: {
          from: 't_semester.kode_semester',
          to: 't_status_mhs.kode_semester'
        }
      }
    }
  }
}

module.exports = SemesterModel