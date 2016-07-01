// HOMEWORK WEEK 10 LIRI BOT
// UT BOOT CAMP
// LOUISE K MILLER


// import Node File System module
var fs = require('fs');

// local file storing twitter API keys and access tokens
var keys = require('./keys.js');

// npm package - twitter - api client library for node.js
var Twitter = require('twitter');

// npm package - spotify - api library for node.js
var spotify = require('spotify');

// npm package - request - use to make http calls
var request = require('request');

// save user command line input
var userInput = process.argv;
var command = "";
var param = "";

// first check if instruction should be read from command line or random.txt
if (userInput[2] == "do-what-it-says") {

// instruction to be read from random.txt
 	var data = fs.readFileSync('random.txt', "utf8");
	var dataArr = data.split(',');
	command = dataArr[0].trim();
	if (dataArr[1]) {
		for (var i=1; i<dataArr.length; i++) {
			param = param + dataArr[i].trim() + " ";
		}
	};

// instruction to be read from command line
} else {
	command = userInput[2];
	if (userInput[3]) {
		for (var i=3; i<userInput.length; i++) {
			param = param + userInput[i] + " ";
		}
	};
};

// BONUS - output data to the terminal and to a txt file called log.txt
// each command run gets appended to the log.txt file
// log.txt file is not overwritten each time a command is run
function outToBoth(output){
	fs.appendFileSync("log.txt", output+"\r\n");
	console.log(output);
};

function header(title){
	outToBoth(" ");
	outToBoth(" ");
	outToBoth("**************************************************");
	outToBoth("**             " + title);
	outToBoth("**************************************************");
	outToBoth(" ");
};

// switch statement for three possible commands
switch(command) {
	case "my-tweets":
		// Twitter - show my last 20 tweets and when they were created 
		// use npm twitter

		// output header
		header(command);

		// my twitter id
		param = {screen_name: 'spin2go'};

		// my Twitter API credentials
		var client = new Twitter({
			consumer_key: keys.twitterkeys.consumer_key,
			consumer_secret: keys.twitterkeys.consumer_secret,
			access_token_key: keys.twitterkeys.access_token_key,
			access_token_secret: keys.twitterkeys.access_token_secret
		});
		// call Twitter API using npm twitter; display results in terminal
		client.get('statuses/user_timeline', param, function(err, tweets, response){
			if (!err){
				for (var i=0; i<tweets.length; i++) {
					outToBoth("@" + tweets[i].in_reply_to_screen_name + " " + tweets[i].text);
					outToBoth(tweets[i].created_at);
				}
			} else {
				outToBoth('Error occurred:' +err);
			}
		});
		break;

	case "spotify-this-song":

		// output title to console.log and log.txt
		header(command);

		// check to see if user provided a parameter
		if (param) {
			// if user did, search for a track in Spotify database using Spotify API
			// use use "track" field filter to limit results to tracks with
			// name containing user specified trackName
			trackName = "track:" + param;		
			spotify.search({type: 'track', query: trackName}, function(err, data){
				if (!err) {
					for (var i=0; i<data.tracks.items.length; i++) {
						for (var j=0; j<data.tracks.items[i].artists.length; j++) {
							outToBoth("artist #" + (j+1) + ": " + data.tracks.items[i].artists[j].name);
						};
						outToBoth("song name: " + data.tracks.items[i].name);
						outToBoth("preview link: " + data.tracks.items[i].preview_url);
						outToBoth("album: " + data.tracks.items[i].album.name);
						outToBoth(" ");
					}

				} else {
					outToBoth('Error occurred:' + err);
				}
			});

		} else {
		// if use did not provie a param (i.e., specify a song) then program defaults to "what's my age again" by blink 182
			outToBoth("\"what's my age again\" by blink 182");
		};
	    break;


	case "movie-this":
		//  output section heading to console.log and log.txt
		header(command);

		// OMDb API - Search for a movie in the OMDb database
		// Check to see if user specified a movie (does param exist?)
		// If not, default is Mr. Nobody
		(param!=="") ? (movieName = param) : (movieName = "Mr. Nobody");

		// define queryURL for movie search
		// include rotton tomatoes info
		var queryURL = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&r=json&tomatoes=true&type=movie";

		// use request package to create and send API call for the specific movie 
		request(queryURL, function(err, response, body) {
			if (!err && response.statusCode == 200) {
				outToBoth("Title: " + JSON.parse(body)["Title"]);
				outToBoth("Year: " + JSON.parse(body)["Year"]);
				outToBoth("iMDB Rating: " + JSON.parse(body)["imdbRating"]);
				outToBoth("Country: " + JSON.parse(body)["Country"]);
				outToBoth("Language: " + JSON.parse(body)["Language"]);
				outToBoth("Plot: " + JSON.parse(body)["Plot"]);
				outToBoth("Actors: " + JSON.parse(body)["Actors"]);
				outToBoth("Rotten Tomatoes Rating: " + JSON.parse(body)["tomatoRating"]);
				outToBoth("Rotten Tomatoes URL: " + JSON.parse(body)["tomatoURL"]);
			} else {
				outToBoth('Error occurred:' + err);			
			}
		});
		break;

	
	default:
		outToBoth("oops - something went wrong. did not fit any switch statement");
}
