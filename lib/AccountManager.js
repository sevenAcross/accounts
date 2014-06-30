var Account = require ( "./Account" );
var Transaction = require ( "./Transaction" );

module.exports = {};

/**
*	create ()
*	=========
*
*	Creates and returns a new AccountManager object
*	This allows us to have privately scoped variables
*/

module.exports.create = function ( initialBalance ) {

	var accounts = new Array ();
	var subAccountMap = new Array ();
	var transactions = new Array ();
	
	var calculateBalance = function ( account ) {
		var balance = 0;

		if ( typeof subAccountMap[account] === 'undefined' ) {
			balance = accounts[account].getBalance ();
		} else {
			if ( subAccountMap[account].length == 0 ) {
				balance = accounts[account].getBalance ();
			}
			else {
				subAccountMap[account].forEach ( function ( subAccount ) {
					balance += accounts[subAccount].getBalance ();
				});
		};
		}
		return balance;
	};
	
	var AccountManager = function ( initialBalance ) {
	};

	AccountManager.prototype.createAccount = function ( parent, name, balance ) {
		// Create the new account and store in the accounts
		var account = new Account ( name, balance );
		var index = accounts.length;
		account.id = index;
		accounts[index] = account;

		if ( parent == null ) {
			subAccountMap[index] = new Array (); // Mark as a top level account
		} else {
		    // Check if there is an entry for the parent in the subAccountMap
		    // If not, then create one

		    if ( typeof subAccountMap[parent] === 'undefined' ) {
			    subAccountMap[parent] = new Array ();
		    }

		    subAccountMap[parent].push ( index );
        }
		return index;
	};

	AccountManager.prototype.getBalance = function ( account ) {
		return calculateBalance ( account );
	};

	AccountManager.prototype.getAccountName = function ( account ) {
		return accounts[account].name;
	};
	
	AccountManager.prototype.transfer = function ( amount, sourceIndex, destinationIndex ) {
		accounts[sourceIndex].withdraw ( amount );
		accounts[destinationIndex].deposit ( amount );
		var transaction = new Transaction ( sourceIndex, destinationIndex, amount );
		transactions.push ( transaction );
	};

	AccountManager.prototype.numberOfAccounts = function ( ) {
		return accounts.length;
	};

	AccountManager.prototype.getAccounts = function () {
		var accountList = [];
		
		var first = true;
		
		for ( var id = 0; id < accounts.length; id++ ) {
			
			// If there is an entry in the map then the account is a top level account.
			// If the entry is empty, it has no sub accounts
			// If there is no entry in the map, the account is a sub account
			if ( typeof ( subAccountMap[id] ) == 'undefined' ) {
				// This is a sub account
			} else {
				// This is a top level account
				if ( first === true ) {
					first = false;
				}
				
				var acc = {};
				acc.name = accounts[id].name;
				var balance = calculateBalance ( id );
				acc.balance = balance.toFixed(2);
				if (balance < 0)
				    acc.negativeBalance = true;
				else
				    acc.negativeBalance = false;
				acc.hasSubAccounts = accounts[id].hasSubAccounts;
				acc.id = accounts[id].id;
				
				accountList.push ( acc );
				if ( subAccountMap[id].length === 0 ) {
					// This is a top level account with no sub accounts
				} else {
				    acc.hasSubAccounts = true;
				    acc.numberOfSubAccounts = subAccountMap[id].length;
				}
			}
		}
		return ( accountList );
	};
	
	AccountManager.prototype.getStatement = function ( account ) {
		var statement = [];
		var lastAmount = 0;
		var balance = calculateBalance(account);
		
		var batch = [];
		var limit = Math.min ( 10, transactions.length );
		for ( var id = 0; id < limit; id++ ) {
			batch.push ( transactions[id] );
		}
		batch = batch.reverse();
		
		for ( var id = 0; id < limit; id++ ) {
			var transaction = batch[id];
			if ( transaction.sourceAccount == account || transaction.destinationAccount == account ) {
				var statementEntry = {};
				
				statementEntry.amount = transaction.amount;
				statementEntry.timestamp = transaction.timestamp;
				if ( transaction.sourceAccount == account ) {
					statementEntry.debit = true;
					statementEntry.name = accounts[transaction.destinationAccount].name;
					balance += lastAmount;
					lastAmount = transaction.amount;
				} else {
					statementEntry.name = accounts[transaction.sourceAccount].name;
					statementEntry.debit = false;
					balance += lastAmount;
					lastAmount = -transaction.amount;
				}
				statementEntry.balance = balance.toFixed(2);
				if (balance < 0)
				    statementEntry.negativeBalance = true;
				else
				    statementEntry.negativeBalance = false;

				statement.push ( statementEntry );
			}
		}
		return statement;
	};
	
	AccountManager.prototype.getSubAccounts = function ( parentAccountId ) {

		var accountList = [];

		if ( typeof ( subAccountMap[parentAccountId ] != 'undefined' ) ) {
			if ( subAccountMap[parentAccountId].length > 0 ) {
				subAccountMap[parentAccountId].forEach ( 
						function (subAccount) {
						    var acc = {};
						    acc.name = accounts[subAccount].name;
						    var balance = calculateBalance(subAccount);
						    acc.balance = balance.toFixed(2);
						    acc.negativeBalance = (balance < 0);
						    acc.hasSubAccounts = accounts[subAccount].hasSubAccounts;
						    acc.id = accounts[subAccount].id;
						    accountList.push(acc);
						}
					);
			}
		}
		return accountList;
	};
	
	AccountManager.prototype.getAccountBalance = function (accountId) {
	    return calculateBalance ( accountId ).toFixed (2);
	};

	return new AccountManager ( initialBalance );
};
