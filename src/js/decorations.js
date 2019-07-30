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
  getElSeats() {
    return this.get('EL_SEATS')
  },
  getIndoorOutdoor() {
    return this.get('INDOOR_OUTDOOR')
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
    const program = [this.mealsHtml(), this.ioHtml(), this.startTimeHtml()]
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
    return ''
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