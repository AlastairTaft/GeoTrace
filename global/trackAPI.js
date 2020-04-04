import * as Sentry from 'sentry-expo'
const API_URL = 'https://api.trackcovid19spread.com/submit-location-history'

/**
 * @param {Array<GeoJSONFeature>} features
 */
export const trackPositions = async function(features){
  var response = await fetch(API_URL, {
    method: 'post',
    body: JSON.stringify({
      "type": "FeatureCollection",
      "features": features,
    }),
  })
  var result = await response.json()
  if (response.status != 200)
    Sentry.captureMessage(JSON.stringify(result))
}
