const { Model } = require('objection')
const knex = require('../db/connection')
const StudentStatusModel = require('./StudentStatusModel')
const PresenceModel = require('./PresenceModel')
const UKTModel = require('./UKTModel')
const ReRegistrationModel = require('./Re-registrationModel')
const AnnouncementModel = require('./AnnouncementModel')
const QuestionnaireModel = require('./QuestionnaireModel')

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
      },
      presence: {
        relation: Model.HasManyRelation,
        modelClass: PresenceModel,
        join: {
          from: 't_admin.id_admin',
          to: 't_presensi.id_admin'
        }
      },
      ukt: {
        relation: Model.HasManyRelation,
        modelClass: UKTModel,
        join: {
          from: 't_admin.id_admin',
          to: 't_ukt.id_admin'
        }
      },
      reRegistrations: {
        relation: Model.HasManyRelation,
        modelClass: ReRegistrationModel,
        join: {
          from: 't_admin.id_admin',
          to: 't_daftar_ulang.id_admin'
        }
      },
      announcement: {
        relation: Model.HasManyRelation,
        modelClass: AnnouncementModel,
        join: {
          from: 't_admin.id_admin',
          to: 't_pengumuman.id_admin'
        }
      },
      questionnaire: {
        relation: Model.HasManyRelation,
        modelClass: QuestionnaireModel,
        join: {
          from: 't_admin.id_admin',
          to: 't_kuesioner.id_admin'
        }
      }
    }
  }
}

module.exports = AdminAccountModel