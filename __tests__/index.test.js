import App from '../src/js/App'
import CsvPoint from 'nyc-lib/nyc/ol/format/CsvPoint'

jest.mock('../src/js/App')
jest.mock('nyc-lib/nyc/ol/format/CsvPoint')

describe('App is created', () => {
  test('App is created', () => {
    require('../src/js/index')
    expect(App).toHaveBeenCalledTimes(1)
    expect(App.mock.calls[0][0].title).toBe('<span class="screen-reader-only">NYC Pre-K Finder</span><span>NYC Pre-K Finder</span>')
    expect(App.mock.calls[0][0].geoclientUrl).toBe('https://maps.nyc.gov/geoclient/v1/search.json?app_key=74DF5DB1D7320A9A2&app_id=nyc-lib-example')
    expect(App.mock.calls[0][0].facilityTabTitle).toBe('Schools')
    expect(App.mock.calls[0][0].facilityUrl).toBe('data/pka.csv')
    expect(App.mock.calls[0][0].facilityFormat instanceof CsvPoint).toBe(true)
    expect(CsvPoint.mock.calls[0][0].x).toEqual('X')
    expect(CsvPoint.mock.calls[0][0].y).toEqual('Y')
    expect(CsvPoint.mock.calls[0][0].dataProjection).toEqual('EPSG:2263')
    
  })
})