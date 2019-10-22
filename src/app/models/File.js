import Sequelize from 'sequelize'

export default sequelize => {
  const File = sequelize.define(
    'file',
    {
      name: Sequelize.STRING,
      path: Sequelize.STRING
    },
    {
      sequelize
    }
  )

  return File
}
