var nyc = nyc || {};

/**
 * @desc Functions used as decoration args for an instance of nyc.ol.source.FilteringAndSorting
 * @public 
 * @memberof nyc
 * @static
 * @type {Object}
 */
nyc.fieldAccess = {
	/**
	 * @desc Return the coordinates of a point feature
	 * @public 
	 * @static
	 * @method
	 * @return {ol.Coordinate}
	 */
	getCoordinates: function(){
		return this.getGeometry().getCoordinates();
	},
	/**
	 * @desc Return the name of feature
	 * @public 
	 * @static
	 * @method
	 * @return {string}
	 */
	getName: function(){
		return this.get('NAME');
	}
};