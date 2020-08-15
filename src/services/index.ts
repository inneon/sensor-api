import DataService from './dataService'
import { RedisClient } from '../persistence'
import SubscriptionService from './subscriptionService'
import emailService from './emailService'

// todo - put in startup section and ensure cleaned up
export const subscriptionService = new SubscriptionService({}, emailService)
export const service = new DataService(
  new RedisClient(),
  subscriptionService.onDataReading.bind(subscriptionService),
)

export { SaveStatus } from './dataService'
