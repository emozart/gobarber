import Sequelize from 'sequelize'
import mongoose from 'mongoose'

import databaseConfig from '../config/database'
import UserModel from '../app/models/User'
import FileModel from '../app/models/File'
import AppointmentModel from '../app/models/Appointment'

const mongoConnection = mongoose.connect('mongodb://localhost:27017/gobarber', {
  useNewUrlParser: true,
  useFindAndModify: true
})

const sequelize = new Sequelize(databaseConfig)

const User = UserModel(sequelize)
const File = FileModel(sequelize)
const Appointment = AppointmentModel(sequelize)

User.belongsTo(File, { foreignKey: 'avatar_id', as: 'avatar' })
Appointment.belongsTo(User, { foreignKey: 'user_id', as: 'user' })
Appointment.belongsTo(User, { foreignKey: 'provider_id', as: 'provider' })

export { User, File, Appointment }
