const { Model } = require('objection')
const knex = require('../db/connection')
const MajoringModel = require('./MajoringModel')
const StudentStatusModel = require('./StudentStatusModel')

Model.knex(knex)

class StudyProgramModel extends Model {
  static get tableName () {
    return 't_program_studi'
  }

  static get relationMappings () {
    return {
      studyPrograms: {
        relation: Model.BelongsToOneRelation,
        modelClass: MajoringModel,
        join: {
          from: 't_program_studi.id_jurusan',
          to: 't_jurusan.id_jurusan'
        }
      },
      studentStatus: {
        relation: Model.HasManyRelation,
        modelClass: StudentStatusModel,
        join: {
          from: 't_program_studi.id_prodi',
          to: 't_status_mhs.id_prodi'
        }
      }
    }
  }
}

module.exports = StudyProgramModel