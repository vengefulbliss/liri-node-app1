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

var movieThis = function(movieQuery) {
	//request npm module
	var request = require('request');
	//if nothing is inputted for movie this. default to "mr. nobody.
	if(movieQuery === undefined) {
		movieQuery = "mr nobody";
	}
	// GET request for http.
	request("http://www.omdapi/?t=" + movieQuery + "&y=&plot=short&r=json", function(error, response, body) {
		if(!error && response.statusCode === 200){
			console.log("* Title of movie:  " + JSON.parse(body).Title);
			console.log("*Year the movie came out: " + JSON.parse(body).Year);
			console.log("* IMDB Rating of the movie: " + JSON.parse(body).imdbRating);
		console.log("* Country produced: " + JSON.parse(body).Country);
		console.log("* Language of the movie" + JSON.parse(body).Language);
		console.log("* Plot of the movie:  " + JSON.parse(body).Plot);
		console.log("* Actors in the movie: " + JSON.parse(body).Actors);
		//for loop parses ratings object to see possible rotten tomato rating.
		//console log if there is one.
		for(var i = 0; i < JSON.parse(body).Ratings.length; i++) {
			if(JSON.parse(body).Ratings[i].Website !== undefined) {
				console.log("*Rotten Tomatoes URL: " + JSON.parse(body).Ratings[i].Website);
			}
		}
	}
});
}
// user input 
if(command === "my-tweets") {
	myTweets();
} else if(command === "spofity-this-song") {
	spotifyThisSong(query);
} else if(command === "movie-this") {
	movieThis(query);
} else if(command === "do-what-it-says") {
	//some functionality from read/load fs npm package.
	var fs = require("fs");
	fs.readFile("random.txt", "utf-8", function(error, data) {
		var command;
		var query;
		// comma will help split the string from the file to help specify command and query. (no comma means command is "my-tweets")
		if(data.indexOf(",") !== -1) {
			var dataArr = data.split(",");
			command = dataArr[0];
			query = dataArr[1];
		} else {
			command = data;
		}
		//app functions
		if(command === "my-tweets") {
			myTweets();
		} else if(command === "spotify-this-song") {
			spotifyThisSong(query);
		} else if(command === "movie-this") {
			movieThis(query);
		} else {
			console.log("Command not valid. Please try again.")
		}
	});
} else if(command === undefined) {
	console.log("Please enter a command to run Liri")
} else {
	console.log("Command not valid. Please try again.")
}
