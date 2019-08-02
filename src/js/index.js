import App from './App'
import Content from 'nyc-lib/nyc/Content'
import decorations from './decorations'
import CsvPoint from 'nyc-lib/nyc/ol/format/CsvPoint'
import messages from './message'
import styles from './styles'


new App({
  title: '<span class="screen-reader-only">NYC Pre-K Finder</span><span>Pre-K Finder</span>',
  splashOptions: {
    message: '<div>welcome to the pre-k finder</div>',
    buttonText: ['Continue to map']
  },
  geoclientUrl: 'https://maps.nyc.gov/geoclient/v1/search.json?app_key=74DF5DB1D7320A9A2&app_id=nyc-lib-example',
  facilityStyle: styles.facilityStyle,
  facilityTabTitle: 'Schools',
  facilityUrl: 'data/pka.csv',
  facilityFormat: new CsvPoint({
    x: 'X',
    y: 'Y',
    dataProjection: 'EPSG:2263'
  }),
  filterChoiceOptions: [
    {
      title: 'Age Group',
      choices: [
        {name: '3K', values: [1], label: '3-K (Born 2016)'},
        {name: 'EL', values: [1], label: 'Early Learn (born 2016)'},
        {name: 'PREK', values: [1], label: 'PRE-K (Born 2015)'}
      ]
    },
    {
      title: 'May Have Pre-K Seats Available',
      choices: [
        {
          name: 'PREK_SEATS',
          values: ['1'],
          label: 'May Have Pre-K Seats Available'
        } 
      ]
    },
    {
      title: 'School Type',
      choices: [
        {name: 'TYPE', values: ['DOE', 'NYCEEC', 'CHARTER', 'PKC'], label: 'All Schools', checked: true},
        {name: 'TYPE', values: ['DOE'], label: 'District School'},
        {name: 'TYPE', values: ['NYCEEC'], label: 'Early Ed Center'},
        {name: 'TYPE', values: ['CHARTER'], label: 'Charter School'},
        {name: 'TYPE', values: ['PKC'], label: 'Pre-K Center'}
      ]
    },  
    {
      title: 'Day Length',
      choices: [
        {name: 'DAY_LENGTH', values: ['1', '2', '5', '7'], label: 'Full Day', checked: true},
        {name: 'DAY_LENGTH', values: ['3', '6', '7'], label: 'Half Day', checked: true},
        {name: 'DAY_LENGTH', values: ['4', '5', '6', '7'], label: '5-hour', checked: true}
      ]
    },
    {
      title: 'Program Features',
      choices: [
        {name: 'EXTEND', values: [1], label: 'Extended Hours'},
        {name: 'INCOME_FLG', values: ['1'], label: 'Income Eligibility'},
        {name: 'LANG', values: [1], label: 'DualEnhanced Language'}
      ]
    }
  ],
  facilitySearch: {displayField: 'search_label', nameField: 'NAME'},
  decorations: decorations,
  directionsUrl: 'https://maps.googleapis.com/maps/api/js?client=gme-newyorkcitydepartment&channel=pka&sensor=false&libraries=visualization'

})