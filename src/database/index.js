import Sequelize from 'sequelize'

import databaseConfig from '../config/database'
import UserModel from '../app/models/User'

const sequelize = new Sequelize(databaseConfig)

const User = UserModel(sequelize)

export default User
