QUnit.module('nyc.app', {
	beforeEach: function(assert){
		setup(assert, this);
		this.proto = nyc.App.prototype;
		this.open = window.open;
	},
	afterEach: function(assert){
		teardown(assert, this);
		nyc.App.prototype = this.proto;
		window.open  = this.open;
	}
});

QUnit.test('constructor', function(assert){
	assert.expect(3);
	
	var done = assert.async();
	
	var schoolSrc = this.SCHOOL_SRC_ACTTIVE_APPLICATION_PERIOD;
	var locationMgr = this.LOCATION_MGR;
	var applicationPeriod = this.APPLICATION_PERIOD_ACTIVE;
	
	var app;

	var filterDisplay = nyc.App.prototype.filterDisplay;
	var ready = nyc.App.prototype.ready;
	var checkUrl = nyc.App.prototype.checkUrl;
	
	nyc.App.prototype.filterDisplay = function(applPeriod){
		assert.deepEqual(applPeriod, applicationPeriod);
	};
		
	nyc.App.prototype.ready = function(){
		assert.ok(true);
		delete app;
		done();
	};

	nyc.App.prototype.checkUrl = function(){
		assert.ok(true);
	};

	app = this.TEST_APP_ACTTIVE_APPLICATION_PERIOD();
	
	nyc.App.prototype.filterDisplay = filterDisplay;
	nyc.App.prototype.ready = ready;
	nyc.App.prototype.checkUrl = checkUrl;

});

QUnit.test('schoolVcard', function(assert){
	assert.expect(1);
	
	var done = assert.async();
	
	var schoolSrc = this.SCHOOL_SRC_ACTTIVE_APPLICATION_PERIOD;
	var app = this.TEST_APP_ACTTIVE_APPLICATION_PERIOD();

	window.open = function(url){
		assert.equal(url, '/vcard/?jcard=jcard+json');
		delete app;
		done();
	};

	schoolSrc.on(nyc.ol.source.Decorating.LoaderEventType.FEATURESLOADED, function(){
		var feature = schoolSrc.getFeatureById('code1');
		feature.getJcardJson = function(){
			return 'jcard json';
		};
		app.schoolVcard('code1');
	});
	
});

QUnit.test('hotline', function(assert){
	assert.expect(3);
		
	var app = this.TEST_APP_ACTTIVE_APPLICATION_PERIOD();

	assert.notOk(app.hotlineDiag);
	
	app.hotline();

	assert.ok(app.hotlineDiag);
	assert.equal($('.dia').html(), '<div class="dia-msg"></div><div class="ui-input-text ui-body-inherit ui-corner-all ui-shadow-inset"><input class="dia-input"></div><div class="ui-input-text ui-body-inherit ui-corner-all ui-shadow-inset"><input class="dia-login dia-user" placeholder="Enter user name"></div><div class="ui-input-text ui-body-inherit ui-corner-all ui-shadow-inset"><input class="dia-login dia-pw" type="password" placeholder="Enter password"></div><div class="dia-btns"><a class="btn-ok ui-link ui-btn ui-shadow ui-corner-all" data-role="button" role="button">OK</a><a class="btn-yes ui-link ui-btn ui-shadow ui-corner-all" data-role="button" role="button">Yes</a><a class="btn-no ui-link ui-btn ui-shadow ui-corner-all" data-role="button" role="button">No</a><a class="btn-submit ui-link ui-btn ui-shadow ui-corner-all" data-role="button" role="button">OK</a><a class="btn-cancel ui-link ui-btn ui-shadow ui-corner-all" data-role="button" role="button">Cancel</a></div>');
	
	delete app;
	$('.dia').remove();
});

