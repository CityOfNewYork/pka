import App from '../src/js/App'
import CsvPoint from 'nyc-lib/nyc/ol/format/CsvPoint'

jest.mock('../src/js/App')
jest.mock('nyc-lib/nyc/ol/format/CsvPoint')

describe('App is created', () => {
  test('App is created', () => {
    require('../src/js/index')
    expect(App).toHaveBeenCalledTimes(1)

    expect(App.mock.calls[0][0].title).toBe('<span class="screen-reader-only">NYC Pre-K Finder</span><span>Pre-K Finder</span>')

    expect(App.mock.calls[0][0].geoclientUrl).toBe('https://maps.nyc.gov/geoclient/v1/search.json?app_key=74DF5DB1D7320A9A2&app_id=nyc-lib-example')

    expect(App.mock.calls[0][0].facilityTabTitle).toBe('Schools')
    expect(App.mock.calls[0][0].facilityUrl).toBe('data/pka.csv')
    expect(App.mock.calls[0][0].facilityFormat instanceof CsvPoint).toBe(true)
    expect(CsvPoint.mock.calls[0][0].x).toEqual('X')
    expect(CsvPoint.mock.calls[0][0].y).toEqual('Y')
    expect(CsvPoint.mock.calls[0][0].dataProjection).toEqual('EPSG:2263')
    
    expect(App.mock.calls[0][0].filterChoiceOptions.length).toBe(5)   
     
    expect(App.mock.calls[0][0].filterChoiceOptions[0].title).toBe('Age Group')

    expect(App.mock.calls[0][0].filterChoiceOptions[0].choices[0].name).toBe('3K')
    expect(App.mock.calls[0][0].filterChoiceOptions[0].choices[0].values).toEqual([1])
    expect(App.mock.calls[0][0].filterChoiceOptions[0].choices[0].label).toBe('3-K (Born 2016)')
    
    expect(App.mock.calls[0][0].filterChoiceOptions[0].choices[1].name).toBe('EL')
    expect(App.mock.calls[0][0].filterChoiceOptions[0].choices[1].values).toEqual([1])
    expect(App.mock.calls[0][0].filterChoiceOptions[0].choices[1].label).toBe('Early Learn (born 2016)')

    expect(App.mock.calls[0][0].filterChoiceOptions[0].choices[2].name).toBe('PREK')
    expect(App.mock.calls[0][0].filterChoiceOptions[0].choices[2].values).toEqual([1])
    expect(App.mock.calls[0][0].filterChoiceOptions[0].choices[2].label).toBe('PRE-K (Born 2015)')


    expect(App.mock.calls[0][0].filterChoiceOptions[2].choices[0].name).toBe('TYPE')
    expect(App.mock.calls[0][0].filterChoiceOptions[2].choices[0].values).toEqual(['DOE', 'NYCEEC', 'CHARTER', 'PKC'])
    expect(App.mock.calls[0][0].filterChoiceOptions[2].choices[0].label).toBe('All Schools')

    expect(App.mock.calls[0][0].filterChoiceOptions[2].choices[1].name).toBe('TYPE')
    expect(App.mock.calls[0][0].filterChoiceOptions[2].choices[1].values).toEqual(['DOE'])
    expect(App.mock.calls[0][0].filterChoiceOptions[2].choices[1].label).toBe('District School')

    expect(App.mock.calls[0][0].filterChoiceOptions[2].choices[2].name).toBe('TYPE')
    expect(App.mock.calls[0][0].filterChoiceOptions[2].choices[2].values).toEqual(['NYCEEC'])
    expect(App.mock.calls[0][0].filterChoiceOptions[2].choices[2].label).toBe('Early Ed Center')

    expect(App.mock.calls[0][0].filterChoiceOptions[2].choices[3].name).toBe('TYPE')
    expect(App.mock.calls[0][0].filterChoiceOptions[2].choices[3].values).toEqual(['CHARTER'])
    expect(App.mock.calls[0][0].filterChoiceOptions[2].choices[3].label).toBe('Charter School')

    expect(App.mock.calls[0][0].filterChoiceOptions[2].choices[4].name).toBe('TYPE')
    expect(App.mock.calls[0][0].filterChoiceOptions[2].choices[4].values).toEqual(['PKC'])
    expect(App.mock.calls[0][0].filterChoiceOptions[2].choices[4].label).toBe('Pre-K Center')
    
  })
})