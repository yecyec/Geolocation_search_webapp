# GeoFinder

### Introduction:
a user-friendly web app featuring geolocation-based search functionality for displaying CSV data.

**Public url to the GitHub repository:**  https://github.com/yecyec/Geolocation_search_webapp

### Key Components
**Frontend (React)**
The frontend is developed using React, and all files are located under the "client" folder. It provides users with an intuitive and responsive platform to interact with the application, enabling users to search based on geolocation data and display search results.

**Backend (Node.js, Express.js)**
The backend is built on Node.js and Express.js, and all files are located under "server" folder. It handles client requests, validates the requests using middleware, executes search logic, and communicates with the cache and database. 

**Database (MySQL)**
MySQL has been chosen as the database management system because it's simple to use, easy to test locally, and capable of handling moderate-sized datasets. It stores important information like street, city, country, country, latitude and longitude and allows efficient retrieval and manipulation of data during search operations.

**In-memory Cache**
Redis is integrated into the server-side architecture to cache filtered data. By caching search results, Redis reduces the computational overhead of repetitive database queries, and improves the performance and responsiveness of the application.

### Installation Guild
Before proceeding, ensure that you have the following installed on your computer:

Node.js
npm (Node Package Manager)
MySQL
Redis

1. Install Frontend Dependencies

```
# Navigate to the client directory
cd client
# Install dependencies
npm install
```

2. Install Backend Dependencies

```
# Navigate to the server directory
cd server
# Install dependencies
npm install
```

3. Start your mysql and redis server
The command varies depending on your environment.

4. Start Server
```
# Open a new terminal, navigate to the server directory
cd server
node server
```

5. Start Frontend 
```
# Open a new terminal, navigate to the client directory
cd client
npm start
```

### User Interface
Please refer to the images in the "UI" folder to view samples of the user interface.

### Database Migration
1. Make sure you have MySQL installed and running on your computer.
2. Create a new database specifically for this project.
3. Open the `.env` file and update the database-related information such as the host name, database name, username and password, to match your MySQL setup. This ensures that the application can connect to your database correctly.
```
# enter the folder
cd server
# execute migration script
node migration
```
A geolocation table will be created, and verify whether the data in this table matches the data in the CSV file.

### Search Functionality

**Rules:**
There are four rules to follow for the inputs:

1. The keyword must not be empty.
2. Either both latitude and longitude must be present, or neither.
3. Latitude and longitude must be numeric values.
4. Latitude and longitude must fall within reasonable ranges (latitude between -90 and 90, longitude between -180 and 180).

Both the frontend and backend implement validation for these rules. If the frontend violates any of these rules, an error message will be displayed, and no request will be sent. Additionally, a middleware has been added to the server to validate the inputs before executing the search logic.

**Search Score**
The score ranges between 0 and 1 and is sorted in descending order to display the most likely search results. 

When all three parameters (city name, latitude, and longitude) are provided, the city name parameter must be a substring of the city name in the database entry. The score is calculated based on the distance between the real location and the input latitude and longitude. Results that are farther than 1000km away will be filtered out.

When only the city name is provided, the score is calculated based on the match between the provided city name and the city name in the database entry and the length of the whole words in the database entry.

### Optimization
Caching is an important technique for enhancing efficiency, particularly when dealing with frequent database scans. The idea is the potential repetition of the same request or popular keywords being sent multiple times. To address this, Redis has been incorporated into the server-side architecture to facilitate rapid data retrieval without the need for repeated scans of the database table.

Another optimization technique is using asynchronous loading for requests in the frontend. This means that while waiting for responses from the server, the frontend can continue doing other tasks, which provides better user experience.

### Testing
To test the reliability and functionality of the application, unit tests have been added to the searchController.spec.js and computeScore.spec.js files.

**To execute the test file**
```
# Navigate to the server directory
cd server
# run unit testing
npm run test
```