QUnit.test('goToSchool (not fullscreen, has good fid, panel not full width)', function(assert){
	assert.expect(4);
	
	var done = assert.async();
	
	var expectedCoordinates, expectedHtml;
	
	var app;
	
	nyc.App.prototype.showPopup = function(coordinates, html){
		var div = $('<div></div>');
		div.append(html);
		assert.deepEqual(coordinates, expectedCoordinates);
		assert.equal(div.html(), expectedHtml);
		delete app;
		done();
	};
	
	app = this.TEST_APP_ACTTIVE_APPLICATION_PERIOD();
	var schoolSrc = app.schoolSrc;

	app.view.animate = function(args){
		assert.equal(args.zoom, app.locationMgr.locator.zoom);
		assert.deepEqual(args.center, expectedCoordinates);
	};
	schoolSrc.on(nyc.ol.source.Decorating.LoaderEventType.FEATURESLOADED, function(){
		var feature = schoolSrc.getFeatureById('code1'), div = $('<div></div>');
		
		div.append(feature.html('inf-pop'));
		expectedCoordinates = feature.getCoordinates();
		expectedHtml = div.html();
		
		app.goToSchool('code1');
	});	
});

QUnit.test('goToSchool (not fullscreen, has good fid, panel is full width)', function(assert){
	assert.expect(5);
	
	var done = assert.async();
	
	$('body').append('<div id="panel"><div id="map-tab-btn"><a></a></div></div>');
	$('#panel').width($(window).width());
	
	$('#map-tab-btn a').click(function(){
		assert.ok(true);
	});

	var expectedCoordinates, expectedHtml;
	
	var app;
	
	nyc.App.prototype.showPopup = function(coordinates, html){
		var div = $('<div></div>');
		div.append(html);
		assert.deepEqual(coordinates, expectedCoordinates);
		assert.equal(div.html(), expectedHtml);
		done();
		delete app;		
		$('#panel').remove();
	};
		
	app = this.TEST_APP_ACTTIVE_APPLICATION_PERIOD();
	var schoolSrc = app.schoolSrc;

	app.view.animate = function(args){
		assert.equal(args.zoom, app.locationMgr.locator.zoom);
		assert.deepEqual(args.center, expectedCoordinates);
	};

	schoolSrc.on(nyc.ol.source.Decorating.LoaderEventType.FEATURESLOADED, function(){
		var feature = schoolSrc.getFeatureById('code1'), div = $('<div></div>');
		
		div.append(feature.html('inf-pop'));
		expectedCoordinates = feature.getCoordinates();
		expectedHtml = div.html();
		
		app.goToSchool('code1');
	});	
});

QUnit.test('goToSchool (not fullscreen, has no fid)', function(assert){
	assert.expect(2);
	
	var done = assert.async();
		
	nyc.App.prototype.showPopup = function(coordinates, html){
		assert.notOk(true);
	};
	
	var app = this.TEST_APP_ACTTIVE_APPLICATION_PERIOD();
	var schoolSrc = app.schoolSrc;

	schoolSrc.on(nyc.ol.source.Decorating.LoaderEventType.FEATURESLOADED, function(){
		var center = app.view.getCenter();
		var zoom = app.view.getZoom(); 
		
		app.goToSchool();

		setTimeout(function(){
			assert.equal(app.view.getZoom(), zoom);
			assert.deepEqual(app.view.getCenter(), center);
			delete app;		
			done();
		}, 1000);
	});	
});

QUnit.test('goToSchool (not fullscreen, has bad fid)', function(assert){
	assert.expect(2);
	
	var done = assert.async();
		
	nyc.App.prototype.showPopup = function(coordinates, html){
		assert.notOk(true);
	};
	
	var app = this.TEST_APP_ACTTIVE_APPLICATION_PERIOD();
	var schoolSrc = app.schoolSrc;

	schoolSrc.on(nyc.ol.source.Decorating.LoaderEventType.FEATURESLOADED, function(){
		var center = app.view.getCenter();
		var zoom = app.view.getZoom(); 
		
		app.goToSchool('bad');

		setTimeout(function(){
			assert.equal(app.view.getZoom(), zoom);
			assert.deepEqual(app.view.getCenter(), center);
			delete app;		
			done();
		}, 1000);
	});	
});

