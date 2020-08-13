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
})
