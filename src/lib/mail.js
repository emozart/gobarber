import nodemailer from 'nodemailer'
import mailConfig from '../config/mail'
import exphbs from 'express-handlebars'
import nodemailerhbs from 'nodemailer-express-handlebars'
import { resolve } from 'path'

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

const configureTemplates = () => {
  const viewPath = resolve(__dirname, '..', 'app', 'views', 'emails')
  transporter.use(
    'compile',
    nodemailerhbs({
      viewEngine: exphbs.create({
        layoutsDir: resolve(viewPath, 'layouts'),
        partialsDir: resolve(viewPath, 'partials'),
        defaultLayout: 'default',
        extname: '.hbs'
      }),
      viewPath,
      extName: '.hbs'
    })
  )
}

export default {
  sendMail,
  configureTemplates
}
