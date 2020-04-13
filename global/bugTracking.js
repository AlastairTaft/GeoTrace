import * as Sentry from 'sentry-expo'
import Constants from 'expo-constants'

Sentry.init({
  dsn: 'https://2529c3502e454d8eaf3a911134bfa720@o372872.ingest.sentry.io/5198818',
  //enableInExpoDevelopment: true,
  //debug: true
})
if (Constants.manifest.revisionId)
  Sentry.setRelease(Constants.manifest.revisionId)