QUnit.test('goToSchool (is fullscreen)', function(assert){
	assert.expect(3);
	
	var done = assert.async();
		
	$('body').append('<div id="inf-full-screen"></div>');

	nyc.App.prototype.showPopup = function(coordinates, html){
		assert.notOk(true);
	};
	
	var app = this.TEST_APP_ACTTIVE_APPLICATION_PERIOD();
	var schoolSrc = app.schoolSrc;

	schoolSrc.on(nyc.ol.source.Decorating.LoaderEventType.FEATURESLOADED, function(){
		var center = app.view.getCenter();
		var zoom = app.view.getZoom(); 
		
		app.goToSchool('bad');

		setTimeout(function(){
			assert.equal(app.view.getZoom(), zoom);
			assert.deepEqual(app.view.getCenter(), center);
			assert.equal($('#inf-full-screen').css('display'), 'none');
			delete app;		
			done();
			$('#inf-full-screen').remove();
		}, 1000);
	});	
});

QUnit.test('schoolDetail (popup, is fullscreen)', function(assert){
	assert.expect(2);
	
	var done = assert.async();
		
	$('body').append('<div id="inf-pop-1"><div class="inf-detail" style="display:none"></div></div>');
	$(this.TEST_MAP.getTarget()).width($(window).width());
	
	var fullScreenDetail = nyc.App.prototype.fullScreenDetail;
	
	nyc.App.prototype.fullScreenDetail = function(id){
		assert.equal(id, 'inf-pop-1');
	};
	
	var app = this.TEST_APP_ACTTIVE_APPLICATION_PERIOD();
	app.isFullScreen = function(){return true;};
	
	app.schoolDetail('inf-pop-1');

	setTimeout(function(){
		assert.equal($('#inf-pop-1 .inf-detail').css('display'), 'none');
		delete app;		
		done();
		$('#inf-pop-1').remove();
		nyc.App.prototype.fullScreenDetail = fullScreenDetail;
	}, 1000);
});

QUnit.test('schoolDetail (popup, not fullscreen)', function(assert){
	assert.expect(2);
	
	var done = assert.async();
	
	this.MOCK_POPUP.pan = function(){
		assert.ok(true);
	}
	
	$('body').append('<div id="inf-pop-1"><div class="inf-detail" style="display:none"></div></div>');
	
	var fullScreenDetail = nyc.App.prototype.fullScreenDetail;

	nyc.App.prototype.fullScreenDetail = function(id){
		assert.notOk(true);
	};
	
	var app = this.TEST_APP_ACTTIVE_APPLICATION_PERIOD();
	
	app.schoolDetail('inf-pop-1');

	setTimeout(function(){
		assert.equal($('#inf-pop-1 .inf-detail').css('display'), 'block');
		delete app;		
		done();
		$('#inf-pop-1').remove();
		nyc.App.prototype.fullScreenDetail = fullScreenDetail;
	}, 1000);
});

QUnit.test('direct', function(assert){
	assert.expect(3);
	
	var done = assert.async();
	
	var app = this.TEST_APP_ACTTIVE_APPLICATION_PERIOD();
	app.origin = function(){return 'user location';};
	app.directions = {
		directions: function(args){
			assert.equal(args.from, 'user location');
			assert.equal(args.to, '309 47th St, Brooklyn, NY 11220');
			assert.equal(args.facility, 'P.S. 1 The Bergen');
		}
	};
	
	var test = function(){
		if (app.schoolSrc.getFeatures() == 0){
			setTimeout(test, 500);
		}else{
			app.direct('code1'); //first time directions are generated (assertins are made above)
			app.direct('code1'); //second time no need to regenerated directions (assertins are not made)
			delete app;		
			done();
		}
	};
	
	test();
	
});

