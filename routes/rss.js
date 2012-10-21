/*
TL RSS structure:
<channel>
	<rss>
		<item>
		    <title><![CDATA[Wojciech Cejrowski Boso Salt Mine 2011 DVDRip XviD-JBS]]></title>
			<pubDate>Sun, 21 Oct 2012 00:18:15 +0000</pubDate>
			<category>Episodes</category>
			<guid>http://www.torrentleech.org/torrent/393599</guid>
			<comments><![CDATA[http://www.torrentleech.org/torrent/393599#comments]]></comments>
		    <link><![CDATA[http://www.torrentleech.org/rss/download/393599/e8e695ab52922b603405/Wojciech.Cejrowski.Boso.Salt.Mine.2011.DVDRip.XviD-JBS.torrent]]></link>
		    <description><![CDATA[Category: Episodes - Seeders: 4 - Leechers: 1]]></description>
		 </item>
*/

var request = require('request'),
	xml = require('elementtree');

var rssUrl = 'http://rss.torrentleech.org/e8e695ab52922b603405';

var getFeedItems = function(next) {
	request(rssUrl, function (error, rssResponse, body) {
		console.log('inside request callback');
		if (!error && rssResponse.statusCode == 200) {
			tree = xml.parse(body);
			var items = tree.findall('*/item');
			console.log('items.length: ' + items.length);
			console.info('Fetched ' + items.length + ' items from feed');
		} else {
			console.error('Error fetching RSS feed');
		}

		next(items);
	});
};

var getItemUrlIfFound = function(search_keyword, next) {
	console.log('inside getItemUrlIfFound');
	console.log('search keyword: ' + search_keyword);

	getFeedItems(function(items) {
		for (var i=0; i<items.length; i++) {
			item = items[i];
			title = item.find('title').text.toLowerCase();
			guid = item.find('guid').text;

			if (title.indexOf(search_keyword) != -1) {
				console.log('found search keyword');
				next(guid);
				break;
			}
		}

		if (i == items.length) {
			// Didn't find anything
			next();
		}
	});

};

exports.periodicCheck = function() {
	console.log('in periodicCheck');
	var kw = 'bdrip';	// for test
	getItemUrlIfFound(kw, function(itemUrl) {
		if (itemUrl) {
			console.log('Found search keyword in rss feed: ' + itemUrl);
		} else {
			console.log("Did not find keyword");
		}
	});
};

exports.test = function(req, res) {
	console.log('inside test');
	items = getFeedItems(function(items) {
		console.log('inside getFeedItems callback');
		console.log('returned ' + items.length + ' items');
		res.send('got items count: ' + items.length);
	});
};  

exports.check = function(req, res) {
	console.log('in rss.check');

	var keyword = req.query.keyword;
	console.log('search keyword: ' + keyword);
	getItemUrlIfFound(keyword, function(itemUrl) {
		if (itemUrl) {
			res.send('Found search keyword in rss feed: <a href="' + itemUrl + '">' + itemUrl + '</a>');
		} else {
			res.send("Did not find keyword");
		}
	});
	
};

