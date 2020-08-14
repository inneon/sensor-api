import InMemory from './inMemory'

describe('In memory storage', () => {
  it('should store and retrieve the data', async () => {
    const inMemory = new InMemory()

    inMemory.store({ sensorId: 'a', time: 1, value: 10 })
    inMemory.store({ sensorId: 'a', time: 2, value: 11 })
    inMemory.store({ sensorId: 'a', time: 10, value: 12 })
    inMemory.store({ sensorId: 'b', time: 2, value: 100000 })

    const actual = await inMemory.retrieve({
      sensorId: 'a',
      since: 1,
      until: 3,
    })

    expect(actual).toEqual([
      { time: 1, value: 10 },
      { time: 2, value: 11 },
    ])
  })
})
