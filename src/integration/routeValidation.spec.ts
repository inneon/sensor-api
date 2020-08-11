import axios from 'axios'
import * as httpModule from 'http'
import https from 'https'

const systemUnderTest = axios.create({
  httpAgent: new httpModule.Agent({ keepAlive: true }),
  httpsAgent: new https.Agent({ keepAlive: true }),
  baseURL: process.env.APP_HOST || 'http://localhost:3000',
  timeout: 5000,
})

describe('route validation', () => {
  it('should reject put on /data without the correct fields', async () => {
    try {
      await systemUnderTest.put('/data', {
        sensorId: 'a',
        other: 'fields',
      })
    } catch (err) {
      expect(err.response.status).toEqual(400)
    }
  })
})
