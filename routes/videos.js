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

// Optional search paramater to filter results
router.get('/', function(req, res) {
	console.log("GET: all videos");

	var query = new Parse.Query(Video);
	var resultList = [];
	var search;

	if (req.query.search) {
		search = req.query.search.toLowerCase();
	}

	query.find({
		success: function(results) {
			var result;
			var name, description;
	   	console.log("Successfully retrieved " + results.length + " videos.");

	    	for (var i = 0; i < results.length; i++) { 
	    		result = results[i];
	    		name = result.get("name").toLowerCase();
	    		description = result.get("description").toLowerCase();

	    		if (!search || ((name.indexOf(search) > -1) ||
	    		 (description.indexOf(search) > -1))) {
	    			resultList.push(results[i]);
	    		}
	    	}

	    	return res.send(resultList);
	  	},
	  	error: function(error) {
	   	console.log("Error getting videos: " + error.code + " " + error.message);
	   	return res.status(500).send(error.message);
	  	}
	});
});

/* GET a specific video by videoId */
router.get('/:videoId', function(req, res) {
	console.log("GET: single video");

	var query = new Parse.Query("Video");

	query.equalTo("objectId", req.params.videoId);
	query.first({
		success: function(video) {
			if (!video) {
				return res.status(500).send("Must supply a valid video id");
			} else {
				return res.send(video);
			}
		},
		error: function(error) {
			return res.status(500).send("Could not get video with id " + req.params.videoId + ": " + error.message);
		}
	});
});

/* GET all videos within a category */

// Optional top paramter to filter the videos by votes and only 
// return 10, otherwise all videos will be returned sorted by most
// recent
router.get('/category/:categoryId', function(req, res) {
	console.log("GET: all videos for a category");

	var query = new Parse.Query(Video);
	var resultList = [];
	var weekAgo = new Date();

	weekAgo.setDate(weekAgo.getDate() - 7);

	if (req.query.top === "true") {
		console.log("Top content");
		query.descending("votes");
		query.greaterThan("createdAt", weekAgo);
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

	    	return res.send(resultList);
	  	},
	  	error: function(error) {
	   	console.log("Error getting videos: " + error.code + " " + error.message);
	   	return res.status(500).send(error.message);
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

	    	return res.send(video);
 		},
 		error: function(video, error) {
 			console.log('Failed to create new object, with error code: ' + error.message);
 			return res.status(500).send(error.message);
 		}
	});
});

/* POST a vote to a video */

// Must supplay a paramter up, either set to true or false
// This paramater determines if the videos gets upvoted or
// downvoted
router.post('/:videoId/vote', function(req, res) {
	console.log("POST: ");
	console.log(req.body);

	var videoQuery = new Parse.Query("Video");
	var ipQuery = new Parse.Query("VoteIps");
	var ip = req.headers['x-forwarded-for'] || 
    req.connection.remoteAddress || 
    req.socket.remoteAddress ||
  	 req.connection.socket.remoteAddress;

  	console.log("IP Address: " + ip);

	videoQuery.equalTo("objectId", req.params.videoId);
	videoQuery.first({
		success: function(video) {
			if (!video) {
				return res.status(500).send("Must supply a valid video id");
			} 
			if (!req.query.up) {
				return res.status(500).send("Must supply a query paramater 'up' that is set to true or false");
			}

			ipQuery.equalTo("videoId", video.id);
			ipQuery.first({
				success: function(voteIps) {
					if (!voteIps) {
						return res.status(500).send("Error voting for video: " + video.id);
					}
					if (!voteIps.get("ips") || !(voteIps.get("ips").indexOf(ip) > -1)) {
						voteIps.addUnique("ips", ip);

						if (req.query.up === "true") {
							video.increment("votes");
						} else {
							video.increment("votes", -1);
						}

						video.save();
						voteIps.save();
						return res.send(video);
					} else {
						return res.status(500).send("This ip address: " + ip + " has already voted for the video");
					}
				},
				error: function(error) {
					return res.status(500).send('Bad stuff yo');
				}
			});
		},
		error: function(error) {
			return res.status(500).send("Could not get video with id " + req.params.videoId + ": " + error);
		}
	});
});

module.exports = router;
