var moment = require ( "moment" );

var Transaction = function ( sourceAccount, destinationAccount, amount ) {
	this.sourceAccount = sourceAccount;
	this.destinationAccount = destinationAccount;
	this.amount = amount;
	this.timestamp = moment().format ( 'DD MMM YYYY' );
	this.getAmount = function () {
		return this.amount;
	};
};

module.exports = Transaction;