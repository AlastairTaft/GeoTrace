import * as Sentry from 'sentry-expo'

export const SALT_SERVERS = __DEV__ ? 
  [ 'http://localhost:3000/dev/get-salt' ] :
  [
    'salt1.geotrace.io/get-salt',
    'salt2.geotrace.io/get-salt',
    'salt3.geotrace.io/get-salt',
    'salt4.geotrace.io/get-salt',
    'salt5.geotrace.io/get-salt',
    'salt6.geotrace.io/get-salt',
    'salt7.geotrace.io/get-salt',
    'salt8.geotrace.io/get-salt',
  ]

/**
 * Get the url of which salt server to use, given a random string it should
 * deterministically return a server url from a list
 * @param {string} randomString
 * @param {Array<string>} urlList
 * @return {string}
 */
export const getServerUrl = function(preSaltHash, urlList = SALT_SERVERS){
  // Grab the last few characters that we'll use to figure out a modulus and
  // get the salt
  var val = base64ToBase10(preSaltHash.slice(-8, -2))
  return urlList[(val + urlList.length) % urlList.length]
}

/**
 * Stolen with <3 from 
 * https://slavik.meltser.info/convert-base-10-to-base-64-and-vise-versa-using-javascript/
 * @param {string}
 * @return {number}
 */
function base64ToBase10(str) {
  var order = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ+/"
  var base = order.length
  var num = 0, r
  while (str.length) {
    r = order.indexOf(str.charAt(0))
    str = str.substr(1)
    num *= base
    num += r
  }
  return num
}

/**
 * Gets salts for risk points.
 * @param {string} serverUrl The url to get salts from
 * @param {string} dtos[0].preSaltHash A seed string for our new salt
 * @param {number} dtos[0].timestamp The timestamp of what point in time this
 * data point represents. If it isn't recent, the server will error.
 */
export const getSalts = async function(preSaltHash, dtos){
  var serverUrl = getServerUrl(preSaltHash)
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
