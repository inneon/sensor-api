import Persistance from './persistance'
import { DataReading } from '../model'
import { SensorHistoryRequest } from '../model/data'

class InMemory implements Persistance {
  private readings: Record<string, number> = {}

  private toKey(sensorId: string, time: number) {
    return `${sensorId}.${time}`
  }

  private fromKey(key: string) {
    const [sensorId, t] = key.split('.')
    const time = Number(t)
    return { sensorId, time }
  }

  public async exists(sensorId: string, time: number) {
    return Object.keys(this.readings).includes(this.toKey(sensorId, time))
  }

  public async store({ sensorId, time, value }: DataReading) {
    this.readings[this.toKey(sensorId, time)] = value
  }

  public async retrieve(request: SensorHistoryRequest) {
    return Object.keys(this.readings)
      .filter((key) => {
        const { sensorId, time } = this.fromKey(key)
        return (
          sensorId === request.sensorId &&
          request.since <= time &&
          time <= request.until
        )
      })
      .map((key) => ({
        time: this.fromKey(key).time,
        value: this.readings[key],
      }))
  }
}

export default InMemory
