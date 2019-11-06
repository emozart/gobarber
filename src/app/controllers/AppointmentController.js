import { Appointment, User, File } from '../../database/index'
import { startOfHour, parseISO, isBefore } from 'date-fns'
import * as Yup from 'yup'

const index = async (req, res) => {
  const { page = 1 } = req.query

  const appointments = await Appointment.findAll({
    where: { user_id: req.userId, canceled_at: null },
    order: ['date'],
    attributes: ['id', 'date'],
    limit: 20,
    offset: (page - 1) * 20,
    include: [
      {
        model: User,
        as: 'provider',
        attributes: ['id', 'name'],
        include: [
          {
            model: File,
            as: 'avatar',
            attributes: ['id', 'path', 'url']
          }
        ]
      }
    ]
  })
  return res.json(appointments)
}

const store = async (req, res) => {
  const schema = Yup.object().shape({
    provider_id: Yup.number().required(),
    date: Yup.date().required()
  })

  if (!schema.isValid(req.body)) {
    return res.status(400).json({ error: 'Validation fails.'})
  }

  const { provider_id, date } = req.body

  /**
   * Check if the provider_id is a provider
   */
  const isProvider = await User.findOne({
    where: { id: provider_id, provider: true }
  })

  if (!isProvider) {
    return res
      .status(401)
      .json({ error: 'You can only create apponitments with providers.' })
  }

  /**
   * Check past dates
   */
  const hourStart = startOfHour(parseISO(date))

  if (isBefore(hourStart, new Date())) {
    return res.status(400).json({ error: 'Past dates are not permited.' })
  }

  /**
   * Check date availability
   */
  const availability = await Appointment.findOne({
    where: {
      provider_id,
      canceled_at: null,
      date: hourStart
    }
  })

  if (availability) {
    return res.status(400).json({ error: 'Appointment date is not available.' })
  }
  const appointment = await Appointment.create({
    user_id: req.userId,
    provider_id,
    date
  })

  return res.json(appointment)
}

export default {
  index,
  store
}
