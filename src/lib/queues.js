import Bee from 'bee-queue'
import CancellationMail from '../app/jobs/CancellationMail'
import redisConfig from '../config/redis'

const CancellationMailQueue = new Bee(CancellationMail.key, { redisConfig })

export default {
  CancellationMailQueue
}
