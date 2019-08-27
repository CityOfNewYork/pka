import App from '../src/js/App'
import FinderApp from 'nyc-lib/nyc/ol/FinderApp'
import decorations from '../src/js/decorations'
import styles from '../src/js/styles'
import FeatureTip from 'nyc-lib/nyc/ol/FeatureTip'
import CsvPoint from 'nyc-lib/nyc/ol/format/CsvPoint'
import Layer from 'ol/layer/Vector'
import FilterAndSort from 'nyc-lib/nyc/ol/source/FilterAndSort'
import Decorate from 'nyc-lib/nyc/ol/format/Decorate'
import VectorSource from 'ol/source/Vector'
import TopoJson from 'ol/format/TopoJSON'
import AutoLoad from 'nyc-lib/nyc/ol/source/AutoLoad';
import MapMgr from 'nyc-lib/nyc/ol/MapMgr'


jest.mock('nyc-lib/nyc/ol/source/FilterAndSort')
// jest.mock('nyc-lib/nyc/ol/format/Decorate')
jest.mock('ol/source/Vector')
jest.mock('ol/layer/Vector')
jest.mock('nyc-lib/nyc/ol/FinderApp')
jest.mock('nyc-lib/nyc/ol/FeatureTip')
jest.mock('nyc-lib/nyc/ol/format/CsvPoint')

const setZ = jest.fn() 
const addLayer = jest.fn()

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
const mockPopup = {
  addLayer: () => {
    return jest.fn()
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
const setupLayers = App.prototype.setupLayers
const createTip = App.prototype.createTip
const makeLayer = App.prototype.makeLayer


beforeEach(() => {
  FinderApp.mockClear()
  App.prototype.rearrangeLayers = jest.fn()
  App.prototype.setupLayers = jest.fn()
  setZ.mockClear()
})

afterEach(() => {
  App.prototype.rearrangeLayers = rearrangeLayers
  App.prototype.setupLayers = setupLayers
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
    expect(FinderApp.mock.calls[0][0].decorations[1]).toBe(decorations.facility)

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
    expect(App.prototype.setupLayers).toHaveBeenCalledTimes(1)
    
    expect(app.content).toBe(mockContent)

  })
})

