import Sequelize from 'sequelize'
import databaseConfig from '../../config/database'

const sequelize = new Sequelize(databaseConfig)

const User = sequelize.define(
  'user',
  {
    name: Sequelize.STRING,
    email: Sequelize.STRING,
    password_hash: Sequelize.STRING,
    provider: Sequelize.BOOLEAN
  },
  {
    sequelize
  }
)

export default User
