
import Constants from 'expo-constants'
import * as Crypto from 'expo-crypto'

var deviceIdResolver

/**
 * Get the device id
 * @returns {Promise<string>}
 */
export const getDeviceId = () => {
  if (!deviceIdResolver)
    deviceIdResolver = Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA512,
      '🚀 Saving the world 🌍 one step 👣 at a time 🕘.' + Constants.installationId
    )
  return deviceIdResolver
}
