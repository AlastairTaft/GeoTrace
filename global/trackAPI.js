
const API_URL = 'https://api.trackcovid19spread.com/submit-location-history'

/**
 * @param {Array<GeoJSONFeature>} features
 */
export const trackPositions = async function(features){
  return fetch(API_URL, {
    method: 'post',
    body: JSON.stringify(features),
  })
}
