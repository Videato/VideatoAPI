var express = require('express');
var router = express.Router();
var Parse = require('parse').Parse;
var Category = Parse.Object.extend("Category");

Parse.initialize("OynHHBhtYiHeKmTt1tj4ZjloR9TVXI9az7fEGiJi", "odyKLYEkPUjj2zPJP1rSgaHiebfFYb4b08Z5IqH1");

/* GET all categories */
router.get('/', function(req, res) {
	console.log("GET: all categories");

	var query = new Parse.Query(Category);
	var resultList = [];

	query.find({
		success: function(results) {
	   	console.log("Successfully retrieved " + results.length + " categories.");

	    	for (var i = 0; i < results.length; i++) { 
	    		resultList.push(results[i]);
	    	}

	    	res.send(resultList);
	  	},
	  	error: function(error) {
	   	console.log("Error getting categories: " + error.code + " " + error.message);
	   	res.status(500).send(error.message);
	  	}
	});
});

/* POST a category */
router.post('/', function(req, res) {
	console.log("POST: ");
	console.log(req.body);

	var category = new Category();

	category.set("name", req.body.name);

	category.save(null, {
		success: function(category) {
	    	console.log('New object created with objectId: ' + category.id);
	    	res.send(category);
 		},
 		error: function(category, error) {
 			console.log('Failed to create new object, with error code: ' + error.message);
 			res.status(500).send(error.message);
 		}
	});
});

module.exports = router;
