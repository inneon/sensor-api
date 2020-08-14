export interface DataReading {
  sensorId: string
  time: number
  value: number
}

export interface SensorHistoryRequest {
  sensorId: string
  since: number
  until: number
}

export type SensorHistory = {
  time: number
  value: number
}[]

export const validatePutData = (body: any): body is DataReading => {
  return (
    !!body &&
    typeof body.sensorId === 'string' &&
    typeof body.time === 'number' &&
    Math.round(body.time) === body.time &&
    typeof body.value === 'number'
  )
}

export const validateGetData = (body: any): body is SensorHistoryRequest => {
  return (
    !!body &&
    typeof body.sensorId !== 'undefined' &&
    typeof body.since === 'number' &&
    Math.round(body.since) === body.since &&
    typeof body.until === 'number' &&
    Math.round(body.until) === body.until &&
    body.since < body.until
  )
}
