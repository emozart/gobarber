import { format, parseISO } from 'date-fns'
import pt from 'date-fns/locale/pt-BR'
import Mail from '../../lib/mail'

Mail.configureTemplates()

const key = 'CancellationMail'

const handle = async ({ data }) => {
  const { appointment } = data
  await Mail.sendMail({
    to: `${appointment.provider.name} <${appointment.provider.email}>`,
    subject: 'Agendamento Cancelado',
    template: 'cancellation',
    context: {
      provider: appointment.provider.name,
      user: appointment.user.name,
      date: format(
        parseISO(appointment.date),
        "'dia' dd 'de' MMMM', às' H:mm'hs'",
        {
          locale: pt
        }
      )
    }
  })
  console.log('Rodou o envio de emails')
}

const handleFailure = err => {
  console.log(`Queue ${key}: FAILED`, err)
}

export default {
  key,
  handle,
  handleFailure
}
