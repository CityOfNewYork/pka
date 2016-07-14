QUnit.module('nyc.fieldAccess', {
	beforeEach: function(assert){
		setup(assert, this);
	},
	afterEach: function(assert){
		teardown(assert, this);
	}
});

QUnit.test('getCoordinates', function(assert){
	assert.expect(3);

	var done = assert.async();
	var validateFeatureProperties = this.validateFeatureProperties;
		
	var schoolSrc = this.SCHOOL_SRC_NOT_ACTTIVE_APPLICATION_PERIOD;

	schoolSrc.on(nyc.ol.source.Decorating.LoaderEventType.FEATURESLOADED, function(){
		assert.deepEqual(schoolSrc.getFeatureById('code1').getCoordinates(), [980985.0000000003, 175779.9999999349]);
		assert.deepEqual(schoolSrc.getFeatureById('code2').getCoordinates(), [996604.000000001, 187903.99999993955]);
		assert.deepEqual(schoolSrc.getFeatureById('code3').getCoordinates(), [1005772.9999999997, 189030.999999948]);
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
