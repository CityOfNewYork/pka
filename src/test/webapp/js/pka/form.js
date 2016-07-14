QUnit.module('pka.Form', {
	beforeEach: function(assert){
		setup(assert, this);
		nyc.lang = {code: null, lang: function(){return this.code;}};
		this.FORM = new pka.Form(this.APPLICATION_PERIOD_ACTIVE, this.SCHOOL_CONTENT, pka.lookup.languages);
		this.FORM.reset();
	},
	afterEach: function(assert){
		teardown(assert, this);
		$('.dia').remove();
		delete nyc.lang;
		delete this.FORM;
	}
});

QUnit.test('constructor (active application period)', function(assert){
	assert.expect(4);
	assert.equal(this.FORM.dob.minYear, this.SCHOOL_CONTENT.message('min_dob_year'));
	assert.equal(this.FORM.dob.maxYear, this.SCHOOL_CONTENT.message('max_dob_year'));
	assert.equal($('#form-note').html(), this.SCHOOL_CONTENT.message('form_msg_no_apply'));
	assert.equal($('#student-dob-note').html(), this.SCHOOL_CONTENT.message('form_dob_msg'));
});

QUnit.test('constructor (not active application period)', function(assert){
	assert.expect(4);
	var form = new pka.Form(this.APPLICATION_PERIOD_NOT_ACTIVE, this.SCHOOL_CONTENT);
	assert.equal(form.dob.minYear, this.SCHOOL_CONTENT.message('min_dob_year'));
	assert.equal(form.dob.maxYear, this.SCHOOL_CONTENT.message('max_dob_year'));
	assert.equal($('#form-note').html(), this.SCHOOL_CONTENT.message('form_msg_yes_apply'));
	assert.equal($('#student-dob-note').html(), this.SCHOOL_CONTENT.message('form_dob_msg'));
});

QUnit.test('valid (all valid)', function(assert){
	assert.expect(2);
	this.FORM.review = function(){
		assert.ok(true);
	};
	this.FORM.dob.val = function(){return '03/03/2016';};
	assert.notOk(this.FORM.valid());
	$('#house-number').val('59');
	$('#street-name').val('Maiden Ln');
	$('#borough').val('Manhattan');
	$('#zip-code').val('10038');
	$('#parent-first-name').val('First');
	$('#parent-last-name').val('Last');
	$('#relationship').val('Mother');
	$('#day-telephone').val('5555555555');
	$('#evening-telephone').val('5555555555');
	$('#email').val('me@email.com');
	this.FORM.valid();
});

QUnit.test('valid (all null)', function(assert){
	assert.expect(12);
	assert.notOk(this.FORM.valid());
	assert.ok($('#form-page label[for="student-dob"]').hasClass('err'));
	$.each($('#form-page input, #form-page select'), function(_, n){
		if ($(n).prop('required') || $(n).attr('required')){
			assert.ok($('label[for="' + n.id + '"]').hasClass('err'));												
		}
	});
});

QUnit.test('valid (borough)', function(assert){
	assert.expect(4);
	assert.notOk(this.FORM.valid());
	assert.ok($('#form-page label[for="borough"]').hasClass('err'));
	$('#borough').val('Manhattan');
	assert.notOk(this.FORM.valid());
	assert.notOk($('#form-page label[for="borough"]').hasClass('err'));
});

QUnit.test('valid (relationship)', function(assert){
	assert.expect(4);
	assert.notOk(this.FORM.valid());
	assert.ok($('#form-page label[for="relationship"]').hasClass('err'));
	$('#relationship').val('Mother');
	assert.notOk(this.FORM.valid());
	assert.notOk($('#form-page label[for="relationship"]').hasClass('err'));
});

QUnit.test('valid (zip-code)', function(assert){
	assert.expect(8);
	assert.notOk(this.FORM.valid());
	assert.ok($('#form-page label[for="zip-code"]').hasClass('err'));
	$('#zip-code').val('12345');
	assert.notOk(this.FORM.valid());
	assert.notOk($('#form-page label[for="zip-code"]').hasClass('err'));
	$('#zip-code').val('1234');
	assert.notOk(this.FORM.valid());
	assert.ok($('#form-page label[for="zip-code"]').hasClass('err'));
	$('#zip-code').val('1234a');
	assert.notOk(this.FORM.valid());
	assert.ok($('#form-page label[for="zip-code"]').hasClass('err'));
});

QUnit.test('valid (day-telephone)', function(assert){
	assert.expect(8);
	assert.notOk(this.FORM.valid());
	assert.ok($('#form-page label[for="day-telephone"]').hasClass('err'));
	$('#day-telephone').val('1234567890');
	assert.notOk(this.FORM.valid());
	assert.notOk($('#form-page label[for="day-telephone"]').hasClass('err'));
	$('#day-telephone').val('123456789');
	assert.notOk(this.FORM.valid());
	assert.ok($('#form-page label[for="day-telephone"]').hasClass('err'));
	$('#day-telephone').val('123456789a');
	assert.notOk(this.FORM.valid());
	assert.ok($('#form-page label[for="day-telephone"]').hasClass('err'));
});

QUnit.test('valid (evening-telephone)', function(assert){
	assert.expect(8);
	assert.notOk(this.FORM.valid());
	assert.ok($('#form-page label[for="evening-telephone"]').hasClass('err'));
	$('#evening-telephone').val('1234567890');
	assert.notOk(this.FORM.valid());
	assert.notOk($('#form-page label[for="evening-telephone"]').hasClass('err'));
	$('#evening-telephone').val('123456789');
	assert.notOk(this.FORM.valid());
	assert.ok($('#form-page label[for="evening-telephone"]').hasClass('err'));
	$('#evening-telephone').val('123456789a');
	assert.notOk(this.FORM.valid());
	assert.ok($('#form-page label[for="evening-telephone"]').hasClass('err'));
});

