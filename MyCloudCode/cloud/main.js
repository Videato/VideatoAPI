// Make sure the Video submitted is valid 
Parse.Cloud.beforeSave("Video", function(request, response) {
	if (!request.object.get("name")) {
		response.error("Must supply a name field for a video");
	} else if (!request.object.get("url")){
		response.error("Must supply an url field for a video");
	} else if (!request.object.get("categoryId")) {
		response.error("Must supply a categoryId field for a video");
	} else {
		response.success();
	}
});

//Add VoteIps object for video
Parse.Cloud.afterSave("Video", function(request) {
	var ips = new Parse.Object.extend("VoteIps");

	ips.set("videoId", video.id);
	ips.set("ips", []);

 	ips.save(null, {
 		success: function(ips) {
 			console.log("Success saving video ips");
 		},
 		error: function(ips, error) {
 			console.log("Error saving video ips: " + error.message);
 		}
 	});

});

// Make sure the Category submitted is valid
Parse.Cloud.beforeSave("Category", function(request, response) {

	// If the name isn't present error out
	if (!request.object.get("name")) {
		response.error("Category must have a name");
	} else {
		var query = new Parse.Query("Category");
		query.equalTo("name", request.object.get("name"));
		query.first({
			success: function(category) {
				// If the category name exists error out
				if (category) {
					response.error("Category already exists!");
				} else {
					response.success();
				}
			},
			error: function(error) {
				response.error("Could not validate uniqueness of category: " + error);
			}
		});
	}
});