import * as methods from './risk'

describe('#risk', () => {
  it(`should get the right risk points, which are risk points for every 5 
    minute block for the first 3 hours and then every hour block after that up
    to 72 hours.`.replace(/s+/g, ' '), () => {
    
    var result = methods.getRiskPoints(
      { latitude: 0, longitude: 0 },
      timestamp
  })
})