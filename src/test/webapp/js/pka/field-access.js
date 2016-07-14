QUnit.module('pka.fieldAccess', {
	beforeEach: function(assert){
		setup(assert, this);
		
		this.validateFeatureProperties = function(schoolSrc, done){
			$.each(schoolSrc.getFeatures(), function(_, feature){
				var props = feature.getProperties();
				assert.equal(props.address_1, props.ADDRESS);
				assert.equal(props.city, feature.borough[props.BOROUGH]);
				assert.equal(props.address_2, props.city + ', NY ' + props.ZIP);
				assert.equal(props.address, props.address_1 + ', ' + props.address_2);
				assert.equal(props.phone, encodeURIComponent(props.PHONE));
				assert.equal(props.meals, feature.meals[props.MEALS]);
				assert.equal(props.in_out, feature.indoor_outdoor[props.INDOOR_OUTDOOR]);
				assert.equal(props.flex, props.FLEX_SCHED == '1' ? feature.message('flex_sched') : '');
				assert.equal(props.sped, props.SPED_FLG == '1' ? feature.message('sped_flg') : '');
				assert.equal(props.income, props.INCOME_FLG == '1' ? feature.message('income_flg') : '');
				assert.equal(props.lang, props.ENHANCED_LANG != '0' ? '1' : '');
				assert.equal(props.start, feature.message('start_time', props));
				assert.equal(props.early, feature.message('early_drop_off', props));
				assert.equal(props.late, feature.message('late_pick_up', props));
				assert.equal(props.extend, (props.EARLY_DROP.toLowerCase() != 'no' || props.LATE_PICKUP.toLowerCase() != 'no') ? '1' : '');
				assert.equal(props.school_year, feature.message('school_year'));
				assert.equal(props.day_length, feature.day_length[props.DAY_LENGTH]);
				assert.equal(props.full_day, $.inArray(props.DAY_LENGTH * 1, feature.full_day) > -1);
				assert.equal(props.apply_url, feature.apply_url);
				assert.equal(props.can_apply, feature.applicationPeriod.isActive() && props.BUTTON_TYPE.toLowerCase() == 'apply' ? '1' : '');
				assert.equal(props.btn_apply, feature.message('btn_apply'));
				assert.equal(props.search_label, feature.message('search_label', props)); 		
			});
			done();
		};
	},
	afterEach: function(assert){
		teardown(assert, this);
	}
});

QUnit.test('nyc.ol.source.Decorating.AUTO_EXEC (active application period)', function(assert){
	assert.expect(66);

	var done = assert.async();
	var validateFeatureProperties = this.validateFeatureProperties;
	
	var schoolSrc = this.SCHOOL_SRC_ACTTIVE_APPLICATION_PERIOD;

	schoolSrc.on(nyc.ol.source.Decorating.LoaderEventType.FEATURESLOADED, function(){
		validateFeatureProperties(schoolSrc, done);
	});	
});

QUnit.test('nyc.ol.source.Decorating.AUTO_EXEC (no active application period)', function(assert){
	assert.expect(66);

	var done = assert.async();
	var validateFeatureProperties = this.validateFeatureProperties;
		
	var schoolSrc = this.SCHOOL_SRC_NOT_ACTTIVE_APPLICATION_PERIOD;

	schoolSrc.on(nyc.ol.source.Decorating.LoaderEventType.FEATURESLOADED, function(){
		validateFeatureProperties(schoolSrc, done);
	});	
});

QUnit.test('getId', function(assert){
	assert.expect(6);
	
	var done = assert.async();

	var schoolSrc = this.SCHOOL_SRC_NOT_ACTTIVE_APPLICATION_PERIOD;

	schoolSrc.on(nyc.ol.source.Decorating.LoaderEventType.FEATURESLOADED, function(){
		assert.equal(schoolSrc.getFeatures()[0].getId(), 'code1');
		assert.equal(schoolSrc.getFeatures()[1].getId(), 'code2');
		assert.equal(schoolSrc.getFeatures()[2].getId(), 'code3');
		assert.equal(schoolSrc.getFeatureById('code1').getId(), 'code1');
		assert.equal(schoolSrc.getFeatureById('code2').getId(), 'code2');
		assert.equal(schoolSrc.getFeatureById('code3').getId(), 'code3');
		done();
	});	
	
});

