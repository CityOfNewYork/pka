import OlFeature from 'ol/Feature'
import decorations from '../src/js/decorations'
import nyc from 'nyc-lib/nyc'
import CsvPoint from 'nyc-lib/nyc/ol/format/CsvPoint'

const csvPoint = new CsvPoint({
  x: 'X',
  y: 'Y',
  defaultDataProjection: 'EPSG:2263'
})

const featureSource = {
  LOCCODE: 'LOCCODE',
  TYPE: 'TYPE',
  BOROUGH: 'BOROUGH',
  NAME: 'NAME',
  NOTE: 'NOTE',
  PHONE: 'PHONE',
  ADDRESS: 'ADDRESS',
  ZIP: 'ZIP',
  DAY_LENGTH: 1,
  PREK_SEATS: 1,
  '3K_SEATS': 1,
  EL_SEATS: 1,
  X: 1,
  Y: 1,
  EMAIL: 'EMAIL',
  WEBSITE: 'WEBSITE',
  MEALS: 1,
  INDOOR_OUTDOOR: 1,
  SEMS_CODE: 'SEMS_CODE',
  BUTTON_TYPE: 'BUTTON_TYPE',
  START_TIME: 'START_TIME',
  EARLY_DROP: 1,
  LATE_PICKUP: 1,
  ENHANCED_LANG: 1,
  FLEX_SCHED: 1,
  SPED_FLG: 1,
  INCOME_FLG: 1,
  SPECIAL_PRIOR: 'SPECIAL_PRIOR',
  DYNAMIC: 1
}
const feature = csvPoint.readFeature(featureSource)
nyc.mixin(feature, [decorations])

export default feature