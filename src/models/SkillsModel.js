const { Model } = require('objection')
const knex = require('../db/connection')
const StudentAccountModel = require('./StudentAccountModel')

Model.knex(knex)

class SkillsModel extends Model {
  static get tableName () {
    return 't_keterampilan'
  }

  static get relationMappings () {
    return {
      students: {
        relation: Model.BelongsToOneRelation,
        modelClass: StudentAccountModel,
        join: {
          from: 't_keterampilan.npm',
          to: 't_akun_mhs.npm'
        }
      }
    }
  }
}

module.exports = SkillsModel
