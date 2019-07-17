QUnit.module('pka.fieldAccess', {
	beforeEach: function(assert){
		setup(assert, this);
		
		this.validateFeatureProperties = function(schoolSrc, done){
			$.each(schoolSrc.getFeatures(), function(_, feature){
				var props = feature.getProperties();
				assert.equal(props.fid, props.LOCCODE);
				assert.equal(props.loccode4, props.fid.substr(props.fid.length - 4));
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
				assert.equal(props.start_time, props.START_TIME ? props.START_TIME : feature.message('contact_start'));
				if (props.EARLY_DROP == '1'){
					assert.equal(props.early_drop, feature.message('yes'));			
				}else if (props.EARLY_DROP == '0'){
					assert.equal(props.early_drop, feature.message('no'));
				}else{
					assert.equal(props.early_drop, feature.message('contact_extend'));	
				}
				assert.equal(props.early, feature.message('early_drop_off', props));
				if (props.LATE_PICKUP == '1'){
					assert.equal(props.late_pickup, feature.message('yes'));			
				}else if (props.LATE_PICKUP == '0'){
					assert.equal(props.late_pickup, feature.message('no'));
				}else{
					assert.equal(props.late_pickup, feature.message('contact_extend'));	
				}
				assert.equal(props.late, feature.message('late_pick_up', props));
				assert.equal(props.school_year, feature.message('school_year'));
				assert.equal(props.day_length, feature.day_length[props.DAY_LENGTH]);
				assert.equal(props.full_day, $.inArray(props.DAY_LENGTH * 1, feature.full_day) > -1);
				assert.equal(props.apply_url, feature.apply_url);
				assert.equal(props.can_apply, feature.applicationPeriod.isActive() && props.BUTTON_TYPE.toLowerCase() == 'apply' ? '1' : '');
				assert.equal(props.btn_apply, feature.message('btn_apply'));
				assert.equal(props.search_label, feature.message('search_label', props)); 	
				assert.equal(props.btn_pdf, feature.message('btn_pdf'));	
				assert.equal(props.pdf_url, feature.message('quality_pdf', props));	
				
				if (props['EL_SEATS'] > 0 && !props['3K_SEATS'] && !props.PREK_SEATS){
					assert.equal(props.prek3, 'el');
				}else if (props['EL_SEATS'] > 0 && props['3K_SEATS'] > 0 && !props.PREK_SEATS){
					assert.equal(props.prek3, 'el-3k');
				}else if (props['EL_SEATS'] > 0 && props['3K_SEATS'] > 0 && props.PREK_SEATS > 0){
					assert.equal(props.prek3, 'el-3k-pk');
				}else if (props['EL_SEATS'] > 0 && !props['3K_SEATS'] && props.PREK_SEATS > 0){
					assert.equal(props.prek3, 'el-pk');
				}else if (!props['EL_SEATS'] && props['3K_SEATS'] > 0 && !props.PREK_SEATS){
					assert.equal(props.prek3, '3k');
				}else if (!props['EL_SEATS'] && !props['3K_SEATS'] && props.PREK_SEATS > 0){
					assert.equal(props.prek3, 'pk');
				}else if (!props['EL_SEATS'] && props['3K_SEATS'] > 0 && props.PREK_SEATS > 0){
					assert.equal(props.prek3, '3k-pk');
				}
				
			});
			done();
		};
	},
	afterEach: function(assert){
		teardown(assert, this);
	}
});

QUnit.test('nyc.ol.source.Decorating.AUTO_EXEC (active application period)', function(assert){
	assert.expect(112);

	var done = assert.async();
	var validateFeatureProperties = this.validateFeatureProperties;
	
	var schoolSrc = this.SCHOOL_SRC_ACTTIVE_APPLICATION_PERIOD;

	schoolSrc.on(nyc.ol.source.Decorating.LoaderEventType.FEATURESLOADED, function(){
		validateFeatureProperties(schoolSrc, done);
	});	
});

QUnit.test('nyc.ol.source.Decorating.AUTO_EXEC (no active application period)', function(assert){
	assert.expect(112);

	var done = assert.async();
	var validateFeatureProperties = this.validateFeatureProperties;
		
	var schoolSrc = this.SCHOOL_SRC_NOT_ACTTIVE_APPLICATION_PERIOD;

	schoolSrc.on(nyc.ol.source.Decorating.LoaderEventType.FEATURESLOADED, function(){
		validateFeatureProperties(schoolSrc, done);
	});	
});