describe('rearrangeLayers', () => {
   
  const mockLayer = {
    setZIndex: setZ
  }
  beforeEach(() => {
    setZ.mockClear()
  })
  test('rearrangeLayers', () => {
    const app = new App(mockContent)

    app.map = mockMap
    app.layer = mockLayer
    app.rearrangeLayers = rearrangeLayers
    
    app.rearrangeLayers()
    expect(setZ).toHaveBeenCalledTimes(2)
    expect(setZ.mock.calls[0][0]).toBe(4)
    expect(setZ.mock.calls[1][0]).toBe(3)

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
    expect(FeatureTip.mock.calls[0][0].tips[0].label).toBe(MapMgr.tipFunction)

  })
})

  describe('setupLayers', () => {
    const mockSource = jest.fn() 
    const mockStyle = jest.fn() 
    
    const mockLayer = {
      source: mockSource,
      style: mockStyle,
      setZIndex: setZ
    }
    beforeEach(() => {
      App.prototype.makeLayer = jest.fn()

    })
    afterEach(() => {
      App.prototype.makeLayer = makeLayer
    })
    test('setupLayers', () => {
    const app = new App(mockContent)

    app.map = mockMap
    app.layer = mockLayer
    app.popup = mockPopup
    app.map.addLayer = jest.fn()

    app.setupLayers.mockClear()
    app.setupLayers = setupLayers

    app.setupLayers()
    expect(app.makeLayer).toHaveBeenCalledTimes(3)
    expect(app.makeLayer.mock.calls[0][0]).toEqual([decorations.district])
    expect(app.makeLayer.mock.calls[0][1]).toBe('../src/data/school-district.json')
    expect(app.makeLayer.mock.calls[0][2]).toBe(0)
    expect(app.makeLayer.mock.calls[0][3]).toBe(styles.districtStyle)
    expect(app.makeLayer.mock.calls[0][4]).toBe('topo')

    expect(app.makeLayer.mock.calls[1][0]).toEqual([decorations.transit])
    expect(app.makeLayer.mock.calls[1][1]).toBe('../src/data/subway-line.json')
    expect(app.makeLayer.mock.calls[1][2]).toBe(1)
    expect(app.makeLayer.mock.calls[1][3]).toBe(styles.transitStyle)
    expect(app.makeLayer.mock.calls[1][4]).toBe('topo')

    expect(app.makeLayer.mock.calls[2][0]).toEqual([decorations.station])
    expect(app.makeLayer.mock.calls[2][1]).toBe('../src/data/subway-station.csv')
    expect(app.makeLayer.mock.calls[2][2]).toBe(2)
    expect(app.makeLayer.mock.calls[2][3]).toBe(styles.stationStyle)
    expect(app.makeLayer.mock.calls[2][4]).toBe('csv')

    expect(app.map.addLayer).toHaveBeenCalledTimes(3)
    })
  })

  describe('makeLayer', () => {
    beforeEach(() => {
      App.prototype.createTip = jest.fn()
    })
    afterEach(() => {
      App.prototype.createTip = createTip
    })
    test('makeLayer - topo source', () => {
      let decoration = {}, url = '', zIndex = 0, style = {}, type = 'topo'
      const app = new App(mockContent)
      app.makeLayer = makeLayer

      Layer.mockReset()

      app.makeLayer(decoration, url, zIndex, style, type)
      expect(VectorSource).toHaveBeenCalledTimes(1)
      expect(VectorSource.mock.calls[0][0].url).toBe(url)
      expect(VectorSource.mock.calls[0][0].format instanceof Decorate).toBe(true)
      expect(VectorSource.mock.calls[0][0].format.parentFormat instanceof TopoJson).toBe(true)
      expect(VectorSource.mock.calls[0][0].format.decorations).toBe(decoration)

      expect(Layer).toHaveBeenCalledTimes(1)
      expect(Layer.mock.calls[0][0].style).toBe(style)
      expect(Layer.mock.calls[0][0].zIndex).toBe(zIndex)

      expect(app.createTip).toHaveBeenCalledTimes(1)
      expect(app.createTip.mock.calls[0][0] instanceof Layer).toBe(true)
    })

    test('makeLayer - csv source', () => {
      let decoration = {}, url = '', zIndex = 0, style = {}, type = 'csv'
      const app = new App(mockContent)
      app.makeLayer = makeLayer

      CsvPoint.mockReset()
      Layer.mockReset()

      app.makeLayer(decoration, url, zIndex, style, type)
      expect(CsvPoint).toHaveBeenCalledTimes(1)
      expect(CsvPoint.mock.calls[0][0].dataProjection).toBe('EPSG:2263')
      expect(CsvPoint.mock.calls[0][0].x).toBe('X')
      expect(CsvPoint.mock.calls[0][0].y).toBe('Y')

      expect(FilterAndSort).toHaveBeenCalledTimes(1)
      expect(FilterAndSort.mock.calls[0][0].url).toBe(url)
      expect(FilterAndSort.mock.calls[0][0].format instanceof Decorate).toBe(true)
      expect(FilterAndSort.mock.calls[0][0].format.parentFormat instanceof CsvPoint).toBe(true)
      expect(FilterAndSort.mock.calls[0][0].format.decorations).toBe(decoration)
      expect(AutoLoad).toHaveBeenCalledTimes(1)

      expect(Layer).toHaveBeenCalledTimes(1)
      expect(Layer.mock.calls[0][0].style).toBe(style)
      expect(Layer.mock.calls[0][0].zIndex).toBe(zIndex)

      expect(app.createTip).toHaveBeenCalledTimes(1)
      expect(app.createTip.mock.calls[0][0] instanceof Layer).toBe(true)
    })

    test('makeLayer - no type', () => {
      let decoration = {}, url = '', zIndex = 0, style = {}, type = ''
      const app = new App(mockContent)
      app.makeLayer = makeLayer

      expect(app.makeLayer(decoration, url, zIndex, style, type)).toBeUndefined()

    })
  })
