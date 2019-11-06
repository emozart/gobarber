import { Appointment, User } from '../../database/index'
import { startOfDay, endOfDay, parseISO } from 'date-fns'
import { Op } from 'sequelize'

const index = async (req, res) => {
  const checkUserProvider = await User.findOne({
    where: { id: req.userId, provider: true }
  })

  if (!checkUserProvider) {
    return res.status(401).json({ error: 'User is not a provider.' })
  }

  const { date } = req.query
  const parsedDate = parseISO(date)

  const appointments = await Appointment.findAll({
    where: {
      provider_id: req.userId,
      canceled_at: null,
      date: {
        [Op.between]: [startOfDay(parsedDate), endOfDay(parsedDate)]
      }
    },
    order: ['date']
  })

  return res.json(appointments)
}

export default {
  index
}