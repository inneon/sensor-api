import redis, { RedisClient } from 'redis'
import { promisify } from 'util'
import Persistance from './persistance'
import { DataReading } from '../model'

class RedisPersistance implements Persistance {
  private client: RedisClient
  private existsKey: (key: string) => Promise<number>
  private set: (key: string, value: string) => Promise<any>

  constructor() {
    this.client = redis.createClient(
      process.env.REDIS_URL || 'redis://localhost:6379',
    )
    this.existsKey = promisify(this.client.exists).bind(this.client)
    this.set = promisify(this.client.set).bind(this.client)
  }

  private key(sensorId: string, time: number): string {
    return `${sensorId}:${time}`
  }

  public async exists(sensorId: string, time: number) {
    const result = await this.existsKey(this.key(sensorId, time)).catch(
      (err) => {
        console.log(err)
        throw err
      },
    )
    return result === 1
  }

  public async store(reading: DataReading) {
    const { sensorId, time, value } = reading
    await this.set(this.key(sensorId, time), value.toString()).catch((err) => {
      console.log(err)
      throw err
    })
  }

  public async retrieve() {
    return []
  }
}

export default RedisPersistance
