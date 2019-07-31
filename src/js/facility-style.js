import Style from 'ol/style/Style'
import nycOl from 'nyc-lib/nyc/ol' 
import Circle from 'ol/style/Circle'
import Fill from 'ol/style/Fill'
import Stroke from 'ol/style/Stroke'
import Text from 'ol/style/Text'
import Icon from 'ol/style/Icon'

const facilityStyle = {
  pointStyle: (feature, resolution) => {
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
    if (zoom > 10) return style
  }
  /*TODO*/
  /*Add district style*/
}

export default facilityStyle