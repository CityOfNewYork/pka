QUnit.module('pka.Splash', {
	beforeEach: function(assert){
		setup(assert, this);

		this.MOCK_SPLASH = $('<div class="mock-splash"><div class="splash-btns"><div id="lang" data-role="button"></div></div><div class="splash-msg"></div><div class="splash-btns"><a class="splash-call capitalize" data-role="button" data-page="#form-page"></a><a class="splash-apply capitalize" data-role="button" target="_blank"></a><button class="splash-map capitalize el" data-role="button" data-page="#map-page">continue to&nbsp;<span class="notranslate" translate="no">Early Learning 3s Finder</span>&nbsp;map</button><button class="splash-map capitalize 3k" data-role="button" data-page="#map-page">continue to&nbsp;<span class="notranslate" translate="no">3-K Finder</span>&nbsp;map</button><button class="splash-map capitalize prek" data-role="button" data-page="#map-page">continue to&nbsp;<span class="notranslate" translate="no">Pre-K Finder</span>&nbsp;map</button></div></div>');
		$('body').append(this.MOCK_SPLASH);
		
		this.MOCK_APP = {
			lastPageRequested: null,
			buttonsClicked: [],
			page: function(event){
				this.lastPageRequested = $(event.target).data('page');
			},
			checkEntryPoint: function(event){
				this.buttonsClicked.push(event.target);
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
	assert.expect(12);
	
	new pka.Splash(this.APPLICATION_PERIOD_ACTIVE, pka.lookup, this.SCHOOL_CONTENT, this.MOCK_APP);
	
	assert.equal($('.splash-msg').html(), this.SCHOOL_CONTENT.message('splash_msg_yes_apply'));
	assert.equal($('.splash-apply').html(), this.SCHOOL_CONTENT.message('btn_apply'));
	assert.equal($('.splash-apply').attr('href'), pka.lookup.apply_url);
	assert.equal($('.splash-apply').css('display'), 'inline');
	assert.equal($('.splash-call').css('display'), 'inline');
	
	$('button.el').trigger('click');
	assert.equal(this.MOCK_APP.lastPageRequested, '#map-page');
	assert.deepEqual(this.MOCK_APP.buttonsClicked, [$('button.el').get(0)]);

	$('button.3k').trigger('click');
	assert.equal(this.MOCK_APP.lastPageRequested, '#map-page');
	assert.deepEqual(this.MOCK_APP.buttonsClicked, [$('button.el').get(0), $('button.3k').get(0)]);

	$('button.prek').trigger('click');
	assert.equal(this.MOCK_APP.lastPageRequested, '#map-page');
	assert.deepEqual(this.MOCK_APP.buttonsClicked, [$('button.el').get(0), $('button.3k').get(0), $('button.prek').get(0)]);

	$('.splash-call').trigger('click');
	assert.equal(this.MOCK_APP.lastPageRequested, '#form-page');
});

QUnit.test('constructor (not active application period)', function(assert){
	assert.expect(6);
	
	new pka.Splash(this.APPLICATION_PERIOD_NOT_ACTIVE, pka.lookup, this.SCHOOL_CONTENT, this.MOCK_APP);
	
	assert.equal($('.splash-msg').html(), this.SCHOOL_CONTENT.message('splash_msg_no_apply'));
	assert.equal($('.splash-call').html(), this.SCHOOL_CONTENT.message('btn_call'));
	assert.equal($('.splash-apply').css('display'), 'none');
	assert.equal($('.splash-call').css('display'), 'inline');
	
	$('button.el').trigger('click');
	assert.equal(this.MOCK_APP.lastPageRequested, '#map-page');
	$('.splash-call').trigger('click');
	assert.equal(this.MOCK_APP.lastPageRequested, '#form-page');
});
