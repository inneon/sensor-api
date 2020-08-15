export type SmsRequest = (request: {
  sensorId: string
  value: number
  threshold: number
  comparison: 'gte' | 'lte'
  time: number
  phoneNumber: string
}) => Promise<void>

const smsService: SmsRequest = ({
  sensorId,
  value,
  threshold,
  comparison,
  time,
  phoneNumber,
}) => {
  console.log(
    `Sending an text: Dear ${phoneNumber}, sensor ${sensorId} has gone ${
      comparison === 'gte' ? 'over' : 'under'
    } the threshold of ${threshold} to ${value} at time ${time}`,
  )
  return Promise.resolve()
}

export default smsService
