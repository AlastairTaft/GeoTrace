import * as methods from './risk'

describe('#risk', () => {
  it(`should get the right risk points, which are risk points for every 5 
    minute block for the first 2 hours`.replace(/s+/g, ' '), () => {
    
    var result = methods.getRiskPoints(
      { latitude: 0, longitude: 0 },
      0
    )
    // We collect the first 2 hours in 5 minute blocks
    expect(result[0]).toEqual({
      timeBlockSize: 300000,
      timeBlockNumber: 0,
      timePassedSinceExposure: 0,
      positionBlockSize: 10,
      position: {
        latitudeBlockNumber: 0,
        longitudeBlockNumber: 0
      },
    })
    expect(result[1]).toEqual({
      timeBlockSize: 300000,
      timeBlockNumber: 1,
      timePassedSinceExposure: 300000,
      positionBlockSize: 10,
      position: {
        latitudeBlockNumber: 0,
        longitudeBlockNumber: 0
      },
    })
    expect(result[2]).toEqual({
      timeBlockSize: 300000,
      timeBlockNumber: 2,
      timePassedSinceExposure: 600000,
      positionBlockSize: 10,
      position: {
        latitudeBlockNumber: 0,
        longitudeBlockNumber: 0
      },
    })
    expect(result[23]).toEqual({
      timeBlockSize: 300000,
      timeBlockNumber: 23,
      timePassedSinceExposure: 6900000,
      positionBlockSize: 10,
      position: {
        latitudeBlockNumber: 0,
        longitudeBlockNumber: 0
      },
    })

    // There should be the above done for all three different location grid
    // systems
    expect(result.length).toBe(24 * 3)
  })

  it(`should get the right risk time points with a different elapsed time`
    .replace(/s+/g, ' '), () => {
    
    var result = methods.getRiskPoints(
      { latitude: 0, longitude: 0 },
      111672937,
    )
    // We collect the first 2 hours in 5 minute blocks
    expect(result[0]).toEqual({
      timeBlockSize: 300000,
      timeBlockNumber: 372,
      timePassedSinceExposure: 0,
      positionBlockSize: 10,
      position: {
        latitudeBlockNumber: 0,
        longitudeBlockNumber: 0
      },
    })
    expect(result[1]).toEqual({
      timeBlockSize: 300000,
      timeBlockNumber: 373,
      timePassedSinceExposure: 300000,
      positionBlockSize: 10,
      position: {
        latitudeBlockNumber: 0,
        longitudeBlockNumber: 0
      },
    })
    expect(result[2]).toEqual({
      timeBlockSize: 300000,
      timeBlockNumber: 374,
      timePassedSinceExposure: 600000,
      positionBlockSize: 10,
      position: {
        latitudeBlockNumber: 0,
        longitudeBlockNumber: 0
      },
    })
    expect(result[23]).toEqual({
      timeBlockSize: 300000,
      timeBlockNumber: 395,
      timePassedSinceExposure: 6900000,
      positionBlockSize: 10,
      position: {
        latitudeBlockNumber: 0,
        longitudeBlockNumber: 0
      },
    })
  })

  it(`should get the correct location positions`.replace(/s+/g, ' '), () => {
    
    var result = methods.getRiskPoints(
      { latitude: -56, longitude: 20 },
      0
    )
    expect(result[0]).toEqual({
      timeBlockSize: 300000,
      timeBlockNumber: 0,
      timePassedSinceExposure: 0,
      positionBlockSize: 10,
      position: {
        latitudeBlockNumber: -622347,
        longitudeBlockNumber: 124498
      },
    })
    expect(result[24]).toEqual({
      timeBlockSize: 300000,
      timeBlockNumber: 0,
      timePassedSinceExposure: 0,
      positionBlockSize: 10,
      position: {
        latitudeBlockNumber: -622346,
        longitudeBlockNumber: 124499,
      },
    })
    expect(result[48]).toEqual({
      timeBlockSize: 300000,
      timeBlockNumber: 0,
      timePassedSinceExposure: 0,
      positionBlockSize: 10,
      position: {
        latitudeBlockNumber: -622346,
        longitudeBlockNumber: 124499,
      },
    })
  })
})