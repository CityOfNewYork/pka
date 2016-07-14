QUnit.module('ta.htmlRenderer', {
	beforeEach: function(assert){
		setup(assert, this);
	},
	afterEach: function(assert){
		teardown(assert, this);
	}
});

QUnit.test('html', function(assert){
	assert.expect(2);

	var done = assert.async();
	
	var stationSrc = this.SUBWAY_STA_SRC;

	stationSrc.on(nyc.ol.source.Decorating.LoaderEventType.FEATURESLOADED, function(){
		
		var div1 = $('<div></div>');
		div1.append(stationSrc.getFeatureById(1).html());
		
		var div2 = $('<div></div>');
		div2.append(stationSrc.getFeatureById(123).html());

		assert.equal(div1.html(), '<div class="subway-info"><div class="inf-name notranslate" translate="no">Canal St</div><div class="icons notranslate" translate="no" "=""><div class="subway-icon subway-4 "><div>4</div></div><div class="subway-icon subway-6 "><div>6</div></div><div class="subway-icon subway-6 express"><div>6</div></div></div><div class="note">4 nights, 6-all times, 6 Express-weekdays AM southbound, PM northbound</div></div>');
		assert.equal(div2.html(), '<div class="subway-info"><div class="inf-name notranslate" translate="no">Aqueduct Racetrack</div><div class="icons notranslate" translate="no" "=""><div class="subway-icon subway-A "><div>A</div></div></div><div class="note">A-to Manhattan only, racing days only</div></div>');
		
		done();
		
	});
});