var ta = ta || {};

/**
 * @desc Functions used as decoration args for an instance of nyc.ol.source.FilteringAndSorting
 * @public 
 * @memberof pka
 * @static
 * @type {Object}
 */
ta.htmlRenderer = {
	/**
	 * @desc Return the HTML representation of subway station as a JQuery
	 * @public 
	 * @static
	 * @method
	 * @param {string} infoClass A css class for list view or popup view
	 * @return {JQuery}
	 */
	html: function(){
		var props = this.getProperties();
		return this.icons($(this.message('info', props)), props.lines);
	},
	/**
	 * @private 
	 * @static
	 * @method
	 * @param {JQuery} html
	 * @param {Array<Oject<string, string>>} lines
	 * @return {JQuery} 
	 */
	icons: function(html, lines){
		var me = this, icons = html.find('.icons');
		$.each(lines, function(_, line){
			icons.append(me.message('icon', line));
		});
		return html;
	}
};