const { Model } = require('objection')
const knex = require('../db/connection')
const LecturesModel = require('./LecturesModel')
const StudentStatusModel = require('./StudentStatusModel')

Model.knex(knex)

class ClassModel extends Model {
  static get tableName () {
    return 't_kelas'
  }

  static get relationMappings () {
    return {
      lectures: {
        relation: Model.HasManyRelation,
        modelClass: LecturesModel,
        join: {
          from: 't_kelas.kode_kelas',
          to: 't_perkuliahan.kode_kelas'
        }
      },
      studentStatus: {
        relation: Model.HasManyRelation,
        modelClass: StudentStatusModel,
        join: {
          from: 't_kelas.kode_kelas',
          to: 't_status_mhs.kode_kelas'
        }
      }
    }
  }
}

module.exports = ClassModel