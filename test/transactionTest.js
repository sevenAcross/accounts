var expect = require ( "chai" ).expect;
var Transaction = require ( "../lib/Transaction" );
var moment = require ( "moment" );

suite ( "Transaction Tests", function () {
	test ( "Single Transaction", function () {
		var transaction = new Transaction ( 1, 2, 100 );

		expect ( transaction ).to.be.ok;
		expect ( transaction.amount ).to.equal ( 100 );
		expect ( transaction.timestamp ).to.equal ( moment().format ( 'D MMM YYYY' ) )
	});


	test ("Multiple transactions should not share the same data", function () {
		var transaction1 = new Transaction ( 1, 2, 100.23 );

		var transaction2 = new Transaction ( 3, 4, 200.45 );

		expect ( transaction1.getAmount() ).to.equal ( 100.23 );
		expect ( transaction2.amount ).to.equal ( 200.45 );
	});
});
