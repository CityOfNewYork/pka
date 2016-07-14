/** 
 * @public 
 * @namespace
 */
var ta = ta || {};

/**
 * @desc Functions used as decoration args for an instance of nyc.ol.source.FilteringAndSorting
 * @public 
 * @memberof ta
 * @static
 * @type {Object}
 */
ta.fieldAccess = {
	/**
	 * @desc Automatically extend the properties of an ol.Feature
	 * @public 
	 * @static
	 * @method
	 */
	extendFeature: function(){
		var props = this.getProperties();
		props.lines = this.getLines();
		this.setProperties(props);
	},
	/**
	 * @desc Return data describing subway lines served by a station  
	 * @public 
	 * @static
	 * @method
	 * @returns {Array<Oject<string, string>>}
	 */
	getLines: function(){
		var lines = [];
		$.each(this.get('LINE').split('-'), function(_, name){
			var parts = name.split(' ');
			lines.push({
				line: parts[0],
				express: parts.length == 2 ? 'express' :  ''
			});
		});
		return lines;
	}		
};