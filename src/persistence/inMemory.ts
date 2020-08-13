import Persistance from './persistance'
import { DataReading } from '../model'

class InMemory implements Persistance {
  private readings: Record<string, number> = {}

  public async exists(sensorId: string, time: number) {
    return Object.keys(this.readings).includes(`${sensorId}.${time}`)
  }

  public async store({ sensorId, time, value }: DataReading) {
    console.log('sotring data in memory')
    this.readings[`${sensorId}.${time}`] = value
  }
}

export default InMemory
