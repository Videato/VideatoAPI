
// Use Parse.Cloud.define to define as many cloud functions as you want.
// For example:
Parse.Cloud.define("hello", function(request, response) {
  response.success("Hello world!");
});

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
