var nyc = nyc || {};

/** 
 * @desc Class for generating layer styles
 * @public 
 * @class
 * @extends {nyc.Style}
 * @constructor
 */
nyc.Style = function(){
	this.locationCache = {};
};

nyc.Style.prototype = {
	/**
	 * @private
	 * @member {Object}
	 */
	locationCache: null,
	/**
	 * @desc Return the image extension to use
	 * @public
	 * @method
	 * @return {string} 
	 */
	imgExt: function(){
		return nyc.util.isIe() || nyc.util.isIos() ? '.png' : '.svg';
	},
	/**
	 * @desc Return the zoom level for a resolution 
	 * @public
	 * @method
	 * @param {number} resolution The resolution of the map view
	 * @return {number} 
	 */
	zoom: function(resolution){
		return nyc.ol.TILE_GRID.getZForResolution(resolution) - 8;
	},
	/**
	 * @desc Style function for user location features
	 * @public
	 * @method
	 * @param {ol.Feature} feature The feature to style
	 * @param {number} resolution The resolution of the map view
	 * @return {ol.Style} 
	 */
	location: function(feature, resolution){
		var zoom = this.zoom(resolution), 
			isFeature = feature.get('isFeature');
		this.locationCache[zoom] = this.locationCache[zoom] || {};
		if (!this.locationCache[zoom][isFeature]){			
			if (isFeature && zoom > 3){
				this.locationCache[zoom][isFeature] = new ol.style.Style({
					image: new ol.style.Circle({
						radius: 3.2 * zoom,
						stroke: new ol.style.Stroke({
							color: 'rgba(1,51,100,1)',
							width: 5
						})
					})
				});
			}else{
				this.locationCache[zoom][isFeature] = new ol.style.Style({
					image: new ol.style.Icon({
						scale: 48 / 512, 
						src: 'img/me' + this.imgExt()
					})
				});
			}

		}
		return this.locationCache[zoom][isFeature];
	}
};
