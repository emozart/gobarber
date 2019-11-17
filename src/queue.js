import 'dotenv/config'
import Queues from './lib/queues'
import CancellationMail from './app/jobs/CancellationMail'

Queues.CancellationMailQueue.on(
  'failed',
  CancellationMail.handleFailure
).process(CancellationMail.handle)

console.log('Rodando fila de emails de cancelamento')
