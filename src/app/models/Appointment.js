import Sequelize from 'sequelize'

export default sequelize => {
  const Appointment = sequelize.define(
    'appointment',
    {
      date: Sequelize.DATE,
      canceled_at: Sequelize.DATE
    },
    {
      sequelize
    }
  )

  return Appointment
}
