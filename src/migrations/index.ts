import * as migration_20260205_021221_init_pages from './20260205_021221_init_pages'
import * as migration_20260205_022112_schema_update from './20260205_022112_schema_update'

export const migrations = [
  {
    up: migration_20260205_021221_init_pages.up,
    down: migration_20260205_021221_init_pages.down,
    name: '20260205_021221_init_pages',
  },
  {
    up: migration_20260205_022112_schema_update.up,
    down: migration_20260205_022112_schema_update.down,
    name: '20260205_022112_schema_update',
  },
]
