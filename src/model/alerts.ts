interface AlertInfo {
  sensorId: string
  threshold: number
  comparison: 'lte' | 'gte'
}

interface EmailSubscription {
  type: 'email'
  address: string
}

interface TextSubscription {
  type: 'text'
  phone: string
}

export type AlertSubscription = AlertInfo &
  (EmailSubscription | TextSubscription)

const validEmail = (body: any) => {
  return (
    body.type === 'email' &&
    typeof body.address === 'string' &&
    /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/.test(body.address)
  )
}

const validText = (body: any) => {
  return (
    body.type === 'text' &&
    typeof body.phone === 'string' &&
    /^[\+0][0-9 ]+$/.test(body.phone)
  )
}

export const validateAlertSubscription = (
  body: any,
): body is AlertSubscription => {
  return (
    !!body &&
    typeof body.sensorId === 'string' &&
    typeof body.threshold === 'number' &&
    (body.comparison === 'lte' || body.comparison === 'gte') &&
    (validEmail(body) || validText(body))
  )
}