QUnit.test('valid (email)', function(assert){
	assert.expect(8);
	assert.notOk(this.FORM.valid());
	assert.ok($('#form-page label[for="email"]').hasClass('err'));
	$('#email').val('me@email.com');
	assert.notOk(this.FORM.valid());
	assert.notOk($('#form-page label[for="email"]').hasClass('err'));
	$('#email').val('me@email');
	assert.notOk(this.FORM.valid());
	assert.ok($('#form-page label[for="email"]').hasClass('err'));
	$('#email').val('email.com');
	assert.notOk(this.FORM.valid());
	assert.ok($('#form-page label[for="email"]').hasClass('err'));
});

QUnit.test('again (yes, no reset)', function(assert){
	assert.expect(4);
	this.FORM.dob.reset = function(){
		assert.ok(true);
	};
	$('.child input').each(function(){
		$(this).val('something');
	});
	this.FORM.again(true);
	assert.ok($($('.child input').get(0)).is(':focus'));
	$('.child input').each(function(){
		assert.equal($(this).val(), '')
	});
});

QUnit.test('again (yes, yes reset)', function(assert){
	assert.expect(3);
	this.FORM.dob.reset = function(){
		assert.ok(false);
	};
	$('.child input').each(function(){
		$(this).val('something');
	});
	this.FORM.again(true, true);
	assert.notOk($($('.child input').get(0)).is(':focus'));
	$('.child input').each(function(){
		assert.equal($(this).val(), 'something')
	});
});

QUnit.test('again (no)', function(assert){
	assert.expect(1);
	$('body').pagecontainer({
		beforechange: function(event, ui){
		  assert.equal(ui.toPage, '#map-page');
	  }
	});	
	this.FORM.again();
});

QUnit.test('review', function(assert){
	assert.expect(16);
	$('input[name="studentDob"]').val('03/03/2016');
	$('#student-first-name').val('StudentFirst');
	$('#student-last-name').val('StudentLast');
	$('#house-number').val('59');
	$('#street-name').val('Maiden Ln');
	$('#apt').val('1A');
	$('#borough').val('Manhattan');
	$('#zip-code').val('10038');
	$('#parent-first-name').val('ParentFirst');
	$('#parent-last-name').val('ParentLast');
	$('#relationship').val('Mother');
	$('#day-telephone').val('5555555555');
	$('#evening-telephone').val('1111111111');
	$('#email').val('me@email.com');
	this.FORM.review();
	assert.equal($('#review-studentDob').html(), '03/03/2016');
	assert.equal($('#review-studentFirstName').html(), $('#student-first-name').val());
	assert.equal($('#review-studentLastName').html(), $('#student-last-name').val());
	assert.equal($('#review-borough').html(), $('#borough').val());
	assert.equal($('#review-houseNumber').html(), $('#house-number').val());
	assert.equal($('#review-streetName').html(), $('#street-name').val());
	assert.equal($('#review-apt').html(), $('#apt').val());
	assert.equal($('#review-borough').html(), $('#borough').val());
	assert.equal($('#review-zipCode').html(), $('#zip-code').val());
	assert.equal($('#review-parentFirstName').html(), $('#parent-first-name').val());
	assert.equal($('#review-parentLastName').html(), $('#parent-last-name').val());
	assert.equal($('#review-relationship').html(), $('#relationship').val());
	assert.equal($('#review-dayPhone').html(), $('#day-telephone').val());
	assert.equal($('#review-eveningPhone').html(), $('#evening-telephone').val());
	assert.equal($('#review-email').html(), $('#email').val());
	assert.equal($('#review-language').html(), $('#language').val());
});

QUnit.test('post (success)', function(assert){
	assert.expect(7);
	
	var done = assert.async();
	var form = this.FORM;

	var ajax = $.ajax;
	$.ajax = function(args){
		assert.equal(args.url, '/pka-form/');
		assert.equal(args.type, 'POST');
		assert.deepEqual(args.data, {
			studentFirstName: 'StudentFirst',
			studentLastName: 'StudentLast',
			studentDob: '03/03/2016',
			houseNumber: '59',
			streetName: 'Maiden Ln',
			apt: '1A',
			borough: 'Manhattan',
			zipCode: '10038',
			parentFirstName: 'ParentFirst',
			parentLastName: 'ParentLast',
			relationship: 'Mother',
			dayPhone: '5555555555',
			eveningPhone: '1111111111',
			email: 'me@email.com',
			language: 'Spanish',
			languageCode: 'es'
		});
		setTimeout(function(){
			assert.equal($('#form-processing').css('display'), 'block');
			args.success();
			setTimeout(function(){
				assert.equal($('#form-processing').css('display'), 'none');
				done();
			}, 1000);
		}, 1000);
	};

	form.dialog.yesNo = function(args){
		assert.equal(args.message, form.content.message('form_another'));
		assert.equal(args.callback.toString(), $.proxy(form.again).toString());
	};
	
	$('input[name="studentDob"]').val('03/03/2016');
	$('#student-first-name').val('StudentFirst');
	$('#student-last-name').val('StudentLast');
	$('#house-number').val('59');
	$('#street-name').val('Maiden Ln');
	$('#apt').val('1A');
	$('#borough').val('Manhattan');
	$('#zip-code').val('10038');
	$('#parent-first-name').val('ParentFirst');
	$('#parent-last-name').val('ParentLast');
	$('#relationship').val('Mother');
	$('#day-telephone').val('5555555555');
	$('#evening-telephone').val('1111111111');
	$('#email').val('me@email.com');
	$('#language').val('Spanish').trigger('change');
	form.post();
	
	$.ajax = ajax;
});