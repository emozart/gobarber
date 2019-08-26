import Sequelize from 'sequelize'
import bcrypt from 'bcryptjs'

import databaseConfig from '../../config/database'

const sequelize = new Sequelize(databaseConfig)

const User = sequelize.define(
  'user',
  {
    name: Sequelize.STRING,
    email: Sequelize.STRING,
    password: Sequelize.VIRTUAL,
    password_hash: Sequelize.STRING,
    provider: Sequelize.BOOLEAN
  },
  {
    sequelize
  }
)

User.prototype.checkPassword = function(password) {
  return bcrypt.compare(password, this.password_hash)
}

User.addHook('beforeSave', async user => {
  if (user.password) {
    user.password_hash = await bcrypt.hash(user.password, 8)
  }
})

export default User
