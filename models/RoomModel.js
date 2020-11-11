const { Model } = require('objection')
const knex = require('../db/connection')
const BuildingModel = require('./BuildingModel')

Model.knex(knex)

class RoomModel extends Model {
  static get tableName () {
    return 't_ruang'
  }

  static get relationMappings () {
    return {
      rooms: {
        relation: Model.BelongsToOneRelation,
        modelClass: BuildingModel,
        join: {
          from: 't_ruang.kode_gedung',
          to: 't_gedung.kode_gedung'
        }
      }
    }
  }
}

module.exports = RoomModel