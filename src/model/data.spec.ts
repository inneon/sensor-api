import { validatePutData, validateGetData } from './data'

describe('validating message DataReadings', () => {
  it('should reject undefined as a DataReading', () => {
    const body = undefined
    const actual = validatePutData(body)
    expect(actual).toBeFalsy()
  })

  it('should reject null as a DataReading', () => {
    const body = null
    const actual = validatePutData(body)
    expect(actual).toBeFalsy()
  })

  it('should reject an empty object as a DataReading', () => {
    const body = {}
    const actual = validatePutData(body)
    expect(actual).toBeFalsy()
  })

  it('should reject an object with just a sensorId as a DataReading', () => {
    const body = { sensorId: 'a' }
    const actual = validatePutData(body)
    expect(actual).toBeFalsy()
  })

  it('should reject non-intiger time as a DataReading', () => {
    const body = {
      sensorId: 'a',
      time: 1.1,
      value: 5,
    }
    const actual = validatePutData(body)
    expect(actual).toBeFalsy()
  })

  it('should accept a DataReading', () => {
    const body = {
      sensorId: 'a',
      time: 1,
      value: 5,
    }
    const actual = validatePutData(body)
    expect(actual).toBeTruthy()
  })
})

describe('validating message SensorHistoryRequest', () => {
  it('should reject undefined as a SensorHistoryRequest', () => {
    const body = undefined
    const actual = validateGetData(body)
    expect(actual).toBeFalsy()
  })

  it('should reject null as a SensorHistoryRequest', () => {
    const body = null
    const actual = validateGetData(body)
    expect(actual).toBeFalsy()
  })

  it('should reject an empty object as a SensorHistoryRequest', () => {
    const body = {}
    const actual = validateGetData(body)
    expect(actual).toBeFalsy()
  })

  it('should reject an object with just a sensorId as a SensorHistoryRequest', () => {
    const body = { sensorId: 'a' }
    const actual = validateGetData(body)
    expect(actual).toBeFalsy()
  })

  it('should reject non-intiger since as a SensorHistoryRequest', () => {
    const body = {
      sensorId: 'a',
      since: 1.1,
      until: 5,
    }
    const actual = validateGetData(body)
    expect(actual).toBeFalsy()
  })

  it('should reject non-intiger until as a SensorHistoryRequest', () => {
    const body = {
      sensorId: 'a',
      since: 1,
      until: 5.1,
    }
    const actual = validateGetData(body)
    expect(actual).toBeFalsy()
  })

  it('should accept a SensorHistoryRequest', () => {
    const body = {
      sensorId: 'a',
      since: 1,
      until: 5,
    }
    const actual = validateGetData(body)
    expect(actual).toBeTruthy()
  })

  it('should reject a SensorHistoryRequest with a negative time period', () => {
    const body = {
      sensorId: 'a',
      since: 5,
      until: 1,
    }
    const actual = validateGetData(body)
    expect(actual).toBeFalsy()
  })
})
