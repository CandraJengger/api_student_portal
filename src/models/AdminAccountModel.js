const { Model } = require('objection')
const knex = require('../db/connection')
const StudentStatusModel = require('./StudentStatusModel')
const PresenceModel = require('./PresenceModel')

Model.knex(knex)

class AdminAccountModel extends Model {
  static get tableName () {
    return 't_admin'
  }

  static get relationMappings () {
    return {
      studenStatus: {
        relation: Model.HasManyRelation,
        modelClass: StudentStatusModel,
        join: {
          from: 't_admin.id_admin',
          to: 't_status_mhs.id_admin'
        }
      },
      presence: {
        relation: Model.HasManyRelation,
        modelClass: PresenceModel,
        join: {
          from: 't_admin.id_admin',
          to: 't_presensi.id_admin'
        }
      }
    }
  }
}

module.exports = AdminAccountModel