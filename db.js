/*
User object example:
{
	"email": "myoffe@gmail.com",
	"subscriptions": [ {feed: FEED_ID, filter = 'dexter'}, ...],
	"notified_items": [ "rss.com/feed/123", "rss.com/feed/552" ]
}

Feed {
	'website': 'The Pirate Bay'
	'category': 'Highres - TV shows',
	'url': 'http://rss.thepiratebay.se/208'
}
*/

var mongo = require('mongodb'),
  Server = mongo.Server,
  Db = mongo.Db;


exports.connect = function(callback) {
	var server = new Server('localhost', 27017, {auto_reconnect: true});
	var db = new Db('gogetit', server);

	db.open(function(err, db) {
		if (!err) {
			console.log('Database connected');
			if (callback) {
				callback(null, db);	
			}
		} else if (callback) {
			callback(new Error('Failed connecting DB'));
		}	  
	});
};

exports.users = function(callback) {
	exports.connect(function(err, db) {
		if (err) return callback(err);

		db.collection('users', function(err, users) {
			if (err) return callback(err);

			callback(null, users);
		});
	})
}


exports.getSubscriptions = function(email, callback) {
	connect(function(err, db) {
		subs = db.users.find({"email":email}, {"subscriptions" : 1}, callback)
	});
};

exports.addSubscription = function(email, feed, search_keyword, callback) {
	// TODO check for DB errors
	connect(function(db) {
		db.users.count({'email': email, 'feed': feed._id, 'filter': search_keyword}, {}, function(err, count) {
			if (count != 0) {
				console.info('Subscription already exists');
			}

			db.users.findOne({'email': email}, {}, function(err, user) {
				user.subscriptions.push({'feed': feed._id, 'filter': search_keyword});
				db.users.insert(user, {}, callback);
			})
			
		});
	});
	
};

exports.addNotifiedItem = function(email, item_id, callback) {
	connect(function(err, db) {
		user = db.users.findOne({"email":email}, {"notified_items": 1}, function(err, user) {
			user.push(item_id);
			db.users.insert(user, {}, callback);			
		});
	});
};

exports.addFeed = function(website, url) {
	connect();
	db.feeds.insert({'website': website, 'url': url})
}

exports.getFeeds = function() {
	connect();
	return db.feeds.find();
}

