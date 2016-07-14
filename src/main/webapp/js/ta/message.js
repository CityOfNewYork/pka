var ta = ta || {};

/**
 * @desc Static message values for use in generating content
 * @public 
 * @memberof ta
 * @static
 * @type {Object<string, string>}
 */
ta.messages = {
	info: '<div class="subway-info"><div class="inf-name notranslate" translate="no">${NAME}</div><div class="icons notranslate" translate="no""></div><div class="note">${NOTE}</div></div>',
	icon: '<div class="subway-icon subway-${line} ${express}"><div>${line}</div></div>'
};
