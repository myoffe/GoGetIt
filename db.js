/*
User object example:
{
	"email": "myoffe@gmail.com",
	"subscriptions": [{"url": "rss.com/feed", "search_keywords": ["dexter", "game of thrones"]}],
	"notified_items": [ "rss.com/feed/123", "rss.com/feed/552" ]
}
*/

var mongo = require('mongodb'),
  Server = mongo.Server,
  Db = mongo.Db,
  db;

exports.connect(next) = function() {

	var server = new Server('localhost', 27017, {auto_reconnect: true});
	db = new Db('gogetit', server);

	db.open(function(err, db) {
	  if(!err) {
	    console.log("We are connected");
	  } else {
	  	next();
	  }
	});
};

exports.getSubscriptions = function(email) {
	subs = db.users.find({"email":email}, "subscriptions" : 1);
};

exports.addSubscription = function(email, feed_url, search_keyword) {
	/* TODO
		1. find user by email, raise exception if doesn't
		2. find feed URL if already exists, create if doesn't
		3. find search_keyword if already exist, add if doesn't
	*/

	subs = getSubscriptions(email);

	keywords = []
	keywords.append(search_keyword)
	subs.append({"url": feed_url, "search_keywords": keywords});
	subs.save()
};

exports.addNotifiedItem = function(email, item_id) {
	notified_items = db.users.find({"email":email, "notified_items": 1});

	notified_items.append(item_id);
	notified_items.save();
};