import App from '../src/js/App'
import FinderApp from 'nyc-lib/nyc/ol/FinderApp'
import decorations from '../src/js/decorations'
import styles from '../src/js/styles'
import FeatureTip from 'nyc-lib/nyc/ol/FeatureTip'
import CsvPoint from 'nyc-lib/nyc/ol/format/CsvPoint'


jest.mock('nyc-lib/nyc/ol/FinderApp')
jest.mock('nyc-lib/nyc/ol/FeatureTip')
jest.mock('nyc-lib/nyc/ol/format/CsvPoint')


const mockMap = {
  getBaseLayers: () => {
    return {
      labels: {
        base: {
          setZIndex: setZ
        }
      }
    }
  }
}
class MockLayer {
  set(prop, val) {
    this[prop] = val
  }
  get(prop) {
    return this[prop]
  }
}
const mockContent = {
  messages: {
    school_year: 'school_year',
    dynamic_filter_btn: 'dynamic_filter_btn',
    btn_pdf: 'btn_pdf',
    quality_pdf: 'quality_pdf'
  },
  message: (key) => {
    return mockContent.messages[key]
  }
}
const rearrangeLayers = App.prototype.rearrangeLayers
const addStationsLayer = App.prototype.addStationsLayer
const addTransitLayer = App.prototype.addTransitLayer
const addDistrictLayer = App.prototype.addDistrictLayer
const createTip = App.prototype.createTip

beforeEach(() => {
  FinderApp.mockClear()
  App.prototype.rearrangeLayers = jest.fn()
  App.prototype.addStationsLayer = jest.fn()
  App.prototype.addTransitLayer = jest.fn()
  App.prototype.addDistrictLayer = jest.fn()
})

afterEach(() => {
  App.prototype.rearrangeLayers = rearrangeLayers
  App.prototype.addStationsLayer = addStationsLayer
  App.prototype.addTransitLayer = addTransitLayer
  App.prototype.addDistrictLayer = addDistrictLayer
})


