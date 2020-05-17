/**
 * @fileOverview Utility functions to split latitude and longitude positions 
 * into equal area blocks.
 */

import { RELATIVE_EPOCH_START } from './constants'

// In metres
export const EARTH_CIRCUMFERENCE = 40075000
export const EARTH_CIRCUMFERENCE_POLE_TO_POLE = 40008000
export const APPROX_BLOCK_SIZE = 10 // Meters

/**
 * Calculate how much latitude degress makes up a block.
 * @param {number} blockSize In meters
 * @return {number}
 */
export const calculateLatitudeBlockSize = function(blockSize){
  return 90 / Math.round((EARTH_CIRCUMFERENCE_POLE_TO_POLE / 4) / blockSize)
}


export const LATITUDE_BLOCK_SIZE = calculateLatitudeBlockSize(10)

/**
 * Get the Earth's circumference at a specific latitude, i.e. if the sphere 
 * intersect is parallel to the equator.
 * @param {number} latitude
 * @returns {number}
 */
export const getEarthCircumferenceAtLatitude = function(latitude){
  if (isNaN(latitude) || latitude === null)
    throw new Error(`Invalid latitude ${latitude}`)
  return EARTH_CIRCUMFERENCE * Math.cos(convertDegreesToRadians(latitude))
}


export const convertDegreesToRadians = function(degrees){
  return degrees * Math.PI / 180
}

/**
 * Get the number of blocks needed to fill along the longitude.
 * @param {number} latitude
 * @param {number} opt_blockSize The desired block size
 */
export const getNoBlocksAtLatitude = function(
  latitude, 
  opt_blockSize = APPROX_BLOCK_SIZE
){
  return Math.round(
    getEarthCircumferenceAtLatitude(latitude) / opt_blockSize
  )
}

/**
 * We fit blocks perpendicular to the equator alont the latitude. This function
 * returns how many blocks we can fit at a specific latitude.
 * @param {number} latitude
 * @param {number} opt_blockSize The desired block size
 * @returns {number}
 */
export const getNoLongitudeBlocks = function(
  latitude, 
  opt_blockSize = APPROX_BLOCK_SIZE
){
  var circumferenceAtLatitude = getEarthCircumferenceAtLatitude(latitude)
  var arc = circumferenceAtLatitude / 2
  var totalBlocksOnArc = Math.round(arc / opt_blockSize)
  return totalBlocksOnArc
}

/**
 * @typedef BlockIdentifierId
 * @property {number} latitudeBlockNumber An integer identifying the block
 * @property {number} longitudeBlockNumber An integer identifying the block
 * 
 * @typedef BlockIdentifier
 * @property {BlockIdentifierId} id
 * @property {GeoJSONFeature} geoJSON Useful for debugging, a geoJSON polygon of
 * the block area.
 * 
 * Gets back more information than `getDetailedBlockIdentifierForLocation`, 
 * however this is to only be used internally, its only exported for testing
 * Use `getLocationBlockId` instead.
 * @param {number} location.latitude
 * @param {number} location.longitude
 * @returns {BlockIdentifier}
 */
export const getDetailedBlockIdentifierForLocation = function(
  location, 
  opt_blockSize = APPROX_BLOCK_SIZE
){
  var { latitude, longitude } = location
  if (isNaN(latitude))
    throw new Error(`Invalid latitude ${latitude}.`)
  if (isNaN(longitude))
    throw new Error(`Invalid longitude ${longitude}.`)
  var latBlockSize = 90 / 
    Math.round((EARTH_CIRCUMFERENCE_POLE_TO_POLE / 4) / opt_blockSize)
  ////0.000001 accurate to 0.11m which is accurate enough for our purposes
  var latBlockNumber = Math.floor(latitude / latBlockSize)
  var blockLatStart = latBlockNumber * latBlockSize
  var totalBlocksOnArc = getNoLongitudeBlocks(blockLatStart)
  var longitudeBlockSize = 180 / totalBlocksOnArc
  var longBlockNumber = Math.floor((longitude / 180) * totalBlocksOnArc)
  var blockLongStart = 180 * (longBlockNumber / totalBlocksOnArc)
  return { 
    id: { 
      latitudeBlockNumber: latBlockNumber, 
      longitudeBlockNumber: longBlockNumber, 
    },
    // Only useful to verify we're creating the correct blocks
    geoJSON: {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              blockLongStart, 
              blockLatStart,
            ],
            [
              blockLongStart + longitudeBlockSize, 
              blockLatStart
            ],
            [
              blockLongStart + longitudeBlockSize, 
              blockLatStart + latBlockSize,
            ],
            [
              blockLongStart, 
              blockLatStart + latBlockSize,
            ],
            [
              blockLongStart, 
              blockLatStart,
            ],
          ]
        ]
      },
    }
  }
}

/**
 * Converts a location to an id that represents its position accurate to the 
 * provided block size.
 * @param {number} location.latitude
 * @param {number} location.longitude
 * @param {number} opt_blockSize The size of the block in meters. Defaults to 
 * 10.
 * @returns {string} 
 */
export const getLocationBlockId = function(location, opt_blockSize){
  var { id } = getDetailedBlockIdentifierForLocation(location, opt_blockSize)
  return id.longitudeBlockNumber + '-' + id.latitudeBlockNumber
} 


/**
 * @deprecated. Use `getTimeBlockId`.
 */
export const getBlockIdentifierForTimestamp = function(elapsed, blockSize){
  return Math.floor(elapsed / blockSize)
}

/**
 * Get the block id for the timestamp
 * @param {number} blockSize The block size in minutes
 * @param {number} timestamp A UNIX epoch.
 * @returns {number} A value uniquely identifying the block that the 
 * milliseconds amount falls within. This will be an integer so if you want to
 * get the previous time block you can subtract 1, to get the next, add 1.
 */
export const getTimeBlockId = function(blockSize, timestamp){
  // Make the timestamp relative to the app tracking start time
  var elapsed = timestamp - RELATIVE_EPOCH_START
  return Math.floor(elapsed / (blockSize * 60 * 1000))
}


/**
 * Convert a time block id back into its UNIX timestamp.
 * @param {number} blockId
 * @param {number} blockSize
 * @returns {number}
 */
export const getTimestampFromBlock = function(blockId, blockSize){

}