var pka = pka || {};

/** 
 * @desc Class for generating layer styles
 * @public 
 * @class
 * @extends {nyc.Style}
 * @constructor
 */
pka.Style = function(){
	this.schoolCache = {};
	this.districtCache = {};
};

pka.Style.prototype = {
	/**
	 * @private
	 * @member {Object}
	 */
	schoolCache: null,
	/**
	 * @private
	 * @member {Object}
	 */
	districtCache: null,
	/**
	 * @desc Style function for school features
	 * @public
	 * @method
	 * @param {ol.Feature} feature The feature to style
	 * @param {number} resolution The resolution of the map view
	 * @return {ol.Style} 
	 */
	school: function(feature, resolution){
		var zoom = this.zoom(resolution),
			type = feature.getType(),
			prek3k = feature.get('3K_SEATS') > 0 ? '3k' : 'prek',
			radius = [8, 8, 16, 16, 16, 24, 24, 32, 32, 48, 48][zoom],
			image = 'img/' + type + this.imgExt();
		this.schoolCache[zoom] = this.schoolCache[zoom] || {};
		this.schoolCache[zoom][type] = this.schoolCache[zoom][type] || {};
		if (!this.schoolCache[zoom][type][prek3k]){
			this.schoolCache[zoom][type][prek3k] = new ol.style.Style({
				image: new ol.style.Icon({
					scale: radius / 54,
					src: image
				})
			});
			if (prek3k == '3k'){
				var size = zoom > 8 ? 20 : 12;
				this.schoolCache[zoom][type][prek3k].setText(
					new ol.style.Text({
						text: '3K',
						fill: new ol.style.Fill({color: 'rgb(1,51,100)'}),
						stroke: new ol.style.Stroke({color: '#fff', width: size == 20 ? 4 : 2}),
						font: 'bold ' + size + 'px "Helvetica Neue", Helvetica, Arial, sans-serif',
						offsetX: size == 20 ? -3 : -1,
						offsetY: size == 20 ? 10 : 6 
					})
				);
			}
		}
		return this.schoolCache[zoom][type][prek3k];
	},
	/**
	 * @desc Style function for school district features
	 * @public
	 * @method
	 * @param {ol.Feature} feature The feature to style
	 * @param {number} resolution The resolution of the map view
	 * @return {ol.Style} 
	 */
	district: function(feature, resolution){
		var zoom = this.zoom(resolution),
			width = [2, 2, 2, 3, 3, 5, 5, 8, 8, 12, 16][zoom],
			geom = feature.getGeometry(),
			uid = JSON.stringify(geom.getCoordinates()),
			dist = feature.get('NAME') + '';
		this.districtCache[zoom] = this.districtCache[zoom] || {};
		if (!this.districtCache[zoom][uid]){
			var options = {
				stroke: new ol.style.Stroke({
					color: '#808080',
					width: width
				})
			};
			if (geom.getArea() > 6712642){
				var size = [8, 10, 12, 16, 24, 32, 32, 48, 64, 72, 96][zoom];
				options.text = new ol.style.Text({
					font: 'bold ' + size + 'px helvetica',
					text: dist,
					fill: new ol.style.Fill({color: '#000'})
				});		
			}
			this.districtCache[zoom][uid] = new ol.style.Style(options);
		}
		return this.districtCache[zoom][uid];
	}
};

nyc.inherits(pka.Style, nyc.Style);