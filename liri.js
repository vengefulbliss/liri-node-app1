require("dotenv").config();
var keys = require("./keys.js");
var twitter = keys.twitterKey;
var Spotify = require('node-spotify-api');
var request = require('request');
// node liri.js command ( - optional)
var command = process.argv[2];
var query = process.argv[3];
console.log(keys.spotify);

// Functions for 3 main functions of the app
// 	--> do-what-it-says requires the use of functions
var myTweets = function() {
	// Load twitter module from npm
	var Twitter = require('twitter');

	// From exports of keys.js file
	var client = new Twitter(keys.twitter
	);

	// Twitter API parameters
	var params = {
		screen_name: 'liribot3',
		count: 20
	};
 // request 20 most recent tweets.
	client.get('statuses/user_timeline', params, function(error, tweets, response) {
		if(error) { // if there IS an error
			console.log('Error occurred: ' + error);
		} else { // if there is NO error
	  	console.log("My 20 Most Recent Tweets");
	  	console.log("");

	  	for(var i = 0; i < tweets.length; i++) {
	  		console.log("( #" + (i + 1) + " )  " + tweets[i].text);
	  		console.log("Created:  " + tweets[i].created_at);
	  		console.log("");
	  	}
	  }
	});
}

var spotifyThisSong = function(trackQuery) {
	// Load Spotify npm package
	var spotify = new Spotify(keys.spotify); 
	//var spotify = new Spotify(keys.spotify)

	// Default if no input is registerd.
	if(trackQuery === undefined) {
		trackQuery = "I Want It That Way";
	}

	// Spotify API request (if an object is returned, output artist(s), song, preview link,album)
	spotify.search({ type: 'track', query: trackQuery }, function(error, data) {
	    if(error) { // if error
	        console.log('Error occurred: ' + error);
	    } else { // if no error
	    	// For loop is for when a track has multiple artists
				for(var i = 0; i < data.tracks.items[0].artists.length; i++) {
					if(i === 0) {
						console.log("Artist(s):    " + data.tracks.items[0].artists[i].name);
					} else {
						console.log("              " + data.tracks.items[0].artists[i].name);
					}
				}
				console.log("Song:         " + data.tracks.items[0].name);
				console.log("Preview Link: " + data.tracks.items[0].preview_url);
				console.log("Album:        " + data.tracks.items[0].album.name);
	    }
	 
	 		
	});
}

var movieThis = function(movieQuery) {
	// Load request npm module
	//var Imdb = require("imdb");
	//var imdb = new Imdb(keys.imdb);
	// if query that is passed in is undefined, Mr. Nobody becomes the default
	if(movieQuery === undefined) {
		movieQuery = "mr nobody";
	}

	// HTTP GET request
	request("http://www.omdbapi.com/?i=tt3896198&apikey=52314070&" + movieQuery + "&y=&plot=short&r=json", function(error, response, body) {
	  if (!error && response.statusCode === 200) {
	    console.log("* Title of the movie:         " + JSON.parse(body).Title);
	    console.log("* Year the movie came out:    " + JSON.parse(body).Year);
	    console.log("* IMDB Rating of the movie:   " + JSON.parse(body).imdbRating);
	    console.log("* Country produced:           " + JSON.parse(body).Country);
	    console.log("* Language of the movie:      " + JSON.parse(body).Language);
	    console.log("* Plot of the movie:          " + JSON.parse(body).Plot);
	    console.log("* Actors in the movie:        " + JSON.parse(body).Actors);

	    // For loop parses through Ratings object to see if there is a RT rating
	    // 	--> and if there is, it will print it
	    for(var i = 0; i < JSON.parse(body).Ratings.length; i++) {
	    	if(JSON.parse(body).Ratings[i].Source === "Rotten Tomatoes") {
	    		console.log("* Rotten Tomatoes Rating:     " + JSON.parse(body).Ratings[i].Value);
	    		if(JSON.parse(body).Ratings[i].Website !== undefined) {
	    			console.log("* Rotten Tomatoes URL:        " + JSON.parse(body).Ratings[i].Website);
	    		}
	    	}
	    }
	  }
	});
}

// App functionality 
if(command === "my-tweets") {
	myTweets();
} else if(command === "spotify-this-song") {
	spotifyThisSong(query);
} else if(command === "movie-this") {
	movieThis(query);
} else if(command === "do-what-it-says") {
	// App functionality from file read / loads
	var fs = require("fs");

	fs.readFile("random.txt", "utf-8", function(error, data) {
		var command;
		var query;

		// If there is a comma, then we will split the string from file the command and query
		//if there is no comma then only the command is considered (my-tweets)
		if(data.indexOf(",") !== -1) {
			var dataArr = data.split(",");
			command = dataArr[0];
			query = dataArr[1];
		} else {
			command = data;
		}

		// After reading the command from the file, decides which app function to run
		if(command === "my-tweets") {
			myTweets();
		} else if(command === "spotify-this-song") {
			spotifyThisSong(query);
		} else if(command === "movie-this") {
			movieThis(query);
		} else { // Use case where the command is not recognized
			console.log("Command from file is not a valid command! Please try again.")
		}
	});
} else if(command === undefined) { 
	console.log("Please enter a command to run LIRI.")
} else { 
	console.log("Command not recognized! Please try again.")
}