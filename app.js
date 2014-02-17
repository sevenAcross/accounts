
/**
 * Module dependencies.
 */

var express = require('express');
var accountManager = require ( "./lib/AccountManager" );
var hbs = require ( 'hbs' );
var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('view engine', 'html');
app.engine ( 'html', hbs.__express );
app.use ( express.bodyParser () );
app.use ( express.static ( 'public' ) );

var manager = accountManager.create ();
var currentAccount = manager.createAccount ( "Current", -1345.76 );
var billsAccount   = manager.createAccount ( "Bills", 50 );
var electricityAccount = manager.createSubAccount ( billsAccount, "Electricity", 100.00 );
var gasAccount = manager.createSubAccount ( billsAccount, "Gas", 200.00 );
manager.transfer ( 50.00, gasAccount, electricityAccount );
manager.transfer ( 25.00, electricityAccount, gasAccount );

hbs.registerHelper ( "negativeBalance", function ( balance ) {
	if ( balance < 0 )
		return true;
	else
		return false;
});

app.get ( '/api/accounts', function ( req, res ) {
	res.render ( 'accounts', { title:"My Accounts", accounts:manager.getAccounts() } );
});

app.get ( '/api/accounts/:id', function ( req, res ) {
	res.render ( 'accounts', {
		title:"Sub Accounts of " + manager.getAccountName ( req.params.id ),
		accounts:manager.getSubAccounts ( req.params.id )
		} );
});

app.get ( '/api/transactions/:id', function ( req, res ) {
	res.render ( 'transactions', {
		title:"Statement for " + manager.getAccountName ( req.params.id ),
		transactions:manager.getStatement ( req.params.id )
	});
});

app.listen ( app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});
