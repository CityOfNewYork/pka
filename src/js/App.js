/**
 * @module pka/App
 */
import FinderApp from 'nyc-lib/nyc/ol/FinderApp'
import MapMgr from 'nyc-lib/nyc/ol/MapMgr'
import TopoJson from 'ol/format/TopoJSON'
import GeoJson from 'ol/format/GeoJSON'
import Layer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import Decorate from 'nyc-lib/nyc/ol/format/Decorate'
import CsvPoint from 'nyc-lib/nyc/ol/format/CsvPoint'
import FilterAndSort from 'nyc-lib/nyc/ol/source/FilterAndSort'
import {Fill, Stroke, Style} from 'ol/style';
import styles from './styles';
import FeatureTip from 'nyc-lib/nyc/ol/FeatureTip'
import Popup from 'nyc-lib/nyc/ol/MultiFeaturePopup'
import decorations from './decorations'
import messages from './message'


class App extends FinderApp {
  constructor(content) {
    super({
      title: `<span class="screen-reader-only">NYC Pre-K Finder</span><span>Pre-K Finder</span><div class="school-banner">for School Year ${content.message('school_year')}</div>`,
      geoclientUrl: 'https://maps.nyc.gov/geoclient/v1/search.json?app_key=74DF5DB1D7320A9A2&app_id=nyc-lib-example',
      facilityStyle: styles.facilityStyle,
      facilityTabTitle: 'Schools',
      facilityUrl: 'data/pka.csv',
      facilityFormat: new CsvPoint({
        x: 'X',
        y: 'Y',
        dataProjection: 'EPSG:2263'
      }),
      filterChoiceOptions: [
        {
          title: 'Age Group',
          choices: [
            {name: '3K', values: [1], label: '3-K (Born 2016)'},
            {name: 'EL', values: [1], label: 'Early Learn (born 2016)'},
            {name: 'PREK', values: [1], label: 'PRE-K (Born 2015)'}
          ]
        },
        {
          title: content.message('dynamic_filter_btn'),
          choices: [
            {
              name: 'PREK_SEATS',
              values: ['1'],
              label: 'May Have Pre-K Seats Available'
            } 
          ]
        },
        {
          title: 'School Type',
          choices: [
            {name: 'TYPE', values: ['DOE', 'NYCEEC', 'CHARTER', 'PKC'], label: 'All Schools', checked: true},
            {name: 'TYPE', values: ['DOE'], label: 'District School'},
            {name: 'TYPE', values: ['NYCEEC'], label: 'Early Ed Center'},
            {name: 'TYPE', values: ['CHARTER'], label: 'Charter School'},
            {name: 'TYPE', values: ['PKC'], label: 'Pre-K Center'}
          ]
        },  
        {
          title: 'Day Length',
          choices: [
            {name: 'DAY_LENGTH', values: ['1', '2', '5', '7'], label: 'Full Day', checked: true},
            {name: 'DAY_LENGTH', values: ['3', '6', '7'], label: 'Half Day', checked: true},
            {name: 'DAY_LENGTH', values: ['4', '5', '6', '7'], label: '5-hour', checked: true}
          ]
        },
        {
          title: 'Program Features',
          choices: [
            {name: 'EXTEND', values: [1], label: 'Extended Hours'},
            {name: 'INCOME_FLG', values: ['1'], label: 'Income Eligibility'},
            {name: 'LANG', values: [1], label: 'DualEnhanced Language'}
          ]
        }
      ],
      facilitySearch: {displayField: 'search_label', nameField: 'NAME'},
      decorations: [{ content: content }, decorations.facility],
      directionsUrl: 'https://maps.googleapis.com/maps/api/js?client=gme-newyorkcitydepartment&channel=pka&sensor=false&libraries=visualization'
    
    })
    this.content = content
    this.rearrangeLayers()
    this.setupLayers()

  }
  rearrangeLayers() {
    this.map.getBaseLayers().labels.base.setZIndex(4)
    this.layer.setZIndex(3)
  }
  createTip(layer) {
    let tip = new FeatureTip({
      map: this.map,
      tips: [{
        layer: layer,
        label: MapMgr.tipFunction
      }]
    })
  }
  makeLayer(decoration, url, zIndex, style, type) {
    let source
    if (type == 'topo') {
      source = new VectorSource({
        url: url,
        format: new Decorate({
          parentFormat: new TopoJson(),
          decorations: decoration
        })
      })
    }
    else if(type == 'csv') {
      let csv = new CsvPoint({
        dataProjection: 'EPSG:2263',
        x: 'X',
        y: 'Y'
      })
      source = new FilterAndSort({
        url: url,
        format: new Decorate({
          parentFormat: csv,
          decorations: decoration
        })
      })
      source.autoLoad()
    }
    else {
      return
    }
    let layer = new Layer({
      source: source,
      style: style,
      zIndex: zIndex
    })
    this.createTip(layer)
    return layer

  }
  setupLayers() {
    this.districtLayer = this.makeLayer([decorations.district], '../src/data/school-district.json', 0, styles.districtStyle, 'topo')
    this.transitLayer = this.makeLayer([decorations.transit], '../src/data/subway-line.json', 1, styles.transitStyle, 'topo')
    this.stationLayer = this.makeLayer([decorations.station], '../src/data/subway-station.csv', 2, styles.stationStyle, 'csv')

    this.map.addLayer(this.transitLayer)
    this.map.addLayer(this.stationLayer)
    this.map.addLayer(this.districtLayer)

    this.popup.addLayer(this.stationLayer)
  }

}

export default App