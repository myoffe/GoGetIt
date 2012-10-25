var forms = require('../forms'),
	database = require('../db');


/*
 * GET users listing.
 */

exports.list = function(req, res) {
	database.connect(function(err, db) {
		db.collection('users', function(err, users) {
			userIds = users.find({}, {'email': 1})
			res.render('user', {title: 'User Management', userIds: userIds});
		})
		
	});
};