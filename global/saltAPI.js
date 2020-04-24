import * as Sentry from 'sentry-expo'

var { hashRiskPoint } = require('./risk')

// Can add multiple servers
export const SALT_SERVERS = [
  __DEV__ ? 
    'http://localhost:3000/dev/get-salt' : 
    'https://au-tas-api.trackcovid19spread.com/get-salt'
]

/**
 * Gets salts for risk points.
 * @param {string} serverUrl The url to get salts from
 * @param {string} dtos[0].preSaltHash A seed string for our new salt
 * @param {number} dtos[0].timestamp The timestamp of what point in time this
 * data point represents. If it isn't recent, the server will error.
 */
export const getSalts = async function(serverUrl, dtos){
  var response = await fetch(serverUrl, {
    method: 'post',
    body: JSON.stringify({
      seeds: dtos.map(dto => ({
        seed: dto.preSaltHash,
        timestamp: dto.timestamp,
      }))
    }),
  })
  var result = await response.json()
  if (response.status != 200){
    Sentry.captureMessage(JSON.stringify(result))
    throw new Error('Unable to get salts.')
  }
  return result['hashes']
}
