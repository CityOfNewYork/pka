var pka = pka || {};

/**
 * @desc Class for managing interaction with the form for requesting a call from DOE
 * @public
 * @class
 * @constructor
 * @param {pka.ApplicationPeriod} applicationPeriod The application period
 * @param {nyc.Content} content Content for the UI
 * @param {Object<String, String>} languages Options for preferred languages
 */
pka.Form = function(applicationPeriod, content, languages){
	this.englishOnly = /^(?=.*[A-Z0-9])[\w.,!"'-@\/$ ]+$/i;
	this.content = content;
	this.languages = languages;
	this.dob = new nyc.DateField('#student-dob', 'studentDob', content.message('min_dob_year'), content.message('max_dob_year'));
	this.dialog = new nyc.Dialog();
	$('#birth-year').val(content.message('birth_year'));
	$('#start-year').val(content.message('start_year'));
	$('#form-note').html(content.message(applicationPeriod.isActive() ? 'form_msg_yes_apply' : 'form_msg_no_apply'));
	$('#student-dob-note').html(content.message('form_dob_msg'));
	$('#form-submit').click($.proxy(this.valid, this));
	$('#review-submit').click($.proxy(this.post, this));
	$('#form-page select').on("change", function(e){
		var target = e.target, inputs = $('#form-page form').find(':input');
		$(target).blur();
		if (target.id == 'language'){
			$('#form-submit').focus(10);
		}else{
			inputs.eq(inputs.index(target) + 1).focus(10);
		}
	});
	for (var code in languages) {
		var opt = $('<option class="notranslate" translate="no"></option>');
		opt.data('code', code);
		opt.attr('value', languages[code].val);
		opt.html(languages[code].desc);
		$('#language').append(opt);
	}
	$('#language').change(function(){
		var val = $('#language').val();
		$('#language-code').val('en');
		for (var code in languages) {
			if (val == languages[code].val){
				$('#language-code').val(code);
				break;
			}
		}
	});
};

pka.Form.prototype = {
	/**
	 * @private
	 * @member {pka.ApplicationPeriod}
	 */
	applicationPeriod: null,
	/**
	 * @private
	 * @member {nyc.Content}
	 */
	content: null,
	/**
	 * @private
	 * @member {nyc.DateField}
	 */
	dob: null,
	/**
	 * @private
	 * @member {boolean}
	 */
	submitting: false,
	/**
	 * @desc Reset the form
	 * @public
	 * @method
	 */
	reset: function(){
		$('#form-page form').get(0).reset();
		$('#language').selectmenu()
			.val(this.languages[nyc.lang.translate.lang() || 'en'].val) 
			.selectmenu('refresh');
	},
	/**
	 * @desc Form validation
	 * @public
	 * @method
	 * @return {boolean}
	 */
	valid: function(){
		var err = [], englishOnly = this.englishOnly;
		$('#form-page label, #form-page span').removeClass('err');
		if (!this.dob.val()){
			err.push(this.dob.selectMonth[0]);
			$('label[for="student-dob"]').addClass('err');
		}
		$.each($('#form-page input, #form-page select'), function(_, n){
			var val = $(n).val(), pattern = $(n).attr('pattern') || $(n).data('pattern'), valid = true;
			if ($(n).prop('required') || $(n).attr('required')){
				valid = val.length;
			}
			if (valid && val.length){
				valid = englishOnly.test(val);
			}
			if (valid && pattern){
				valid = new RegExp(pattern).test(val);
			}
			if (!valid && !$(n).prop('required') && $(n).attr('required') && !val.length){
				valid = true;
			}
			if (!valid){
				err.push(n);
				$('label[for="' + n.id + '"]').addClass('err');
			}
		});
		if (err.length){
			$(err[0]).focus();
			this.dialog.ok({
				message: this.content.message('form_invalid')
			});
		}else{
			this.review();
		}
		return false;
	},
	/**
	 * @private
	 * @method
	 * @param {boolean} yes
	 * @param {boolean} noreset
	 */
	again: function(yes, noreset){
		if (!yes){
			$('body').pagecontainer('change', '#map-page', {transition: 'slideup'});
		}else{
			if (!noreset){
				this.dob.reset();
				$($('.child input').val('').get(0)).focus();
			}
		}
	},
	/**
	 * @private
	 * @method
	 */
	retry: function(){
		this.again(true, true);
	},
	/**
	 * @private
	 * @method
	 */
	review: function(){
		var data = this.formData();
		for (var d in data){
			$('#review-' + d).html(data[d].toString());
		}
		$('#form-review').fadeIn();
		if ($('#form-review').height() > 320) $('#review-submit').focus(200);
	},
	/**
	 * @private
	 * @method
	 * @return {Object<string, string>}
	 */
	formData: function(){
		var result = {};
		$.each($('#form-page form').serializeArray(), function(_, input) {
			result[input.name] = input.value || '';
		});
		return result;
	},
	/**
	 * @private
	 * @method
	 */
	post: function(){
		var me = this;
		$('#form-processing').fadeIn(function(){
			$('#form-review').fadeOut();
		});
		$.ajax({
			url: '/pka-form/',
			data: this.formData(),
			type: 'POST',
			success: function(){
				$('#form-processing').fadeOut(function(){
					me.dialog.yesNo({
						message: me.content.message('form_another'),
						callback: $.proxy(me.again, me)
					});
				});
			},
			error: function(){
				$('#form-processing').fadeOut(function(){
					me.dialog.ok({
						message: me.content.message('form_error'),
						callback: $.proxy(me.retry, me)
					});
				});
			}
		});
	}
};
