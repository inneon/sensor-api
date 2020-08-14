import axios from 'axios'
import * as httpModule from 'http'
import https from 'https'
import { v4 } from 'uuid'

const systemUnderTest = axios.create({
  httpAgent: new httpModule.Agent({ keepAlive: true }),
  httpsAgent: new https.Agent({ keepAlive: true }),
  baseURL: process.env.APP_HOST || 'http://localhost:3001',
  timeout: 5000,
})

describe('storing data reading', () => {
  it('should accept a reading', async () => {
    const sensorId = v4()
    const result = await systemUnderTest.put('/data', {
      sensorId: sensorId,
      time: 1,
      value: 2,
    })
    expect(result.status).toEqual(200)
  })

  it('should reject a reading that has already been logged', async () => {
    const sensorId = v4()
    await systemUnderTest.put('/data', {
      sensorId: sensorId,
      time: 1,
      value: 2,
    })

    try {
      await systemUnderTest.put('/data', {
        sensorId: sensorId,
        time: 1,
        value: 2,
      })
    } catch (err) {
      expect(err.response.status).toEqual(409)
    }
  })

  it('should be able to retrieve reading that have been added', async () => {
    const sensorId = v4()
    await systemUnderTest.put('/data', {
      sensorId,
      time: 1,
      value: 111,
    })
    await systemUnderTest.put('/data', {
      sensorId,
      time: 2,
      value: 222,
    })
    await systemUnderTest.put('/data', {
      sensorId,
      time: 3,
      value: 333,
    })
    await systemUnderTest.put('/data', {
      sensorId,
      time: 5,
      value: 555,
    })
    await systemUnderTest.put('/data', {
      sensorId: 'another sensor',
      time: 1,
      value: 111,
    })

    const result = await systemUnderTest.get('/data', {
      data: {
        sensorId,
        since: 1,
        until: 3,
      },
    })

    expect(result.status).toEqual(200)
    expect(result.data).toEqual({
      requested: {
        sensorId,
        since: 1,
        until: 3,
      },
      data: [
        { time: 1, value: 111 },
        { time: 2, value: 222 },
        { time: 3, value: 333 },
      ],
    })
  })
})
