var pka = pka || {};

/**
 * @desc Static message values for use in generating content
 * @public 
 * @memberof pka
 * @static
 * @type {Array<Object<string, string>>}
 */
pka.messages = [
	/************ Pre-K Finder TEXT content ************/
	{
		flex_sched: 'Program may utilize flexible scheduling policy. Please contact program directly for details about pre-K schedule.',
		sped_flg: 'If your child has an IEP recommending Related Services and/or SEIT, contact the program directly for more information before applying.',
		income_flg: 'Program may have income or other eligibility requirements. Contact for more information.',
		start_time: 'Daily Start Time: ${start_time}',
		early_drop_off: 'Early Drop Off Available: ${early_drop}',
		late_pick_up: 'Late Pick Up Available: ${late_pickup}',
		search_label: '<img src="img/${TYPE}.png" alt="${TYPE}"><span class="srch-loccode">${LOCCODE}</span>${NAME}',
		hotline_call_now: 'call now',
		yes: 'Yes',
		no: 'No',
		contact_start: 'Contact program about start time',
		contact_extend: 'Contact program about extended hours'
	},
	/********* Pre-K Finder School Info HTML ***********/
	{		
		info: '<div id="${infoId}" class="${infoClass} info"></div>',
		info_container: '<div class="inf-container"></div>',
		info_name: '<div class="inf-name notranslate" translate="no"><img alt="" src="img/${TYPE}.png">${NAME}</div>',
		info_distance: '<div class="inf-dist notranslate" translate="no">&bull; ${distance} mi &bull;</div>',
		info_code: '<div class="code"><span class="inf-name">Program Code: ${LOCCODE}</span></div>',
		info_address: '<div class="notranslate" translate="no">${address_1}</div><div class="notranslate" translate="no">${address_2}</div>',
		info_apply_btn: '<div class="capitalize inf-btn apply"><a data-role="button" href="${apply_url}" target="_blank" rel="noopener noreferer">${btn_apply}</a></div>',
		info_pdf_btn: '<div class="capitalize inf-btn pdf"><a data-role="button" href="${pdf_url}" target="_blank" rel="noopener noreferer">${btn_pdf}</a></div>',
		info_contact: '<div class="capitalize inf-btn contact"></div>',
		info_phone: '<div class="phone notranslate" translate="no"><a data-role="button" href="tel:${phone}">${PHONE}</a></div>',
		info_vcard: '<div class="vcard"><a data-role="button" onclick="nyc.app.schoolVcard(\'${fid}\');">contact</a></div>',
		info_detail: '<div class="inf-detail"></div>',
		info_email: '<div class="email" translate="no"><a data-role="button" href="mailto:${EMAIL}">email</a></div>',
		info_email_lnk: '<div class="email-lnk" translate="no"><a href="mailto:${EMAIL}">${EMAIL}</a></div>',
		info_web: '<div class="web" translate="no"><a data-role="button" href="${WEBSITE}" target="_blank" rel="noopener noreferer">website</a></div>',
		info_note: '<div class="note">${NOTE}</div>',
		info_program_features: '<div class="inf-name">Program Features:</div><ul class="feats"><li>${meals}</li><li>${in_out}</li><li>${start}</li><li>${early}</li><li>${late}</li></ul>',
		info_seats: '<div class="seats"><span class="inf-name">${school_year} Seats:</span></div>',
		info_el_seats: '<li class="seats"><span class="inf-name">Early Learn 3s: </span>${EL_SEATS} Full day</li>',
		info_3k_seats: '<li class="seats"><span class="inf-name">3-K: </span>${3K_SEATS} Full day</li>',
		info_prek_seats: '<li class="seats"><span class="inf-name">Pre-K: </span>${PREK_SEATS} ${day_length}</li>',
		info_dual_lang: '<div><b>Dual Language:</b> ${lang}</div>',
		info_enhanced_lang: '<div><b>Enhanced Language Support:</b> ${lang}</div>',
		info_flex: '<div><b>Alert:</b> ${flex}</div>',
		info_sped: '<div><b>Alert:</b> ${sped}</div>',
		info_special: '<div>${SPECIAL_PRIOR}</div>',
		info_income: '<div>${income}</div>',
		info_action: '<div class="capitalize inf-btn action"></div>',
		info_directions_btn: '<div class="directions"><a data-role="button" onclick="nyc.app.direct(\'${fid}\');">direct</a></div>',
		info_map_btn: '<div class="map"><a data-role="button" onclick="nyc.app.goToSchool(\'${fid}\');">map</a></div>',
		info_detail_btn: '<div class="detail"><a data-role="button" onclick="nyc.app.schoolDetail(\'${infoId}\');">detail</a></div>'
	},
	/*********** Pre-K Finder School VCARD *************/
	{
		vcard_code: '\nProgram Code: ${LOCCODE}\n\n',
		vcard_note: '${NOTE}\n\n',
		vcard_program_features: 'Program Features:\n\n\t${meals}\n\t${in_out}\n\t${start}\n\t${early}\n\t${late}\n\n',
		vcard_seats: '${school_year} Pre-K Seats: ${PREK_SEATS} ${day_length}\n\n',
		vcard_dual_lang: 'Dual Language: ${lang}\n\n',
		vcard_enhanced_lang: 'Enhanced Language Support: ${lang}\n\n',
		vcard_flex: 'Alert: ${flex}\n\n',
		vcard_sped: 'Alert: ${sped}\n\n',
		vcard_special: '${SPECIAL_PRIOR}\n\n',
		vcard_income: '${income}\n\n',
		vcard_link: '\n\nhttp://maps.nyc.gov/pka/?fid=${fid}#map-page',
	}
];
