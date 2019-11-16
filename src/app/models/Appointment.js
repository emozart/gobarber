import Sequelize from 'sequelize'
import { isBefore, subHours } from 'date-fns'

export default sequelize => {
  const Appointment = sequelize.define(
    'appointment',
    {
      date: Sequelize.DATE,
      canceled_at: Sequelize.DATE,
      past: {
        type: Sequelize.VIRTUAL,
        get() {
          return isBefore(this.date, new Date())
        }
      },
      cancelable: {
        type: Sequelize.VIRTUAL,
        get() {
          return isBefore(new Date(), subHours(this.date, 2))
        }
      }
    },
    {
      sequelize
    }
  )

  return Appointment
}
