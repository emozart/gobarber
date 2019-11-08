import Notification from '../schemas/Notification'
import { User } from '../../database/index'

const index = async (req, res) => {
  const checkIsProvider = await User.findOne({
    where: { id: req.userId, provider: true }
  })

  if (!checkIsProvider) {
    return res
      .status(401)
      .json({ error: 'Only providers can load notifications.' })
  }

  const notifications = await Notification.find({
    user: req.userId
  })
    .sort({ createdAt: 'desc' })
    .limit(20)

  return res.json(notifications)
}

const update = async (req, res) => {
  const notifications = await Notification.findByIdAndUpdate(
    req.params.id,
    {
      read: true
    },
    { new: true }
  )
  return res.json(notifications)
}

export default {
  index,
  update
}
