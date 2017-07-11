QUnit.module('nyc.fieldAccess', {
	beforeEach: function(assert){
		setup(assert, this);
	},
	afterEach: function(assert){
		teardown(assert, this);
	}
});

QUnit.test('getCoordinates', function(assert){
	assert.expect(6);

	var done = assert.async();
	var validateFeatureProperties = this.validateFeatureProperties;
		
	var app = this.TEST_APP_NOT_ACTTIVE_APPLICATION_PERIOD();

	var schoolSrc = this.SCHOOL_SRC_NOT_ACTTIVE_APPLICATION_PERIOD;

	schoolSrc.on(nyc.ol.source.Decorating.LoaderEventType.FEATURESLOADED, function(){
		assert.equal(schoolSrc.getFeatureById('15K001').getCoordinates()[0].toFixed(0), "-8238952");
		assert.equal(schoolSrc.getFeatureById('15K001').getCoordinates()[1].toFixed(0), "4960729");
		assert.equal(schoolSrc.getFeatureById('13K003').getCoordinates()[0].toFixed(0), "-8232684");
		assert.equal(schoolSrc.getFeatureById('13K003').getCoordinates()[1].toFixed(0), "4965611");
		assert.equal(schoolSrc.getFeatureById('16K005').getCoordinates()[0].toFixed(0), "-8229003");
		assert.equal(schoolSrc.getFeatureById('16K005').getCoordinates()[1].toFixed(0), "4966063");
		delete app;
		done();
	});	
});

QUnit.test('getName', function(assert){
	assert.expect(3);

	var done = assert.async();
	var validateFeatureProperties = this.validateFeatureProperties;
	
	var schoolSrc = this.SCHOOL_SRC_NOT_ACTTIVE_APPLICATION_PERIOD;

	schoolSrc.on(nyc.ol.source.Decorating.LoaderEventType.FEATURESLOADED, function(){
		assert.equal(schoolSrc.getFeatureById('15K001').getName(), 'P.S. 1 The Bergen');
		assert.equal(schoolSrc.getFeatureById('13K003').getName(), 'P.S. 3 The Bedford Village');
		assert.equal(schoolSrc.getFeatureById('16K005').getName(), 'P.S. 5 Dr. Ronald Mcnair');
		done();
	});	
});

