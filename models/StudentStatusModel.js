const { Model } = require('objection')
const knex = require('../db/connection')
const BatchModel = require('./BatchModel')
const StudentAccountModel = require('./StudentAccountModel')
const AdminAccountModel = require('./AdminAccountModel')
const ClassModel = require('./ClassModel')
const SemesterModel = require('./SemesterModel')
const StudyProgramModel = require('./StudyProgramModel')

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
      },
      admins: {
        relation: Model.BelongsToOneRelation,
        modelClass: AdminAccountModel,
        join: {
          from: 't_status_mhs.id_admin',
          to: 't_admin.id_admin'
        }
      },
      studyPrograms: {
        relation: Model.BelongsToOneRelation,
        modelClass: StudyProgramModel,
        join: {
          from: 't_status_mhs.id_prodi',
          to: 't_program_studi.id_prodi'
        }
      },
      semesters: {
        relation: Model.BelongsToOneRelation,
        modelClass: SemesterModel,
        join: {
          from: 't_status_mhs.kode_semester',
          to: 't_semester.kode_semester'
        }
      },
      class: {
        relation: Model.BelongsToOneRelation,
        modelClass: ClassModel,
        join: {
          from: 't_status_mhs.kode_kelas',
          to: 't_kelas.kode_kelas'
        }
      }
    }
  }
}

module.exports = StudentStatusModel