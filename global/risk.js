import * as Crypto from 'expo-crypto'
import { 
  LATITUDE_BLOCK_SIZE,
  getBlockIdentifierForLocation, 
  getNoLongitudeBlocks,
  getBlockIdentifierForTimestamp,
  APPROX_BLOCK_SIZE,
} from './blocks'

/**
 * Get all the risk points for a location and timestamp
 * @param {number} location.latitude
 * @param {number} location.longitude
 * @param {number} elapsed Number of milliseconds that have passed since 
 * V-Day
 * @returns {Array<RiskPoint>}
 */
export const getRiskPoints = function(location, elapsed){
  // Here we shift the grid by a third of the block size. So that if users
  // are at the very edge of a block we have a different frame that's closer
  // to centering them in it
  var totalBlocksAtLatitude = getNoLongitudeBlocks(location.latitude)
  var longitudeBlockSize = 180 / totalBlocksAtLatitude
  var positionBlocks = [1/3,2/3,3/3].map(fraction => 
    getBlockIdentifierForLocation(
      {
        latitude: location.latitude + (LATITUDE_BLOCK_SIZE * fraction),
        longitude: location.longitude + (longitudeBlockSize * fraction),
      },
      APPROX_BLOCK_SIZE,
    )
    .id
  )
  var riskPoints = []
  positionBlocks.forEach(position => {
    var t2Hours = 1000 * 60 * 60 * 2
    // Let's record the area at risk in 5 minute blocks for the first 2 hours
    var tBlockSize = 1000 * 60 * 5
    for (var i = 0; i < t2Hours; i += tBlockSize){
      var timeBlock = getBlockIdentifierForTimestamp(elapsed + i, tBlockSize)
      riskPoints.push({
        // The point in time this block represents
        timeBlockSize: tBlockSize,
        timeBlockNumber: timeBlock,
        timePassedSinceExposure: i,
        position,
        positionBlockSize: APPROX_BLOCK_SIZE,
      })
    }
    /*var t9Hours = 1000 * 60 * 60 * 9
    // Let's record every hour block after that up to 9 hours
    var t2BlockSize = 1000 * 60 * 60
    for (; i < t9Hours; i += t2BlockSize){
      var timeBlock = getBlockIdentifierForTimestamp(elapsed + i, t2BlockSize)
      riskPoints.push({
        // The point in time this block representss
        timeBlockSize: t2BlockSize,
        timeBlockNumber: timeBlock,
        timePassedSinceExposure: i,
        position,
        positionBlockSize: APPROX_BLOCK_SIZE,
      })
    }*/
  })
  return riskPoints
}

/**
 * Hash a risk point.
 * @returns {Promise<string>}
 */
export const hashRiskPoint = async function(riskPoint){
  var { 
    timeBlockSize,
    timeBlockNumber,
    timePassedSinceExposure,
    position,
    positionBlockSize,
  } = riskPoint
  return Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA512,
    `This additional text here doesn\'t do much apart from make a malicious 
     actor have to track this down in the source code.` + JSON.stringify({
      timeBlockSize,
      timeBlockNumber,
      position,
      positionBlockSize
    }),
    {
      encoding: Crypto.CryptoEncoding.BASE64,
    }
  )
}


/**
 * @typedef RiskDataPoint
 * @property {string} hash The simple device location/time hash. 
 * @property {number} timePassedSinceExposure This is for future projecting, so 
 * when the user visits X location, this is the hash for the same location Y 
 * time in the future. So that if this user becomes infected, we know a risk
 * point for a point in time in the future at the same location. e.g. if this
 * user is likely to touch surfaces, someone who visits here later is at risk
 * @property {string} preSaltHash This is a hash of a 50 kilometer squared block
 * this location point is in. The idea is it is not specific enough to identify
 * any one person but it will be used to determine which salt server to ask for 
 * a salt from.
 * @property {number} timestamp Purely used locally to prune old data
 */


/**
 * Validate its a valid risk point object. Throws if not valid.
 * @param {object} riskPoint
 */
export const validateRiskDataPoint = async function(riskPoint){
  if (!riskPoint.hash)
    throw new Error('Missing \'hash\' value.')
  if (!riskPoint.preSaltHash)
    throw new Error('Missing \'preSaltHash\' value.')
  if (!riskPoint.timestamp)
    throw new Error('Missing \'timestamp\' value.')
  if (riskPoint.timePassedSinceExposure === undefined || riskPoint.timePassedSinceExposure === null)
    throw new Error('Missing \'timePassedSinceExposure\' value.')
}