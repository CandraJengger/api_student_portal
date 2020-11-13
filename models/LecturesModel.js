const { Model } = require('objection')
const knex = require('../db/connection')
const SemesterModel = require('./SemesterModel')
const ClassScheduleMode = require('./ClassScheduleModel')

Model.knex(knex)

class LecturesModel extends Model {
  static get tableName () {
    return 't_perkuliahan'
  }

  static get relationMappings () {
    return {
      semesters: {
        relation: Model.BelongsToOneRelation,
        modelClass: SemesterModel,
        join: {
          from: 't_perkuliahan.kode_semester',
          to: 't_semester.kode_semester'
        }
      },
      classSchedules: {
        relation: Model.BelongsToOneRelation,
        modelClass: ClassScheduleMode,
        join: {
          from: 't_perkuliahan.kode_jadwal',
          to: 't_jadwal_kuliah.kode_jadwal'
        }
      }
    }
  }
}

module.exports = LecturesModel