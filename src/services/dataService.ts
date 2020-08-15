import { DataReading } from '../model'
import { DataPersistance } from '../persistence'
import { SensorHistoryRequest } from '../model/data'
import { AcceptsDataReadings } from './subscriptionService'

export enum SaveStatus {
  success,
  duplicate,
}

class DataService {
  private persistance: DataPersistance
  private acceptsDataReadings: AcceptsDataReadings
  constructor(
    persistance: DataPersistance,
    acceptsDataReadings: AcceptsDataReadings,
  ) {
    this.persistance = persistance
    this.acceptsDataReadings = acceptsDataReadings
  }

  public async save(reading: DataReading) {
    if (await this.persistance.exists(reading.sensorId, reading.time))
      return SaveStatus.duplicate

    this.acceptsDataReadings.onDataReading(reading)
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
