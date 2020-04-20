/**
 * @fileOverview Utility functions to split latitude and longitude positions 
 * into equal area blocks.
 */

// In metres
const EARTH_CIRCUMFERENCE = 40075000
const EARTH_CIRCUMFERENCE_POLE_TO_POLE = 40008000
const APPROX_BLOCK_SIZE = 10 // Meters
const LATITUDE_BLOCK_SIZE = 90 / 
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
 */
export const getNoBlocksAtLatitude = function(latitude){
  return Math.round(
    getEarthCircumferenceAtLatitude(latitude) / APPROX_BLOCK_SIZE
  )
}

/**
 * We fit blocks perpendicular to the equator alont the latitude. This function
 * returns how many blocks we can fit at a specific latitude.
 * @param {number} latitude
 * @returns {number}
 */
export const getNoLongitudeBlocks = function(latitude){
  var circumferenceAtLatitude = getEarthCircumferenceAtLatitude(latitude)
  var arc = circumferenceAtLatitude / 2
  var totalBlocksOnArc = Math.round(arc / 10)
  return totalBlocksOnArc
}

/**
 * @param {number} location.latitude
 * @param {number} location.longitude
 * @returns {tbd}
 */
export const getBlockIdentifierForLocation = function(location){
  var { latitude, longitude } = location
  ////0.000001 accurate to 0.11m which is accurate enough for our purposes
  var latBlockNumber = Math.floor(latitude / LATITUDE_BLOCK_SIZE)
  var blockLatStart = latBlockNumber * LATITUDE_BLOCK_SIZE
  var totalBlocksOnArc = getNoLongitudeBlocks(blockLatStart)
  var longitudeBlockSize = 180 / totalBlocksOnArc
  var longBlockNumber = Math.floor((longitude / 180) * totalBlocksOnArc)
  var blockLongStart = 180 * (longBlockNumber / totalBlocksOnArc)
  return { 
    id: { 
      latitudeNumber: latBlockNumber, 
      longitudeNumber: longBlockNumber, 
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
              blockLatStart + LATITUDE_BLOCK_SIZE,
            ],
            [
              blockLongStart, 
              blockLatStart + LATITUDE_BLOCK_SIZE,
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
