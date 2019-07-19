/**
 * @module pka/decorations
 */
import lookup from './lookup'
import messages from './message'

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