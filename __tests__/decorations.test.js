import decorations from '../src/js/decorations'
import lookup from '../src/js/lookup'

import {facilityFeature, stationFeature} from './features.mock'
import $ from 'jquery'

let container
beforeEach(() => {
  container = $('<div></div>')
  $('body').append(container)
  
})
afterEach(() => {
  container.remove()
})

describe('facility decorations', () => {
  describe('extendFeature', () => {
    test('extendFeature', () => {
      expect(facilityFeature.get('3K')).toBe(undefined)
      expect(facilityFeature.get('EL')).toBe(undefined)
      expect(facilityFeature.get('PREK')).toBe(undefined)
      expect(facilityFeature.get('EXTEND')).toBe(undefined)
      // expect(facilityFeature.get('LANG')).toBe(undefined)

      facilityFeature.extendFeature()
      expect(facilityFeature.get('3K')).toBe(1)
      expect(facilityFeature.get('EL')).toBe(1)
      expect(facilityFeature.get('PREK')).toBe(1)
      expect(facilityFeature.get('EXTEND')).toBe(1)
      // expect(facilityFeature.get('LANG')).toBe(0)

    })
    test('extendFeature -', () => {
      facilityFeature.set('3K_SEATS', '')
      facilityFeature.set('EL_SEATS', '')
      facilityFeature.set('PREK_SEATS', '')
      facilityFeature.set('EARLY_DROP', '')
      facilityFeature.set('LATE_PICKUP', '')
      // facilityFeature.set('ENHANCED_LANG', 'Spanish')

      facilityFeature.extendFeature()
      expect(facilityFeature.get('3K')).toBe(-1)
      expect(facilityFeature.get('EL')).toBe(-1)
      expect(facilityFeature.get('PREK')).toBe(-1)
      expect(facilityFeature.get('EXTEND')).toBe('')
      // expect(facilityFeature.get('LANG')).toBe(1)

    })
  })

  describe('getter methods', () => {
    test('getAddress1', () => {
      expect.assertions(2)
      expect(facilityFeature.getAddress1()).toBe(`${facilityFeature.get('ADDRESS')}`)
      expect(facilityFeature.getAddress1()).not.toBeNull()
    })
    test('getBorough', () => {
      expect.assertions(2)
      expect(facilityFeature.getBorough()).toBe(`${facilityFeature.get('BOROUGH')}`)
      expect(facilityFeature.getBorough()).not.toBeNull()
    })
    describe('getCityStateZip', () => {
      const boroughHtml = facilityFeature.boroughHtml
      beforeEach(() => {
        facilityFeature.boroughHtml = jest.fn().mockImplementation(() => {
          return 'mockBorough'
        })
      })
      afterEach(() => {
        facilityFeature.boroughHtml = boroughHtml
      })
      test('getCityStateZip', () => {
        expect.assertions(3)
        
        expect(facilityFeature.getCityStateZip()).toBe(`${'mockBorough'}, NY ${facilityFeature.get('ZIP')}`)
        expect(facilityFeature.boroughHtml).toHaveBeenCalledTimes(1)
        expect(facilityFeature.getCityStateZip()).not.toBeNull()
        
      })
    })
    test('getDayLength', () => {
      expect.assertions(2)
      expect(facilityFeature.getDayLength()).toBe(facilityFeature.get('DAY_LENGTH'))
      expect(facilityFeature.getDayLength()).not.toBeNull()
    })
    test('getEarlyDrop', () => {
      expect.assertions(2)
      expect(facilityFeature.getEarlyDrop()).toBe(facilityFeature.get('EARLY_DROP'))
      expect(facilityFeature.getEarlyDrop()).not.toBeNull()
    })
    test('getEmail', () => {
      expect.assertions(2)
      expect(facilityFeature.getEmail()).toBe(`${facilityFeature.get('EMAIL')}`)
      expect(facilityFeature.getEmail()).not.toBeNull()
    })
    test('getElSeats', () => {
      expect.assertions(2)
      expect(facilityFeature.getElSeats()).toBe(facilityFeature.get('EL_SEATS'))
      expect(facilityFeature.getElSeats()).not.toBeNull()
    })
    test('getIndoorOutdoor', () => {
      expect.assertions(2)
      expect(facilityFeature.getIndoorOutdoor()).toBe(facilityFeature.get('INDOOR_OUTDOOR'))
      expect(facilityFeature.getIndoorOutdoor()).not.toBeNull()
    })
    test('getLatePickup', () => {
      expect.assertions(2)
      expect(facilityFeature.getLatePickup()).toBe(facilityFeature.get('LATE_PICKUP'))
      expect(facilityFeature.getLatePickup()).not.toBeNull()
    })
    test('getMeals', () => {
      expect.assertions(2)
      expect(facilityFeature.getMeals()).toBe(facilityFeature.get('MEALS'))
      expect(facilityFeature.getMeals()).not.toBeNull()
    })
    test('getName', () => {
      expect.assertions(2)
      expect(facilityFeature.getName()).toBe(`${facilityFeature.get('NAME')}`)
      expect(facilityFeature.getName()).not.toBeNull()
    })
    test('getPrekSeats', () => {
      expect.assertions(2)
      expect(facilityFeature.getPrekSeats()).toBe(facilityFeature.get('PREK_SEATS'))
      expect(facilityFeature.getPrekSeats()).not.toBeNull()
    })
    test('getProgramCode', () => {
      expect.assertions(2)
      expect(facilityFeature.getProgramCode()).toBe(facilityFeature.get('LOCCODE'))
      expect(facilityFeature.getProgramCode()).not.toBeNull()
    })
    describe('getProgramfacilityFeatures', () => {
      const mealsHtml = facilityFeature.mealsHtml
      const ioHtml = facilityFeature.ioHtml
      const startTimeHtml = facilityFeature.startTimeHtml
      const earlyDropHtml = facilityFeature.earlyDropHtml
      const latePickupHtml = facilityFeature.latePickupHtml
      const makeList = facilityFeature.makeList
  
      beforeEach(() => {
        facilityFeature.mealsHtml = jest.fn().mockImplementation(() => {
          return 'mockMeals'
        })
        facilityFeature.ioHtml = jest.fn().mockImplementation(() => {
          return 'mockIo'
        })
        facilityFeature.startTimeHtml = jest.fn().mockImplementation(() => {
          return 'mockStartTime'
        })
        facilityFeature.earlyDropHtml = jest.fn().mockImplementation(() => {
          return 'mockEarlyDrop'
        })
        facilityFeature.latePickupHtml = jest.fn().mockImplementation(() => {
          return 'mockLatePickup'
        })
        facilityFeature.makeList = jest.fn().mockImplementation(() => {
          return 'mockList'
        })
  
      })
      afterEach(() => {
        facilityFeature.mealsHtml = mealsHtml
        facilityFeature.ioHtml = ioHtml
        facilityFeature.startTimeHtml = startTimeHtml
        facilityFeature.earlyDropHtml = earlyDropHtml
        facilityFeature.latePickupHtml = latePickupHtml
        facilityFeature.makeList = makeList
  
      })
      test('getProgramFeatures', () => {
        expect.assertions(8)
        let program = ['mockMeals', 'mockIo', 'mockStartTime', 'mockEarlyDrop', 'mockLatePickup']
        expect(facilityFeature.getProgramFeatures()).toBe('mockList')
        expect(facilityFeature.mealsHtml).toHaveBeenCalledTimes(1)
        expect(facilityFeature.ioHtml).toHaveBeenCalledTimes(1)
        expect(facilityFeature.startTimeHtml).toHaveBeenCalledTimes(1)
        expect(facilityFeature.earlyDropHtml).toHaveBeenCalledTimes(1)
        expect(facilityFeature.latePickupHtml).toHaveBeenCalledTimes(1)
        expect(facilityFeature.makeList).toHaveBeenCalledTimes(1)
        expect(facilityFeature.makeList.mock.calls[0][0]).toEqual(program)
      })
    })
    test('getStartTime', () => {
      expect.assertions(2)
      expect(facilityFeature.getStartTime()).toBe(`${facilityFeature.get('START_TIME')}`)
      expect(facilityFeature.getStartTime()).not.toBeNull()
    })
    test('getWebsite', () => {
      expect.assertions(2)
      expect(facilityFeature.getWebsite()).toBe(`${facilityFeature.get('WEBSITE')}`)
      expect(facilityFeature.getWebsite()).not.toBeNull()
    })
    test('get3kSeats', () => {
      expect.assertions(2)
      expect(facilityFeature.get3kSeats()).toBe(facilityFeature.get('3K_SEATS'))
      expect(facilityFeature.get3kSeats()).not.toBeNull()
    })
  
  })

  describe('html methods', () => {
    const getBorough = facilityFeature.getBorough
    const getEmail = facilityFeature.getEmail
    const getIndoorOutdoor = facilityFeature.getIndoorOutdoor
    const getMeals = facilityFeature.getMeals
    const getProgramCode = facilityFeature.getProgramCode



    beforeEach(() => {
      facilityFeature.getBorough = jest.fn().mockImplementation(() => {
        return 'K'
      })
      facilityFeature.getEmail = jest.fn().mockImplementation(() => {
        return 'mockEmail'
      })
      facilityFeature.getProgramCode = jest.fn().mockImplementation(() => {
        return 'mockProgramCode'
      })
      facilityFeature.getMeals = jest.fn().mockImplementation(() => {
        return 1
      })
      facilityFeature.getIndoorOutdoor = jest.fn().mockImplementation(() => {
        return 1
      })

    })
    afterEach(() => {
      facilityFeature.getBorough = getBorough
      facilityFeature.getEmail = getEmail
      facilityFeature.getProgramCode = getProgramCode
      facilityFeature.getMeals = getMeals
      facilityFeature.getIndoorOutdoor = getIndoorOutdoor
    })
    test('boroughHtml', () => {
      expect.assertions(2)

      expect(facilityFeature.boroughHtml()).toBe('Brooklyn')
      expect(facilityFeature.getBorough).toHaveBeenCalledTimes(1)

    })

    test('boroughHtml - getBorough is undefined or not in borough lookup', () => {
      expect.assertions(2)
      facilityFeature.getBorough = jest.fn().mockImplementation(() => {
        return ''
      })

      expect(facilityFeature.boroughHtml()).toBe('New York')
      expect(facilityFeature.getBorough).toHaveBeenCalledTimes(1)

    })

    /*TODO*/
    /* detailsHTML */

    test('emailHtml', () => {
      expect.assertions(2)

      expect(facilityFeature.emailHtml()).toBe(`<div class="email-lnk" translate="no"><a href="mailto:mockEmail">mockEmail</a></div>`)
      expect(facilityFeature.getEmail).toHaveBeenCalledTimes(1)

    })

    test('emailHtml - none provided', () => {
      expect.assertions(2)

      facilityFeature.getEmail = jest.fn()

      expect(facilityFeature.emailHtml()).toBe('')
      expect(facilityFeature.getEmail).toHaveBeenCalledTimes(1)

    })

    test('ioHtml - getIndoorOutdoor is undefined or not in indoor_outdoor lookup', () => {
      expect.assertions(2)
      facilityFeature.getIndoorOutdoor = jest.fn().mockImplementation(() => {
        return ''
      })

      expect(facilityFeature.ioHtml()).toBe('')
      expect(facilityFeature.getIndoorOutdoor).toHaveBeenCalledTimes(1)

    })

    test('ioHtml', () => {
      expect.assertions(2)

      expect(facilityFeature.ioHtml()).toBe('Indoor playspace')
      expect(facilityFeature.getIndoorOutdoor).toHaveBeenCalledTimes(1)

    })

    test('mealsHtml - getMeals is undefined or not in indoor_outdoor lookup', () => {
      expect.assertions(2)
      facilityFeature.getMeals = jest.fn().mockImplementation(() => {
        return ''
      })

      expect(facilityFeature.mealsHtml()).toBe('')
      expect(facilityFeature.getMeals).toHaveBeenCalledTimes(1)

    })

    test('mealsHtml', () => {
      expect.assertions(2)

      expect(facilityFeature.mealsHtml()).toBe('Breakfast')
      expect(facilityFeature.getMeals).toHaveBeenCalledTimes(1)

    })

    test('programCodeHtml', () => {
      expect.assertions(2)

      expect(facilityFeature.programCodeHtml()).toBe(`<div><b>Program Code: </b>${'mockProgramCode'}</div>`)
      expect(facilityFeature.getProgramCode).toHaveBeenCalledTimes(1)

    })

    test('programCodeHtml - none provided', () => {
      expect.assertions(2)

      facilityFeature.getProgramCode = jest.fn()

      expect(facilityFeature.programCodeHtml()).toBe('')
      expect(facilityFeature.getProgramCode).toHaveBeenCalledTimes(1)

    })

  })
})

