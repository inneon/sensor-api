import { DataReading } from '../model'
import Persistance from '../persistence'

export enum SaveStatus {
  success,
  duplicate,
}

class DataService {
  private persistance: Persistance
  constructor(persistance: Persistance) {
    this.persistance = persistance
  }

  public save(reading: DataReading) {
    if (this.persistance.exists(reading.sensorId, reading.time))
      return SaveStatus.duplicate

    this.persistance.store(reading)
    return SaveStatus.success
  }
}

export default DataService
