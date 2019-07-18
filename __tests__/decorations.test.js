import decorations from '../src/js/decorations'
import feature from './features.mock'
import $ from 'jquery'

describe('decorations', () => {
  let container
  beforeEach(() => {
    container = $('<div></div>')
    $('body').append(container)
    
  })
  afterEach(() => {
    container.remove()
  })

  test('getAddress1', () => {
    expect.assertions(2)
    expect(feature.getAddress1()).toBe(`${feature.get('ADDRESS')}`)
    expect(feature.getAddress1()).not.toBeNull()
  })
  test('getName', () => {
    expect.assertions(2)
    expect(feature.getName()).toBe(`${feature.get('NAME')}`)
    expect(feature.getName()).not.toBeNull()
  })
  test('getEmail', () => {
    expect.assertions(2)
    expect(feature.getEmail()).toBe(`${feature.get('EMAIL')}`)
    expect(feature.getEmail()).not.toBeNull()
  })
  test('getIndoorOutdoor', () => {
    expect.assertions(2)
    expect(feature.getIndoorOutdoor()).toBe(feature.get('INDOOR_OUTDOOR'))
    expect(feature.getIndoorOutdoor()).not.toBeNull()
  })
  test('getMeals', () => {
    expect.assertions(2)
    expect(feature.getMeals()).toBe(feature.get('MEALS'))
    expect(feature.getMeals()).not.toBeNull()
  })
  test('getProgramCode', () => {
    expect.assertions(2)
    expect(feature.getProgramCode()).toBe(`${feature.get('LOCCODE')}`)
    expect(feature.getProgramCode()).not.toBeNull()
  })
  test('getStartTime', () => {
    expect.assertions(2)
    expect(feature.getStartTime()).toBe(`${feature.get('START_TIME')}`)
    expect(feature.getStartTime()).not.toBeNull()
  })
  test('getWebsite', () => {
    expect.assertions(2)
    expect(feature.getWebsite()).toBe(`${feature.get('WEBSITE')}`)
    expect(feature.getWebsite()).not.toBeNull()
  })

})
