const { Model } = require('objection')
const knex = require('../db/connection')
const StudyProgramModel = require('./StudyProgramModel')

Model.knex(knex)

class MajoringModel extends Model {
  static get tableName () {
    return 't_jurusan'
  }

  static get relationMappings () {
    return {
      majorings: {
        relation: Model.HasManyRelation,
        modelClass: StudyProgramModel,
        join: {
          from: 't_jurusan.id_jurusan',
          to: 't_program_studi.id_jurusan'
        }
      }
    }
  }
}

module.exports = MajoringModel