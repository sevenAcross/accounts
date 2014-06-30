/// <reference path="../lib/AccountManager.js" />
/// <reference path="node.js" />

var expect = require("chai").expect;
var accountManager = require ( "../lib/AccountManager" );
var moment = require ( "moment");

suite ( "Get Account Name", function () {
	test ( "getAccountName", function () {
		var manager = accountManager.create ();
		expect ( manager.numberOfAccounts () ).to.equal ( 0 );

		var currentAccount = manager.createAccount ( null, "Current", 100 );
		expect ( manager.numberOfAccounts () ).to.equal ( 1 );
		expect ( manager.getAccountName ( currentAccount ) ).to.equal ( "Current" );
		
		var billsAccount   = manager.createAccount ( null, "Bills", 50 );
		expect ( manager.numberOfAccounts () ).to.equal ( 2 );
		expect ( manager.getAccountName ( billsAccount ) ).to.equal ( "Bills" );
	});
});

suite ( "Transfer between accounts", function () {
	setup ( function () {
	});

	test ( "Simple transfers", function () {
		var manager = accountManager.create ();
		expect ( manager.numberOfAccounts () ).to.equal ( 0 );

		var currentAccount = manager.createAccount ( null, "Current", 100 );
		expect ( manager.numberOfAccounts () ).to.equal ( 1 );

		var billsAccount   = manager.createAccount ( null, "Bills", 50 );
		expect ( manager.numberOfAccounts () ).to.equal ( 2 );

		expect ( manager.getBalance ( currentAccount) ).to.equal ( 100 );
		expect ( manager.getBalance ( billsAccount) ).to.equal ( 50 );

		manager.transfer ( 20, currentAccount, billsAccount );
		
		expect ( manager.getBalance ( currentAccount) ).to.equal ( 80 );
		expect ( manager.getBalance ( billsAccount) ).to.equal ( 70 );
	});

	test ( "Transaction history", function () {
		var manager = accountManager.create ();
		var currentAccount = manager.createAccount ( null, "Current", 100.33 );
		var billsAccount   = manager.createAccount ( null, "Bills", 50.44 );
		
		// Make 2 transfers that debit the current account
		manager.transfer ( 20.11, currentAccount, billsAccount );
		expect ( manager.getBalance ( currentAccount) ).to.equal ( 100.33 - 20.11 );
		manager.transfer ( 50.00, currentAccount, billsAccount );
		expect(manager.getBalance(currentAccount)).to.equal(100.33 - 20.11 - 50.00);

		// Get the statement (this is what gets passed to a web page
		var statement = manager.getStatement ( currentAccount );
		
		expect ( statement.length ).to.equal ( 2 );
		
		expect(statement[0].amount).to.equal(50.00);
		expect(statement[0].debit).to.equal(true);
		expect(statement[0].balance).to.equal((100.33 - 20.11 - 50.00).toString());

		expect(statement[1].amount).to.equal(20.11);
		expect ( statement[1].debit ).to.equal ( true );
		expect ( statement[1].timestamp ).to.equal ( moment().format ( 'DD MMM YYYY' ) );
		expect ( statement[1].balance ).to.equal ( (100.33 - 20.11 ).toString ());
		
		
		// Now add another transfer to credit the current account
		manager.transfer ( 34.21, billsAccount, currentAccount );
		
		statement = manager.getStatement ( currentAccount );

		expect ( statement.length ).to.equal ( 3 );
		expect ( statement[0].amount ).to.equal ( 34.21 );
		expect ( statement[0].name ).to.equal ( "Bills" );
		expect ( statement[0].debit ).to.equal ( false );

		
	});
});

