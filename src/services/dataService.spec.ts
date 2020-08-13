import DataService, { SaveStatus } from './dataService'
import Persistance from '../persistence'

describe('data service', () => {
  it('should save a data reading', async () => {
    const mockPerisitance: Persistance = {
      store: () => Promise.resolve(),
      exists: () => Promise.resolve(false),
    }

    const dataService = new DataService(mockPerisitance)
    const actual = await dataService.save({
      sensorId: 'a',
      time: 1,
      value: 2,
    })

    expect(actual).toEqual<SaveStatus>(SaveStatus.success)
  })

  it('should not persist a reading that has already been logged', async () => {
    const mockPerisitance: Persistance = {
      store: () => Promise.resolve(),
      exists: () => Promise.resolve(true),
    }
    const dataService = new DataService(mockPerisitance)

    const actual = await dataService.save({
      sensorId: 'a',
      time: 1,
      value: 3,
    })

    expect(actual).toEqual<SaveStatus>(SaveStatus.duplicate)
  })
})
