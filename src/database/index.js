import Sequelize from 'sequelize'

import databaseConfig from '../config/database'
import UserModel from '../app/models/User'
import FileModel from '../app/models/File'

const sequelize = new Sequelize(databaseConfig)

const associate = (modelA, modelB) => {
  modelA.belongsTo(modelB, { foreignKey: 'avatar_id' })
}

const User = UserModel(sequelize)
const File = FileModel(sequelize)

associate(User, File)

export { User, File }