QUnit.test('getId', function(assert){
	assert.expect(8);
	
	var done = assert.async();

	var schoolSrc = this.SCHOOL_SRC_NOT_ACTTIVE_APPLICATION_PERIOD;

	schoolSrc.on(nyc.ol.source.Decorating.LoaderEventType.FEATURESLOADED, function(){
		assert.equal(schoolSrc.getFeatures()[0].getId(), '15K001');
		assert.equal(schoolSrc.getFeatures()[1].getId(), '13K003');
		assert.equal(schoolSrc.getFeatures()[2].getId(), '16K005');
		assert.equal(schoolSrc.getFeatures()[3].getId(), '07XBBK');
		assert.equal(schoolSrc.getFeatureById('15K001').getId(), '15K001');
		assert.equal(schoolSrc.getFeatureById('13K003').getId(), '13K003');
		assert.equal(schoolSrc.getFeatureById('16K005').getId(), '16K005');
		assert.equal(schoolSrc.getFeatureById('07XBBK').getId(), '07XBBK');
		done();
	});	
	
});

QUnit.test('getType', function(assert){
	assert.expect(4);
	
	var done = assert.async();

	var schoolSrc = this.SCHOOL_SRC_NOT_ACTTIVE_APPLICATION_PERIOD;	
	
	schoolSrc.on(nyc.ol.source.Decorating.LoaderEventType.FEATURESLOADED, function(){
		assert.equal(schoolSrc.getFeatureById('15K001').getType(), 'DOE');
		assert.equal(schoolSrc.getFeatureById('13K003').getType(), 'DOE');
		assert.equal(schoolSrc.getFeatureById('16K005').getType(), 'DOE');
		assert.equal(schoolSrc.getFeatureById('07XBBK').getType(), 'NYCEEC');
		done();
	});	
	
});

QUnit.test('setDistance/getDistance', function(assert){
	assert.expect(2);
	
	var done = assert.async();

	var schoolSrc =this.SCHOOL_SRC_NOT_ACTTIVE_APPLICATION_PERIOD;

	schoolSrc.on(nyc.ol.source.Decorating.LoaderEventType.FEATURESLOADED, function(){
		var feature = schoolSrc.getFeatureById('15K001');
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
		var feature1 = schoolSrc.getFeatureById('15K001');
		var feature2 = schoolSrc.getFeatureById('13K003');
		var feature3 = schoolSrc.getFeatureById('16K005');
		
		feature1.set('ENHANCED_LANG', '100;101;123');
		feature2.set('ENHANCED_LANG', '');
		feature3.set('ENHANCED_LANG', '102;202;209');		
		
		assert.equal(feature1.getLangContent('info'), '<div><b>Dual Language:</b> Arabic</div><div><b>Dual Language:</b> Bengali</div><div><b>Dual Language:</b> Vietnamese</div>');
		assert.equal(feature2.getLangContent('info'), '');
		assert.equal(feature3.getLangContent('info'), '<div><b>Dual Language:</b> Chinese</div><div><b>Enhanced Language Support:</b> Chinese</div><div><b>Enhanced Language Support:</b> Spanish</div>');
		
		assert.equal(feature1.getLangContent('vcard'), 'Dual Language: Arabic\n\nDual Language: Bengali\n\nDual Language: Vietnamese\n\n');
		assert.equal(feature2.getLangContent('vcard'), '');
		assert.equal(feature3.getLangContent('vcard'), 'Dual Language: Chinese\n\nEnhanced Language Support: Chinese\n\nEnhanced Language Support: Spanish\n\n');
		done();
	});	
	
});

QUnit.test('getJcardJson', function(assert){
	assert.expect(1);
	
	var done = assert.async();

	var schoolSrc = this.SCHOOL_SRC_NOT_ACTTIVE_APPLICATION_PERIOD;

	schoolSrc.on(nyc.ol.source.Decorating.LoaderEventType.FEATURESLOADED, function(){
		assert.equal(schoolSrc.getFeatureById('15K001').getJcardJson(), '["vcard",[["version",{},"text","4.0"],["org",{},"text","P.S. 1 The Bergen"],["adr",{"type":"work","label":"309 47th Street\\nBrooklyn, NY 11220\\nU.S.A."},"text",["309 47th Street","Brooklyn","","NY","11220","U.S.A."]],["email",{"type":"work"},"text","aramos4@schools.nyc.gov"],["tel",{},"uri","+1-718-567-7661"],["url",{"type":"work"},"uri","http://schools.nyc.gov/schoolportals/15/k001"],["tz",{},"utc-offset","-5:00"],["geo",{},"uri","geo:40.64915151241655,-74.01176609170993"],["note",{},"text","\\nProgram Code: 15K001\\n\\nProgram Features:\\n\\n\\tBreakfast/Lunch\\n\\tIndoor/Outdoor (onsite) playspace\\n\\tDaily Start Time: Contact program about start time\\n\\tEarly Drop Off Available: No\\n\\tLate Pick Up Available: No\\n\\n2015-16 Pre-K Seats: 138 Full day\\n\\nDual Language: Spanish\\n\\n\\n\\nhttp://maps.nyc.gov/pka/?fid=15K001#map-page"],["fn",{},"text","P.S. 1 The Bergen"]]]');
		done();
	});	
	
});
