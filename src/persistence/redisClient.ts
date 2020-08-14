import redis, { RedisClient } from 'redis'
import { promisify } from 'util'
import Persistance from './persistance'
import { DataReading } from '../model'
import { SensorHistoryRequest, SensorHistory } from '../model/data'

export const toTimeAndValue = (zScores: string[]): SensorHistory => {
  return zScores
    .map((s) => Number(s))
    .reduce<SensorHistory>((accumulator, timeOrValue, i) => {
      if (i % 2 === 0) {
        accumulator.push({ time: 0, value: timeOrValue })
      } else {
        accumulator[i / 2 - 0.5].time = timeOrValue
      }
      return accumulator
    }, [])
}

class RedisPersistance implements Persistance {
  private client: RedisClient
  private existsKey: (key: string) => Promise<number>
  private zRangeByScore: (
    key: string,
    from: string | number,
    to: string | number,
    withScores: string,
  ) => Promise<unknown>
  // private set: (key: string, value: string) => Promise<any>

  constructor() {
    this.client = redis.createClient(
      process.env.REDIS_URL || 'redis://localhost:6379',
    )
    this.existsKey = promisify(this.client.exists).bind(this.client)
    // this.set = promisify(this.client.set).bind(this.client)
    this.zRangeByScore = promisify(this.client.zrangebyscore).bind(this.client)
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

    await new Promise((res, rej) =>
      this.client
        .multi()
        .set(this.key(sensorId, time), value.toString())
        .zadd(sensorId, time, value)
        .exec((err, reply) => {
          if (err) rej(err)
          else res(reply)
        }),
    )
  }

  public async retrieve(request: SensorHistoryRequest) {
    const result = (await this.zRangeByScore(
      request.sensorId,
      request.since,
      request.until,
      'withScores',
    )) as string[]

    return toTimeAndValue(result)
  }
}

export default RedisPersistance
