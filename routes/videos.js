var express = require('express');
var router = express.Router();
var Parse = require('parse').Parse;
var Video = Parse.Object.extend("Video");

Parse.initialize("OynHHBhtYiHeKmTt1tj4ZjloR9TVXI9az7fEGiJi", "odyKLYEkPUjj2zPJP1rSgaHiebfFYb4b08Z5IqH1");

var getIp = function(req) {
        return ( req.headers["X-Forwarded-For"] 
        	|| req.headers["x-forwarded-for"] 
        	|| req.client.remoteAddress );
};

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

router.get('/:videoId', function(req, res) {
	console.log("GET: single video");

	var query = new Parse.Query("Video");

	query.equalTo("objectId", req.params.videoId);
	query.first({
		success: function(video) {
			if (!video) {
				res.status(500).send("Must supply a valid video id");
			} else {
				res.send(video);
			}
		},
		error: function(error) {
			response.error("Could not get video with id " + req.params.videoId + ": " + error);
		}
	});
});

/* GET all videos within a category */

router.get('/category/:categoryId', function(req, res) {
	console.log("GET: all videos for a category");

	var query = new Parse.Query(Video);
	var resultList = [];

	if (req.query.top === "true") {
		console.log("Top content");
		query.descending("votes");
	} else {
		query.descending("createdAt");
	}


	query.equalTo("categoryId", req.params.categoryId);
	query.find({
		success: function(results) {
	   	console.log("Successfully retrieved " + results.length + " videos for category " + req.params.categoryId);

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

/* POST a vote to a video */
router.post('/:videoId/vote', function(req, res) {
	console.log("POST: ");
	console.log(req.body);

	var query = new Parse.Query("Video");

	query.equalTo("objectId", req.params.videoId);
	query.first({
		success: function(video) {
			if (!video) {
				res.status(500).send("Must supply a valid video id");
			} 
			if (!req.query.up) {
				res.status(500).send("Must supply a query paramater 'up' that is set to true or false");
			}
			
			if (req.query.up === "true") {
				video.increment("votes");
			} else {
				video.decrement("votes");
			}

			video.save();
			res.send(video);
		},
		error: function(error) {
			response.error("Could not get video with id " + req.params.videoId + ": " + error);
		}
	});
});

module.exports = router;
