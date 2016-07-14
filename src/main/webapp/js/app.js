/** 
 * @public 
 * @namespace
 */
var nyc = nyc || {};

/** 
 * @desc Class for managing data and user interactions
 * @public 
 * @class
 * @constructor
 * @param {pka.ApplicationPeriod} applicationPeriod Determines the existence of an active application period
 * @param {ol.Map} map The map
 * @param {Object<string, ol.layer.Vector>} layers The layers with which the user will interact
 * @param {Array<nyc.Check>} filterControls The check box controls used to modify the school features' filter 
 * @param {pka.lookup} lookup Lookup values
 * @param {nyc.Content} content Content for the UI
 * @param {nyc.LocationMgr} locationMgr A location manager for searching for locations 
 * @param {nyc.Directions} directions Displays directions
 * @param {nyc.ol.Popup} popup A popup for displaying feature information
 * @param {pka.Form} form Controls interaction with the form for requesting a call from DOE
 */
nyc.App = function(applicationPeriod, map, layers, filterControls, lookup, content, locationMgr, directions, popup, form){
	var me = this;
	me.applicationPeriod = applicationPeriod;
	me.map = map;
	me.view = map.getView();
	me.schoolLyr = layers.school;
	me.schoolSrc = me.schoolLyr.getSource();
	me.districtLyr = layers.district;
	me.subwayStationLyr = layers.subwayStation;
	me.subwayLineLyr = layers.subwayLine;
	me.filterControls = filterControls;
	me.lookup = lookup;
	me.content = content;
	me.locationMgr = locationMgr;
	me.directions = directions;
	me.popup = popup;
	me.form = form;
	me.pager = new nyc.ListPager();
	me.controls = locationMgr.controls;
		
	me.setTips([me.schoolSrc, locationMgr.locator.layerSource]);

	me.filterDisplay(applicationPeriod);
	
	map.on('click', $.proxy(me.mapClick, me));
	me.view.on('change:resolution', $.proxy(me.zoomChange, me));

	me.schoolSrc.once(nyc.ol.source.Decorating.LoaderEventType.FEATURESLOADED, $.proxy(me.ready, me));

	$.each(filterControls, function(_, control){
		control.on('change', $.proxy(me.filter, me));
	});
	
	locationMgr.on(nyc.Locate.EventType.GEOCODE, $.proxy(me.located, me));
	locationMgr.on(nyc.Locate.EventType.GEOLOCATION, $.proxy(me.located, me));
	
	$('#btn-more a').click($.proxy(me.listNextPage, me));
	$('.school-yr').html(content.message('school_year'));

	$('#tabs a').click($.proxy(me.tabs, me));

	$('body').pagecontainer({change: $.proxy(me.pageChanged, me)});
	
	$('#panel, .banner').mouseenter(me.hideTips);
	
	$('#map').append($('#btn-call'));
	$('#btn-call').click($.proxy(me.hotline, me));
	
	$(window).resize($.proxy(me.resize, me));
};

