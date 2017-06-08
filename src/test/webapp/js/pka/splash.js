QUnit.module('pka.Splash', {
	beforeEach: function(assert){
		setup(assert, this);

		this.MOCK_SPLASH = $('<div class="mock-splash"><div class="splash-btns"><div id="lang" data-role="button"></div></div><div class="splash-msg"></div><div class="splash-btns capitalize"><a class="splash-call" data-role="button" data-page="#form-page"></a><a class="splash-apply" data-role="button" target="_blank"></a><a class="splash-map" data-role="button" data-page="#map-page"><span>continue to <span class="notranslate" translate="no"> Pre-K Finder </span> map</span></a><a class="splash-filters" data-role="button" data-page="#map-page"><span>Continue to <span class="notranslate" translate="no"> Pre-K Finder </span> Search Filters</span></a></div></div>');
		$('body').append(this.MOCK_SPLASH);
		
		this.MOCK_APP = {
			lastPageRequested: null,
			page: function(event){
				this.lastPageRequested = $(event.target).data('page');
			}
		};
	},
	afterEach: function(assert){
		teardown(assert, this);
		this.MOCK_SPLASH.remove();
		delete this.MOCK_APP;
		delete this.MOCK_SPLASH;
	}
});

QUnit.test('constructor (active application period)', function(assert){
	assert.expect(8);
	
	new pka.Splash(this.APPLICATION_PERIOD_ACTIVE, pka.lookup, this.SCHOOL_CONTENT, this.MOCK_APP);
	
	assert.equal($('.splash-msg').html(), this.SCHOOL_CONTENT.message('splash_msg_yes_apply'));
	assert.equal($('.splash-apply').html(), this.SCHOOL_CONTENT.message('btn_apply'));
	assert.equal($('.splash-apply').attr('href'), pka.lookup.apply_url);
	assert.equal($('.splash-apply').css('display'), 'inline');
	assert.equal($('.splash-call').css('display'), 'inline');
	
	$('.splash-map').trigger('click');
	assert.equal(this.MOCK_APP.lastPageRequested, '#map-page');
	$('.splash-call').trigger('click');
	assert.equal(this.MOCK_APP.lastPageRequested, '#form-page');
	$('.splash-filters').trigger('click');
	assert.equal(this.MOCK_APP.lastPageRequested, '#map-page');
});

QUnit.test('constructor (not active application period)', function(assert){
	assert.expect(7);
	
	new pka.Splash(this.APPLICATION_PERIOD_NOT_ACTIVE, pka.lookup, this.SCHOOL_CONTENT, this.MOCK_APP);
	
	assert.equal($('.splash-msg').html(), this.SCHOOL_CONTENT.message('splash_msg_no_apply'));
	assert.equal($('.splash-call').html(), this.SCHOOL_CONTENT.message('btn_call'));
	assert.equal($('.splash-apply').css('display'), 'none');
	assert.equal($('.splash-call').css('display'), 'inline');
	
	$('.splash-map').trigger('click');
	assert.equal(this.MOCK_APP.lastPageRequested, '#map-page');
	$('.splash-call').trigger('click');
	assert.equal(this.MOCK_APP.lastPageRequested, '#form-page');
	$('.splash-filters').trigger('click');
	assert.equal(this.MOCK_APP.lastPageRequested, '#map-page');
});

QUnit.test('constructor (3k URL)', function(assert){
	assert.expect(1);
	
	this.MOCK_APP.is3k = true;
	
	new pka.Splash(this.APPLICATION_PERIOD_NOT_ACTIVE, pka.lookup, this.SCHOOL_CONTENT, this.MOCK_APP);
	
	assert.equal($('.splash-filters span.notranslate').html(), ' 3-K Finder ');

});

QUnit.test('constructor (Not 3k URL)', function(assert){
	assert.expect(1);
	
	new pka.Splash(this.APPLICATION_PERIOD_NOT_ACTIVE, pka.lookup, this.SCHOOL_CONTENT, this.MOCK_APP);
	
	assert.equal($('.splash-filters span.notranslate').html(), ' Pre-K Finder ');

});