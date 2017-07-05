QUnit.config.requireExpects = true;

function setup(assert, hooks){
			
	hooks.APPLICATION_PERIOD_ACTIVE = {
		active: true,
		isActive: function(){
			return this.active;
		}
	};
		
	hooks.APPLICATION_PERIOD_NOT_ACTIVE = {
		active: false,
		isActive: function(){
			return this.active;
		}
	};
			
	hooks.CSV_MESSAGES = {
		school_year: '2015-16',
		apply_start_date: '2016-05-06',
		apply_end_date: '2016-07-11',
		splash_msg_no_apply: '<p>All NYC children born in 2011 are eligible to attend pre-K in September 2015.</p><p>Click \"<span class="capitalize">request a call</span>\" to hear from an enrollment specialist.</p><p>You can also apply in the <span class="capitalize">round 2</span> application period from June 22 - July 10</p>',
		splash_msg_yes_apply: '<p>All NYC children born in 2011 are eligible to attend pre-K in September 2015.</p><p>Click \"<span class="capitalize">request a call</span>\" to hear from an enrollment specialist.</p><p>The <span class="capitalize">main round</span> application period is now closed. You can still contact <span class="capitalize">main round</span> programs directly to inquire about waitlists and availability.</p><p>You can still apply for pre-K in the <span class="capitalize">round 2</span> application period from June 22-July 10. <span class="capitalize">round 2</span> programs include newly awarded NYCEEC pre-k programs</p>',
		btn_call: 'request a call',
		btn_apply: 'apply now',
		application_filter_btn: 'round 2 programs',
		dynamic_filter_btn: 'dynamic',
		form_msg_no_apply: 'This form is only a statement of interest and not an application. An Enrollment Specialist will contact you shortly. Please visit <a href="http://nyc.gov/prek" target="_blank">nyc.gov/prek</a> for more information.',
		form_msg_yes_apply: 'This form is only a statement of interest and not an application. An Enrollment Specialist will contact you shortly. Please visit <a href="http://nyc.gov/prek" target="_blank">nyc.gov/prek</a> for more information.',
		form_dob_msg: '<b>Note:</b> To be eligible for pre-K for the 2015-16 school year, your child must have been born in the year 2011.',
		form_another: 'Do you wish to submit again for another child?',
		min_dob_year: '2011',
		max_dob_year: '2015',
		hotline_number: '(800) 555-5555',
		hotline_msg: 'Call (800) 555-5555 to contact an enrollment specialist between 7AM-9PM Monday-Friday'
	};
	
	pka.messages.push(hooks.CSV_MESSAGES);

	hooks.SCHOOL_CONTENT = new nyc.Content(pka.messages);

	hooks.SCHOOL_SRC_ACTTIVE_APPLICATION_PERIOD = new nyc.ol.source.FilteringAndSorting(
			{loader: new nyc.ol.source.CsvPointFeatureLoader({
				url: 'data/pka/pka.csv',
				projection: 'EPSG:2263',
				xCol: 'X',
				yCol: 'Y'
			})}, 
			[
			 	{applicationPeriod: hooks.APPLICATION_PERIOD_ACTIVE}, 
			 	hooks.SCHOOL_CONTENT, 
			 	nyc.fieldAccess, 
			 	pka.fieldAccess, 
			 	pka.htmlRenderer, 
			 	pka.lookup
		 	],
			{nativeProjection: 'EPSG:2263', projection: 'EPSG:3857'}
		);

	hooks.SCHOOL_SRC_NOT_ACTTIVE_APPLICATION_PERIOD = new nyc.ol.source.FilteringAndSorting(
			{loader: new nyc.ol.source.CsvPointFeatureLoader({
				url: 'data/pka/pka.csv',
				projection: 'EPSG:2263',
				xCol: 'X',
				yCol: 'Y'
			})}, 
			[
			 	{applicationPeriod: hooks.APPLICATION_PERIOD_NOT_ACTIVE}, 
			 	hooks.SCHOOL_CONTENT, 
			 	nyc.fieldAccess, 
			 	pka.fieldAccess, 
			 	pka.htmlRenderer, 
			 	pka.lookup
		 	],
			{nativeProjection: 'EPSG:2263', projection: 'EPSG:3857'}
		);

	hooks.SUBWAY_STA_SRC = new nyc.ol.source.Decorating(
			{loader: new nyc.ol.source.CsvPointFeatureLoader({
				url: 'data/ta/subway-station.csv',
				projection: 'EPSG:2263',
				xCol: 'X',
				yCol: 'Y'
			})}, 
			[new nyc.Content(ta.messages), ta.lookup, nyc.fieldAccess, ta.fieldAccess, ta.htmlRenderer],
			{nativeProjection: 'EPSG:2263', projection: 'EPSG:3857'}
		);

	hooks.SUBWAY_LINE_SRC = new nyc.ol.source.Decorating(
		{url: 'data/ta/subway-line.json', format: new ol.format.TopoJSON},
		[new nyc.Content(ta.messages), ta.lookup, nyc.fieldAccess]
	);

	hooks.TEST_MAP = (function(){
		var div = $('<div class="test-map"></div>')[0];
		$('body').append(div);
		var map = new ol.Map({
			target: div,
			view: new ol.View({
				projection: 'EPSG:2263',
				resolutions: nyc.ol.layer.BaseLayer.RESOLUTIONS
			})
		});
		map.getView().fit(nyc.ol.EXTENT, map.getSize());
		return map;
	}());
	
	var districtSrc = new nyc.ol.source.Decorating(
			{url: 'data/pka/school-district.json', format: new ol.format.TopoJSON},
			[{getName: function(){
				return 'District ' + this.get('NAME');
			}}]
		);

	var subwayStationLyr = new ol.layer.Vector({source: hooks.SUBWAY_STA_SRC});
	var subwayLineLyr = new ol.layer.Vector({source: hooks.SUBWAY_LINE_SRC});
	var districtLyr = new ol.layer.Vector({
		source: new nyc.ol.source.Decorating(
			{url: 'data/pka/school-district.json', format: new ol.format.TopoJSON},
			[{getName: function(){
				return 'District ' + this.get('NAME');
			}}]
		)
	});
		
	window.locationLyr = new ol.layer.Vector({
		source: new nyc.ol.source.Decorating({}, [{getName: function(){return this.get('name')}}])
	});
	hooks.TEST_MAP.addLayer(locationLyr);

	hooks.LOCATION_MGR = new nyc.LocationMgr({
		controls: new nyc.ol.control.ZoomSearch(hooks.TEST_MAP),
		locate: new nyc.ol.Locate(
			new nyc.Geoclient(''),
			'EPSG:2263',
			nyc.ol.EXTENT
		),
		locator: new nyc.ol.Locator({
			map: hooks.TEST_MAP,
			layer: locationLyr
		})
	});
	
	hooks.MOCK_DIRECTIONS = {};

	hooks.MOCK_POPUP = {};
	
	hooks.MOCK_FORM = {
		reset: function(){}	
	};
	
	$('body').append('<div id="filters"><div id="chk-prek-3k"></div><div id="chk-dynamic"></div><div id="chk-apply"></div><div id="chk-sch-type"></div><div id="chk-day-len"></div><div id="chk-prog-feat"></div></div>');

	var filterControls = [
	new nyc.Check({
		target: '#chk-prek-3k',
		title: 'age group',
		expanded: true,
		choices: [
			{name: 'prek3', value: 'el,el-3k,el-3k-pk,el-pk', label: 'early learn 3s', checked: true},
			{name: 'prek3', value: 'el-3k,el-3k-pk,3k,3k-pk', label: '3-K', checked: true},
			{name: 'prek3', value: 'el-3k-pk,el-pk,pk,3k-pk', label: 'Pre-K', checked: true}
        ]
	}),
	new nyc.Check({
		target: '#chk-dynamic',
		title: '',
		expanded: true,
		choices: [{name: 'DYNAMIC', value: '1', label: ''}]
	}),
	new nyc.Check({
		target: '#chk-apply',
		title: '',
		expanded: true,
		choices: [{name: 'can_apply', value: '1', label: ''}]
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
	
	hooks.TEST_APP_ACTTIVE_APPLICATION_PERIOD = function(){
		var schoolLyr = new ol.layer.Vector({source: hooks.SCHOOL_SRC_ACTTIVE_APPLICATION_PERIOD});
		return new nyc.App(
			hooks.APPLICATION_PERIOD_ACTIVE,
			hooks.TEST_MAP,
			{school: schoolLyr, district: districtLyr, subwayStation: subwayStationLyr, subwayLine: subwayLineLyr},
			filterControls,
			pka.lookup,
			hooks.SCHOOL_CONTENT,
			hooks.LOCATION_MGR,
			hooks.MOCK_DIRECTIONS,
			hooks.MOCK_POPUP,
			hooks.MOCK_FORM
		);
	};
	
	hooks.TEST_APP_NOT_ACTTIVE_APPLICATION_PERIOD = function(){
		var schoolLyr = new ol.layer.Vector({source: hooks.SCHOOL_SRC_NOT_ACTTIVE_APPLICATION_PERIOD});
		return new nyc.App(
			hooks.APPLICATION_PERIOD_ACTIVE,
			hooks.TEST_MAP,
			{school: schoolLyr, district: districtLyr, subwayStation: subwayStationLyr, subwayLine: subwayLineLyr},
			filterControls,
			pka.lookup,
			hooks.SCHOOL_CONTENT,
			hooks.LOCATION_MGR,
			hooks.MOCK_DIRECTIONS,
			hooks.MOCK_POPUP,
			hooks.MOCK_FORM
		);
	};
	
};

function teardown(assert, hooks){
	$('#filters').remove();
	delete hooks.APPLICATION_PERIOD_ACTIVE;
	delete hooks.APPLICATION_PERIOD_NOT_ACTIVE;
	delete hooks.CSV_MESSAGES;
	delete hooks.SCHOOL_CONTENT;
	delete hooks.SCHOOL_SRC_ACTTIVE_APPLICATION_PERIOD;
	delete hooks.SCHOOL_SRC_NOT_ACTTIVE_APPLICATION_PERIOD;
	delete hooks.SUBWAY_STA_SRC;
	delete hooks.SUBWAY_LINE_SRC;
	delete hooks.LOCATION_MGR.controls;
	delete hooks.LOCATION_MGR;
	delete hooks.MOCK_DIRECTIONS;
	delete hooks.MOCK_POPUP;
	delete hooks.MOCK_FORM;
	delete hooks.TEST_APP_ACTTIVE_APPLICATION_PERIOD;
	delete hooks.TEST_APP_NOT_ACTTIVE_APPLICATION_PERIOD
	
	var div = hooks.TEST_MAP.getTarget();
	delete hooks.TEST_MAP;
	$(div).remove();
};