describe('station decorations', () => {
  test('getName', () => {
    expect.assertions(2)
    expect(stationFeature.getName()).toBe(`${stationFeature.get('NAME')}`)
    expect(stationFeature.getName()).not.toBeNull()
  })
  test('getTip', () => {
    expect.assertions(2)
    expect(stationFeature.getTip()).toBe(`${stationFeature.get('NAME')}`)
    expect(stationFeature.getTip()).not.toBeNull()
  })
  test('getLine', () => {
    expect.assertions(2)
    expect(stationFeature.getLine()).toBe(`${stationFeature.get('LINE')}`)
    expect(stationFeature.getLine()).not.toBeNull()
  })
  test('getNote', () => {
    expect.assertions(2)
    expect(stationFeature.getNote()).toBe(`<div class="note">${stationFeature.get('NOTE')}</div>`)
    expect(stationFeature.getNote()).not.toBeNull()
  })
  describe('getSubwayIcon', () => {
    test('getSubwayIcon', () => {
      let line = '7'
      expect(stationFeature.getSubwayIcon(line)).toBe(`<div class="subway-icon subway-7"><div>7</div></div>`)
    })
    test('getSubwayIcon - express', () => {
      let line = '7 Express'
      expect(stationFeature.getSubwayIcon(line)).toBe(`<div class="subway-icon subway-7 express"><div>7</div></div>`)
    })
    test('getSubwayIcon - local/express', () => {
      let line = '7-7 Express'
      expect(stationFeature.getSubwayIcon(line)).toBe(`<div class="subway-icon subway-7"><div>7</div></div><div class="subway-icon subway-7 express"><div>7</div></div>`)
    })
  })

  describe('html', () => {
    const getSubwayIcon = stationFeature.getSubwayIcon
    const getLine = stationFeature.getLine
    const getNote = stationFeature.getNote
    const getName = stationFeature.getName

    beforeEach(() => {
      stationFeature.getSubwayIcon = jest.fn().mockImplementation(() => {
        return 'mockSubwayIcon'
      })
      stationFeature.getLine = jest.fn().mockImplementation(() => {
        return 'mockLine'
      })
      stationFeature.getNote = jest.fn().mockImplementation(() => {
        return 'mockNote'
      })
      stationFeature.getName = jest.fn().mockImplementation(() => {
        return 'mockName'
      })
    })
    afterEach(() => {
      stationFeature.getSubwayIcon = getSubwayIcon
      stationFeature.getLine = getLine
      stationFeature.getNote = getNote
      stationFeature.getName = getName
    })
    test('html', () => {
      stationFeature.html()
      expect(stationFeature.getSubwayIcon).toHaveBeenCalledTimes(1)
      expect(stationFeature.getLine).toHaveBeenCalledTimes(1)
      expect(stationFeature.getNote).toHaveBeenCalledTimes(1)
      expect(stationFeature.getName).toHaveBeenCalledTimes(1)
      expect(stationFeature.getSubwayIcon.mock.calls[0][0]).toBe('mockLine')
    })
  })
})
