import express from 'express'
import path from 'path'
import routes from './routes'

import './database'

/**
 * Declaração do Servidor
 */
const server = express()

/**
 * Lista de Middlewares
 */
server.use(express.json())
server.use(
  '/files',
  express.static(path.resolve(__dirname, '..', 'temp', 'uploads'))
)

/**
 * Rotas da aplicação
 */
server.use(routes)

export default server