describe('constructor', () => {
  test('constructor', () => {
    const app = new App(mockContent)

    expect(app instanceof FinderApp).toBe(true)
    expect(FinderApp).toHaveBeenCalledTimes(1)

    expect(FinderApp.mock.calls[0][0].title).toBe(`<span class="screen-reader-only">NYC Pre-K Finder</span><span>Pre-K Finder</span><div class="school-banner">for School Year school_year</div>`)
    expect(FinderApp.mock.calls[0][0].geoclientUrl).toBe('https://maps.nyc.gov/geoclient/v1/search.json?app_key=74DF5DB1D7320A9A2&app_id=nyc-lib-example')
    expect(FinderApp.mock.calls[0][0].facilityStyle).toBe(styles.facilityStyle)
    expect(FinderApp.mock.calls[0][0].facilityUrl).toBe('data/pka.csv')
    expect(FinderApp.mock.calls[0][0].facilitySearch.displayField).toBe('search_label')
    expect(FinderApp.mock.calls[0][0].facilitySearch.nameField).toBe('NAME')

    expect(FinderApp.mock.calls[0][0].facilityFormat instanceof CsvPoint).toBe(true)
    expect(CsvPoint.mock.calls[0][0].x).toEqual('X')
    expect(CsvPoint.mock.calls[0][0].y).toEqual('Y')
    expect(CsvPoint.mock.calls[0][0].dataProjection).toEqual('EPSG:2263')

    expect(FinderApp.mock.calls[0][0].directionsUrl).toBe('https://maps.googleapis.com/maps/api/js?client=gme-newyorkcitydepartment&channel=pka&sensor=false&libraries=visualization')

    expect(FinderApp.mock.calls[0][0].decorations.length).toBe(2)
    expect(FinderApp.mock.calls[0][0].decorations[0].content).toBe(mockContent)
    expect(FinderApp.mock.calls[0][0].decorations[1]).toBe(decorations)

    expect(FinderApp.mock.calls[0][0].filterChoiceOptions.length).toBe(5)   
     
    expect(FinderApp.mock.calls[0][0].filterChoiceOptions[0].title).toBe('Age Group')

    expect(FinderApp.mock.calls[0][0].filterChoiceOptions[0].choices[0].name).toBe('3K')
    expect(FinderApp.mock.calls[0][0].filterChoiceOptions[0].choices[0].values).toEqual([1])
    expect(FinderApp.mock.calls[0][0].filterChoiceOptions[0].choices[0].label).toBe('3-K (Born 2016)')
    
    expect(FinderApp.mock.calls[0][0].filterChoiceOptions[0].choices[1].name).toBe('EL')
    expect(FinderApp.mock.calls[0][0].filterChoiceOptions[0].choices[1].values).toEqual([1])
    expect(FinderApp.mock.calls[0][0].filterChoiceOptions[0].choices[1].label).toBe('Early Learn (born 2016)')

    expect(FinderApp.mock.calls[0][0].filterChoiceOptions[0].choices[2].name).toBe('PREK')
    expect(FinderApp.mock.calls[0][0].filterChoiceOptions[0].choices[2].values).toEqual([1])
    expect(FinderApp.mock.calls[0][0].filterChoiceOptions[0].choices[2].label).toBe('PRE-K (Born 2015)')


    expect(FinderApp.mock.calls[0][0].filterChoiceOptions[2].choices[0].name).toBe('TYPE')
    expect(FinderApp.mock.calls[0][0].filterChoiceOptions[2].choices[0].values).toEqual(['DOE', 'NYCEEC', 'CHARTER', 'PKC'])
    expect(FinderApp.mock.calls[0][0].filterChoiceOptions[2].choices[0].label).toBe('All Schools')

    expect(FinderApp.mock.calls[0][0].filterChoiceOptions[2].choices[1].name).toBe('TYPE')
    expect(FinderApp.mock.calls[0][0].filterChoiceOptions[2].choices[1].values).toEqual(['DOE'])
    expect(FinderApp.mock.calls[0][0].filterChoiceOptions[2].choices[1].label).toBe('District School')

    expect(FinderApp.mock.calls[0][0].filterChoiceOptions[2].choices[2].name).toBe('TYPE')
    expect(FinderApp.mock.calls[0][0].filterChoiceOptions[2].choices[2].values).toEqual(['NYCEEC'])
    expect(FinderApp.mock.calls[0][0].filterChoiceOptions[2].choices[2].label).toBe('Early Ed Center')

    expect(FinderApp.mock.calls[0][0].filterChoiceOptions[2].choices[3].name).toBe('TYPE')
    expect(FinderApp.mock.calls[0][0].filterChoiceOptions[2].choices[3].values).toEqual(['CHARTER'])
    expect(FinderApp.mock.calls[0][0].filterChoiceOptions[2].choices[3].label).toBe('Charter School')

    expect(FinderApp.mock.calls[0][0].filterChoiceOptions[2].choices[4].name).toBe('TYPE')
    expect(FinderApp.mock.calls[0][0].filterChoiceOptions[2].choices[4].values).toEqual(['PKC'])
    expect(FinderApp.mock.calls[0][0].filterChoiceOptions[2].choices[4].label).toBe('Pre-K Center')

    expect(App.prototype.rearrangeLayers).toHaveBeenCalledTimes(1)
    expect(App.prototype.addStationsLayer).toHaveBeenCalledTimes(1)
    expect(App.prototype.addTransitLayer).toHaveBeenCalledTimes(1)
    expect(App.prototype.addDistrictLayer).toHaveBeenCalledTimes(1)
    
    expect(app.content).toBe(mockContent)

  })
})

describe('createTip', () => {
  test('createTip', () => {
    const app = new App(mockContent)
    app.map = mockMap
    const mockLayer = new MockLayer()
    const tips = [{
      layer: mockLayer,
      label: (feature) => {
        return {
          html: `${feature.get('name')}`,
          css:'my-tip'
        }
      }
    }]
    app.createTip(mockLayer)

    expect(FeatureTip).toHaveBeenCalledTimes(1)
    expect(FeatureTip.mock.calls[0][0].map).toBe(mockMap)
    expect(FeatureTip.mock.calls[0][0].tips.length).toBe(1)
    expect(FeatureTip.mock.calls[0][0].tips[0].layer).toBe(mockLayer)

  })
})