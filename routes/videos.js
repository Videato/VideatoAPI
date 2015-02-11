var express = require('express');
var router = express.Router();
var Parse = require('parse').Parse;

Parse.initialize("OynHHBhtYiHeKmTt1tj4ZjloR9TVXI9az7fEGiJi", "odyKLYEkPUjj2zPJP1rSgaHiebfFYb4b08Z5IqH1");

/* GET all videos */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

/* POST a video */
router.post('/', function(req, res) {
	console.log("POST: ");
	console.log(req.body);

	var Video = Parse.Object.extend("Video");
	var video = new Video();

	video.set("name", req.body.name);
	video.set("description", req.body.description);
	video.set("url", req.body.url);
	video.set("votes", 0);
	video.set("categoryId", req.body.categoryId);

	video.save(null, {
		success: function(video) {
			return res.send(video);
	    	console.log('New object created with objectId: ' + video.id);
 		},
 		error: function(video, error) {
 			res.status(500).send(error.message);
	    	console.log('Failed to create new object, with error code: ' + error.message);
 		}
	});
});

module.exports = router;
