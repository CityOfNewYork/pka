QUnit.module('ta.fieldAccess', {
	beforeEach: function(assert){
		setup(assert, this);
	},
	afterEach: function(assert){
		teardown(assert, this);
	}
});

QUnit.test('nyc.ol.source.Decorating.AUTO_EXEC', function(assert){
	assert.expect(470);

	var done = assert.async();
	
	var stationSrc = this.SUBWAY_STA_SRC;

	stationSrc.on(nyc.ol.source.Decorating.LoaderEventType.FEATURESLOADED, function(){
		$.each(stationSrc.getFeatures(), function(){
			assert.deepEqual(this.getProperties().lines, this.getLines()); 
		});
		done();
	});	
});

QUnit.test('getLines', function(assert){
	assert.expect(471);

	var done = assert.async();
	
	var stationSrc = this.SUBWAY_STA_SRC;

	stationSrc.on(nyc.ol.source.Decorating.LoaderEventType.FEATURESLOADED, function(){
		assert.deepEqual(
			stationSrc.getFeatureById(1).getLines(),
			[
              {line: '4', express: ''}, 
              {line: '6', express: ''}, 
              {line: '6', express: 'express'}
            ]
		);
		$.each(stationSrc.getFeatures(), function(){
			var lines = [];
			$.each(this.get('LINE').split('-'), function(_, name){
				var parts = name.split(' ');
				lines.push({
					line: parts[0],
					express: parts.length == 2 ? 'express' :  ''
				});
			});
			assert.deepEqual(this.getLines(), lines); 
		});
		done();
	});	
});

