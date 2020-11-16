const { Model } = require('objection')
const knex = require('../db/connection')
const StudentStatusModel = require('./StudentStatusModel')
const GraduationModel = require('./GraduationModel')
const InternshipModel = require('./InternshipModel')

Model.knex(knex)

class StudentAccountModel extends Model {
  static get tableName () {
    return 't_akun_mhs'
  }

  static get relationMappings () {
    return {
      studentStatus: {
        relation: Model.HasManyRelation,
        modelClass: StudentStatusModel,
        join: {
          from: 't_akun_mhs.npm',
          to: 't_status_mhs.npm'
        }
      },
      graduations: {
        relation: Model.HasManyRelation,
        modelClass: GraduationModel,
        join: {
          from: 't_akun_mhs.npm',
          to: 't_wisuda.npm'
        }
      },
      internship: {
        relation: Model.HasManyRelation,
        modelClass: InternshipModel,
        join: {
          from: 't_akun_mhs.npm',
          to: 't_magang.npm'
        }
      }
    }
  }
}

module.exports = StudentAccountModel