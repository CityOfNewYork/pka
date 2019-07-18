/**
 * @module pka/decorations
 */
import lookup from './lookup'

const decorations = {
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
  getEmail() {
    return this.get('EMAIL')
  },
  getIndoorOutdoor() {
    return this.get('INDOOR_OUTDOOR')
  },
  getMeals() {
    return this.get('MEALS')
  },
  getProgramCode() {
    return this.get('LOCCODE')
  },
  getProgramFeatures() {
    return $(this.mealsHtml())
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
  programCodeHtml() {
    return `<div><b>Program Code: </b>${this.getProgramCode()}</div>`
  },
  detailsHtml() {
    const div = $('<div class="dtl"></div>')
    let ul = $('<ul></ul>')
    
    ul.append(this.getProgramFeatures())
    
    div.append(this.programCodeHtml())
      .append('<b>Program Features: </b>')
      .append(ul)

    //2019-20 Seats

    return div
  },
  ioHtml() {
    let io = lookup.indoor_outdoor[this.getIndoorOutdoor()]
    return `<li>${io}</li>`
  },
  mealsHtml() {
    let meals = lookup.meals[this.getMeals()]
    return `<li>${meals}</li>`
  },
  startTimeHtml() {
    return `<li>Daily Start Time: ${this.getStartTime()}</li>`
  },
  snapshotButton() {
    return $('<a class="btn rad-all snapshot" target="_blank"></a>')
      .html('Pre-K Snapshot')
      .attr('href', this.getSnapshotLink())
  },
  getSnapshotLink() {
    return 'http://www.google.com'
  }
}

export default decorations