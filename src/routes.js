import { Router } from 'express'
import multer from 'multer'
import multerConfig from './config/multer'
import UserController from './app/controllers/UserController'
import ProviderController from './app/controllers/ProviderController'
import SessionController from './app/controllers/SessionController'
import FileController from './app/controllers/FileController'
import AuthMiddleware from './app/middlewares/auth'
import AppointmentController from './app/controllers/AppointmentController'

const routes = Router()
const upload = multer(multerConfig)

routes.post('/users', UserController.store)
routes.post('/sessions', SessionController.store)

routes.use(AuthMiddleware)

routes.put('/users', UserController.update)

routes.get('/providers', ProviderController.index)

routes.get('/appointments', AppointmentController.index)
routes.post('/appointments', AppointmentController.store)

routes.post('/files', upload.single('file'), FileController.store)

export default routes
