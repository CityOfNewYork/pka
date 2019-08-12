import Style from 'ol/style/Style'
import nycOl from 'nyc-lib/nyc/ol' 
import Circle from 'ol/style/Circle'
import Fill from 'ol/style/Fill'
import Stroke from 'ol/style/Stroke'
import Text from 'ol/style/Text'
import Icon from 'ol/style/Icon'
import lookup from './lookup'

const styles = {
  facilityStyle: (feature, resolution) => {
    const zoom = nycOl.TILE_GRID.getZForResolution(resolution)
    let size = zoom > 8 ? 20 : 12
    const style = [new Style({
      image: new Icon({
        src: './img/' + feature.get('TYPE') + '.png',
        scale:  zoom / 34
      }),
      text: new Text({
        text: feature.get('3K') == 1 ? '3K' : '',
        fill: new Fill({color: 'rgb(1,51,100)'}),
        stroke: new Stroke({color: '#fff', width: size == 20 ? 4 : 2}),
        font: 'bold ' + size + 'px "Helvetica Neue", Helvetica, Arial, sans-serif',
        offsetX: size == 20 ? -3 : -1,
        offsetY: size == 20 ? 10 : 6,
        scale: 35 / 50
      })
    })]
    if (zoom > 11) return style
  },
  districtStyle: (feature, resolution) => {
    const zoom = nycOl.TILE_GRID.getZForResolution(resolution)
    let geom = feature.getGeometry()
    let dist = feature.get('NAME')
    let options = {
      stroke: new Stroke({
        color: '#808080',
        width: 1
      })
    }
    let width = [2, 2, 2, 3, 3, 5, 5, 8, 8, 12, 16, 18, 20, 22][zoom - 9] || 20
    const style = [new Style({
      stroke: new Stroke({
        color: '#808080',
        width: width
      }),
      text: new Text({
        font: 'bold ' + zoom * 2 + 'px helvetica',
        text: `${dist}`,
        fill: new Fill({color: 'rgba(0, 0, 0, 0.65)', })
      }),
      fill: new Fill({
        color: 'rgba(0, 0, 0, 0)'
      })
    })]
    if(zoom > 10) return style
  },
  transitStyle: (feature, resolution) => {
    const zoom = nycOl.TILE_GRID.getZForResolution(resolution)
    let geom = feature.getGeometry()
    let line = feature.get('RT_SYMBOL')
    let width = [2, 2, 2, 3, 3, 5, 5, 8, 8, 12, 16, 18, 20, 22][zoom - 9] || 20
    
    const style = [new Style({
      stroke: new Stroke({
        color: lookup.transit_color[line],
        width: width / 2
      }),
      fill: new Fill({
        color: 'rgba(0, 0, 0, 0)'
      })
    })]
    if(zoom > 10) return style
  },
  stationStyle: (feature, resolution) => {
    const zoom = nycOl.TILE_GRID.getZForResolution(resolution)
    let geom = feature.getGeometry()
    let line = feature.getLine()
    let note = feature.getNote()
    let name = feature.getName()
    let radius = [2, 2, 4, 4, 4, 6, 8, 10, 12, 16, 24, 24][zoom - 4];
    console.warn(line)
    console.warn(note)
    console.warn(name)

    const style = new Style({
      image: new Circle({
        radius: (radius / 4) || 6,
        stroke: new Stroke({
          color: '#000',
          width: radius > 2 ? 2 : 1
        }),
        fill: new Fill({
          color: 'rgba(255,255,255,0.9)'
        })
      })
    });
    if(zoom > 11) return style
  }
}


export default styles