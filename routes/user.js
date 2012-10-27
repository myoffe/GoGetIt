var forms = require('../forms'),
	database = require('../db'),
	util = require('util');


/*
 * GET users listing.
 */

usersArray = function (callback) {
	database.users(function(err, collection) {
		collection.find({}, {}, function(err, users) {
			if (err) callback(err);
			else {
				users.toArray(function(err, usersArray) {
					callback(null, usersArray);
				});
			}
		});
	});
}

exports.list = function(req, res) {
	usersArray(function(err, arr) {
		if (err) {
			throw err;
		} else {
			console.log('# users fetched: ' + arr.length);
			res.render('user', {title: 'User Management', users: arr});
		}
	});
};

exports.create = function(req, res) {
	console.info('POST params: ' + req.body);
	database.users(function(err, users) {
		if (err) throw err;

		users.insert({email: req.body.email}, function(err, docs) {
			if (err) throw err;

			console.log('inserted into DB:' + docs);
			res.send('new user added!')
		});
	});
}