QUnit.test('getType', function(assert){
	assert.expect(3);
	
	var done = assert.async();

	var schoolSrc = this.SCHOOL_SRC_NOT_ACTTIVE_APPLICATION_PERIOD;

	schoolSrc.on(nyc.ol.source.Decorating.LoaderEventType.FEATURESLOADED, function(){
		assert.equal(schoolSrc.getFeatureById('code1').getType(), 'DOE');
		assert.equal(schoolSrc.getFeatureById('code2').getType(), 'CHARTER');
		assert.equal(schoolSrc.getFeatureById('code3').getType(), 'NYCEEC');
		done();
	});	
	
});

QUnit.test('setDistance/getDistance', function(assert){
	assert.expect(2);
	
	var done = assert.async();

	var schoolSrc =this.SCHOOL_SRC_NOT_ACTTIVE_APPLICATION_PERIOD;

	schoolSrc.on(nyc.ol.source.Decorating.LoaderEventType.FEATURESLOADED, function(){
		var feature = schoolSrc.getFeatureById('code1');
		assert.notOk(feature.getDistance());
		feature.setDistance(100);
		assert.equal(feature.getDistance(), 100);
		done();
	});	
	
});

QUnit.test('getLangContent', function(assert){
	assert.expect(6);
	
	var done = assert.async();

	var schoolSrc = this.SCHOOL_SRC_NOT_ACTTIVE_APPLICATION_PERIOD;

	schoolSrc.on(nyc.ol.source.Decorating.LoaderEventType.FEATURESLOADED, function(){
		var feature1 = schoolSrc.getFeatureById('code1');
		var feature2 = schoolSrc.getFeatureById('code2');
		var feature3 = schoolSrc.getFeatureById('code3');
		
		assert.equal(feature1.getLangContent('info'), '<div><b>Dual Language:</b> Spanish</div><div><b>Dual Language:</b> Greek</div><div><b>Dual Language:</b> Vietnamese</div><div><b>Enhanced Language Support:</b> Arabic</div><div><b>Enhanced Language Support:</b> Bengali</div><div><b>Enhanced Language Support:</b> French</div>');
		assert.equal(feature2.getLangContent('info'), '');
		assert.equal(feature3.getLangContent('info'), '<div><b>Dual Language:</b> Urdu</div>');
		
		assert.equal(feature1.getLangContent('vcard'), 'Dual Language: Spanish\n\nDual Language: Greek\n\nDual Language: Vietnamese\n\nEnhanced Language Support: Arabic\n\nEnhanced Language Support: Bengali\n\nEnhanced Language Support: French\n\n');
		assert.equal(feature2.getLangContent('vcard'), '');
		assert.equal(feature3.getLangContent('vcard'), 'Dual Language: Urdu\n\n');
		done();
	});	
	
});

QUnit.test('getJcardJson', function(assert){
	assert.expect(1);
	
	var done = assert.async();

	var schoolSrc = this.SCHOOL_SRC_NOT_ACTTIVE_APPLICATION_PERIOD;

	schoolSrc.on(nyc.ol.source.Decorating.LoaderEventType.FEATURESLOADED, function(){
		assert.equal(schoolSrc.getFeatureById('code1').getJcardJson(), '["vcard",[["version",{},"text","4.0"],["org",{},"text","P.S. 1 The Bergen"],["adr",{"type":"work","label":"309 47th St\\nBrooklyn, NY 11220\\nU.S.A."},"text",["309 47th St","Brooklyn","","NY","11220","U.S.A."]],["email",{"type":"work"},"text","aramos4@schools.nyc.gov"],["tel",{},"uri","+1-718-undefined"],["url",{"type":"work"},"uri","http://schools.nyc.gov/schoolportals/15/k001"],["tz",{},"utc-offset","-5:00"],["geo",{},"uri","geo:NaN,NaN"],["note",{},"text","\\nProgram Code: code1\\n\\nProgram Features:\\n\\n\\tBreakfast\\n\\tIndoor playspace\\n\\tDaily Start Time: 9:00 AM\\n\\tEarly Drop Off Available: no\\n\\tLate Pick Up Available: no\\n\\n2015-16 Seats: 125 Full day\\n\\nDual Language: Spanish\\n\\nDual Language: Greek\\n\\nDual Language: Vietnamese\\n\\nEnhanced Language Support: Arabic\\n\\nEnhanced Language Support: Bengali\\n\\nEnhanced Language Support: French\\n\\n\\n\\nhttp://maps.nyc.gov/pka/?fid=code1#map-page"],["fn",{},"text","P.S. 1 The Bergen"]]]');
		done();
	});	
	
});