import { DataReading, AlertSubscription } from '../model'
import { SensorHistoryRequest, SensorHistory } from '../model/data'

export interface DataPersistance {
  store(reading: DataReading): Promise<void>
  exists(sensorId: string, time: number): Promise<boolean>
  retrieve(request: SensorHistoryRequest): Promise<SensorHistory>
}

export interface SubscriptionPersistance {
  initialSubscriptions(): Promise<Record<string, AlertSubscription[]>>
  saveSubscriptions(
    subscriptions: Record<string, AlertSubscription[]>,
  ): Promise<void>
}
