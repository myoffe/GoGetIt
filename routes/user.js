var forms = require('../forms'),
	database = require('../db'),
	util = require('util'),
	Q = require('q');


/*
 * GET users listing.
 */

var usersArray = function (callback) {
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

var usersArray2 = function() {
	var usersPromise = database.users();
	console.log('usersPromise: ' + usersPromise);
	var arrayPromise = usersPromise
	.then(function(collection) {
		return Q.ncall(collection.find, collection, {}, {});
	})
	.then(function(users) {
		console.log('users promise fufilled');
		console.log('users: ' + users);
		var promise = Q.ncall(users.toArray, users);
		console.log('array promise: ' + promise);
		return promise;
	});
	console.log('arrayPromise: ' + arrayPromise);

	return arrayPromise;
}

exports.list2 = function(req, res) {
	console.log('in list2');
	var arrPromise = usersArray2();
	console.log('arrPromise: ' + arrPromise);
	var renderPromise = arrPromise.then(function(arr) {
		console.log('array promise fufilled');
		console.log('# users fetched: ' + arr.length);
		res.render('user', {title: 'User Management', users: arr});
	},
	function(err) {
		console.error('array promise rejected');
		throw err;
	});

	console.log('finishing render promise');
	renderPromise.end();
/*
	Q.ncall(usersArray, null).then(function(arr) {
		console.log('list2 then');
		console.log('# users fetched: ' + arr.length);
		res.render('user', {title: 'User Management', users: arr});
	},
	function(err) {
		console.error('error list2 promise');
		throw err;
	});
*/
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


