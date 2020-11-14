const { Model } = require('objection')
const knex = require('../db/connection')
const AdminAccountModel = require('./AdminAccountModel')

Model.knex(knex)

class UKTModel extends Model {
  static get tableName () {
    return 't_ukt'
  }

  static get relationMappings () {
    return {
      studyPrograms: {
        relation: Model.BelongsToOneRelation,
        modelClass: AdminAccountModel,
        join: {
          from: 't_ukt.id_admin',
          to: 't_admin.id_admin'
        }
      }
    }
  }
}

module.exports = UKTModel