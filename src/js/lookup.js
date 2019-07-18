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
}
export default lookup
