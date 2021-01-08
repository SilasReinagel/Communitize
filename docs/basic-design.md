Communitize - Backend

- Mongo
- JS Lib

Use Cases:
X - Create User
X - Get User Profile
X - Update User Profile
X - Add Post
X - Get Recent Posts
X - Like Post
X - Add Post Comment

Data:
Document Types:

Validate Schema

User Profile
- Id
- Username
- Bio
- DoB
- Links 
	- Twitter
	- LinkedIn
	- Website

UserPost
- Id
- UserId
- Username
- Timestamp
- PhotoUrl
- Title
- Body
- Scores[]
- Comments[]

	PostComment
	- PostId
	- UserId
	- Username
	- Timestamp
	- Comment

	PostScore
	- PostId
	- UserId
	- Username
	- Timestamp
	- Value

