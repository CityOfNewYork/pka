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

  describe('getter methods', () => {


    test('getAddress1', () => {
      expect.assertions(2)
      expect(feature.getAddress1()).toBe(`${feature.get('ADDRESS')}`)
      expect(feature.getAddress1()).not.toBeNull()
    })
    test('getBorough', () => {
      expect.assertions(2)
      expect(feature.getBorough()).toBe(`${feature.get('BOROUGH')}`)
      expect(feature.getBorough()).not.toBeNull()
    })
    describe('getCityStateZip', () => {
      const boroughHtml = feature.boroughHtml
      beforeEach(() => {
        feature.boroughHtml = jest.fn().mockImplementation(() => {
          return 'mockBorough'
        })
      })
      afterEach(() => {
        feature.boroughHtml = boroughHtml
      })
      test('getCityStateZip', () => {
        expect.assertions(3)
        
        expect(feature.getCityStateZip()).toBe(`${'mockBorough'}, NY ${feature.get('ZIP')}`)
        expect(feature.boroughHtml).toHaveBeenCalledTimes(1)
        expect(feature.getCityStateZip()).not.toBeNull()
        
      })
    })
    test('getDayLength', () => {
      expect.assertions(2)
      expect(feature.getDayLength()).toBe(feature.get('DAY_LENGTH'))
      expect(feature.getDayLength()).not.toBeNull()
    })
    test('getEmail', () => {
      expect.assertions(2)
      expect(feature.getEmail()).toBe(`${feature.get('EMAIL')}`)
      expect(feature.getEmail()).not.toBeNull()
    })
    test('getElSeats', () => {
      expect.assertions(2)
      expect(feature.getElSeats()).toBe(feature.get('EL_SEATS'))
      expect(feature.getElSeats()).not.toBeNull()
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
    test('getName', () => {
      expect.assertions(2)
      expect(feature.getName()).toBe(`${feature.get('NAME')}`)
      expect(feature.getName()).not.toBeNull()
    })
    test('getPrekSeats', () => {
      expect.assertions(2)
      expect(feature.getPrekSeats()).toBe(feature.get('PREK_SEATS'))
      expect(feature.getPrekSeats()).not.toBeNull()
    })
    test('getProgramCode', () => {
      expect.assertions(2)
      expect(feature.getProgramCode()).toBe(feature.get('LOCCODE'))
      expect(feature.getProgramCode()).not.toBeNull()
    })
    describe('getProgramFeatures', () => {
      const mealsHtml = feature.mealsHtml
      const ioHtml = feature.ioHtml
      const startTimeHtml = feature.startTimeHtml
      const makeList = feature.makeList
  
      beforeEach(() => {
        feature.mealsHtml = jest.fn().mockImplementation(() => {
          return 'mockMeals'
        })
        feature.ioHtml = jest.fn().mockImplementation(() => {
          return 'mockIo'
        })
        feature.startTimeHtml = jest.fn().mockImplementation(() => {
          return 'mockStartTime'
        })
        feature.makeList = jest.fn().mockImplementation(() => {
          return 'mockList'
        })
  
      })
      afterEach(() => {
        feature.mealsHtml = mealsHtml
        feature.ioHtml = ioHtml
        feature.startTimeHtml = startTimeHtml
        feature.makeList = makeList
  
      })
      test('getProgramFeatures', () => {
        expect.assertions(6)
        let program = ['mockMeals', 'mockIo', 'mockStartTime']
        expect(feature.getProgramFeatures()).toBe('mockList')
        expect(feature.mealsHtml).toHaveBeenCalledTimes(1)
        expect(feature.ioHtml).toHaveBeenCalledTimes(1)
        expect(feature.startTimeHtml).toHaveBeenCalledTimes(1)
        expect(feature.makeList).toHaveBeenCalledTimes(1)
        expect(feature.makeList.mock.calls[0][0]).toEqual(program)
      })
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
    test('get3kSeats', () => {
      expect.assertions(2)
      expect(feature.get3kSeats()).toBe(feature.get('3K_SEATS'))
      expect(feature.get3kSeats()).not.toBeNull()
    })
  
  })

  describe('html methods', () => {
    const getBorough = feature.getBorough
    const getEmail = feature.getEmail
    const getIndoorOutdoor = feature.getIndoorOutdoor
    const getMeals = feature.getMeals
    const getProgramCode = feature.getProgramCode



    beforeEach(() => {
      feature.getBorough = jest.fn().mockImplementation(() => {
        return 'K'
      })
      feature.getEmail = jest.fn().mockImplementation(() => {
        return 'mockEmail'
      })
      feature.getProgramCode = jest.fn().mockImplementation(() => {
        return 'mockProgramCode'
      })
      feature.getMeals = jest.fn().mockImplementation(() => {
        return 1
      })
      feature.getIndoorOutdoor = jest.fn().mockImplementation(() => {
        return 1
      })

    })
    afterEach(() => {
      feature.getBorough = getBorough
      feature.getEmail = getEmail
      feature.getProgramCode = getProgramCode
      feature.getMeals = getMeals
      feature.getIndoorOutdoor = getIndoorOutdoor
    })
    test('boroughHtml', () => {
      expect.assertions(2)

      expect(feature.boroughHtml()).toBe('Brooklyn')
      expect(feature.getBorough).toHaveBeenCalledTimes(1)

    })

    test('boroughHtml - getBorough is undefined or not in borough lookup', () => {
      expect.assertions(2)
      feature.getBorough = jest.fn().mockImplementation(() => {
        return ''
      })

      expect(feature.boroughHtml()).toBe('New York')
      expect(feature.getBorough).toHaveBeenCalledTimes(1)

    })

    /*TODO*/
    /* detailsHTML */

    test('emailHtml', () => {
      expect.assertions(2)

      expect(feature.emailHtml()).toBe(`<div class="email-lnk" translate="no"><a href="mailto:mockEmail">mockEmail</a></div>`)
      expect(feature.getEmail).toHaveBeenCalledTimes(1)

    })

    test('emailHtml - none provided', () => {
      expect.assertions(2)

      feature.getEmail = jest.fn()

      expect(feature.emailHtml()).toBe('')
      expect(feature.getEmail).toHaveBeenCalledTimes(1)

    })

    test('ioHtml - getIndoorOutdoor is undefined or not in indoor_outdoor lookup', () => {
      expect.assertions(2)
      feature.getIndoorOutdoor = jest.fn().mockImplementation(() => {
        return ''
      })

      expect(feature.ioHtml()).toBe('')
      expect(feature.getIndoorOutdoor).toHaveBeenCalledTimes(1)

    })

    test('ioHtml', () => {
      expect.assertions(2)

      expect(feature.ioHtml()).toBe('Indoor playspace')
      expect(feature.getIndoorOutdoor).toHaveBeenCalledTimes(1)

    })

    test('mealsHtml - getMeals is undefined or not in indoor_outdoor lookup', () => {
      expect.assertions(2)
      feature.getMeals = jest.fn().mockImplementation(() => {
        return ''
      })

      expect(feature.mealsHtml()).toBe('')
      expect(feature.getMeals).toHaveBeenCalledTimes(1)

    })

    test('mealsHtml', () => {
      expect.assertions(2)

      expect(feature.mealsHtml()).toBe('Breakfast')
      expect(feature.getMeals).toHaveBeenCalledTimes(1)

    })

    test('programCodeHtml', () => {
      expect.assertions(2)

      expect(feature.programCodeHtml()).toBe(`<div><b>Program Code: </b>${'mockProgramCode'}</div>`)
      expect(feature.getProgramCode).toHaveBeenCalledTimes(1)

    })

    test('programCodeHtml - none provided', () => {
      expect.assertions(2)

      feature.getProgramCode = jest.fn()

      expect(feature.programCodeHtml()).toBe('')
      expect(feature.getProgramCode).toHaveBeenCalledTimes(1)

    })

  })
})

