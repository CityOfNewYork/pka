var ta = ta || {};

/** 
 * @desc Class for generating layer styles
 * @public 
 * @class
 * @extends {nyc.Style}
 * @constructor
 * @param {ta.lookup} lookup Color lookup
 */
ta.Style = function(lookup){
	this.lookup = lookup;
	this.stationCache = {};
	this.lineCache = {};
};

ta.Style.prototype = {
	/**
	 * @private
	 * @member {Object<string, string>}
	 */
	lookup: null,
	/**
	 * @private
	 * @member {Object}
	 */
	stationCache: null,
	/**
	 * @private
	 * @member {Object}
	 */
	lineCache: null,
	/**
	 * @desc Style function for subway line features
	 * @public
	 * @method
	 * @param {ol.Feature} feature The feature to style
	 * @param {number} resolution The resolution of the map view
	 * @return {ol.Style} 
	 */
	line: function(feature, resolution){
		var zoom = this.zoom(resolution),
			line = feature.get('RT_SYMBOL'),
			width = [1, 1, 1, 1, 1, 2, 4, 6, 7, 8, 9, 10, 11, 12][zoom];
		this.lineCache[zoom] = this.lineCache[zoom] || {};
		if (!this.lineCache[zoom][line]){
			this.lineCache[zoom][line] = new ol.style.Style({
				stroke: new ol.style.Stroke({
					color: this.lookup.color[line],
					width: width
				})
			});
		}
		return this.lineCache[zoom][line];
	},
	/**
	 * @desc Style function for subway station features
	 * @public
	 * @method
	 * @param {ol.Feature} feature The feature to style
	 * @param {number} resolution The resolution of the map view
	 * @return {ol.Style} 
	 */
	station: function(feature, resolution){
		var zoom = this.zoom(resolution),
			radius = [2, 2, 4, 4, 4, 6, 8, 10, 12, 16, 24][zoom - 4];
		if (!this.stationCache[zoom]){
			this.stationCache[zoom] = new ol.style.Style({
				image: new ol.style.Circle({
					radius: radius,
					stroke: new ol.style.Stroke({
						color: '#000',
						width: radius > 2 ? 2 : 1
					}),
					fill: new ol.style.Fill({
						color: 'rgba(255,255,255,0.9)'
					})
				})
			});
		}
		return this.stationCache[zoom];
	}
};

nyc.inherits(ta.Style, nyc.Style);