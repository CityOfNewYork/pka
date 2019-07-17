'use strict';

var timeOffset = 1000 * 60 * 15;
var cacheBust = Math.round(new Date().getTime() / timeOffset) * timeOffset;

function csvContentLoaded(csvContent){
	pka.messages.push(csvContent);
	
	$(document).ready(function(){
		
		var GEOCLIENT_URL = '//maps.nyc.gov/geoclient/v1/search.json?app_key=YOUR_APP_KEY&app_id=YOUR_APP_ID';
		var GOOGLE_URL = 'https://maps.googleapis.com/maps/api/js?sensor=false&libraries=visualization';
		
		var lang = new nyc.lang.Goog({target: '#lang', languages: pka.lookup.languages})
		lang.on(nyc.lang.Translate.EventType.READY, function(){
			$('#first-load').fadeOut();			
		});
		
		new nyc.Share('#map');

		var map = new nyc.ol.Basemap({target: $('#map').get(0)});
		
		var applicationPeriod = new pka.ApplicationPeriod(csvContent.apply_start_date, csvContent.apply_end_date);
		var schoolContent = new nyc.Content(pka.messages);
		var schoolStyle = new pka.Style();

		var schoolSrc = new nyc.ol.source.FilteringAndSorting(
			{loader: new nyc.ol.source.CsvPointFeatureLoader({
				url: 'data/pka/pka.csv?' + cacheBust,
				projection: 'EPSG:2263',
				xCol: 'X',
				yCol: 'Y'
			})}, 
			[
			 	{applicationPeriod: applicationPeriod}, 
			 	schoolContent, 
			 	nyc.fieldAccess, 
			 	pka.fieldAccess, 
			 	pka.htmlRenderer, 
			 	pka.lookup
		 	],
			{nativeProjection: 'EPSG:2263', projection: 'EPSG:3857'}
		);

		var schoolLyr = new ol.layer.Vector({
			source: schoolSrc, 
			style: $.proxy(schoolStyle.school, schoolStyle),
			maxResolution: nyc.ol.TILE_GRID.getResolution(11),
			zIndex: 400
		});
		map.addLayer(schoolLyr);

		var districtSrc = new nyc.ol.source.Decorating(
				{url: 'data/pka/school-district.json', format: new ol.format.TopoJSON},
				[{getName: function(){
					return 'District ' + this.get('NAME');
				}}]
			);

		var districtLyr = new ol.layer.Vector({
			source: districtSrc, 
			style: $.proxy(schoolStyle.district, schoolStyle),
			zIndex: 1,
			maxResolution: nyc.ol.TILE_GRID.getResolution(10),
			opacity: .5
		});
		
		var subwayStyle = new ta.Style(ta.lookup);
		var subwayContent = new nyc.Content(ta.messages);

		var subwayLineSrc = new nyc.ol.source.Decorating(
			{url: 'data/ta/subway-line.json', format: new ol.format.TopoJSON},
			[subwayContent, ta.lookup, nyc.fieldAccess]
		);
		var subwayLineLyr = new ol.layer.Vector({
			source: subwayLineSrc, 
			style: $.proxy(subwayStyle.line, subwayStyle),
			maxResolution: nyc.ol.TILE_GRID.getResolution(10),
			zIndex: 100,
			opacity: 0.6
		});
		
		var subwayStationSrc = new nyc.ol.source.Decorating(
			{loader: new nyc.ol.source.CsvPointFeatureLoader({
				url: 'data/ta/subway-station.csv',
				projection: 'EPSG:2263',
				xCol: 'X',
				yCol: 'Y'
			})}, 
			[subwayContent, ta.lookup, nyc.fieldAccess, ta.fieldAccess, ta.htmlRenderer],
			{projection: 'EPSG:3857'}
		);
		var subwayStationLyr = new ol.layer.Vector({
			source: subwayStationSrc, 
			style: $.proxy(subwayStyle.station, subwayStyle),
			maxResolution: nyc.ol.TILE_GRID.getResolution(10),
			zIndex: 200
		});

		var filterControls = [
  			new nyc.Check({
				target: '#chk-prek-3k',
				title: 'age group',
				expanded: true,
				choices: [
					{name: 'prek3', value: 'el-3k,el-3k-pk,3k,3k-pk', label: '3-K <span class="birth">(born ' + (schoolContent.message('start_year') - 3) + ')</span>', checked: true},
					{name: 'prek3', value: 'el,el-3k,el-3k-pk,el-pk', label: 'early learn 3s <span class="birth">(born ' + (schoolContent.message('start_year') - 3) + ')</span>', checked: true},
					{name: 'prek3', value: 'el-3k-pk,el-pk,pk,3k-pk', label: 'Pre-K <span class="birth">(born ' + (schoolContent.message('start_year') - 4) + ')</span>', checked: true}
		        ]
			}),
			new nyc.Check({
				target: '#chk-dynamic',
				title: schoolContent.message('dynamic_filter_btn'),
				expanded: true,
				choices: [{name: 'DYNAMIC', value: '1', label: schoolContent.message('dynamic_filter_btn')}]
			}),
	  		new nyc.Check({
				target: '#chk-apply',
				title: schoolContent.message('application_filter_btn'),
				expanded: true,
				choices: [{name: 'can_apply', value: '1', label: schoolContent.message('application_filter_btn')}]
			}),
			new nyc.Check({
				target: '#chk-sch-type',
				title: 'school type',
				expanded: true,
				choices: [
					{name: 'TYPE', value: 'DOE', label: '<img alt="District School" src="img/DOE.png">district school', checked: true},
					{name: 'TYPE', value: 'NYCEEC', label: '<img alt="Early Ed Center" src="img/NYCEEC.png">early ed center', checked: true},
					{name: 'TYPE', value: 'CHARTER', label: '<img alt="Charter School" src="img/CHARTER.png">charter school', checked: true},
					{name: 'TYPE', value: 'PKC', label: '<img alt="Pre-K Center" src="img/PKC.png">Pre-K center', checked: true}
		        ]
			}),
			new nyc.Check({
				target: '#chk-day-len',
				title: 'day length',
				expanded: true,
				choices: [
					{name: 'DAY_LENGTH', value: '1,2,5,7', label: 'full day', checked: true},
					{name: 'DAY_LENGTH', value: '3,6,7', label: 'half day', checked: true},
					{name: 'DAY_LENGTH', value: '4,5,6,7', label: '5-hour', checked: true}
		        ]
			}),
			new nyc.Check({
				target: '#chk-prog-feat',
				title: 'program features',
				expanded: true,
				choices: [
					{name: 'extend', value: '1', label: 'extended hours'},
					{name: 'INCOME_FLG', value: '1', label: 'income eligibility'},
					{name: 'lang', value: '1', label: 'dual/enhanced language'}//,
					//{name: 'sped', value: '1', label: 'special education'}
		        ]
			})
		];
		
		var locationStyle = new nyc.Style();
		
		nyc.app = new nyc.App(
			applicationPeriod,
			map,
			{school: schoolLyr, district: districtLyr, subwayStation: subwayStationLyr, subwayLine: subwayLineLyr},
			filterControls,
			pka.lookup,
			schoolContent,
			new nyc.LocationMgr({
				controls: new nyc.ol.control.ZoomSearch(map),
				locate: new nyc.ol.Locate(new nyc.Geoclient(GEOCLIENT_URL)),
				locator: new nyc.ol.Locator({
					map: map, 
					style: $.proxy(locationStyle.location, locationStyle)
				})
			}),
			new nyc.Directions('#dir-map', '#directions', GOOGLE_URL),
			new nyc.ol.Popup(map),
			new pka.Form(applicationPeriod, schoolContent, pka.lookup.languages)
		);

		new pka.Splash(applicationPeriod, pka.lookup, schoolContent, nyc.app);
	});	
};

new nyc.CsvContent('data/pka/content.csv?' + cacheBust, csvContentLoaded);