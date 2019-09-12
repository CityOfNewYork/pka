import styles from '../src/js/styles'
import {facilityFeature,stationFeature} from './features.mock'
import nycOl from 'nyc-lib/nyc/ol'
import Style from 'ol/style/Style'
import Circle from 'ol/style/Circle'
import Fill from 'ol/style/Fill'
import Stroke from 'ol/style/Stroke'
import Text from 'ol/style/Text'
import Icon from 'ol/style/Icon'
// import lookup from './lookup'


describe('facilityStyle', () => {
  test('facilityStyle - zoom > 11', () => {
    facilityFeature.extendFeature()
    const style = styles.facilityStyle(facilityFeature, 9.554628535647032)

    expect(style[0].getImage() instanceof Icon).toBe(true)
    expect(style[0].getImage().getSrc()).toBe('./img/' + facilityFeature.get('TYPE') + '.png')
    expect(style[0].getImage().getScale()).toBe(nycOl.TILE_GRID.getZForResolution(9.554628535647032) / 34)

    expect(style[0].getText() instanceof Text).toBe(true)
    expect(style[0].getText().getText()).toBe('3K')
    expect(style[0].getText().getFill() instanceof Fill).toBe(true)
    expect(style[0].getText().getFill().getColor()).toBe('rgb(1,51,100)')
    expect(style[0].getText().getStroke() instanceof Stroke).toBe(true)
    expect(style[0].getText().getStroke().getColor()).toBe('#fff')
    expect(style[0].getText().getStroke().getWidth()).toBe(4)

    expect(style[0].getText().getFont()).toBe('bold 20px "Helvetica Neue", Helvetica, Arial, sans-serif')
    expect(style[0].getText().getOffsetX()).toBe(-3)
    expect(style[0].getText().getOffsetY()).toBe(10)
    expect(style[0].getText().getScale()).toBe(35 / 50)

  })

  test('facilityStyle - zoom < 11', () => {
    const style = styles.facilityStyle(facilityFeature, 156543.03392804097)
    expect(style).toBe(undefined)

  })
})

describe('districtStyle', () => {
  
})

describe('transitStyle', () => {
  
})

describe('stationStyle', () => {
  
})