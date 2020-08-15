import { AlertSubscription, DataReading } from '../model'
import { EmailRequest } from './emailService'
import { SmsRequest } from './smsService'

interface AcceptsSubscriptions {
  addAlertSubscription(alertSubscription: AlertSubscription): Promise<void>
}

export interface AcceptsDataReadings {
  onDataReading(reading: DataReading): void
}

class SubscriptionService implements AcceptsSubscriptions, AcceptsDataReadings {
  private subscriptions: Record<string, AlertSubscription[]>
  private emailCallback: EmailRequest
  private smsCallback: SmsRequest

  constructor(
    initialSubscriptions: Record<string, AlertSubscription[]>,
    emailCallback: EmailRequest,
    smsCallback: SmsRequest,
  ) {
    this.subscriptions = initialSubscriptions
    this.emailCallback = emailCallback
    this.smsCallback = smsCallback
  }

  public async addAlertSubscription(alertSubscription: AlertSubscription) {
    if (!this.subscriptions[alertSubscription.sensorId]) {
      this.subscriptions[alertSubscription.sensorId] = []
    }
    this.subscriptions[alertSubscription.sensorId].push(alertSubscription)
    //todo persit this
  }

  public onDataReading({ sensorId, value, time }: DataReading) {
    const subscriptionsForSensor = this.subscriptions[sensorId] ?? []
    const alerts = subscriptionsForSensor.filter(
      ({ threshold, comparison }) =>
        (comparison === 'gte' && value >= threshold) ||
        (comparison === 'lte' && value <= threshold),
    )

    alerts.forEach((alert) => {
      if (alert.type === 'email') {
        this.emailCallback({
          sensorId,
          value,
          threshold: alert.threshold,
          comparison: alert.comparison,
          time,
          emailAddress: alert.address,
        })
      } else if (alert.type === 'text') {
        this.smsCallback({
          sensorId,
          value,
          threshold: alert.threshold,
          comparison: alert.comparison,
          time,
          phoneNumber: alert.phone,
        })
      }
    })
  }
}

export default SubscriptionService
