var timeOffset = 1000 * 60 * 15;
var cacheBust = Math.round(new Date().getTime() / timeOffset) * timeOffset;

function csvContentLoaded(csvContent){
	pka.messages.push(csvContent);
	
	$(document).ready(function(){

		var GEOCLIENT_URL = '//maps.nyc.gov/geoclient/v1/search.json?app_key=YOUR_APP_KEY&app_id=YOUR_APP_ID';
		var GOOGLE_URL = 'https://maps.googleapis.com/maps/api/js?sensor=false&libraries=visualization';
		var LANGUAGES = {
		    en: {val: 'English', desc: 'English', hint: 'Translate'},
		    ar: {val: 'Arabic', desc: '&#x627;&#x644;&#x639;&#x631;&#x628;&#x64A;&#x629;', hint: '&#x62A;&#x631;&#x62C;&#x645;'},
		    bn: {val: 'Bengali', desc: '&#x9AC;&#x9BE;&#x999;&#x9BE;&#x9B2;&#x9BF;', hint: '&#x985;&#x9A8;&#x9C1;&#x9AC;&#x9BE;&#x9A6; &#x995;&#x9B0;&#x9BE;'},
		    'zh-CN': {val: 'Chinese (Simplified)', desc: '&#x4E2D;&#x56FD;', hint: '&#x7FFB;&#x8BD1;'},
		    fr: {val: 'French', desc: 'Fran&#231;ais', hint: 'Traduire'},
		    ht: {val: 'Haitian Creole', desc: 'Krey&#242;l Ayisyen', hint: 'Tradui'},
		    ko: {val: 'Korean', desc: '&#xD55C;&#xAD6D;&#xC758;', hint: '&#xBC88;&#xC5ED;'},
		    ru: {val: 'Russian', desc: 'P&#x443;&#x441;&#x441;&#x43A;&#x438;&#x439;', hint: '&#x43F;&#x435;&#x440;&#x435;&#x432;&#x435;&#x441;&#x442;&#x438;'},
		    es: {val: 'Spanish', desc: 'Espa&#241;ol', hint: 'Traducir'},
		    ur: {val: 'Urdu', desc: '&#x627;&#x631;&#x62F;&#x648;', hint: '&#x62A;&#x631;&#x62C;&#x645;&#x6C1; &#x6A9;&#x631;&#x6CC;&#x6BA;'}
		};
		
		var lang = new nyc.Lang('#lang', pka.lookup.languages)
		lang.on(nyc.Lang.EventType.READY, function(){
			$('#first-load').fadeOut();			
		});
		
		new nyc.Share('#map');

		var base = new nyc.ol.layer.BaseLayer();
		base.setOpacity(0.7);
		
		var map = new ol.Map({
			target: $('#map').get(0),
			layers: [base],
			view: new ol.View({
				projection: 'EPSG:2263',
				resolutions: nyc.ol.layer.BaseLayer.RESOLUTIONS,
				zoom: 3,
				center: nyc.ol.CENTER
			})
		});
		
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
			{projection: 'EPSG:2263'}
		);

		var schoolLyr = new ol.layer.Vector({
			source: schoolSrc, 
			style: $.proxy(schoolStyle.school, schoolStyle),
			maxResolution: nyc.ol.layer.BaseLayer.RESOLUTIONS[2],
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
			zIndex: -1
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
			maxResolution: nyc.ol.layer.BaseLayer.RESOLUTIONS[3],
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
			[subwayContent, ta.lookup, nyc.fieldAccess, ta.fieldAccess, ta.htmlRenderer]
		);
		var subwayStationLyr = new ol.layer.Vector({
			source: subwayStationSrc, 
			style: $.proxy(subwayStyle.station, subwayStyle),
			maxResolution: nyc.ol.layer.BaseLayer.RESOLUTIONS[3],
			zIndex: 200
		});

		var filterControls = [
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
					{name: 'PREK_TYPE', value: 'DOE', label: '<img alt="District School" src="img/DOE.png">district school', checked: true},
					{name: 'PREK_TYPE', value: 'NYCEEC', label: '<img alt="Early Ed Center" src="img/NYCEEC.png">early ed center', checked: true},
					{name: 'PREK_TYPE', value: 'CHARTER', label: '<img alt="Charter School" src="img/CHARTER.png">charter school', checked: true},
					{name: 'PREK_TYPE', value: 'PKC', label: '<img alt="Pre-K Center" src="img/PKC.png">Pre-K center', checked: true}
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
		window.locationLyr = new ol.layer.Vector({
			source: new nyc.ol.source.Decorating({}, [{getName: function(){return this.get('name')}}]),
			style: $.proxy(locationStyle.location, locationStyle),
			zIndex: 1000
		});
		map.addLayer(locationLyr);
		
		nyc.app = new nyc.App(
			applicationPeriod,
			map,
			{school: schoolLyr, district: districtLyr, subwayStation: subwayStationLyr, subwayLine: subwayLineLyr},
			filterControls,
			pka.lookup,
			schoolContent,
			new nyc.LocationMgr({
				autoLocate: true,
				controls: new nyc.ol.control.ZoomSearch(map),
				locate: new nyc.ol.Locate(
					new nyc.Geoclient(GEOCLIENT_URL),
					'EPSG:2263',
					nyc.ol.EXTENT
				),
				locator: new nyc.ol.Locator({
					map: map,
					layer: locationLyr
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