const { Model } = require('objection')
const knex = require('../db/connection')
const SemesterModel = require('./SemesterModel')
const ClassScheduleModel = require('./ClassScheduleModel')
const ClassModel = require('./ClassModel')
const RoomModel = require('./RoomModel')

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
        modelClass: ClassScheduleModel,
        join: {
          from: 't_perkuliahan.kode_jadwal',
          to: 't_jadwal_kuliah.kode_jadwal'
        }
      },
      class: {
        relation: Model.BelongsToOneRelation,
        modelClass: ClassModel,
        join: {
          from: 't_perkuliahan.kode_kelas',
          to: 't_kelas.kode_kelas'
        }
      },
      rooms: {
        relation: Model.BelongsToOneRelation,
        modelClass: RoomModel,
        join: {
          from: 't_perkuliahan.kode_ruang',
          to: 't_ruang.kode_ruang'
        }
      }
    }
  }
}

module.exports = LecturesModel