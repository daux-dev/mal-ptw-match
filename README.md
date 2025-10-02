# mal-ptw-match
compares two plan to watch lists from MyAnimeList users and shows matching entries

### how to run locally
1. install nodejs
2. download and unzip project
3. create a file named `.env` in root directory. (can be tricky under windows)
4. generate a mal client id from the API tab in your MAL profile settings
5. edit the `.env` file with a text editor so it contains
```
MAL_ID=your-mal-client-id
PORT=3000
```
6. run `npm install` in a terminal from the root directory to install dependencies
7. run `node app.js`, it should confirm that the server started on port 3000
8. in a webbrowser connect to `http://localhost:3000`
