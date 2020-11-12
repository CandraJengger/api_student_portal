const { Model } = require('objection')
const knex = require('../db/connection')
const MajoringModel = require('./MajoringModel')

Model.knex(knex)

class StudyProgramModel extends Model {
  static get tableName () {
    return 't_program_studi'
  }

  static get relationMappings () {
    return {
      studyPrograms: {
        relation: Model.HasManyRelation,
        modelClass: MajoringModel,
        join: {
          from: 't_program_studi.id_jurusan',
          to: 't_jurusan.id_jurusan'
        }
      }
    }
  }
}

module.exports = StudyProgramModel