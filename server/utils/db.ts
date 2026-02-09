// server/utils/db.ts
import { connect } from '@tidbcloud/serverless'

export const useDb = () => {
  const config = useRuntimeConfig()

  if (!config.databaseUrl) {
    throw new Error('DATABASE_URL is missing in runtime configuration')
  }

  // The simplified connection
  return connect({ url: config.databaseUrl })
}