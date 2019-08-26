import * as Yup from 'yup'

import User from '../models/User'

/**
 * Função para criação de novo usuaŕio
 */
const store = async (req, res) => {
  const schema = Yup.object().shape({
    name: Yup.string().required(),
    email: Yup.string()
      .email()
      .required(),
    password: Yup.string()
      .required()
      .min(6)
  })

  if (!(await schema.isValid(req.body))) {
    res.status(400).json({ error: 'Validation fails' })
  }

  const userExits = await User.findOne({
    where: {
      email: req.body.email
    }
  })

  if (userExits) {
    return res.status(400).json({ error: 'User already exists.' })
  }

  const { id, name, email, provider } = await User.create(req.body)
  return res.json({
    id,
    name,
    email,
    provider
  })
}

const update = async (req, res) => {
  const schema = Yup.object().shape({
    name: Yup.string(),
    email: Yup.string().email(),
    old_password: Yup.string(),
    password: Yup.string()
      .min(6)
      .when('old_password', (old_password, field) => {
        return old_password ? field.required() : field
      }),
    confirmPassword: Yup.string()
      .min(6)
      .when('password', (password, field) => {
        return password ? field.required().oneOf([Yup.ref('password')]) : field
      })
  })

  if (!(await schema.isValid(req.body))) {
    res.status(400).json({ error: 'Validation fails' })
  }

  const { email, old_password } = req.body

  const user = await User.findByPk(req.userId)

  if (email !== user.email) {
    const userExits = await User.findOne({
      where: {
        email: req.body.email
      }
    })

    if (userExits) {
      return res
        .status(400)
        .json({ error: 'This email is already used by another user.' })
    }
  }

  if (old_password && !(await user.checkPassword(old_password))) {
    res.status(401).json({ error: 'Actual password does nor match.' })
  }

  const { id, name, provider } = await user.update(req.body)

  return res.json({
    id,
    name,
    email,
    provider
  })
}

export default {
  store,
  update
}
