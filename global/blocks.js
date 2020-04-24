/**
 * @fileOverview Utility functions to split latitude and longitude positions 
 * into equal area blocks.
 */

// In metres
export const EARTH_CIRCUMFERENCE = 40075000
export const EARTH_CIRCUMFERENCE_POLE_TO_POLE = 40008000
export const APPROX_BLOCK_SIZE = 10 // Meters
export const LATITUDE_BLOCK_SIZE = 90 / 
  Math.round((EARTH_CIRCUMFERENCE_POLE_TO_POLE / 4) / 10)

/**
 * Get the Earth's circumference at a specific latitude, i.e. if the sphere 
 * intersect is parallel to the equator.
 * @param {number} latitude
 * @returns {number}
 */
export const getEarthCircumferenceAtLatitude = function(latitude){
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
 * @param {number} location.latitude
 * @param {number} location.longitude
 * @returns {tbd}
 */
export const getBlockIdentifierForLocation = function(
  location, 
  opt_blockSize = APPROX_BLOCK_SIZE
){
  var { latitude, longitude } = location
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
 * Get the block identifier for the timestamp
 * @param {number} elapsed
 * @param {number} blockSize The block size in milliseconds
 * @returns {number} A value uniquely identifying the block that the 
 * milliseconds amount falls within.
 */
export const getBlockIdentifierForTimestamp = function(elapsed, blockSize){
  return Math.floor(elapsed / blockSize)
}
