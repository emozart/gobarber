import Sequelize from 'sequelize'

export default sequelize => {
  const File = sequelize.define(
    'file',
    {
      name: Sequelize.STRING,
      path: Sequelize.STRING,
      url: {
        type: Sequelize.VIRTUAL,
        get() {
          return `${process.env.APP_URL}/files/${this.path}`
        }
      }
    },
    {
      sequelize
    }
  )

  return File
}
