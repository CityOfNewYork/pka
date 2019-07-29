/**
 * @module pka/decorations
 */
import lookup from './lookup'
import messages from './message'
import $ from 'jquery'

const decorations = {
  extendFeature() {
    this.set('3K', (this.get('3K_SEATS')) ? 1 : -1) 
    this.set('EL', (this.get('EL_SEATS')) ? 1 : -1) 
    this.set('PREK', (this.get('PREK_SEATS')) ? 1 : -1) 
    this.set('EXTEND', 
      this.get('EARLY_DROP').trim() == '' ? 1 : 0
    )
    this.set('LANG', 
      this.containsKey(this.get('ENHANCED_LANG'), lookup.enhanced_lang) || this.containsKey(this.get('ENHANCED_LANG'), lookup.dual_lang) ? 1 : 0
    )
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
      .append(this.snapshotButton())
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
  getName() {
    return this.get('NAME')
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
  getEmail() {
    return this.get('EMAIL')
  },
  getIndoorOutdoor() {
    return this.get('INDOOR_OUTDOOR')
  },
  getMeals() {
    return this.get('MEALS')
  },
  getPrekSeats() {
    return this.get('PREK_SEATS')
  },
  get3kSeats() {
    return this.get('3K_SEATS')
  },
  getElSeats() {
    return this.get('EL_SEATS')
  },
  getProgramCode() {
    return this.get('LOCCODE')
  },
  getProgramFeatures(list) {
    return list
      .append(this.mealsHtml())
      .append(this.ioHtml())
      .append(this.startTimeHtml())

  },
  getStartTime() {
    return this.get('START_TIME')
  },
  getWebsite() {
    return this.get('WEBSITE')
  },
  boroughHtml() {
    return lookup.borough[this.getBorough()] || 'New York'
  },
  detailsHtml() {
    const div = $('<div class="dtl"></div>')
    let program = []
    program.push(this.mealsHtml())
    program.push(this.ioHtml())
    program.push(this.startTimeHtml())

    let ul = this.makeList(program)

    div.append(this.programCodeHtml())
      .append(this.emailHtml())
      .append('<div><b>Program Features: </b></div>')
      .append(ul)
      .append('<div><b>2019-20 Seats: </b></div>')
      .append(this.seatsHtml())

    return div
  },
  emailHtml() {
    const email = this.getEmail()
    return `<div class="email-lnk" translate="no"><a href="mailto:${email}">${email}</a></div>`
  },
  ioHtml() {
    const io = lookup.indoor_outdoor[this.getIndoorOutdoor()]
    return `${io}`
  },
  mealsHtml() {
    const meals = lookup.meals[this.getMeals()]
    return `${meals}`
  },
  programCodeHtml() {
    return `<div><b>Program Code: </b>${this.getProgramCode()}</div>`
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
    return `Daily Start Time: ${this.getStartTime()}`
  },
  snapshotButton() {
    return $('<a class="btn rad-all snapshot" target="_blank"></a>')
      .html('Pre-K Snapshot')
      .attr('href', this.getSnapshotLink())
  },
  getSnapshotLink() {
    return 'http://www.google.com'
  },
  makeList(list) {
    const ul = $('<ul></ul>')
    list.forEach(item => {
      const li = $('<li></li>').html(item)
      ul.append(li)
    })
    return ul
  }
}


export default decorations