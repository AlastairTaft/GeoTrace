/**
 * @fileOverview Utility functions to split latitude and longitude positions 
 * into equal area blocks.
 */

// In metres
const EARTH_CIRCUMFERENCE = 40075000
const EARTH_CIRCUMFERENCE_POLE_TO_POLE = 40008000

const APPROX_BLOCK_SIZE = 10

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
 * @param {number} location.latitude
 * @param {number} location.longitude
 * @returns {tbd}
 */
export const getBlockIdentifierForLocation = function(location){
  var { latitude, longitude } = location
  ////0.000001 accurate to 0.11m which is accurate enough for our purposes
  //var totalLatBlocks = Math.round(EARTH_CIRCUMFERENCE_POLE_TO_POLE / 10)
  var latIncrements = 90 / Math.round((EARTH_CIRCUMFERENCE_POLE_TO_POLE / 4) / 10)
  console.log('getBlockIdentifierForLocation#latIncrements', latIncrements)
  
  var latBlockNumber = Math.floor(latitude / latIncrements)
  var blockLatStart = latBlockNumber * latIncrements
  
  
  var circumferenceAtLatitude = getEarthCircumferenceAtLatitude(blockLatStart)
  var arc = circumferenceAtLatitude / 2
  //console.log('getBlockIdentifierForLocation#circumferenceAtLatitude', circumferenceAtLatitude)
  
  var totalBlocksOnArc = Math.round(arc / 10)
  var widthPerBlock = arc / totalBlocksOnArc
  //console.log('getBlockIdentifierForLocation#widthPerBlock', widthPerBlock)
  
  var longBlockBumber = (longitude / 180) * totalBlocksOnArc
  var blockLongStart = 180 * (longBlockBumber / totalBlocksOnArc)

  var latBlockIncrements = latIncrements

  if (latitude < 0)
    latBlockIncrements = - latBlockIncrements
  var result = { 
    id: { blockLat: blockLatStart, blockLong: blockLongStart },
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
              blockLongStart + (360 * (widthPerBlock / EARTH_CIRCUMFERENCE)), 
              blockLatStart
            ],
            [
              blockLongStart + (360 * (widthPerBlock / EARTH_CIRCUMFERENCE)), 
              blockLatStart + latBlockIncrements,
            ],
            [
              blockLongStart, 
              blockLatStart + latBlockIncrements,
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
  console.log('getBlockIdentifierForLocation#result', JSON.stringify(result, null, 2))
  return result
}