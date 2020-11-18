const { Model } = require('objection')
const knex = require('../db/connection')
const StudentStatusModel = require('./StudentStatusModel')
const GraduationModel = require('./GraduationModel')
const InternshipModel = require('./InternshipModel')
const AchievementModel = require('./AchievementModel')
const ILModel = require('./InternationalLanguageModel')
const OrgModel = require('./OrganizationModel')
const StudentProfileModel = require('./StudentProfileModel')

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
      },
      achievement: {
        relation: Model.HasManyRelation,
        modelClass: AchievementModel,
        join: {
          from: 't_akun_mhs.npm',
          to: 't_prestasi.npm'
        }
      },
      organizations: {
        relation: Model.HasManyRelation,
        modelClass: OrgModel,
        join: {
          from: 't_akun_mhs.npm',
          to: 't_organisasi.npm'
        }
      },
      internationalLanguages: {
        relation: Model.HasManyRelation,
        modelClass: ILModel,
        join: {
          from: 't_akun_mhs.npm',
          to: 't_b_internasional.npm'
        }
      },
      studentsProfile: {
        relation: Model.HasManyRelation,
        modelClass: StudentProfileModel,
        join: {
          from: 't_akun_mhs.npm',
          to: 't_profil_mhs.npm'
        }
      }
    }
  }
}

module.exports = StudentAccountModel