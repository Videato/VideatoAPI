var express = require('express');
var router = express.Router();
var Parse = require('parse').Parse;
var Video = Parse.Object.extend("Video");

Parse.initialize("OynHHBhtYiHeKmTt1tj4ZjloR9TVXI9az7fEGiJi", "odyKLYEkPUjj2zPJP1rSgaHiebfFYb4b08Z5IqH1");

/* GET all videos */

// Probably will get rid of this call, maybe implement pagination
router.get('/', function(req, res) {
	console.log("GET: all videos");

	var query = new Parse.Query(Video);
	var resultList = [];

	query.find({
		success: function(results) {
	   	console.log("Successfully retrieved " + results.length + " videos.");

	    	for (var i = 0; i < results.length; i++) { 
	    		resultList.push(results[i]);
	    	}

	    	res.send(resultList);
	  	},
	  	error: function(error) {
	   	console.log("Error getting videos: " + error.code + " " + error.message);
	   	res.status(500).send(error.message);
	  	}
	});
});

/* POST a video */
router.post('/', function(req, res) {
	console.log("POST: ");
	console.log(req.body);

	var video = new Video();

	video.set("name", req.body.name);
	video.set("description", req.body.description);
	video.set("url", req.body.url);
	video.set("votes", 0);
	video.set("categoryId", req.body.categoryId);

	video.save(null, {
		success: function(video) {
	    	console.log('New object created with objectId: ' + video.id);
	    	res.send(video);
 		},
 		error: function(video, error) {
 			console.log('Failed to create new object, with error code: ' + error.message);
 			res.status(500).send(error.message);
 		}
	});
});

module.exports = router;
