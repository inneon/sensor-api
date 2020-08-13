import { DataReading } from '../model'

interface Persistance {
  store(reading: DataReading): Promise<void>
  exists(sensorId: string, time: number): Promise<boolean>
}

export default Persistance
