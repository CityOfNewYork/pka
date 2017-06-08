var pka = pka || {};

/**
 * @desc Functions used as decoration args for an instance of nyc.ol.source.FilteringAndSorting
 * @public 
 * @memberof pka
 * @static
 * @type {Object}
 */
pka.htmlRenderer = {
	/**
	 * @desc Return the HTML representation of facility as a JQuery
	 * @public 
	 * @static
	 * @method
	 * @param {string} infoClass A css class for list view or popup view
	 * @return {JQuery}
	 */
	html: function(infoClass){
		var props =  this.getProperties(),
			infoId = infoClass + this.getId();
		props.infoId = infoId;
		props.infoClass = infoClass;
		return $(this.message('info', props)).append(
			$(this.message('info_container', props))
				.append(this.distanceHtml())
				.append(this.message('info_name', props))
				.append(this.message('info_note', props))
				.append(this.message('info_address', props))
				.append(this.pdfBtnHtml(props))
				.append(this.applyBtnHtml(props))
				.append(this.phoneWebHtml(props))
				.append(this.detailHtml(props))
				.append(this.actionHtml(props))
		);
	},		
	/**
	 * @private 
	 * @static
	 * @method
	 * @return {string} 
	 */
	distanceHtml: function(){
		var dist = this.getDistance();
		return dist === undefined ? '' : this.message('info_distance', {distance: (dist/5280).toFixed(2)});
	},
	/**
	 * @private 
	 * @static
	 * @method
	 * @param {Object<string, Object>} props
	 * @return {JQuery} 
	 */
	phoneWebHtml: function(props){
		var web = this.webHtml(props),
			phone = $(this.message('info_phone', props));
		if (!web){
			phone.addClass('full-width');
		}
		return $(this.message('info_contact'))
			.append(phone)
			.append(web);
	},
	/**
	 * @private 
	 * @static
	 * @method
	 * @param {Object<string, Object>} props
	 * @return {JQuery} 
	 */
	contactHtml: function(props){
		return $(this.message('info_contact'))
			.append(this.message('info_email', props))
			.append(this.message('info_vcard', props));
	},
	/**
	 * @private 
	 * @static
	 * @method
	 * @param {Object<string, Object>} props
	 * @return {string} 
	 */
	webHtml: function(props){
		return props.WEBSITE? this.message('info_web', props) : '';
	},
	/**
	 * @private 
	 * @static
	 * @method
	 * @param {Object<string, Object>} props
	 * @return {string} 
	 */
	flexHtml: function(props){
		return props.flex ? this.message('info_flex', props) : '';
	},
	/**
	 * @private 
	 * @static
	 * @method
	 * @param {Object<string, Object>} props
	 * @return {string} 
	 */
	spedHtml: function(props){
		return props.sped ? this.message('info_sped', props) : '';
	},
	/**
	 * @private 
	 * @static
	 * @method
	 * @param {Object<string, Object>} props
	 * @return {string} 
	 */
	specialHtml: function(props){
		return props.SPECIAL_PRIOR ? this.message('info_special', props) : '';
	},
	/**
	 * @private 
	 * @static
	 * @method
	 * @param {Object<string, Object>} props
	 * @return {string} 
	 */
	incomeHtml: function(props){
		return props.income ? this.message('info_income', props) : '';
	},
	/**
	 * @private 
	 * @static
	 * @method
	 * @param {Object<string, Object>} props
	 * @return {JQuery} 
	 */
	detailHtml: function(props){
		var detailHtml = $(this.message('info_detail'));
		return detailHtml.append(this.message('info_code', props))
			.append(this.message('info_email_lnk', props))
			.append(this.message('info_program_features', props))
			.append(this.flexHtml(props))
			.append(this.spedHtml(props))
			.append(this.specialHtml(props))
			.append(this.incomeHtml(props))
			.append(this.getLangContent('info'))
			.append(this.message('info_3k_seats', props))
			.append(this.message('info_prek_seats', props))
			.append(this.contactHtml(props));
	},
	/**
	 * @private 
	 * @static
	 * @method
	 * @param {Object<string, Object>} props
	 * @return {string} 
	 */
	pdfBtnHtml: function(props){
		return $(this.message('info_pdf_btn', props));	
	},
	/**
	 * @private 
	 * @static
	 * @method
	 * @param {Object<string, Object>} props
	 * @return {string} 
	 */
	applyBtnHtml: function(props){
		return props.can_apply ? $(this.message('info_apply_btn', props)) : '';	
	},
	/**
	 * @private 
	 * @static
	 * @method
	 * @param {Object<string, Object>} props
	 * @return {JQuery} 
	 */
	actionHtml: function(props){
		var apply = props.can_apply;
		return $(this.message('info_action'))
			.append(this.message('info_map_btn', props))
			.append(this.message('info_directions_btn', props)) 
			.append(this.message('info_detail_btn', props));
	}
};