const { Model } = require('objection')
const knex = require('../db/connection')
const StudentStatusModel = require('./StudentStatusModel')

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
      }
    }
  }
}

module.exports = AdminAccountModel