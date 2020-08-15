import { validateAlertSubscription } from './alerts'

describe('validating AlertSubscription', () => {
  it('should reject an undefined body', () => {
    const body = undefined
    const actual = validateAlertSubscription(body)
    expect(actual).toBeFalsy()
  })

  it('should reject a null body', () => {
    const body = null
    const actual = validateAlertSubscription(body)
    expect(actual).toBeFalsy()
  })

  it('should reject an empty object', () => {
    const body = {}
    const actual = validateAlertSubscription(body)
    expect(actual).toBeFalsy()
  })

  it('should reject a body without a sensorId', () => {
    const body = {
      threshold: 1,
      comparison: 'gte',
      type: 'email',
      address: 'a@b.com',
    }
    const actual = validateAlertSubscription(body)
    expect(actual).toBeFalsy()
  })

  it('should reject a body without a threshold', () => {
    const body = {
      sensorId: 'a',
      comparison: 'gte',
      type: 'email',
      address: 'a@b.com',
    }
    const actual = validateAlertSubscription(body)
    expect(actual).toBeFalsy()
  })

  it('should reject a body without a comparison', () => {
    const body = {
      sensorId: 'a',
      threshold: 1,
      type: 'email',
      address: 'a@b.com',
    }
    const actual = validateAlertSubscription(body)
    expect(actual).toBeFalsy()
  })

  it('should reject a body with incorrect comparison', () => {
    const body = {
      sensorId: 'a',
      threshold: 1,
      comparison: 'asdfasdfsdf',
      type: 'email',
      address: 'a@b.com',
    }
    const actual = validateAlertSubscription(body)
    expect(actual).toBeFalsy()
  })

  it('should reject a body without a type', () => {
    const body = {
      sensorId: 'a',
      threshold: 1,
      comparison: 'gte',
      address: 'a@b.com',
    }
    const actual = validateAlertSubscription(body)
    expect(actual).toBeFalsy()
  })

  it('should accept a valid email subscription request', () => {
    const body = {
      sensorId: 'a',
      threshold: 1,
      comparison: 'gte',
      type: 'email',
      address: 'a@b.com',
    }
    const actual = validateAlertSubscription(body)
    expect(actual).toBeTruthy()
  })

  it('should reject an email subscription request without an address', () => {
    const body = {
      sensorId: 'a',
      threshold: 1,
      comparison: 'gte',
      type: 'email',
      phone: 'a@b.com',
    }
    const actual = validateAlertSubscription(body)
    expect(actual).toBeFalsy()
  })

  it('should accept a valid text subscription request', () => {
    const body = {
      sensorId: 'a',
      threshold: 1,
      comparison: 'gte',
      type: 'text',
      phone: '01234 567 890',
    }
    const actual = validateAlertSubscription(body)
    expect(actual).toBeTruthy()
  })

  it('should reject a text subscription request without a phone', () => {
    const body = {
      sensorId: 'a',
      threshold: 1,
      comparison: 'gte',
      type: 'text',
      address: '01234 567 890',
    }
    const actual = validateAlertSubscription(body)
    expect(actual).toBeFalsy()
  })
})
