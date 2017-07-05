var pka = pka || {};

/** 
 * @desc Class for managing splash page
 * @public 
 * @class
 * @constructor
 * @param {pka.ApplicationPeriod} applicationPeriod The application period
 * @param {pka.lookup} lookup Lookup values for the splash page
 * @param {nyc.Content} content Content for the UI
 * @param {nyc.App} app The application instance
 */
pka.Splash = function(applicationPeriod, lookup, content, app){
	$('.splash-call').html(content.message('btn_call'));
	if (applicationPeriod.isActive()) {
		$('.splash-msg').html(content.message('splash_msg_yes_apply'));	
		$('.splash-apply').html(content.message('btn_apply'))
			.attr('href', lookup.apply_url);
	}else{
		$('.splash-msg').html(content.message('splash_msg_no_apply'));
		$('.splash-apply').hide();
	}
	$('button.el, button.3k, button.prek').click($.proxy(app.checkEntryPoint, app));
	$('.splash-call, .splash-map').click($.proxy(app.page, app));
};
