//read and set any environment variables with the dotenv package.
require("dotenv").config();
var keys = require('./keys.js');
var twitterCredentials = keys.twitterKeys;

//node command for liri.js 
var command = process.argv[2];
var query = process.argv[3];
// lets write out some of the functions.
var myTweets = function () {
	//load npm twitter module.
	var Twitter = require('twitter');
	//takes from exports keys.js file
	var client = new Twitter({
		consumer_key: twitterCredentials.consumer_key,
		consumer_secret: twitterCredentials.consumer_secret,
		access_token_key: twitterCredentials.access_token_key,
		access_token_secret: twitterCredentials.access_token_secret
	});
	//twitter api	
	var params = {
		screen_name: liribot3,
		count: 20
	};
	//get up to.. last 20 tweets.
	client.get('statuses/user_timeline', params, function (error, tweets, responses) {
		if (error) {
			console.log('error' + error);
		} else {
			console.log('My Recent Tweets');
			console.log('');

			for (var i = 0; i < tweets.length; i++) {
				console.log("( #" + (i + 1) + ") " + tweets[i].text);
				console.log("Created: " + tweets[i].created_at);
				console.log("");

			}
		}
	});
}

// load npm package for spotify.
var spotify = require('spotify');
// this will be the default if no input is entered.
if(trackQuery === undefined) {
	trackQuery = "The Sign Ace of Base";
}
//spotify API request. upon return, output the artist, song, preview link, album.
spotify.search({ type: 'track', query: trackQuery }, function(error, data) {
	if(error) {
		console.log(error);
	}
	else {
		console.log("Artist: " + data.tracks.items[0].name);
		console.log("Song: " + data.tracks.items[0].artist.name);
		console.log("Preview Link: " + data.tracks.items[0].preview_url);
		console.log("Album: " + data.tracks.items[0].album.name);
	}
});
