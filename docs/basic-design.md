Communitize - Backend

- Mongo
- JS Lib

Use Cases:
- Create User
- Update User Profile
- Add Post
- Get Posts
- Like Post
- Add Post Comment

Data:
Document Types:

User
- UserId
- Username

User Profile
- User
- Bio
- DoB
- Links 
	- Twitter
	- LinkedIn
	- Website

UserPost
- PostId
- User
- Timestamp
- PhotoUrl
- Title
- Body
- PostScore[]
- PostComment[]

	PostComment
	- PostId
	- User
	- Timestamp
	- Comment

	PostScore
	- PostId
	- User
	- Timestamp
	- Value

