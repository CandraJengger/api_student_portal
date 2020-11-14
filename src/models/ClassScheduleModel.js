const { Model } = require('objection')
const knex = require('../db/connection')
const LecturerModel = require('./LecturerAccountModel')
const CoursesModel = require('./CoursesModel')
const LecturesModel = require('./LecturesModel')

Model.knex(knex)

class ClassScheduleModel extends Model {
  static get tableName () {
    return 't_jadwal_kuliah'
  }

  static get relationMappings () {
    return {
      lecturers: {
        relation: Model.BelongsToOneRelation,
        modelClass: LecturerModel,
        join: {
          from: 't_jadwal_kuliah.NIP_dosen',
          to: 't_akun_dosen.NIP_dosen'
        }
      },
      courses: {
        relation: Model.BelongsToOneRelation,
        modelClass: CoursesModel,
        join: {
          from: 't_jadwal_kuliah.kode_mk',
          to: 't_matakuliah.kode_mk'
        }
      },
      lectures: {
        relation: Model.HasManyRelation,
        modelClass: LecturesModel,
        join: {
          from: 't_jadwal_kuliah.kode_jadwal',
          to: 't_perkuliahan.kode_jadwal'
        }
      }
    }
  }
}

module.exports = ClassScheduleModel