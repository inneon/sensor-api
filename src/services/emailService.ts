export type EmailRequest = (request: {
  sensorId: string
  value: number
  threshold: number
  comparison: 'gte' | 'lte'
  time: number
  emailAddress: string
}) => Promise<void>

const emailService: EmailRequest = ({
  sensorId,
  value,
  threshold,
  comparison,
  time,
  emailAddress,
}) => {
  console.log(
    `Sending an email: Dear ${emailAddress}, sensor ${sensorId} has gone ${
      comparison === 'gte' ? 'over' : 'under'
    } the threshold of ${threshold} to ${value} at time ${time}`,
  )
  return Promise.resolve()
}

export default emailService
