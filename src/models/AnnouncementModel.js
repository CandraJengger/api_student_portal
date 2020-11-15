const { Model } = require('objection')
const knex = require('../db/connection')
const AdminAccountModel = require('./AdminAccountModel')

Model.knex(knex)

class ReRegistraionModel extends Model {
  static get tableName () {
    return 't_pengumuman'
  }

  static get relationMappings () {
    return {
      admin: {
        relation: Model.BelongsToOneRelation,
        modelClass: AdminAccountModel,
        join: {
          from: 't_pengumuman.id_admin',
          to: 't_admin.id_admin'
        }
      }
    }
  }
}

module.exports = ReRegistraionModel