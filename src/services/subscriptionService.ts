import { AlertSubscription, DataReading } from '../model'
import { EmailRequest } from './emailService'

class SubscriptionService {
  private subscriptions: Record<string, AlertSubscription[]>
  private emailCallback: EmailRequest

  constructor(
    initialSubscriptions: Record<string, AlertSubscription[]>,
    emailCallback: EmailRequest,
  ) {
    this.subscriptions = initialSubscriptions
    this.emailCallback = emailCallback
    console.log(this.subscriptions, initialSubscriptions)
  }

  public async addAlertSubscription(alertSubscription: AlertSubscription) {
    if (!this.subscriptions[alertSubscription.sensorId]) {
      this.subscriptions[alertSubscription.sensorId] = []
    }
    this.subscriptions[alertSubscription.sensorId].push(alertSubscription)
    //todo persit this
  }

  public onDataReading({ sensorId, value, time }: DataReading) {
    console.log(this.subscriptions)
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
      }
    })
  }
}

export default SubscriptionService
