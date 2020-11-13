const { Model } = require('objection')
const knex = require('../db/connection')
const LecturerModel = require('./LecturerAccountModel')
const CoursesModel = require('./CoursesModel')

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
          from: 't_jadwal_kuliah.id_dosen',
          to: 't_akun_dosen.id_dosen'
        }
      },
      courses: {
        relation: Model.BelongsToOneRelation,
        modelClass: CoursesModel,
        join: {
          from: 't_jadwal_kuliah.kode_mk',
          to: 't_matakuliah.kode_mk'
        }
      }
    }
  }
}

module.exports = ClassScheduleModel