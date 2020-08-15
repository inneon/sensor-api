import DataService, { SaveStatus } from './dataService'
import { DataPersistance } from '../persistence'
import { AcceptsDataReadings } from './subscriptionService'

const createService = (
  overrides: Partial<DataPersistance>,
  acceptsDataReadings?: AcceptsDataReadings,
) =>
  new DataService(
    {
      store: () => Promise.resolve(),
      exists: () => Promise.resolve(false),
      retrieve: () => Promise.resolve([]),
      ...overrides,
    },
    acceptsDataReadings ?? { onDataReading: () => {} },
  )

describe('data service', () => {
  it('should save a data reading', async () => {
    const dataService = createService({})
    const actual = await dataService.save({
      sensorId: 'a',
      time: 1,
      value: 2,
    })

    expect(actual).toEqual<SaveStatus>(SaveStatus.success)
  })

  it('should not persist a reading that has already been logged', async () => {
    const dataService = createService({
      exists: () => Promise.resolve(true),
    })

    const actual = await dataService.save({
      sensorId: 'a',
      time: 1,
      value: 3,
    })

    expect(actual).toEqual<SaveStatus>(SaveStatus.duplicate)
  })

  it('should retrieve data requested', async () => {
    const dataService = createService({
      retrieve: () =>
        Promise.resolve([
          { time: 4, value: 16 },
          { time: 1, value: 10 },
          { time: 2, value: 10 },
          { time: 5, value: 14 },
        ]),
    })

    const actual = await dataService.retrieve({
      sensorId: 'a',
      since: 1,
      until: 5,
    })

    expect(actual).toEqual({
      requested: {
        sensorId: 'a',
        since: 1,
        until: 5,
      },
      data: [
        { time: 1, value: 10 },
        { time: 2, value: 10 },
        { time: 4, value: 16 },
        { time: 5, value: 14 },
      ],
    })
  })

  it('should call the subscription service when a reading is received', async () => {
    const mockSubscriptionService = jest.fn()
    const dataService = createService(
      {},
      { onDataReading: mockSubscriptionService },
    )

    await dataService.save({
      sensorId: 'a',
      time: 1,
      value: 3,
    })

    expect(mockSubscriptionService).toBeCalledWith({
      sensorId: 'a',
      time: 1,
      value: 3,
    })
  })

  it('should not call the subscription service when a duplicate reading is received', async () => {
    const mockSubscriptionService = jest.fn()
    const dataService = createService(
      { exists: () => Promise.resolve(true) },
      { onDataReading: mockSubscriptionService },
    )

    await dataService.save({
      sensorId: 'a',
      time: 1,
      value: 3,
    })

    expect(mockSubscriptionService).not.toBeCalled()
  })
})
