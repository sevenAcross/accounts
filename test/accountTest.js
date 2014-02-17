var expect = require ( "chai" ).expect;
var Account = require ( "../lib/Account" );

suite ( "Single Account", function () {
	var account = new Account ();

	test ( "should exist", function () {
	
		expect ( account ).to.be.ok;
	});

	test ( "getBalance()", function () {
		expect ( account.getBalance() ).to.equal (0);
	});

	test ( "update the balance after a deposit", function () {
		account.deposit ( 100.34 );

		expect ( account.getBalance() ).to.equal ( 100.34 );
	});

	test ( "update the balance after a withdraw", function () {
		account.withdraw ( 55.11 );

		expect ( account.getBalance () ).to.be.closeTo ( 45.23, 0.001 );
	});
});

suite ( "Multiple accounts", function () {

	test ("Multiple accounts should not share the same balance", function () {
		var account1 = new Account ( "", 100 );
		account1.deposit ( 110 );

		var account2 = new Account ( "", 200 );
		account2.deposit ( 95 );

		expect ( account1.getBalance () ).to.equal ( 210 );	
		expect ( account2.getBalance () ).to.equal ( 295 );	
	});
});
