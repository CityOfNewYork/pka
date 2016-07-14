QUnit.module('pka.ApplicationPeriod', {});

QUnit.test('isActive', function(assert){
	assert.expect(4);
	
	var applicationPeriod = new pka.ApplicationPeriod('2015-01-01', '2015-02-01');
	assert.notOk(applicationPeriod.isActive());
	
	applicationPeriod = new pka.ApplicationPeriod('2020-01-01', '2015-20-01');
	assert.notOk(applicationPeriod.isActive());

	var today = applicationPeriod.localeDate(new Date());
	today = today.toISOString().split('T')[0];
	
	var tomorrow = new Date();
	tomorrow = applicationPeriod.localeDate(tomorrow);
	tomorrow.setDate(tomorrow.getDate() + 1);
	tomorrow = tomorrow.toISOString().split('T')[0];
	
	applicationPeriod = new pka.ApplicationPeriod(today, tomorrow);
	assert.ok(applicationPeriod.isActive());

	var yesterday = new Date();
	yesterday = applicationPeriod.localeDate(yesterday);
	yesterday.setDate(yesterday.getDate() - 1);
	yesterday = yesterday.toISOString().split('T')[0];
	
	applicationPeriod = new pka.ApplicationPeriod(yesterday, today);
	assert.notOk(applicationPeriod.isActive());

});