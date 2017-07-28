/** 
 * @public 
 * @namespace
 */
var pka = pka || {};

/** 
 * @desc Class for determining the whether or not Pre-K applications can be submitted at the current time
 * @public 
 * @class
 * @constructor
 * @param {string} startDate yyyy-mm-dd date string
 * @param {string} endDate yyyy-mm-dd date string
 */
pka.ApplicationPeriod = function(startDate, endDate){
	this.applyStart = this.localeDate(startDate);
	this.applyEnd = this.localeDate(endDate);
};

pka.ApplicationPeriod.prototype = {
	/**
	 * @private
	 * @member {Date}
	 */
	applyStart: null,
	/**
	 * @private
	 * @member {Date}
	 */
	applyEnd: null,
	/**
	 * @desc Indicates whether or not Pre-K applications can be submitted at the current time
	 * @public
	 * @method
	 * @return {boolean}
	 */
	isActive: function(){
		var today = new Date();
		return today >= this.applyStart && today < this.applyEnd;		
	},
	/** 
	 * @private 
	 * @method
	 * @param {string} sources
	 * @return {Date}
	 */
	localeDate: function (dateString){
		if (window.IE8) return this.ie8Date(dateString);
		var utcDate = dateString ? new Date(dateString) : new Date();
		return new Date(utcDate.getTime() + (utcDate.getTimezoneOffset() * 60000));
	},
	/** 
	 * @private 
	 * @method
	 * @param {string} sources
	 * @return {Date}
	 */
	ie8Date: function(dateString){
		return dateString ? new Date(unIso(dateString)) : new Date();
	},
	/** 
	 * @private 
	 * @method
	 * @param {string} sources
	 * @return {string}
	 */
	unIso: function(dateString){
		if (typeof dateString != 'string') return dateString;
		var dateParts = dateString.split('-');
		return dateParts[1] + '/' + dateParts[2] + '/' + dateParts[0];
	}
};
