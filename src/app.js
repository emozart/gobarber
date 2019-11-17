import 'dotenv/config'
import express from 'express'
import path from 'path'
import Youch from 'youch'
import * as Sentry from '@sentry/node'
import 'express-async-errors'
import routes from './routes'
import sentryConfig from './config/sentry'

import './database'

/**
 * Declaração do Servidor
 */
const server = express()

/**
 * Monitoramento de erros
 */
Sentry.init(sentryConfig)

/**
 * Lista de Middlewares
 */
server.use(Sentry.Handlers.requestHandler())
server.use(express.json())
server.use(
  '/files',
  express.static(path.resolve(__dirname, '..', 'temp', 'uploads'))
)

/**
 * Rotas da aplicação
 */
server.use(routes)
server.use(Sentry.Handlers.errorHandler())

/**
 * Captura de erros
 */
server.use(async (err, req, res, next) => {
  if (process.env.NODE_ENV === 'development') {
    const errors = await new Youch(err, req).toJSON()
    return res.status(500).json(errors)
  }
  return res.status(500).json({ error: 'Internal server error' })
})

export default server
