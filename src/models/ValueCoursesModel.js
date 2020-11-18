const { Model } = require('objection')
const knex = require('../db/connection')
const AdminAccountModel = require('./AdminAccountModel')

Model.knex(knex)

class ValueCoursesModel extends Model {
  static get tableName () {
    return 't_nilai'
  }

  static get relationMappings () {
    return {
      admin: {
        relation: Model.BelongsToOneRelation,
        modelClass: AdminAccountModel,
        join: {
          from: 't_nilai.id_admin',
          to: 't_admin.id_admin'
        }
      }
    }
  }
}

module.exports = ValueCoursesModel