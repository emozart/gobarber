import express from 'express'
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

/**
 * Rotas da aplicação
 */
server.use(routes)

export default server
