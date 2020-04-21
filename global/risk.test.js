import * as methods from './risk'

describe('#risk', () => {
  it(`should get the right risk points, which are risk points for every 5 
    minute block for the first 3 hours and then every hour block after that up
    to 72 hours.`.replace(/s+/g, ' '), () => {
    
    var result = methods.getRiskPoints(
      { latitude: 0, longitude: 0 },
      0
    )
    // We collect the first 3 hours in 5 minute blocks
    expect(result[0]).toEqual({
      timeBlockSize: 300000,
      timeBlockNumber: 0,
      timePassedSinceExposure: 0,
      position: {
        latitudeBlockNumber: 0,
        longitudeBlockNumber: 0
      },
    })
    expect(result[1]).toEqual({
      timeBlockSize: 300000,
      timeBlockNumber: 1,
      timePassedSinceExposure: 300000,
      position: {
        latitudeBlockNumber: 0,
        longitudeBlockNumber: 0
      },
    })
    expect(result[2]).toEqual({
      timeBlockSize: 300000,
      timeBlockNumber: 2,
      timePassedSinceExposure: 600000,
      position: {
        latitudeBlockNumber: 0,
        longitudeBlockNumber: 0
      },
    })
    expect(result[35]).toEqual({
      timeBlockSize: 300000,
      timeBlockNumber: 35,
      timePassedSinceExposure: 10500000,
      position: {
        latitudeBlockNumber: 0,
        longitudeBlockNumber: 0
      },
    })
    // At this point we collect in hourly blocks up to 72 hours
    expect(result[36]).toEqual({
      timeBlockSize: 3600000,
      timeBlockNumber: 3, 
      timePassedSinceExposure: 10800000,
      position: {
        latitudeBlockNumber: 0,
        longitudeBlockNumber: 0
      },
    })
    expect(result[104]).toEqual({
      timeBlockSize: 3600000,
      timeBlockNumber: 71, 
      timePassedSinceExposure: 255600000,
      position: {
        latitudeBlockNumber: 0,
        longitudeBlockNumber: 0
      },
    })
    // The third tile should cross into another block grid position
    expect(result[210]).toEqual({
      timeBlockSize: 300000,
      timeBlockNumber: 0,
      timePassedSinceExposure: 0,
      position: {
        latitudeBlockNumber: 1,
        longitudeBlockNumber: 1
      },
    })

    // There should be the above done for all three different location grid
    // systems
    expect(result.length).toBe(105 * 3)
  })

  it(`should get the right risk time points with a different elapsed time`
    .replace(/s+/g, ' '), () => {
    
    var result = methods.getRiskPoints(
      { latitude: 0, longitude: 0 },
      111672937,
    )
    // We collect the first 3 hours in 5 minute blocks
    expect(result[0]).toEqual({
      timeBlockSize: 300000,
      timeBlockNumber: 372,
      timePassedSinceExposure: 0,
      position: {
        latitudeBlockNumber: 0,
        longitudeBlockNumber: 0
      },
    })
    expect(result[1]).toEqual({
      timeBlockSize: 300000,
      timeBlockNumber: 373,
      timePassedSinceExposure: 300000,
      position: {
        latitudeBlockNumber: 0,
        longitudeBlockNumber: 0
      },
    })
    expect(result[2]).toEqual({
      timeBlockSize: 300000,
      timeBlockNumber: 374,
      timePassedSinceExposure: 600000,
      position: {
        latitudeBlockNumber: 0,
        longitudeBlockNumber: 0
      },
    })
    expect(result[35]).toEqual({
      timeBlockSize: 300000,
      timeBlockNumber: 407,
      timePassedSinceExposure: 10500000,
      position: {
        latitudeBlockNumber: 0,
        longitudeBlockNumber: 0
      },
    })
    // At this point we collect in hourly blocks up to 72 hours
    expect(result[36]).toEqual({
      timeBlockSize: 3600000,
      timeBlockNumber: 34, 
      timePassedSinceExposure: 10800000,
      position: {
        latitudeBlockNumber: 0,
        longitudeBlockNumber: 0
      },
    })
    expect(result[104]).toEqual({
      timeBlockSize: 3600000,
      timeBlockNumber: 102, 
      timePassedSinceExposure: 255600000,
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
      position: {
        latitudeBlockNumber: -622347,
        longitudeBlockNumber: 124498
      },
    })
    expect(result[105]).toEqual({
      timeBlockSize: 300000,
      timeBlockNumber: 0,
      timePassedSinceExposure: 0,
      position: {
        latitudeBlockNumber: -622346,
        longitudeBlockNumber: 124499,
      },
    })
    expect(result[210]).toEqual({
      timeBlockSize: 300000,
      timeBlockNumber: 0,
      timePassedSinceExposure: 0,
      position: {
        latitudeBlockNumber: -622346,
        longitudeBlockNumber: 124499,
      },
    })
  })
})