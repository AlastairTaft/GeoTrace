import * as BackgroundFetch from 'expo-background-fetch'

export const createBackgroundSyncFunction = ({
  popStoredRiskData,
  getSalts,
  getDeviceId,
  submitRiskMap,
  onError,
  hashFunction,
  warnAtRisk,
  getStoredUserData,
  setStoredUserData,
}) => async () => {
  try {
    var riskPointsHash = await popStoredRiskData()
    /**
     * @type {Array<RiskDataPoint>}
     */
    var riskPoints = Object.values(riskPointsHash)
    // Don't do this because we still need to ask the server if the user has 
    // been put at risk
    //if (!riskPoints.length)
    //  return BackgroundFetch.Result.NoData
    var finalHashes = []
    // Group risk points by pre salt hashes
    var saltGroups = groupBy(riskPoints, 'preSaltHash')
    await Promise.all(Object.keys(saltGroups).map(async preSaltHash => {
      var saltDtos = saltGroups[preSaltHash]
      var salts = await getSalts(preSaltHash, saltDtos) 
      await Promise.all(saltDtos.map(async (dto, i) => {
        var { success, hash: salt, error } = salts[i]
        if (!success){
          Sentry.captureMessage(error)
          return BackgroundFetch.Result.Failed
        }
        var { timePassedSinceExposure, hash } = dto
        var saltedHash = await hashFunction(hash + '-' + salt)
        finalHashes.push({ hash: saltedHash, timePassedSinceExposure })
      }))
    }))
    var deviceId = await getDeviceId()
    var newUserInfo = await submitRiskMap(deviceId, finalHashes)
    var user = await getStoredUserData()
    if (newUserInfo.atRisk && user.atRisk != newUserInfo.atRisk){
      // Warn possible exposure
      await warnAtRisk()
    }
    await setStoredUserData(newUserInfo)
    return BackgroundFetch.Result.NewData
  } catch (error) {
    if (!onError)
      throw error
    onError(error)
    return BackgroundFetch.Result.Failed
  }
}

function groupBy(arr, key) {
  var obj = {}
  arr.forEach(a => {
    var val = a[key]
    obj[val] = obj[val] || []
    obj[val].push(a)
  })
  return obj
}

/**
 * Deletes stale locations from a hashmap. The hashmap must follow a specific 
 * structure.
 * e.g.
 * ```
 * {
 *   '300000': {
 *     '2': { location },
 *     '3': { location },
 *   }
 * }
 */
export const purgeStaleLocations = function(hashmap, earliestBlock){
  for (var blockSize in hashmap){
    for (var blockId in hashmap[blockSize]){
      if (Number(blockId) < earliestBlock)
        delete hashmap[blockSize][blockId]
    }
  }
}