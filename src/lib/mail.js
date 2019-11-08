import nodemailer from 'nodemailer'
import mailConfig from '../config/mail'

const { host, port, secure, auth } = mailConfig

const transporter = nodemailer.createTransport({
  host,
  port,
  secure,
  auth: auth.user ? auth : null
})

const sendMail = message => {
  return transporter.sendMail({
    ...mailConfig.default,
    ...message
  })
}

export default {
  sendMail
}
