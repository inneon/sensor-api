import { DataReading } from '../model'
import { SensorHistoryRequest, SensorHistory } from '../model/data'

interface Persistance {
  store(reading: DataReading): Promise<void>
  exists(sensorId: string, time: number): Promise<boolean>
  retrieve(request: SensorHistoryRequest): Promise<SensorHistory>
}

export default Persistance
