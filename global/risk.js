

import { 
  LATITUDE_BLOCK_SIZE,
  getBlockIdentifierForLocation, 
  getNoLongitudeBlocks,
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
    getBlockIdentifierForLocation({
      latitude: location.latitude + (LATITUDE_BLOCK_SIZE * fraction),
      longitude: location.longitude + (longitudeBlockSize * fraction),
    })
    .id
  )

  var riskPoints = []
  positionBlocks.forEach(position => {
    var t3Hours = 1000 * 60 * 60 * 3
    // Let's record the area at risk in 5 minute blocks for the first 3 hours
    var tBlockSize = 1000 * 60 * 5
    for (var i = 0; i < t3Hours; i += tBlockSize){
      var timeBlock = getBlockIdentifierForTimestamp(elapsed + i, tBlockSize)
      riskPoints.push({
        // The point in time this block represents
        time: timeBlock,
        timeBlockSize: tBlockSize,
        timePassedSinceExposure: i,
        position,
      })
    }
    var t72Hours = 1000 * 60 * 60 * 72
    // Let's record every hour block after that up to 72 hours
    var t2BlockSize = 1000 * 60 * 60
    for (; i < t72Hours; i += t2BlockSize){
      var timeBlock = getBlockIdentifierForTimestamp(elapsed + i, t2BlockSize)
      riskPoints.push({
        // The point in time this block represents
        time: timeBlock,
        timeBlockSize: t2BlockSize,
        timePassedSinceExposure: i,
        position,
      })
    }
  })
  return riskPoints
}