An FCC project of API and Microservices Projects

Exercise Tracker REST API

User Stories
1. can create a user by posting form data username to /api/exercise/new-user and returned will be an object with username and _id.
2. can get an array of all users by getting api/exercise/users with the same info as when creating a user.
3. can add an exercise to any user by posting form data userId(_id), description, duration, and optionally date to /api/exercise/add. 
  If no date supplied it will use current date. Returned will be the user object with also the exercise fields added.
4. can retrieve a full exercise log of any user by getting /api/exercise/log with a parameter of userId(_id). Return will be the user
  object with added array log and count (total exercise count).
5. can retrieve part of the log of any user by also passing along optional parameters of from & to or limit. 
  (Date format yyyy-mm-dd, limit = int)
