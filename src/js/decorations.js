/**
 * @module pka/decorations
 */

const decorations = {
  getName() {
    return this.get('NAME')
  },
  getAddress1() {
    return this.get('ADDRESS')
  },
  getCityStateZip() {
    return `${this.get('BOROUGH')}, NY ${this.get('ZIP')}`
  } 
}

export default decorations