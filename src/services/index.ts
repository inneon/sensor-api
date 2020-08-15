import DataService from './dataService'
import { RedisClient } from '../persistence'
import SubscriptionService from './subscriptionService'
import emailService from './emailService'
import smsService from './smsService'

// todo - put in startup section and ensure cleaned up
export const subscriptionService = new SubscriptionService(
  {},
  emailService,
  smsService,
)
export const service = new DataService(new RedisClient(), subscriptionService)

export { SaveStatus } from './dataService'
