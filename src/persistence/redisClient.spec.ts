import { toTimeAndValue } from './redisClient'

describe('redis client', () => {
  it('can create time and value arrays from zRangeScores', () => {
    const zScores = ['100', '1', '102', '2', '99', '3']

    const actual = toTimeAndValue(zScores)

    expect(actual).toEqual([
      { time: 1, value: 100 },
      { time: 2, value: 102 },
      { time: 3, value: 99 },
    ])
  })
})
