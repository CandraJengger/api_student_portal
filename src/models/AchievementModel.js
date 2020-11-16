const { Model } = require('objection')
const knex = require('../db/connection')
const StudentAccountModel = require('./StudentAccountModel')

Model.knex(knex)

class AchievementModel extends Model {
  static get tableName () {
    return 't_prestasi'
  }

  static get relationMappings () {
    return {
      students: {
        relation: Model.BelongsToOneRelation,
        modelClass: StudentAccountModel,
        join: {
          from: 't_prestasi.npm',
          to: 't_akun_mhs.npm'
        }
      }
    }
  }
}

module.exports = AchievementModel
