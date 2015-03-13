# VideatoAPI
API for the Videato app

video schema:
	name: string, required
	url: string, required
	categoryId: string, required
	description: string, not required
	timestamp: string, given
	votes: number, set to 0

category schema:
	name: string, required


GET 
/videos 
	Get all videos

GET
/videos?search=abc
	Get all videos with 'abc' in the name or description

GET
/videos/:videoId
	Get single video

GET
/videos/category/:categoryId
	Get all videos for a category

GET
/videos/category/:categoryId?top=true
	Get top videos for a category

GET
/categories
	Get all categories

POST
/videos
	Post a new video 

POST
/videos/:videoId/vote?up=true
	Post an upvote to a video

POST
/videos/:videoId/vote?up=false
	Post an upvote to a video

POST
/categories
	Post a new category
