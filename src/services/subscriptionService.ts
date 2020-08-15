import { AlertSubscription, DataReading } from '../model'
import { EmailRequest } from './emailService'
import { SmsRequest } from './smsService'
import { SubscriptionPersistance } from '../persistence'

interface AcceptsSubscriptions {
  addAlertSubscription(alertSubscription: AlertSubscription): Promise<void>
}

export interface AcceptsDataReadings {
  onDataReading(reading: DataReading): void
}

class SubscriptionService implements AcceptsSubscriptions, AcceptsDataReadings {
  private subscriptions: Record<string, AlertSubscription[]> | undefined
  private subscriptionPeristance: SubscriptionPersistance
  private emailCallback: EmailRequest
  private smsCallback: SmsRequest

  constructor(
    subscriptionPeristance: SubscriptionPersistance,
    emailCallback: EmailRequest,
    smsCallback: SmsRequest,
  ) {
    this.subscriptionPeristance = subscriptionPeristance
    this.emailCallback = emailCallback
    this.smsCallback = smsCallback
  }

  private async getSubscriptions() {
    if (!this.subscriptions) {
      this.subscriptions = await this.subscriptionPeristance.initialSubscriptions()
    }

    return this.subscriptions
  }

  public async addAlertSubscription(alertSubscription: AlertSubscription) {
    const subscriptions = await this.getSubscriptions()
    if (!subscriptions[alertSubscription.sensorId]) {
      subscriptions[alertSubscription.sensorId] = []
    }
    subscriptions[alertSubscription.sensorId].push(alertSubscription)
    this.subscriptionPeristance.saveSubscriptions(subscriptions)
  }

  public async onDataReading({ sensorId, value, time }: DataReading) {
    const subscriptions = await this.getSubscriptions()
    const subscriptionsForSensor = subscriptions[sensorId] ?? []
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
