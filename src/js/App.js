/**
 * @module pka/App
 */
import FinderApp from 'nyc-lib/nyc/ol/FinderApp'
import TopoJson from 'ol/format/TopoJSON'
import GeoJson from 'ol/format/GeoJSON'
import Layer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import Decorate from 'nyc-lib/nyc/ol/format/Decorate'
import {Fill, Stroke, Style} from 'ol/style';
import styles from './styles';
import FeatureTip from 'nyc-lib/nyc/ol/FeatureTip'

class App extends FinderApp {
  constructor(options) {
    super(options)

    this.rearrangeLayers()
    this.addDistrictLayer()
    this.addTransitLayer()
  }
  rearrangeLayers() {
    this.map.getBaseLayers().labels.base.setZIndex(0)
    this.layer.setZIndex(3)
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
    });

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
    });

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
    });
  }

}

export default App