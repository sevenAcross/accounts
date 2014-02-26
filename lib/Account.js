var Account = function ( initialName, initialBalance ) {
	this.balance = 0;
	this.name = "";
	this.id = -1;

	if ( parseInt ( initialBalance ) ) {
		this.balance = initialBalance;
		this.name = initialName;
	};

	this.getBalance = function () {
		return this.balance;
	};

	this.deposit = function ( amount ) {
		this.balance += amount;
	};

	this.withdraw = function ( amount ) {
		this.balance -= amount;
	};
};

module.exports = Account;

