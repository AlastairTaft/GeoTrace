import * as methods from './risk'
import * as constants from './constants'

describe('#risk', () => {
  it(`should get the right risk points, which are risk points for every 5 
    minute block for the first 2 hours`.replace(/\s+/g, ' '), () => {
    
    var result = methods.convertLocationToRiskPoints(
      { 
        coords: { latitude: 0, longitude: 0 },
        timestamp: 0 + constants.RELATIVE_EPOCH_START,
      }
    )
    // We collect the first 2 hours in 5 minute blocks
    expect(result.slice(0, 6)).toEqual([
      {
        positionLayerId: 'A',
        positionBlockId: '0-0',
        positionBlockSize: 10,
        timeBlockId: 0,
        timeBlockSize: 5,
        timeUntilVisit: 0,
      },{
        positionLayerId: 'A',
        positionBlockId: '0-0',
        positionBlockSize: 10,
        timeBlockId: -1,
        timeBlockSize: 5,
        timeUntilVisit: 5,  
      },{
        positionLayerId: 'A',
        positionBlockId: '0-0',
        positionBlockSize: 10,
        timeBlockId: 0,
        timeBlockSize: 10,
        timeUntilVisit: 0,
      },{
        positionLayerId: 'A',
        positionBlockId: '0-0',
        positionBlockSize: 10,
        timeBlockId: -1,
        timeBlockSize: 10,
        timeUntilVisit: 10,
      },{
        positionLayerId: 'A',
        positionBlockId: '0-0',
        positionBlockSize: 10,
        timeBlockId: 0,
        timeBlockSize: 20,
        timeUntilVisit: 0,
      },{
        positionLayerId: 'A',
        positionBlockId: '0-0',
        positionBlockSize: 10,
        timeBlockId: -1,
        timeBlockSize: 20,
        timeUntilVisit: 20,
      },
    ])
    expect(result[6]).toEqual({
      positionLayerId: 'B',
      positionBlockId: '0-0',
      positionBlockSize: 10,
      timeBlockId: 0,
      timeBlockSize: 5,
      timeUntilVisit: 0,
    })
    expect(result[12]).toEqual({
      positionLayerId: 'C',
      positionBlockId: '1-1',
      positionBlockSize: 10,
      timeBlockId: 0,
      timeBlockSize: 5,
      timeUntilVisit: 0,
    })

    // There should be the above done for all three different location grid
    // systems
    expect(result.length).toBe(6 * 3)
  })

  it(`should get the right risk time points with a different elapsed time`
    .replace(/s+/g, ' '), () => {
    
    var result = methods.convertLocationToRiskPoints({
      coords: { latitude: 0, longitude: 0 },
      timestamp: 111672937 + constants.RELATIVE_EPOCH_START,
    })
    expect(result[0]).toEqual({
      positionLayerId: 'A',
      positionBlockId: '0-0',
      positionBlockSize: 10,
      timeBlockId: 372,
      timeBlockSize: 5,
      timeUntilVisit: 0,
    })
    expect(result[1]).toEqual({
      positionLayerId: 'A',
      positionBlockId: '0-0',
      positionBlockSize: 10,
      timeBlockId: 371,
      timeBlockSize: 5,
      timeUntilVisit: 5,
    })
    expect(result[5]).toEqual({
      positionLayerId: 'A',
      positionBlockId: '0-0',
      positionBlockSize: 10,
      timeBlockId: 92,
      timeBlockSize: 20,
      timeUntilVisit: 20,
    })
  })

  it(`should get the correct location positions`.replace(/s+/g, ' '), () => {
    var result = methods.convertLocationToRiskPoints({
      coords: { latitude: -56, longitude: 20 },
      timestamp: 0 + constants.RELATIVE_EPOCH_START,
    })
    expect(result[0]).toEqual({
      positionLayerId: 'A',
      positionBlockId: '124498--622347',
      positionBlockSize: 10,
      timeBlockId: 0,
      timeBlockSize: 5,
      timeUntilVisit: 0,
    })
    expect(result[6]).toEqual({
      positionLayerId: 'B',
      positionBlockId: '124499--622346',
      positionBlockSize: 10,
      timeBlockId: 0,
      timeBlockSize: 5,
      timeUntilVisit: 0,
    })
    expect(result[12]).toEqual({
      positionLayerId: 'C',
      positionBlockId: '124499--622346',
      positionBlockSize: 10,
      timeBlockId: 0,
      timeBlockSize: 5,
      timeUntilVisit: 0,
    })
  })
})