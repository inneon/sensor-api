import axios from 'axios'
import * as httpModule from 'http'
import https from 'https'

const systemUnderTest = axios.create({
  httpAgent: new httpModule.Agent({ keepAlive: true }),
  httpsAgent: new https.Agent({ keepAlive: true }),
  baseURL: process.env.APP_HOST || 'http://localhost:3000',
  timeout: 5000,
})

describe('integration tests', () => {
  it('should get the healthcheck endpoint', async () => {
    const response = await systemUnderTest.get('/internal/healthcheck')

    expect(response.status).toEqual(200)
  })
})
