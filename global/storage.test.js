import * as methods from './storage'

describe('#purgeStaleRiskPoints', () => {
  it('should remove risk points that are older than 2 weeks.', () => {
    var riskData = [
      {
        timestamp: 0,
        riskPoint: { foo: 'bar' },
      },
      {
        timestamp: 86400000, // 1 day later
        riskPoint: { foo: 'bar' },
      },
      {
        timestamp: 1296000000, // 15 days later
        riskPoint: { foo: 'bar2' },
      },
    ]
    var nowTimestamp = 1296000000 // 15 days
    var purgeTimeout = 1209600000
    var purgedData = methods.purgeStaleRiskPoints(
      riskData, 
      nowTimestamp, 
      purgeTimeout
    )
    expect(purgedData).toEqual([
      {
        timestamp: 86400000, // 1 day later
        riskPoint: { foo: 'bar' },
      },
      {
        timestamp: 1296000000, // 15 days later
        riskPoint: { foo: 'bar2' },
      },
    ])
  })

  it('should remove risk points that are older than 1 week.', () => {
    var riskData = [
      {
        timestamp: 0,
        riskPoint: { foo: 'bar' },
      },
      {
        timestamp: 86400000, // 1 day later
        riskPoint: { foo: 'bar' },
      },
      {
        timestamp: 1296000000, // 15 days later
        riskPoint: { foo: 'bar2' },
      },
    ]
    var nowTimestamp = 1296000000 // 15 days
    var purgeTimeout = 604800000
    var purgedData = methods.purgeStaleRiskPoints(
      riskData, 
      nowTimestamp, 
      purgeTimeout
    )
    expect(purgedData).toEqual([
      {
        timestamp: 1296000000, // 15 days later
        riskPoint: { foo: 'bar2' },
      },
    ])
  })
})