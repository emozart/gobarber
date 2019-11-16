import { Appointment, User, File } from '../../database/index'
import { startOfHour, parseISO, isBefore, format, subHours } from 'date-fns'
import pt from 'date-fns/locale/pt'
import * as Yup from 'yup'
import NotificationSchema from '../schemas/Notification'

import Queues from '../../lib/queues'

const index = async (req, res) => {
  const { page = 1 } = req.query

  const appointments = await Appointment.findAll({
    where: { user_id: req.userId, canceled_at: null },
    order: ['date'],
    attributes: ['id', 'date', 'past', 'cancelable'],
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
    return res.status(400).json({ error: 'Validation fails.' })
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

  /**
   * Notify Appointment provider
   */
  const user = await User.findByPk(req.userId)
  const formattedDate = format(hourStart, "'dia' dd 'de' MMMM', às' H:mm'hs'", {
    locale: pt
  })
  await NotificationSchema.create({
    content: `Novo agendamento de ${user.name} para ${formattedDate}.`,
    user: provider_id
  })

  return res.json(appointment)
}

const excluir = async (req, res) => {
  const appointment = await Appointment.findByPk(req.params.id, {
    include: [
      {
        model: User,
        as: 'provider',
        attributes: ['name', 'email']
      },
      {
        model: User,
        as: 'user',
        attributes: ['name']
      }
    ]
  })

  if (appointment.user_id !== req.userId) {
    return res
      .status(401)
      .json({ error: 'You do not have permittion to cancel this appointment.' })
  }

  const cancelLimit = subHours(appointment.date, 2)

  if (isBefore(cancelLimit, new Date())) {
    return res.status(401).json({
      error: 'You can only cancel appointments in 2 hours in advance.'
    })
  }

  appointment.canceled_at = new Date()
  await appointment.save()

  Queues.CancellationMailQueue.createJob({ appointment }).save()

  return res.json(appointment)
}

export default {
  index,
  store,
  excluir
}
