import DataService, { SaveStatus } from './dataService'
import Persistance from '../persistence'
import { DataReading } from '../model'

const createService = (
  overrides: Partial<Persistance>,
  onDataReading?: (dataReading: DataReading) => void,
) =>
  new DataService(
    {
      store: () => Promise.resolve(),
      exists: () => Promise.resolve(false),
      retrieve: () => Promise.resolve([]),
      ...overrides,
    },
    onDataReading ?? (() => {}),
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
})
