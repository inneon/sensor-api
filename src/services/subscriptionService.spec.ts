import SubscriptionService from './subscriptionService'

describe('subscription service', () => {
  it('should email when a subscribed sensor goes over the threshold', () => {
    const mockEmail = jest.fn()
    const service = new SubscriptionService(
      {
        sensor1: [
          {
            sensorId: 'sensor1',
            threshold: 5,
            comparison: 'gte',
            type: 'email',
            address: 'a@b.com',
          },
        ],
      },
      mockEmail,
    )

    service.onDataReading({
      sensorId: 'sensor1',
      time: 2,
      value: 10,
    })

    expect(mockEmail).toBeCalledWith({
      sensorId: 'sensor1',
      value: 10,
      threshold: 5,
      comparison: 'gte',
      time: 2,
      emailAddress: 'a@b.com',
    })
  })

  it('should email when a subscribed sensor goes under the threshold', () => {
    const mockEmail = jest.fn()
    const service = new SubscriptionService(
      {
        sensor1: [
          {
            sensorId: 'sensor1',
            threshold: 5,
            comparison: 'lte',
            type: 'email',
            address: 'a@b.com',
          },
        ],
      },
      mockEmail,
    )

    service.onDataReading({
      sensorId: 'sensor1',
      time: 2,
      value: 2,
    })

    expect(mockEmail).toBeCalledWith({
      sensorId: 'sensor1',
      value: 2,
      threshold: 5,
      comparison: 'lte',
      time: 2,
      emailAddress: 'a@b.com',
    })
  })

  it('should not email when a subscribed sensor doesnt reach the threshold', () => {
    const mockEmail = jest.fn()
    const service = new SubscriptionService(
      {
        sensor1: [
          {
            sensorId: 'sensor1',
            threshold: 5,
            comparison: 'gte',
            type: 'email',
            address: 'a@b.com',
          },
        ],
      },
      mockEmail,
    )

    service.onDataReading({
      sensorId: 'sensor1',
      time: 2,
      value: 2,
    })

    expect(mockEmail).not.toBeCalled()
  })

  it('should email for the right sensor', () => {
    const mockEmail = jest.fn()
    const service = new SubscriptionService(
      {
        sensor1: [
          {
            sensorId: 'sensor1',
            threshold: 5,
            comparison: 'lte',
            type: 'email',
            address: 'a@b.com',
          },
        ],
        sensor2: [
          {
            sensorId: 'sensor2',
            threshold: 5,
            comparison: 'lte',
            type: 'email',
            address: 'a@b.com',
          },
        ],
      },
      mockEmail,
    )

    service.onDataReading({
      sensorId: 'sensor1',
      time: 2,
      value: 2,
    })

    expect(mockEmail).toBeCalledWith({
      sensorId: 'sensor1',
      value: 2,
      threshold: 5,
      comparison: 'lte',
      time: 2,
      emailAddress: 'a@b.com',
    })
    expect(mockEmail).toBeCalledTimes(1)
  })
})
