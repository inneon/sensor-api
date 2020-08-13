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

  public async save(reading: DataReading) {
    if (await this.persistance.exists(reading.sensorId, reading.time))
      return SaveStatus.duplicate

    await this.persistance.store(reading)
    return SaveStatus.success
  }
}

export default DataService