QUnit.test('fullScreenDetail', function(assert){
	assert.expect(3);
			
	$('body').append('<div id="inf-full-screen" style="display:none"><div></div></div>');

	var app = this.TEST_APP_ACTTIVE_APPLICATION_PERIOD();
	app.schoolSrc = {
		getFeatureById: function(id){
			assert.equal(id, 'code1');
			return {html: function(){return 'TEST_HTML';}}
		},
		sort: function(){return [];},
		getFeatures: function(){return [];}
	};
	
	app.fullScreenDetail('inf-popcode1');
	assert.equal($('#inf-full-screen div').html(), 'TEST_HTML');
	assert.equal($('#inf-full-screen').css('display'), 'block');

	delete app;		
	$('#inf-full-screen').remove();
});

QUnit.test('origin', function(assert){
	assert.expect(4);

	var app = this.TEST_APP_ACTTIVE_APPLICATION_PERIOD();
	assert.equal(app.origin(), '');
	
	app.location = {type: 'geolocation', coordinates: [-8237876.301139942, 4969241.81643751]};
	
	var p = app.origin();
	
	assert.equal(p[0].toFixed(7), 40.7071498);
	assert.equal(p[1].toFixed(7), -74.0021019);

	app.location = {type: 'geocode', name: '59 Maiden Lane, New York, NY 10038'};
	assert.deepEqual(app.origin(), '59 Maiden Lane, New York, NY 10038');
	
	delete app;		
});

QUnit.test('zoomChange', function(assert){
	assert.expect(18);

	var done = assert.async();
	
	var app = this.TEST_APP_ACTTIVE_APPLICATION_PERIOD();
	
	assert.notOk(app.districtLyr.get('added'));
	assert.notOk(app.subwayLineLyr.get('added'));
	assert.notOk(app.subwayStationLyr.get('added'));
	
	assert.equal($.inArray(app.districtLyr, app.map.getLayers().getArray()), -1);
	assert.equal($.inArray(app.subwayLineLyr, app.map.getLayers().getArray()), -1);
	assert.equal($.inArray(app.subwayStationLyr, app.map.getLayers().getArray()), -1);
	
	function secondTest(){
		assert.ok(app.districtLyr.get('added'));
		assert.ok(app.subwayLineLyr.get('added'));
		assert.ok(app.subwayStationLyr.get('added'));
		assert.ok($.inArray(app.districtLyr, app.map.getLayers().getArray()) > -1);
		assert.ok($.inArray(app.subwayLineLyr, app.map.getLayers().getArray()) > -1);
		assert.ok($.inArray(app.subwayStationLyr, app.map.getLayers().getArray()) > -1);
		done();
		delete app;			
	};
	
	function firstTest(){
		assert.notOk(app.districtLyr.get('added'));
		assert.notOk(app.subwayLineLyr.get('added'));
		assert.notOk(app.subwayStationLyr.get('added'));
		assert.equal($.inArray(app.districtLyr, app.map.getLayers().getArray()), -1);
		assert.equal($.inArray(app.subwayLineLyr, app.map.getLayers().getArray()), -1);
		assert.equal($.inArray(app.subwayStationLyr, app.map.getLayers().getArray()), -1);		
		app.view.once('change:resolution', secondTest);
		app.mapLoaded = true; 
		app.view.setZoom(13);
	};
	
	app.view.once('change:resolution', firstTest);
	
	app.view.setZoom(12);
	
});

QUnit.test('filter3k', function(assert){
	assert.expect(1);

	var app = this.TEST_APP_ACTTIVE_APPLICATION_PERIOD();

	app.filterControls[0].on('change', function(){
		assert.deepEqual(app.filterControls[0].val(), [{checked: true, label: '3-K (3 year olds)', name: 'prek3k', value: '3,b'}]);
	});
	
	app.filter3k();
	
	delete app;		
});
