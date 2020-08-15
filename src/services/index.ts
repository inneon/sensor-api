import DataService from './dataService'
import { RedisClient } from '../persistence'
import SubscriptionService from './subscriptionService'
import emailService from './emailService'
import smsService from './smsService'

// todo - put in startup section and ensure cleaned up
const redis = new RedisClient()
export const subscriptionService = new SubscriptionService(
  redis,
  emailService,
  smsService,
)
export const service = new DataService(redis, subscriptionService)

export { SaveStatus } from './dataService'
