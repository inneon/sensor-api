export interface PutData {
  sensorId: string
  time: number
  value: number
}

export const validatePutData = (body: any): body is PutData => {
  return (
    typeof body !== 'undefined' &&
    typeof body.sensorId === 'string' &&
    typeof body.time === 'number' &&
    Math.round(body.time) === body.time &&
    typeof body.value === 'number'
  )
}
