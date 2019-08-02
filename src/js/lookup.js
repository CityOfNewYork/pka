const lookup = {
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
	 * @desc Colors of subway lines
	 * @public 
	 * @static
	 * @member {Object<string, string>}
	 */
	transit_color: {
		1: '#ff3433',
		2: '#ff3433',
		3: '#ff3433',
		
		4: '#009d33',
		5: '#009d33',
		6: '#009d33',
		7: '#c801cc',
		
		A: '#0e689a',
		C: '#0e689a',
		E: '#0e689a',
		
		B: '#fa9705',
		D: '#fa9705',
		F: '#fa9705',
		
		G: '#98cd01',
		
		J: '#9d6400',
		M: '#9d6400',
		Z: '#9d6400',
		
		L: '#999999',
		S: '#999999',
		
		N: '#ffff0c',
		R: '#ffff0c',
		Q: '#ffff0c'
	}
}
export default lookup
