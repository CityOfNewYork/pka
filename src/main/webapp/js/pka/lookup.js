var pka = pka || {};

/**
 * @desc Static lookup values to be used in the application
 * @public 
 * @memberof pka
 * @static
 * @type {Object}
 */
pka.lookup = {
	/**
	 * @desc The URL to the Pre-K application page
	 * @public 
	 * @static
	 * @member {string}
	 */
	apply_url: 'https://prod.semsnycdoe.com/parentsite/',
	/**
	 * @desc The values of the DAY_LENGTH field that represent a full day
	 * @public 
	 * @static
	 * @member {Array<number>}
	 */
	full_day: [1, 2, 5, 7],
	/**
	 * @desc Descriptions of the values in the DAY_LENGTH field
	 * @public 
	 * @static
	 * @member {Object<number, string>}
	 */
	day_length: {
		'0': 'Day length not available',
		'1': 'Full day',
		'2': 'Full day and Half Day',
		'3': 'Half Day',
		'4': '5-Hour',
		'5': 'Full Day and 5-Hour',
		'6': 'Half Day and 5-hour',
		'7': 'Full Day, Half Day and 5-hour'			
	},
	/**
	 * @desc Descriptions of the values in the INDOOR_OUTDOOR field
	 * @public 
	 * @static
	 * @member {Object<number, string>}
	 */
	indoor_outdoor: {
		'1': 'Indoor playspace',
		'2': 'Indoor/Outdoor (offsite) playspace',
		'3': 'Indoor/Outdoor (onsite) playspace',
		'4': 'Indoor/Outdoor (onsite) playspace/Outdoor (offsite) playspace',
		'5': 'Playspace not offered',
		'6': 'Outdoor (offsite) playspace',
		'7': 'Outdoor (onsite) playspace',
		'8': 'Outdoor (onsite) playspace/Outdoor (offsite) playspace',
		'9': 'Please contact site directly for information about playspace'
	},
	/**
	 * @desc Descriptions of the values in the MEALS field
	 * @public 
	 * @static
	 * @member {Object<number, string>}
	 */
	meals: {
		'1': 'Breakfast',
		'2': 'Breakfast/Lunch',
		'3': 'Breakfast/Lunch/Snack(s)',
		'4': 'Breakfast/Snack(s)',
		'5': 'Please contact site directly for information about meals',
		'6': 'Lunch',
		'7': 'Lunch/Snack(s)',
		'8': 'Snack(s)'
	},
	/**
	 * @desc Descriptions of the values in the ENHANCED_LANG field that represent dual language services
	 * @public 
	 * @static
	 * @member {Object<number, string>}
	 */
	dual_lang: {
		'100': 'Arabic',
		'101': 'Bengali',
		'102': 'Chinese',
		'103': 'Chinese (Mandarin)',
		'104': 'Chinese (Cantonese)',
		'105': 'French',
		'106': 'Haitian-Creole',
		'107': 'Korean',
		'108': 'Russian',
		'109': 'Spanish',
		'110': 'Urdu',
		'111': 'Hindi',
		'112': 'Gujarati',
		'113': 'Hebrew',
		'114': 'Polish',
		'115': 'Japanese',
		'116': 'Italian',
		'117': 'Yiddish',
		'118': 'Portuguese',
		'119': 'Tagalog',
		'120': 'Greek',
		'121': 'German',
		'122': 'Farsi',
		'123': 'Vietnamese'
	},
	/**
	 * @desc Descriptions of the values in the ENHANCED_LANG field that represent enhanced language services
	 * @public 
	 * @static
	 * @member {Object<number, string>}
	 */
	enhanced_lang: {
		'200': 'Arabic',
		'201': 'Bengali',
		'202': 'Chinese',
		'203': 'Chinese (Mandarin)',
		'204': 'Chinese (Cantonese)',
		'205': 'French',
		'206': 'Haitian-Creole',
		'207': 'Korean',
		'208': 'Russian',
		'209': 'Spanish',
		'210': 'Urdu',
		'211': 'Hindi',
		'212': 'Gujarati',
		'213': 'Hebrew',
		'214': 'Polish',
		'215': 'Japanese',
		'216': 'Italian',
		'217': 'Yiddish',
		'218': 'Portuguese',
		'219': 'Tagalog',
		'220': 'Greek',
		'221': 'German',
		'222': 'Farsi',
		'223': 'Vietnamese'
	},
	/**
	 * @desc Descriptions of the values in the BOROUGH field
	 * @public 
	 * @static
	 * @member {Object<string, string>}
	 */
	borough: {
		'M': 'Manhattan', 
		'X': 'Bronx', 
		'K': 'Brooklyn', 
		'Q': 'Queens', 
		'R': 'Staten Island'
	},
	/**
	 * @desc Languages for the nyc.Lang control
	 * @public 
	 * @static
	 * @member {Object<string, Object<string, string>>}
	 */
	languages: {
	    en: {val: 'English', desc: 'English', hint: 'Translate'},
	    ar: {val: 'Arabic', desc: '&#x627;&#x644;&#x639;&#x631;&#x628;&#x64A;&#x629;', hint: '&#x62A;&#x631;&#x62C;&#x645;'},
	    bn: {val: 'Bengali', desc: '&#x9AC;&#x9BE;&#x999;&#x9BE;&#x9B2;&#x9BF;', hint: '&#x985;&#x9A8;&#x9C1;&#x9AC;&#x9BE;&#x9A6; &#x995;&#x9B0;&#x9BE;'},
	    'zh-CN': {val: 'Chinese (Simplified)', desc: '&#x4E2D;&#x56FD;', hint: '&#x7FFB;&#x8BD1;'},
	    fr: {val: 'French', desc: 'Fran&#231;ais', hint: 'Traduire'},
	    ht: {val: 'Haitian Creole', desc: 'Krey&#242;l Ayisyen', hint: 'Tradui'},
	    ko: {val: 'Korean', desc: '&#xD55C;&#xAD6D;&#xC758;', hint: '&#xBC88;&#xC5ED;'},
	    ru: {val: 'Russian', desc: 'P&#x443;&#x441;&#x441;&#x43A;&#x438;&#x439;', hint: '&#x43F;&#x435;&#x440;&#x435;&#x432;&#x435;&#x441;&#x442;&#x438;'},
	    es: {val: 'Spanish', desc: 'Espa&#241;ol', hint: 'Traducir'},
	    ur: {val: 'Urdu', desc: '&#x627;&#x631;&#x62F;&#x648;', hint: '&#x62A;&#x631;&#x62C;&#x645;&#x6C1; &#x6A9;&#x631;&#x6CC;&#x6BA;'}
	}
};