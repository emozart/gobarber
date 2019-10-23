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
          return `http://localhost:3333/files/${this.path}`
        }
      }
    },
    {
      sequelize
    }
  )

  return File
}
