// APIs to use:
// OMDb - http://www.omdbapi.com/?i=tt3896198&apikey=b9b84c89

// Node Spotify SPOTIFY_ID=a26833e401d443a7a13656934acb21a4;
  // SPOTIFY_SECRET=630bf8ff8a0e4f57a330099adc882bbb;

// Request
// dotemv

var Spotify = require("node-spotify-api");
var moment = require("moment");
var request = require("request");

// turn on dotenv load up from .env file
require("dotenv").config();

var spotifyKeys = require("./keys.js");

// turn on spotify app
var spotify = new Spotify (spotifyKeys.spotify);

// The type of action you wish to take for the app (whether you want to search a song, concert or movie)
var action = process.argv[2];

// what gets searched
var searchResult = process.argv[3];



function switchCase() {

  switch (action) {

    case 'concert-this':
      bandsInTown(searchResult);                   
      break;                          

    case 'spotify-this-song':
      spotifySearch(searchResult);
      break;

    case 'movie-this':
      movieInfo(searchResult);
      break;

    case 'do-what-it-says':
      getRandom();
      break;

      default:                            
      console.log("Invalid Instruction");

    break;

  }
};

function bandsInTown(searchResult){

if (action === 'concert-this')
{
	var movieName="";
	for (var i = 3; i < process.argv.length; i++)
	{
		movieName+=process.argv[i];
	}
	console.log(movieName);
}
else
{
	movieName = searchResult;
}



var queryUrl = "https://rest.bandsintown.com/artists/"+movieName+"/events?app_id=codingbootcamp";


request(queryUrl, function(error, response, body) {

  if (!error && response.statusCode === 200) {

    var JS = JSON.parse(body);
    for (i = 0; i < JS.length; i++)
    {
      var dTime = JS[i].datetime;
        var month = dTime.substring(5,7);
        var year = dTime.substring(0,4);
        var day = dTime.substring(8,10);
        var dateForm = month + "/" + day + "/" + year
  
      console.log("\n---------------------------------------------------\n");

        
      console.log("Date: " + dateForm);
      console.log("Name: " + JS[i].venue.name);
      console.log("City: " + JS[i].venue.city);
      if (JS[i].venue.region !== "")
      {
        console.log("Country: " + JS[i].venue.region);
      }
      console.log("Country: " + JS[i].venue.country);
      console.log("\n---------------------------------------------------\n");

    }
  }
});
}
function spotifySearch(searchResult) {


  var searchTrack;
  if (searchResult === undefined) {
    searchTrack = "";
  } else {
    searchTrack = searchResult;
  }

  spotify.search({
    type: 'track',
    query: searchTrack
  }, function(error, data) {
    if (error) {
      console.log('Error occurred: ' + error);
      return;
    } else {
      console.log("\n---------------------------------------------------\n");
      console.log("Artist: " + data.tracks.items[0].artists[0].name);
      console.log("Song: " + data.tracks.items[0].name);
      console.log("Preview: " + data.tracks.items[3].preview_url);
      console.log("Album: " + data.tracks.items[0].album.name);
      console.log("\n---------------------------------------------------\n");
      
    }
  });
};
function movieInfo(searchResult) {


  var findMovie;
  if (searchResult === undefined) {
    findMovie = "";
  } else {
    findMovie = searchResult;
  };

  var queryUrl = "http://www.omdbapi.com/?t=" + findMovie + "&y=&plot=short&apikey=trilogy";
  
  request(queryUrl, function(err, res, body) {
  	var bodyOf = JSON.parse(body);
    if (!err && res.statusCode === 200) {
      console.log("\n---------------------------------------------------\n");
      console.log("Title: " + bodyOf.Title);
      console.log("Release Year: " + bodyOf.Year);
      console.log("IMDB Rating: " + bodyOf.imdbRating);
      console.log("Rotten Tomatoes Rating: " + bodyOf.Ratings[1].Value); 
      console.log("Country: " + bodyOf.Country);
      console.log("Language: " + bodyOf.Language);
      console.log("Plot: " + bodyOf.Plot);
      console.log("Actors: " + bodyOf.Actors);
      console.log("\n---------------------------------------------------\n");
    }
  });
};

function getRandom() {
fs.readFile('random.txt', "utf8", function(error, data){

    if (error) {
        return console.log(error);
      }

  
    var dataArr = data.split(",");
    
    if (dataArr[0] === "spotify-this-song") 
    {
      var songcheck = dataArr[1].trim().slice(1, -1);
      spotifySearch(songcheck);
    } 
    else if (dataArr[0] === "concert-this") 
    { 
      if (dataArr[1].charAt(1) === "'")
      {
      	var dLength = dataArr[1].length - 1;
      	var data = dataArr[1].substring(2,dLength);
      	console.log(data);
      	bandsInTown(data);
      }
      else
      {
	      var bandName = dataArr[1].trim();
	      console.log(bandName);
	      bandsInTown(bandName);
	  }
  	  
    } 
    else if(dataArr[0] === "movie-this") 
    {
      var movie_name = dataArr[1].trim().slice(1, -1);
      movieInfo(movie_name);
    } 
    
    });

};

function dataToLog() {

	console.log(dataToLog);

	fs.appendFile('log.txt', dataToLog + '\n', function(err) {
		
		if (err) return console.log('Error logging data to file: ' + err);	
	});
}


switchCase();