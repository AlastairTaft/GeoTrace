import * as Sentry from 'sentry-expo'
import Constants from 'expo-constants'

Sentry.init({
  dsn: 'https://6daaa6e11e0642caac142e2b7eceaec5@sentry.io/5188341',
  //enableInExpoDevelopment: true,
  //debug: true
})
if (Constants.manifest.revisionId)
  Sentry.setRelease(Constants.manifest.revisionId)
