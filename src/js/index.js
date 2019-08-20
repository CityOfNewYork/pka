import App from './App'
import Content from 'nyc-lib/nyc/Content'
import CsvPoint from 'nyc-lib/nyc/ol/format/CsvPoint'
import nyc from 'nyc-lib/nyc'

const cacheBust = nyc.cacheBust(5)

Content.loadCsv({
  url: `data/content.csv?${cacheBust}`
}).then((content) => {
  new App(content)
})
