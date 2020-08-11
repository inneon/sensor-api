import { DataReading } from '../model'

interface Persistance {
  store(reading: DataReading): void
  exists(sensorId: string, time: number): boolean
}

export default Persistance
