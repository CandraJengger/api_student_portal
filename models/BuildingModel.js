const { Model } = require('objection')
const knex = require('../db/connection')
const RoomModel = require('./RoomModel')

Model.knex(knex)

class BuildingModel extends Model {
  static get tableName () {
    return 't_gedung'
  }

  static get relationMappings () {
    return {
      buildings: {
        relation: Model.HasManyRelation,
        modelClass: RoomModel,
        join: {
          from: 't_gedung.kode_gedung',
          to: 't_ruang.kode_gedung'
        }
      }
    }
  }
}

module.exports = BuildingModel