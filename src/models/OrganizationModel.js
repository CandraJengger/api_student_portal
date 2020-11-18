const { Model } = require('objection')
const knex = require('../db/connection')
const StudentAccountModel = require('./StudentAccountModel')

Model.knex(knex)

class OrganizationModel extends Model {
  static get tableName () {
    return 't_organisasi'
  }

  static get relationMappings () {
    return {
      students: {
        relation: Model.BelongsToOneRelation,
        modelClass: StudentAccountModel,
        join: {
          from: 't_organisasi.npm',
          to: 't_akun_mhs.npm'
        }
      }
    }
  }
}

module.exports = OrganizationModel