nyc.App.prototype = {
	/**
	 * @private
	 * @member {pka.ApplicationPeriod}
	 */
	applicationPeriod: null,
	/**
	 * @private
	 * @member {ol.Map}
	 */
	map: null,
	/**
	 * @private
	 * @member {ol.View}
	 */
	view: null,
	/**
	 * @private
	 * @member {ol.layer.Vector}
	 */
	schoolLyr: null,
	/**
	 * @private
	 * @member {nyc.ol.source.FilteringAndSorting}
	 */
	schoolSrc: null,
	/**
	 * @private
	 * @member {ol.layer.Vector}
	 */
	districtLyr: null,
	/**
	 * @private
	 * @member {ol.layer.Vector}
	 */
	subwayStationLyr: null,
	/**
	 * @private
	 * @member {ol.layer.Vector}
	 */
	subwayLineLyr: null,
	/**
	 * @private
	 * @member {Array<nyc.Check>}
	 */
	filterControls: null,
	/**
	 * @private
	 * @member {nyc.Content}
	 */
	content: null,
	/**
	 * @private
	 * @member {nyc.Directions}
	 */
	directions: null,
	/**
	 * @private
	 * @member {nyc.ol.Popup}
	 */
	popup: null,
	/**
	 * @private
	 * @member {nyc.ListPager}
	 */
	pager: null,
	/**
	 * @private
	 * @member {nyc.Locate.Result}
	 */
	location: null,
	/**
	 * @private
	 * @member {boolean}
	 */
	mapLoaded: false,
	/**
	 * @private
	 * @member {boolean}
	 */
	showingFilters: false,
	/**
	 * @private
	 * @member {nyc.Dialog}
	 */
	hotlineDiag: null,
	/**
	 * @desc Initiate download of a contact card for the school
	 * @public
	 * @method
	 * @param {string} fid The feature id of the school
	 */
	schoolVcard: function(fid){
		var feature = this.schoolSrc.getFeatureById(fid);
		window.open('/vcard/?' + $.param({jcard: feature.getJcardJson()}));
	},
	/**
	 * @desc Show the hotline dialog
	 * @public
	 * @method
	 */
	hotline: function(){
		var me = this;
		if (!me.hotlineDiag){
			var dialog = new nyc.Dialog(), apply = me.applicationPeriod.isActive();
			dialog.container.find('.dia-btns a').addClass('capitalize hotline');
			me.hotlineDiag = dialog;
		}
		me.hotlineDiag.yesNoCancel({
			message: me.content.message('hotline_msg'),
			buttonText: [
	             me.content.message('hotline_call_now'),
	             me.content.message(apply ? 'btn_apply' : 'btn_call')
			],
			buttonHref: [
	             'tel:' + encodeURIComponent(me.content.message('hotline_number')),
	             apply ? me.lookup.apply_url : '#form-page'
			]
		});
		$('a[href="' + me.lookup.apply_url + '"]').attr('target', '_blank');
	},
	/** 
	 * @desc Pan and zoom to a school
	 * @public 
	 * @method
	 * @param {string} fid The feature id of the school
	 */
	goToSchool: function(fid){
		if ($('#inf-full-screen').css('display') == 'block'){
			$('#inf-full-screen').fadeOut();
		}else if (fid){
			var me = this, feature = me.schoolSrc.getFeatureById(fid);
			if (feature){
				var coordinates = feature.getCoordinates();
				me.map.beforeRender(
					ol.animation.zoom({resolution: me.view.getResolution()}), 
					ol.animation.pan({source: me.view.getCenter()})
				);
				me.map.once('moveend', function(){
					me.showPopup(feature.getCoordinates(), feature.html('inf-pop'))
				});
				if ($('#panel').width() == $(window).width()){
					$('#map-tab-btn a').trigger('click');
				}
				me.view.setZoom(me.locationMgr.locator.zoom);
				me.view.setCenter(coordinates);			
			}
		}
	},
	/** 
	 * @desc Show detailed info about the school
	 * @public
	 * @method
	 * @param {string} infoId The id of the HTML container for the  school's info 
	 */
	schoolDetail: function(infoId){
		var popup = this.popup, end;
		if (infoId.indexOf('inf-pop') == 0){
			if (this.isFullScreen()){
				return this.fullScreenDetail(infoId);
			}
			end = function(){popup.pan();};
		}
		$('#' + infoId + ' .inf-detail').slideToggle(end);
	},
	/** 
	 * @desc Show directions to a school
	 * @public
	 * @method
	 * @param {string} fid The feature id of the school 
	 */
	direct: function(fid){
		var me = this,
			feature = me.schoolSrc.getFeatureById(fid),
			to = feature.get('address'),
			name = feature.getName(),
			from = me.origin();
		
		$('body').pagecontainer('change', $('#dir-page'), {transition: 'slideup'});
		if (me.lastDir != from + '|' + to){
			var args = {from: unescape(from), to: unescape(to), facility: unescape(name)};
			me.lastDir = from + '|' + to;
			me.directions.directions(args);
		}
	},
	/** 
	 * @private 
	 * @method
	 * @return {boolean}
	 */
	isFullScreen: function(){
		return $(window).width() <= 495 || $(window).height() <= 495;
	},
	/** 
	 * @private 
	 * @method
	 * @param {string} infoId
	 */
	fullScreenDetail: function(infoId){
		var fid = infoId.replace(/inf-pop/, ''),
			feature = this.schoolSrc.getFeatureById(fid),
			html = feature.html('inf-full-screen');
		$('#inf-full-screen div').html(html).trigger('create');
		$('#inf-full-screen').fadeIn();
	},
	/** 
	 * @private 
	 * @method
	 * @return {string}
	 */
	origin: function(){
		var location = this.location || {};
		if (location.type == 'geolocation'){
			var coordinates = proj4('EPSG:2263', 'EPSG:4326', location.coordinates);
			return [coordinates[1], coordinates[0]];
		}
		return location.name || '';
	},
	/** 
	 * @private 
	 * @method
	 * @param {ol.ObjectEvent} event
	 */
	zoomChange: function(event){
		var me = this, res = me.view.getResolution();
		$.each([me.districtLyr, me.subwayLineLyr, me.subwayStationLyr], function(_, lyr){
			if (!lyr.get('added') && res >= lyr.getMinResolution() && res <= lyr.getMaxResolution()){
				me.map.addLayer(lyr);
				if (lyr !== me.subwayLineLyr){
					me.setTips([lyr.getSource()]);
				}
				lyr.set('added', true, true);
			}
		});
	},
	/** 
	 * @private 
	 * @method
	 * @param {Array<ol.source.Vector>} sources
	 */
	setTips: function(sources){
		var me = this;
		$.each(sources, function(_, src){
			new nyc.ol.FeatureTip(me.map, [{source: src, labelFunction: me.getTip}])
		})
	},
	/** 
	 * @private 
	 * @method
	 * @param {pka.ApplicationPeriod} applicationPeriod
	 */
	filterDisplay: function(applicationPeriod){
		if (applicationPeriod.isActive() && this.content.message('application_filter_btn')){
			$('#chk-apply').show();
		}
		if (this.content.message('dynamic_filter_btn')){
			$('#chk-dynamic').show();
		}		
	},
	/** 
	 * @private 
	 * @method
	 */
	ready: function(){
		var me = this;
		me.listSchools();
		$('#tabs').tabs({active: 1});
		$('#first-load').fadeOut(function(){
			me.qstrFid();
		});
	},
	/** 
	 * @private 
	 * @method
	 */
	qstrFid: function(){
		var fid = document.location.search.split('=')[1];
		this.goToSchool(fid);
	},
	/** 
	 * @private 
	 * @method
	 * @param {Object} event
	 */
	tabs: function(event){
		var target = $(event.currentTarget);
		$('#panel').css(
			'z-index',
			target.attr('href') == '#map-tab' ? 999 : 1000
		);
	},
	/** 
	 * @private 
	 * @method
	 * @param {nyc.Locate.Result} location
	 */
	listSchools: function(location){
		var loc = location || this.location || {},
			features = this.schoolSrc.sort(loc.coordinates);
		$('#school-list').empty();
		this.pager.reset(features);
		this.listNextPage();
		this.controls.removeFeatures('pka');
		this.controls.setFeatures({
			featureTypeName: 'pka',
			features: features,
			nameField: 'NAME',
			labelField: 'search_label'
		});
	},
	/** 
	 * @private 
	 * @method
	 * @return {boolean}
	 */
	isFiltered: function(){
		var filtered = this.schoolSrc.getFeatures().length != this.schoolSrc.allFeatures.length;
		$('a[href="#filters-tab"]')[filtered ? 'addClass' : 'removeClass']('filter-on');
	},
	/** 
	 * @private 
	 * @method
	 */
	listNextPage: function(){
		var container = $('#school-list');
		$.each(this.pager.next(), function(i, feature){
			var info = $(feature.html('inf-list'));
			info.attr('role', 'listitem');
			if (i % 2 != 0) info.addClass('odd-row');
			$(container).append(info).trigger('create');
		});	
	},
	/** 
	 * @private 
	 * @method
	 * @param {nyc.Locate.Result} location
	 */
	located: function(location){
		this.location = location;
		this.listSchools();
	},
	/** 
	 * @private 
	 * @method
	 */
	filter: function(){
		var me = this, namedFilters = {}, filters = [];
		$.each(this.filterControls, function(_, control){
			$.each(control.val(), function(__, choice){
				var filter = namedFilters[choice.name] || [];
				filter = filter.concat(choice.value.split(','));
				namedFilters[choice.name] = filter;
			});
		});
		for (var name in namedFilters){
			filters.push({property: name, values: namedFilters[name]});
		}
		//provide time for checkbox display to update
		setTimeout(function(){
			me.schoolSrc.filter(filters);
			me.isFiltered();
			me.listSchools();
			me.clearPopup();
		}, 100);
	},
	clearPopup: function(){
		var id = $('.inf-pop').attr('id')
		if (id) {
			var feature = this.schoolSrc.getFeatureById(id.replace(/inf-pop/, ''));
			if (!feature){
				this.popup.hide();
			}
		}
	},
	pageChanged: function(){
		if ($('#panel').width() == $(window).width() && !this.showingFilters){
			$('#map-tab-btn a').trigger('click');
		}
		$('.school-yr').html(this.content.message('school_year'));
		if (!this.mapLoaded){
			this.map.once('change:size', function(){
				this.mapLoaded = true;
				$('#first-load').fadeOut();				
			});
		}
		var div = $('#map');
		this.map.setSize([div.width(), div.height()]);
		this.map.render();
		this.form.reset();
		this.showingFilters = false;
	},
	page: function(event){
		var target = $(event.currentTarget);
		if (!this.mapLoaded){
			$('#first-load').fadeIn();
		}
		if (target.hasClass('splash-filters')){
			this.showingFilters = true;
			$('#tabs .ui-tabs-nav li').removeClass('ui-tabs-active');
			$('#tabs .ui-tabs-nav a').removeClass('ui-btn-active');
			$('a[href="#filters-tab"]').click()
				.addClass('ui-btn-active')
				.parent().addClass('ui-tabs-active');
		}
		$('body').pagecontainer('change', target.data('page'), {transition: 'slideup'});
	},
	/** 
	 * @private 
	 * @method
	 * @param {Object} event
	 */
	mapClick: function(event){
		var me = this, map = me.map, px = event.pixel;
		map.forEachFeatureAtPixel(px, function(feature, layer){
			var coords, html;
			if (feature.html){
				coords = feature.getCoordinates();
				html = feature.html('inf-pop');
			}
			if (coords){
				me.showPopup(coords, html);
				return true;
			}
		});
	},
	/** 
	 * @private 
	 * @method
	 * @param {ol.Coordinate} coordinates
	 * @param {string} html
	 */
	showPopup: function(coordinates, html){
		this.hideTips();
		this.popup.setOffset([0, -10]);
		this.popup.show({
			coordinates: coordinates,
			html: html
		});
	},
	/** 
	 * @private 
	 * @method
	 * @return {nyc.ol.FeatureTip.Label}
	 */
	getTip: function(){
		return {text: this.getName()};
	},
	/** 
	 * @private 
	 * @method
	 */
	hideTips: function(){
		$('.feature-tip').fadeOut();
	},
	/** 
	 * @private 
	 * @method
	 */
	resize: function(){
		if ($('#panel').width() != $(window).width() && $('#map-tab-btn').hasClass('ui-tabs-active')){
			$('#schools-tab-btn a').trigger('click');
		}
	}
};