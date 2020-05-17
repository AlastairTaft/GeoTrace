import * as Crypto from 'expo-crypto'
import { 
  LATITUDE_BLOCK_SIZE,
  getBlockIdentifierForLocation, 
  getNoLongitudeBlocks,
  getBlockIdentifierForTimestamp,
  APPROX_BLOCK_SIZE,
  getLocationBlockId,
  calculateLatitudeBlockSize,
  getTimeBlockId,
} from './blocks'

/**
 * Get all the risk points for a location and timestamp
 * @param {number} location.latitude
 * @param {number} location.longitude
 * @param {number} elapsed Number of milliseconds that have passed since 
 * V-Day
 * @returns {Array<RiskPoint>}
 */
export const convertLocationToRiskPoints = function(location){
  let l = location
  const positionBlockSize = 10
  var layerBlockIds = getPositionLayerGroupForLocation(l, positionBlockSize)
  var layerNames = Object.keys(layerBlockIds)
  var timeBlocksMins = [5, 10, 20]
  var riskPoints = []
  layerNames.forEach((positionLayer, index) => {
    var positionBlockId = layerBlockIds[layerNames[index]]
    timeBlocksMins.forEach(mins => {
      var riskPoint = {
        positionLayer,
        positionBlockId,
        positionBlockSize,
        timeBlockSize: mins,
        timeBlockId: getTimeBlockId(1000 * 60 * mins, l.timestamp),
        timeUntilVisit: 0,
      }
      riskPoints.push(riskPoint)
      // Grab the previous time block
      riskPoints.push({
        ...riskPoint,
        timeBlockId: riskPoint.timeBlockId - 1,
        timeUntilVisit: mins,
      })
    })
  })
  return riskPoints
}

/**
 * @typedef BlockIdentifierLayerGroup
 * @property {string} A A unique identifier for the grid position the user
 * is currently within for layer A
 * @property {string} B A unique identifier for the grid position the user
 * is currently within for layer B
 * @property {string} C A unique identifier for the grid position the user
 * is currently within for layer C
 * 
 * Breaks down a location into three different grid layers and returns a block
 * id that identifies the block position on the layer that the user falls within.
 * If another user matches any number of these block positions it can be 
 * considered the same, i.e. that a user is close to another user. The only
 * reason for having 3 layers is to limit the chances of a user being at the 
 * very edge of a block.
 * @param {Location} location Expo location
 * @param {number} opt_blockSize Optionally specify the block size
 * @returns {BlockIdentifierLayerGroup}
 */
const getPositionLayerGroupForLocation = function(
  location, 
  opt_blockSize = APPROX_BLOCK_SIZE,
){
  // Here we shift the grid by a third of the block size. So that if users
  // are at the very edge of a block we have a different frame that's closer
  // to centering them in it
  var totalBlocksAtLatitude = getNoLongitudeBlocks(location.coords.latitude)
  var longitudeBlockSize = 180 / totalBlocksAtLatitude
  var positionBlockIds = [1/3,2/3,3/3].map(fraction => {
    return getLocationBlockId(
      {
        latitude: location.coords.latitude 
          + (calculateLatitudeBlockSize(opt_blockSize) * fraction),
        longitude: location.coords.longitude + (longitudeBlockSize * fraction),
      },
      opt_blockSize,
    )
  })

  return {
    'A': positionBlockIds[0],
    'B': positionBlockIds[1],
    'C': positionBlockIds[2],
  }
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


/**
 * Convert an Expo location to risk data points. It can't be a one to one map
 * because we split a location into three different grid layers to avoid being 
 * at the edge of a block not matching to another person at the edge of their
 * block. We also calculate historic points to track if this user was at the 
 * location sometime after an infected person was.
 * @param {Location} props.l See 
 * https://docs.expo.io/versions/latest/sdk/location/#location
 * @param {Function} props.hashFunction
 * @returns {Array<RiskDataPoint>}
 */
export const convertLocationToHashPoints = async function(props){
  const { location: l, hashFunction } = props
  // The current time right now is 10:06 AEST, we don't care about anything
  // before then so let's remove that time from the EPOCH.
  var elapsed = Math.round(l.timestamp) - RELATIVE_EPOCH_START
  
  // Not specific geographic block the user is in, used to get the salt
  var nonSpecificBlockId = getLocationBlockId(
    {
      latitude: l.latitude,
      longitude: l.longitude,
    },
    1000 * 50 // Will represent a 50km squared block
  )
  var preSaltHash = await hashFunction(`
    This block, if reverse hashed identifies that somebody with a certain 
    IP was somewhere within a 50 square meter block at a certain time.`
    .replace(/\s+/g, ' ') + 
    nonSpecificBlockId
  )

  



  
  return 


  var localRiskPoints = getRiskPoints(l.coords, elapsed)
  await Promise.all(localRiskPoints.map(
    async dto => {
      var hash = await hashRiskPoint(dto)
      riskPoints.push({
        timePassedSinceExposure: dto.timePassedSinceExposure,
        hash,
        preSaltHash,
        timestamp: Math.round(l.timestamp),
      })
    }
  ))   
}