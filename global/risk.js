import { 
  getNoLongitudeBlocks,
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
  var layerIds = Object.keys(layerBlockIds)
  var timeBlocksMins = [5, 10, 20]
  var riskPoints = []
  layerIds.forEach((positionLayerId, index) => {
    var positionBlockId = layerBlockIds[layerNames[index]]
    timeBlocksMins.forEach(mins => {
      var riskPoint = {
        positionLayerId,
        positionBlockId,
        positionBlockSize,
        timeBlockSize: mins,
        timeBlockId: getTimeBlockId(mins, l.timestamp),
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
 * @typedef HashedRiskPoint
 * @property {number} timeUntilVisit The time in minutes before our current user
 * will visit this location after this point in time. e.g. if this value was
 * 5, for the same location in 5 minutes our current user will visit.
 * @property {string} hash This is a hashed combination of all the risk point
 * details minus the timeUntilVisit value.
 * @property {string} preSaltHash This is a less specific hash of the risk 
 * point.
 * @property {number} timeBlockId An integer that identifies at what point in
 * time this risk point represents. Can use it to keep chronological order of
 * contact events.
 * @property {number} timeBlockSize The window in which the time block is
 * accurate to, in minutes.
 * @property {number} positionBlockSize The size of the block in which the 
 * location is accurate to. In meters.
 * @property {string} positionLayerId Identifies the position layer this hash
 * comes from, at the time of writing there are three different position layers.
 * 
 * @typedef RiskPoint This is the same as HashedRiskPoint however it includes
 * the `positionBlockId` prop.
 * @property {string} positionBlockId This identifies the position of the risk
 * point accurately.
 * @property {number} timeUntilVisit The time in minutes before our current user
 * will visit this location after this point in time. e.g. if this value was
 * 5, for the same location in 5 minutes our current user will visit.
 * @property {string} hash This is a hashed combination of all the risk point
 * details minus the timeUntilVisit value.
 * @property {string} preSaltHash This is a less specific hash of the risk 
 * point.
 * @property {number} timeBlockId An integer that identifies at what point in
 * time this risk point represents. Can use it to keep chronological order of
 * contact events.
 * @property {number} timeBlockSize The window in which the time block is
 * accurate to, in minutes.
 * @property {number} positionBlockSize The size of the block in which the 
 * location is accurate to. In meters.
 * @property {string} positionLayerId Identifies the position layer this hash
 * comes from, at the time of writing there are three different position layers.
 */


/**
 * Convert an Expo location to risk data points. It can't be a one to one map
 * because we split a location into three different grid layers to avoid being 
 * at the edge of a block not matching to another person at the edge of their
 * block. We also calculate historic points to track if this user was at the 
 * location sometime after an infected person was.
 * @param {Location} location See 
 * https://docs.expo.io/versions/latest/sdk/location/#location
 * @param {Function} options.hashFunction
 * @returns {Array<HashedRiskPoint>}
 */
export const convertLocationToHashedRiskPoints = async function(location, options){
  var { hashFunction } = options
  let l = location
  var riskPoints = convertLocationToRiskPoints(l)
  var preSaltHash = await getPreSaltHash(l, { hashFunction })

  await Promise.all(riskPoints.map(
    async dto => {

      var {
        positionLayerId,
        positionBlockId,
        positionBlockSize,
        timeBlockSize,
        timeBlockId,
        timeUntilVisit,
      } = dto

      // The only thing we don't hash is the timeUntilVisit prop. This prop
      // is special because we are hashing the points in time before the 
      // current user has visited the location. i.e. if we decide its valuable
      // to track the virus staying around on surfaces we can match these 
      // hashes to complete the infection chain as they are synomous with 
      // the hashes of when an infected user visited the location.
      // TODO Opportunity to memorizee here to get 2x less hashes being done
      var hash = await hashFunction(
        positionLayer + '-'
        + positionBlockId + '-' +
        + positionBlockSize + '-' + 
        + timeBlockSize + '-'
        + timeBlockId
      )
      return {
        // Server needs this to tweak the risk algorithm to consider the virus
        // remaining on surfaces
        timeUntilVisit,
        // We don't reveal the specific location, that is encoded in the hash.
        hash,
        preSaltHash,
        // If we don't send this to the server we don't know the cronological
        // order of the infection chain and thus we'd end up notifying double
        // the amount of people that they are at risk, with these people being
        // incorrectly labelled as at risk
        timeBlockId,
        // Useful info to tweak the risk algorithm on the central server.
        timeBlockSize,
        // Useful to know the block size on the server, it doesn't reveal any
        // location info.
        positionBlockSize,
        // Need to know, may help optimisation on the server, in the future
        // the layer id may change when we optimise with Hexagons
        positionLayerId,
      }
    }
  ))   
}

/**
 * Get a pre salt hash for the current location. This pre salt hash is non
 * specific enough so that it does not reveal any sensitive location info.
 * However it makes uses of the location details it has so that anyone in the
 * same location at the same time will agree on the same generated hash. i.e.
 * it goes to some degree of specificness to get a first level of protection
 * but not enough to reveal sensitive details
 * @param {Location} location An expo location object.
 * @param {Function} options.hashFunction A function to generate a hash
 * @returns {Promise<string>}
 */
export const getPreSaltHash = function(location, options){
  var { hashFunction } = options

  let l = location
  // We'll take the location block accurate to 50 kilometers squared, that is
  // not specific enough to be sensitive

  var nonSpecificPositionBlockId = getLocationBlockId(
    {
      latitude: l.coords.latitude,
      longitude: l.coords.longitude,
    },
    1000 * 50 // Will represent a 50km squared block
  )

  var nonSpecificTimeBlockId = getTimeBlockId(80, l.timestamp)

  // Because we are only taking the current and previous time blocks for
  // 5, 10 and 20 min intervals, we can take the 80 min interval here without
  // impacting more specific time block points
  return hashFunction(nonSpecificPositionBlockId + '-' + nonSpecificTimeBlockId)
}