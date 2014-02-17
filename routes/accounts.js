/**
 * New node file
 */
module.exports = function ( app, manager ) {
	app.get ( '/api/accounts', function ( req, res ) {
		res.render ( 'accounts', { accounts:  ( manager.getAccounts () )} ); 
	});
};