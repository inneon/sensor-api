import DataService from './dataService'
import { RedisClient } from '../persistence'

// todo - put in startup section and ensure cleaned up
const service = new DataService(new RedisClient())

export { SaveStatus } from './dataService'
export default service
