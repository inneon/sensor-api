import { DataReading } from '../model'
import Persistance from '../persistence'
import { SensorHistoryRequest } from '../model/data'

export enum SaveStatus {
  success,
  duplicate,
}

class DataService {
  private persistance: Persistance
  private onDataReading: (dataReading: DataReading) => void
  constructor(
    persistance: Persistance,
    onDataReading: (dataReading: DataReading) => void,
  ) {
    this.persistance = persistance
    this.onDataReading = onDataReading
  }

  public async save(reading: DataReading) {
    if (await this.persistance.exists(reading.sensorId, reading.time))
      return SaveStatus.duplicate

    this.onDataReading(reading)
    await this.persistance.store(reading)
    return SaveStatus.success
  }

  public async retrieve(request: SensorHistoryRequest) {
    const data = await this.persistance.retrieve(request)
    return {
      requested: request,
      data: data.sort((a, b) => a.time - b.time),
    }
  }
}

export default DataService
