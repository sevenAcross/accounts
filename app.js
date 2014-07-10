
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
var currentAccount = manager.createAccount ( null, "Current", -1345.76 );
var billsAccount   = manager.createAccount ( null, "Bills", 50 );
var electricityAccount = manager.createAccount ( billsAccount, "Electricity", 100.00 );
var gasAccount = manager.createAccount ( billsAccount, "Gas", 200.00 );
manager.transfer ( 50.00, gasAccount, electricityAccount );
manager.transfer(25.00, electricityAccount, gasAccount);
manager.transfer(1.23, currentAccount, gasAccount);
manager.transfer(2.34, currentAccount, electricityAccount);
manager.transfer(3.45, currentAccount, gasAccount);
manager.transfer(4.56, currentAccount, electricityAccount);
manager.transfer(5.67, currentAccount, gasAccount);

hbs.registerHelper ( "negativeBalance", function ( balance ) {
	if ( balance < 0 )
		return true;
	else
		return false;
});

app.get ( '/api/accounts', function ( req, res ) {
	res.render ( 'accounts', { title:"My Accounts", accounts:manager.getAccounts() } );
});

app.get('/api/accounts/new/:id', function (req, res) {
    res.render('newAccount', {
        parent: req.params.id,
        parentName: manager.getAccountName(req.params.id)
    });
});

app.get('/api/accounts/:id', function (req, res) {
	res.render ( 'accounts', {
	    title: "Sub Accounts of " + manager.getAccountName(req.params.id),
        parent: req.params.id,
		accounts: manager.getSubAccounts ( req.params.id )
		} );
});


app.post ( "/api/accounts", function ( req, res ) {
    if ( ! req.body.hasOwnProperty ( 'parent' ) ||
         ! req.body.hasOwnProperty ( 'name' ) ||
         ! req.body.hasOwnProperty ( 'balance' ) ) {
        res.statusCode = 400;
        return res.send ( 'Error 400: Post Syntax incorrect.' );
    }
    
    var parent = Number ( req.body.parent );
    if (isNaN(parent) == true)
        parent = null;
    else
        if (parent < 0)
            parent = null;

    manager.createAccount ( parent, req.body.name, Number ( req.body.balance ) );

    if ( parent == null )
        res.render('accounts', { title: "My Accounts", accounts: manager.getAccounts() });
    else
        res.render('accounts', {
            title: "Sub Accounts of " + manager.getAccountName(parent),
            parent: parent,
            accounts: manager.getSubAccounts(parent)
        });

    //    res.json ( parent );
});

app.get('/api/transactions/:id', function (req, res) {
    res.render('transactions', {
        statement: manager.getStatement(req.params.id)
    });
});

app.get ( '/', function ( req, res ) {
    res.render('accounts', {
        title: "My Accounts",
        accounts: manager.getAccounts()
    });
});

app.listen ( app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});
