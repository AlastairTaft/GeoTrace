var { hashRiskPoint } = require('./risk')

// Can add multiple servers
const SALT_SERVERS = [
  __DEV__ ? 
    'http://localhost:3000/dev/salt' : 
    'https://au-tas-api.trackcovid19spread.com/salt'
]

/**
 * Gets salts for risk points.
 */
export const getSalts = function(serverUrl, ){

  var foo = nonSpecificRiskPoints.map(dto => {
    var { 
      timeBlockSize,
      timeBlockNumber,
      timePassedSinceExposure,
      position,
      positionBlockSize,
    } = dto
    // Double check we're not sending sensitive position data to a server
    if (
      !positionBlockSize || 
      positionBlockSize < 1000 * 50 // 50 square meters
    )
      throw new Error('Position block is too granular.')
    
    var hash = hashRiskPoint(dto)
  })
  
  var response = await fetch(serverUrl, {
    method: 'post',
    body: JSON.stringify({
      riskPoints,
    }),
  })
  var result = await response.json()
  if (response.status != 200){
    Sentry.captureMessage(JSON.stringify(result))
    throw new Error('Unable to log risk points.')
  }
}
