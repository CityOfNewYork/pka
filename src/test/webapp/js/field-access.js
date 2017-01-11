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
		assert.equal(schoolSrc.getFeatureById('code1').getCoordinates()[0].toFixed(0), "980985");
		assert.equal(schoolSrc.getFeatureById('code1').getCoordinates()[1].toFixed(0), "175780");
		assert.equal(schoolSrc.getFeatureById('code2').getCoordinates()[0].toFixed(0), "996604");
		assert.equal(schoolSrc.getFeatureById('code2').getCoordinates()[1].toFixed(0), "187904");
		assert.equal(schoolSrc.getFeatureById('code3').getCoordinates()[0].toFixed(0), "1005773");
		assert.equal(schoolSrc.getFeatureById('code3').getCoordinates()[1].toFixed(0), "189031");
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
		assert.equal(schoolSrc.getFeatureById('code1').getName(), 'P.S. 1 The Bergen');
		assert.equal(schoolSrc.getFeatureById('code2').getName(), 'P.S. 3 The Bedford Village');
		assert.equal(schoolSrc.getFeatureById('code3').getName(), 'P.S. 5 Dr. Ronald Mcnair');
		done();
	});	
});
