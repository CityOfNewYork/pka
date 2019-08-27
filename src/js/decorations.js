/**
 * @module pka/decorations
 */
import lookup from './lookup'
import messages from './message'
import $ from 'jquery'

const decorations = {
  facility: {
    extendFeature() {
      this.set('3K', (this.get('3K_SEATS')) ? 1 : -1) 
      this.set('EL', (this.get('EL_SEATS')) ? 1 : -1) 
      this.set('PREK', (this.get('PREK_SEATS')) ? 1 : -1) 
      this.set('EXTEND', 
        this.get('EARLY_DROP') == '1' || this.get('LATE_PICKUP') == '1' ? 1 : ''
      )
      this.set('LANG', 
        this.containsKey(this.get('ENHANCED_LANG'), lookup.enhanced_lang) || this.containsKey(this.get('ENHANCED_LANG'), lookup.dual_lang) ? 1 : 0
      )
      console.warn('wtf')
    },
    containsKey(item, list) {
      let result = false
      $.each(list, (key, value) => {
        if(key == item) {
          result = true
          return false
        }
      })
      return result
    },
    html() {
      return $('<div class="facility"></div>')
        .append(this.distanceHtml())
        .append(this.nameHtml())
        .append(this.distanceHtml(true))
        .append(this.addressHtml())
        .append(this.dynamicButton())
        .append(this.phoneButton())
        .append(this.websiteButton())
        .append(this.mapButton())
        .append(this.directionsButton())
        .append(this.detailsCollapsible())
        .data('feature', this)
        .mouseover($.proxy(this.handleOver, this))
        .mouseout($.proxy(this.handleOut, this))
    },
    getAddress1() {
      return this.get('ADDRESS')
    },
    getBorough() {
      return this.get('BOROUGH')
    },
    getCityStateZip() {
      return `${this.boroughHtml()}, NY ${this.get('ZIP')}`
    },
    getDayLength() {
      return this.get('DAY_LENGTH')
    },
    getEarlyDrop() {
      return this.get('EARLY_DROP')
    },
    getEmail() {
      return this.get('EMAIL')
    },
    getElSeats() {
      return this.get('EL_SEATS')
    },
    getIndoorOutdoor() {
      return this.get('INDOOR_OUTDOOR')
    },
    getLatePickup() {
      return this.get('LATE_PICKUP')
    },
    getMeals() {
      return this.get('MEALS')
    },
    getName() {
      return this.get('NAME')
    },
    getPrekSeats() {
      return this.get('PREK_SEATS')
    },
    getProgramCode() {
      return this.get('LOCCODE')
    },
    getProgramFeatures() {
      const program = [this.mealsHtml(), this.ioHtml(), this.startTimeHtml(), this.earlyDropHtml(), this.latePickupHtml()]
      return this.makeList(program)
    },
    getStartTime() {
      return this.get('START_TIME')
    },
    getWebsite() {
      return this.get('WEBSITE')
    },
    get3kSeats() {
      return this.get('3K_SEATS')
    },
    boroughHtml() {
      const boroughKey = this.getBorough() || ''
      return lookup.borough[boroughKey] || 'New York'
    },
    detailsHtml() {
      const div = $('<div class="dtl"></div>')

      let programFeatures = this.getProgramFeatures()

      div.append(this.programCodeHtml())
        .append(this.emailHtml())
        .append('<div><b>Program Features: </b></div>')
        .append(programFeatures)
        .append('<div><b>2019-20 Seats: </b></div>')
        .append(this.seatsHtml())

      return div
    },
    earlyDropHtml() {
      const earlyDrop = this.getEarlyDrop()
      if (earlyDrop) {
        return `Early Drop Off Available: ${earlyDrop == 1 ? 'Yes' : earlyDrop == 0 ? 'No' : ''} `
      }
      return 'Early Drop Off Available: Contact program about extended hours'
    },
    emailHtml() {
      const email = this.getEmail()
      if (email)
        return `<div class="email-lnk" translate="no"><a href="mailto:${email}">${email}</a></div>`
      return ''
    },
    ioHtml() {
      const io = this.getIndoorOutdoor() || ''
      return lookup.indoor_outdoor[io] || ''
    },
    latePickupHtml() {
      const latePickup = this.getLatePickup()
      if (latePickup) {
        return `Late Pickup Available: ${latePickup == 1 ? 'Yes' : latePickup == 0 ? 'No' : ''} `
      }
      return 'Late Pickup Available: Contact program about extended hours'
    },
    mealsHtml() {
      const meals = this.getMeals() || ''
      return lookup.meals[meals] || ''
    },
    programCodeHtml() {
      const programCode = this.getProgramCode()
      if (programCode)
        return `<div><b>Program Code: </b>${programCode}</div>`
      return ''
    },
    seatsHtml() {
      const pre_k = this.getPrekSeats()
      const three_k = this.get3kSeats()
      const el = this.getElSeats()
      let seats = []
      if(pre_k)
        seats.push(`<b>Pre-K:</b> ${pre_k}`)
      if(three_k)
        seats.push(`<b>3-K:</b> ${three_k}`)
      if(el)
        seats.push(`<b>Early Learn 3s:</b> ${el}`)

      for(let i = 0; i < seats.length; i++) {
        seats[i] = `${seats[i]} ${lookup.day_length[this.getDayLength()]}`
      }
      return this.makeList(seats)
    },
    startTimeHtml() {
      const startTime = this.getStartTime()
      if (startTime)
        return `Daily Start Time: ${this.getStartTime()}`
      return 'Daily Start Time: Contact program about start time'
    },
    dynamicButton() {
      return $('<a class="btn rad-all snapshot" target="_blank"></a>')
        .html(this.content.message('btn_pdf'))
        .attr('href', this.getSnapshotLink())
    },
    getSnapshotLink() {
      let link = this.content.message('quality_pdf')
      const progCode = this.getProgramCode()
      if(progCode) {
        let loccode = progCode.substring(progCode.length - 4)
        link = link.replace('${loccode4}', loccode)
      }
      return link
    },
    makeList(list) {
      const ul = $('<ul></ul>')
      list.forEach(item => {
        let li
        if (item != '') li = $('<li></li>').html(item)
        ul.append(li)
      })
      return ul
    }
  },
  station: {
      getName() {
        return this.get('NAME')
      },
      getTip() {
        return this.getName()
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
  },
  district: {
    getTip() {
      return `District ${this.get('NAME')}`
    }
  },
  transit: {
    getTip() {
      return `${this.get('RT_SYMBOL')} Line`
    }
  }
}



export default decorations