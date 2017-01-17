var pka = pka || {};

/**
 * @desc Functions used as decoration args for an instance of nyc.ol.source.FilteringAndSorting
 * @public 
 * @memberof pka
 * @static
 * @type {Object}
 */
pka.fieldAccess = {
	/**
	 * @private
	 * @member {nyc.jcard.Builder}
	 */
	jcardBuilder: new nyc.jcard.Builder(),
	/**
	 * @desc Automatically extend the properties of an ol.Feature
	 * @public 
	 * @static
	 * @method
	 */
	extendFeature: function(){
		var props = this.getProperties();
		this.setId(this.getId());
		props.fid = this.getId();
		props.loccode4 = props.fid.substr(props.fid.length - 4);
		props.address_1 = props.ADDRESS;
		props.city = this.borough[props.BOROUGH];
		props.address_2 = props.city + ', NY ' + props.ZIP;
		props.address = props.address_1 + ', ' + props.address_2;
		props.phone = encodeURIComponent(props.PHONE);
		props.meals = this.meals[props.MEALS];
		props.in_out = this.indoor_outdoor[props.INDOOR_OUTDOOR];
		props.flex = props.FLEX_SCHED == '1' ? this.message('flex_sched') : '';
		props.sped = props.SPED_FLG == '1' ? this.message('sped_flg') : '';
		props.income = props.INCOME_FLG == '1' ? this.message('income_flg') : '';
		props.lang = props.ENHANCED_LANG != '0' ? '1' : '';
		
		props.start_time = props.START_TIME ? props.START_TIME : this.message('contact_start');
		props.start = this.message('start_time', props);

		if (props.EARLY_DROP == '1'){
			props.early_drop = this.message('yes');			
		}else if (props.EARLY_DROP == '0'){
			props.early_drop = this.message('no');
		}else{
			props.early_drop = this.message('contact_extend');	
		}
		props.early = this.message('early_drop_off', props);
		
		
		if (props.LATE_PICKUP == '1'){
			props.late_pickup = this.message('yes');			
		}else if (props.LATE_PICKUP == '0'){
			props.late_pickup = this.message('no');
		}else{
			props.late_pickup = this.message('contact_extend');	
		}
		props.late = this.message('late_pick_up', props);
		
		props.extend = props.EARLY_DROP == '1' || props.LATE_PICKUP == '1' ? '1' : '';
		
		props.school_year = this.message('school_year');
		props.day_length = this.day_length[props.DAY_LENGTH];
		props.full_day = $.inArray(props.DAY_LENGTH * 1, this.full_day) > -1;
		props.apply_url = this.apply_url;
		props.can_apply = this.applicationPeriod.isActive() && props.BUTTON_TYPE.toLowerCase() == 'apply' ? '1' : '';
		props.btn_apply = this.message('btn_apply');
		props.search_label = this.message('search_label', props);
		
		props.btn_pdf = this.message('btn_pdf');
		props.pdf_url = this.message('quality_pdf', props);
		
		this.setProperties(props);
	},
	/**
	 * @desc Return the facility LOCCODE as the id 
	 * @public 
	 * @static
	 * @method
	 * @returns {string}
	 */
	getId: function(){
		return this.get('LOCCODE');
	},
	/**
	 * @desc Return the facility PREK_TYPE 
	 * @public 
	 * @static
	 * @method
	 * @returns {string}
	 */
	getType: function(){
		return this.get('PREK_TYPE');
	},
	/**
	 * @desc Return the distance from the user location 
	 * @public 
	 * @static
	 * @method
	 * @returns {number|undefined}
	 */
	getDistance: function(){
		return this.get('distance');
	},
	/**
	 * @desc Set the distance from the user location 
	 * @public 
	 * @static
	 * @method
	 * @param {number} distance The distance in map units
	 */
	setDistance: function(distance){
		this.set('distance', distance);
	},
	/**
	 * @desc Return description of language support at the facility 
	 * @public 
	 * @static
	 * @method
	 * @param {string} infoOrVcard Indicates whether to use message content for the web page or the vcard
	 * @returns {string}
	 */
	getLangContent: function(infoOrVcard){
		var me = this, langs = this.getLangs(), dual = langs.dual, enhanced = langs.enhanced, msg = '';
		$.each(dual, function(_, lang){
			msg += me.message(infoOrVcard + '_dual_lang', {lang: lang});
		});
		$.each(enhanced, function(_, lang){
			msg += me.message(infoOrVcard + '_enhanced_lang', {lang: lang});
		});
		return msg;
	},
	/**
	 * @desc Return jcard string for vcard download generation 
	 * @public 
	 * @static
	 * @method
	 * @returns {string}
	 */
	getJcardJson: function(){
		var props = this.getProperties(),
			builder = this.jcardBuilder,
			coordinates = proj4('EPSG:4326', 'EPSG:2263', this.getCoordinates());
		builder.add(builder.organization({name: props.NAME}));
		builder.add(builder.address({
			type: 'work', 
			line1: props.address_1,
			city:  props.city,
			state: 'NY',
			zip:  props.ZIP,
			country: 'U.S.A.'
		}));
		builder.add(builder.email({type: 'work', email: props.EMAIL}));
		builder.add(builder.parsePhone(props.PHONE));
		builder.add(builder.url({type: 'work', url: props.WEBSITE}));
		builder.add(builder.timezone('-5:00'));
		builder.add(builder.geography({lng: coordinates[0], lat: coordinates[1]}));
		builder.add(builder.note(this.getJcardNote()));
		return builder.json();
	},
	/**
	 * @private 
	 * @static
	 * @method
	 * @return {Object<string, Array<string>>} 
	 */
	getLangs: function(){
		var me = this, codes = this.get('ENHANCED_LANG') || '', langs = {dual: [], enhanced: []};
		$.each(codes.trim().split(';'), function(_, code){
			var dual = me.dual_lang[code], enhanced = me.enhanced_lang[code];
			if (dual) langs.dual.push(dual);
			if (enhanced) langs.enhanced.push(enhanced);
		});
		return langs;
	},
	/**
	 * @private 
	 * @static
	 * @method
	 * @return {string} 
	 */
	getJcardNote: function(){
		var props = this.getProperties(),
			langs = this.getLangs(),
			note = this.message('vcard_code', props);
		if (props.NOTE) note += this.message('vcard_note', props);
		note += this.message('vcard_program_features', props);
		note += this.message('vcard_seats', props);
		note += this.getLangContent('vcard');		
		if (props.flex) note += this.message('vcard_flex', props);
		if (props.sped) note += this.message('vcard_sped', props);
		if (props.income) note += this.message('vcard_income', props);
		note += this.message('vcard_link', props);	
		return note;
	}
};