suite ( "Sub Accounts", function ( ) {
	setup ( function () {
		this.manager = accountManager.create ();
		expect ( this.manager.numberOfAccounts () ).to.equal ( 0 );
	});

	test ( "Add Sub Accounts", function () {

		var billsAccount = this.manager.createAccount ( null, "Bills", 100 );
		var electricAccount = this.manager.createAccount ( billsAccount, "Electric", 50 );
		expect ( this.manager.getBalance ( electricAccount ) ).to.equal ( 50 );
		expect ( this.manager.getBalance ( billsAccount ) ).to.equal ( 50 );

		var gasAccount = this.manager.createAccount ( billsAccount, "Gas", 150 );
		expect ( this.manager.getBalance ( gasAccount ) ).to.equal ( 150 );
		expect ( this.manager.getBalance ( billsAccount ) ).to.equal ( 200 );
	});

	test ( "Transfer between sub accounts", function () {
		var billsAccount    = this.manager.createAccount ( null, "Bills", 100 );
		var electricAccount = this.manager.createAccount ( billsAccount, "Electric", 50 );
		var gasAccount      = this.manager.createAccount ( billsAccount, "Gas", 150 );
		this.manager.transfer ( 20, electricAccount, gasAccount );

		expect ( this.manager.getBalance ( electricAccount ) ).to.equal ( 30 );
		expect ( this.manager.getBalance ( gasAccount ) ).to.equal ( 170 );
		expect ( this.manager.getBalance ( billsAccount ) ).to.equal ( 200 );
	});

	test ( "Transfer from sub account to main account", function () {
		var billsAccount    = this.manager.createAccount ( null, "Bills", 100 );
		var currentAccount  = this.manager.createAccount ( null, "Current", 200 );
		var electricAccount = this.manager.createAccount ( billsAccount, "Electric", 50 );
		var gasAccount      = this.manager.createAccount ( billsAccount, "Gas", 150 );

		this.manager.transfer ( 20, electricAccount, currentAccount );

		expect ( this.manager.getBalance ( electricAccount ) ).to.equal ( 30 );
		expect ( this.manager.getBalance ( gasAccount ) ).to.equal ( 150 );
		expect ( this.manager.getBalance ( billsAccount ) ).to.equal ( 180 );
		expect ( this.manager.getBalance ( currentAccount ) ).to.equal ( 220 );

		this.manager.transfer ( 70, gasAccount, currentAccount );

		expect ( this.manager.getBalance ( electricAccount ) ).to.equal ( 30 );
		expect ( this.manager.getBalance ( gasAccount ) ).to.equal ( 80 );
		expect ( this.manager.getBalance ( billsAccount ) ).to.equal ( 110 );
		expect ( this.manager.getBalance ( currentAccount ) ).to.equal ( 290 );
	});

	test ( "Transfer from main account to sub account", function () {
		var billsAccount    = this.manager.createAccount ( null, "Bills", 100 );
		var currentAccount  = this.manager.createAccount ( null, "Current", 200 );
		var electricAccount = this.manager.createAccount ( billsAccount, "Electric", 50 );
		var gasAccount      = this.manager.createAccount ( billsAccount, "Gas", 150 );

		this.manager.transfer ( 20, currentAccount, electricAccount );

		expect ( this.manager.getBalance ( electricAccount ) ).to.equal ( 70 );
		expect ( this.manager.getBalance ( gasAccount ) ).to.equal ( 150 );
		expect ( this.manager.getBalance ( billsAccount ) ).to.equal ( 220 );
		expect ( this.manager.getBalance ( currentAccount ) ).to.equal ( 180 );

		this.manager.transfer ( 70, currentAccount, gasAccount );

		expect ( this.manager.getBalance ( electricAccount ) ).to.equal ( 70 );
		expect ( this.manager.getBalance ( gasAccount ) ).to.equal ( 220 );
		expect ( this.manager.getBalance ( billsAccount ) ).to.equal ( 290 );
		expect ( this.manager.getBalance ( currentAccount ) ).to.equal ( 110 );
	});

});

suite ( "Get Accounts", function () {
	setup ( function () {
	});
	
	test ( "Simple Top Level Accounts ", function () {
		var manager = accountManager.create ();

		var currentAccount = manager.createAccount ( null, "Current", 100.4 );
		var billsAccount   = manager.createAccount ( null, "Bills", 50 );

		var result = manager.getAccounts ();
		expect ( result.length ).to.equal ( 2 );
		expect ( result[0].balance ).to.equal ( (100.4).toFixed (2) );
		expect ( result[1].balance ).to.equal ( (50).toFixed (2) );
		
	});
	
	test ( "Simple Sub Accounts ", function () {
		var manager = accountManager.create ();

		var currentAccount  = manager.createAccount ( null, "Current", 100 );
		var billsAccount    = manager.createAccount ( null, "Bills", 100 );
		var electricAccount = manager.createAccount ( billsAccount, "Electric", 50 );
		var gasAccount      = manager.createAccount ( billsAccount, "Gas",      150 );

		var result = manager.getAccounts ();
		expect ( result.length ).to.equal ( 2 );
		expect ( result[1].balance ).to.equal ( (200).toFixed (2) );
		expect ( result[1].hasSubAccounts ).to.equal ( true );

		var result = manager.getSubAccounts ( billsAccount );
	});
});

suite("Get Statement", function () {
    setup(function () {
    });

    test("Statement List", function () {
        var manager = accountManager.create();
        var currentAccount = manager.createAccount(null, "Current", 100);
        var billsAccount = manager.createAccount(null, "Bills", 100);
        var electricAccount = manager.createAccount(billsAccount, "Electric", 50);
        var gasAccount = manager.createAccount(billsAccount, "Gas", 150);

        manager.transfer(34.56, electricAccount, gasAccount);

        var result = manager.getStatement(electricAccount);
        expect(result.length).to.equal(1);
        expect(result[0].balance).to.equal((15.44).toFixed(2));
        expect(result[0].debit).to.equal(true);
    });

    test("Statement With Sub Accounts", function () {
        var manager = accountManager.create();
        var currentAccount = manager.createAccount(null, "Current", -1345.76);
        var billsAccount = manager.createAccount(null, "Bills", 50);
        var electricityAccount = manager.createAccount(billsAccount, "Electricity", 100.00);
        var gasAccount = manager.createAccount(billsAccount, "Gas", 200.00);
        manager.transfer(50.00, gasAccount, electricityAccount);
        expect(manager.getBalance(electricityAccount)).to.equal(150);
        manager.transfer(10.00, gasAccount, electricityAccount);
        expect(manager.getBalance(electricityAccount)).to.equal(160);
        manager.transfer(25.00, electricityAccount, gasAccount);
        expect(manager.getBalance(electricityAccount)).to.equal(135);
        manager.transfer(1.23, currentAccount, gasAccount);
        manager.transfer(2.34, currentAccount, gasAccount);
        manager.transfer(3.45, currentAccount, gasAccount);
        manager.transfer(4.56, currentAccount, gasAccount);
        manager.transfer(5.67, currentAccount, gasAccount);

       
        var result = manager.getStatement(electricityAccount);
        expect(result.length).to.equal(3);
        expect(result[0].balance).to.equal((135).toFixed(2));
        expect(result[0].debit).to.equal(true);
        expect(result[1].balance).to.equal((160).toFixed(2));
        expect(result[1].debit).to.equal(false);
        expect(result[2].balance).to.equal((150).toFixed(2));
        expect(result[2].debit).to.equal(false);
    });
});


