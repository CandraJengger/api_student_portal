const { Model } = require('objection')
const knex = require('../db/connection')
const AdminAccountModel = require('./AdminAccountModel')

Model.knex(knex)

class PresenceModel extends Model {
  static get tableName () {
    return 't_presensi'
  }

  static get relationMappings () {
    return {
      studyPrograms: {
        relation: Model.BelongsToOneRelation,
        modelClass: AdminAccountModel,
        join: {
          from: 't_presensi.id_admin',
          to: 't_admin.id_admin'
        }
      }
    }
  }
}

module.exports = PresenceModel