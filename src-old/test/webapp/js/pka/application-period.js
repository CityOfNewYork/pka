QUnit.module('pka.ApplicationPeriod', {});

QUnit.test('isActive', function(assert){
	assert.expect(5);
	
	var iso = function(dt){
		var d = dt.getDate() + '', m = dt.getMonth() + 1 + '';
		d = d.length > 1 ? d : '0' + d;
		m = m.length > 1 ? m : '0' + m;
		return dt.getFullYear() + '-' + m + '-' + d;
	};
	
	var applicationPeriod = new pka.ApplicationPeriod('2015-01-01', '2015-02-01');
	assert.notOk(applicationPeriod.isActive());
	
	applicationPeriod = new pka.ApplicationPeriod('2020-01-01', '2015-20-01');
	assert.notOk(applicationPeriod.isActive());

	applicationPeriod = new pka.ApplicationPeriod('2020-01-01', '2020-20-01');
	assert.notOk(applicationPeriod.isActive());

	var today = applicationPeriod.localeDate(new Date());
	today = iso(today);
	
	var tomorrow = new Date();
	tomorrow = applicationPeriod.localeDate(tomorrow);
	tomorrow.setDate(tomorrow.getDate() + 1);
	tomorrow = iso(tomorrow);
	
	applicationPeriod = new pka.ApplicationPeriod(today, tomorrow);
	assert.ok(applicationPeriod.isActive());

	var yesterday = new Date();
	yesterday = applicationPeriod.localeDate(yesterday);
	yesterday.setDate(yesterday.getDate() - 1);
	yesterday = yesterday.toISOString().split('T')[0];
	
	applicationPeriod = new pka.ApplicationPeriod(yesterday, today);
	assert.notOk(applicationPeriod.isActive());

});