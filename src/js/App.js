/**
 * @module pka/App
 */
import FinderApp from 'nyc-lib/nyc/ol/FinderApp'
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

class App extends FinderApp {
  constructor(options) {
    super(options)

    this.rearrangeLayers()
    this.addDistrictLayer()
    this.addTransitLayer()
    this.addStationsLayer()

  }
  rearrangeLayers() {
    this.map.getBaseLayers().labels.base.setZIndex(0)
    this.layer.setZIndex(4)
  }
  addStationsLayer() {
    let stationDecorations = [{
      getName() {
        return this.get('NAME')
      },
      getLine() {
        return this.get('LINE')
      },
      getNote() {
        return `<div class="note">${this.get('NOTE')}</div>`
      },
      getSubwayIcon(line) {
        let lines = line.split('-')
        let lineHtml = ''
        
        lines.forEach(line => {
          let lineTruncate = line.indexOf('Express') > -1 ? line.replace('Express', '').trim() : line
          lineHtml += `<div class="subway-icon subway-${line.replace('Express', 'express')}"><div>${lineTruncate}</div></div>` 
        })
  
        return lineHtml
      },
      html() {
        return $('<div class="station"></div>')
          .append(`<h1 class="station-name">${this.getName()}</h1>`)
          .append(this.getSubwayIcon(this.getLine()))
          .append(this.getNote()) 
      }
    }];

    let csv = new CsvPoint({
      dataProjection: 'EPSG:2263',
      x: 'X',
      y: 'Y'
    })
    let source = new FilterAndSort({
      url: '../src/data/subway-station.csv',
      format: new Decorate({
        parentFormat: csv,
        decorations: stationDecorations
      })
    })
    source.autoLoad()

    let layer = new Layer({
      source: source,
      style: styles.stationStyle,
      zIndex: 3
    });
    this.popup.addLayer(layer)
    this.createTip(layer)
    this.map.addLayer(layer)

  }
  addTransitLayer() {
    let transitDecorations = [{getName() {return `${this.get('RT_SYMBOL')} Line`}}];

    let source = new VectorSource({
      url: '../src/data/subway-line.json',
      format: new Decorate({
        parentFormat: new TopoJson(),
        decorations: transitDecorations
      })
    })
    let layer = new Layer({
      source: source,
      style: styles.transitStyle,
      zIndex: 2
    })

    this.map.addLayer(layer)
    this.createTip(layer)
    
  }
  addDistrictLayer() {
    let districtDecorations = [{getName() {return `District ${this.get('NAME')}`}}];

    let source = new VectorSource({
      url: '../src/data/school-district.json',
      format: new Decorate({
        parentFormat: new TopoJson(),
        decorations: districtDecorations
      })
    })

    let layer = new Layer({
      source: source,
      style: styles.districtStyle,
      zIndex: 1
    })

    this.map.addLayer(layer)
    this.createTip(layer)

  }
  createTip(layer) {
    let tip = new FeatureTip({
      map: this.map,
      tips: [{
        layer: layer,
        label: (feature) => {
          return {
            html: feature.getName(),
            css: 'my-tip'
          }
        }
      }]
    })
  }

}

export default App