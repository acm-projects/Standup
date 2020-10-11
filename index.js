/*checking if file works, in cmd:

       Drive:\..\..> node index.js 
*/

/* go to postman.co and download & run postman desktop application to get around CORS
   - then make new request and choose method 'POST' 
   - input http:://localhost:3000/session/hello 
*/ 


/*  NOTES:
       - THIS IS A WORKING VIDEO CALL APPLICATION IT RUNS ON LOCALHOST:3000
       - NEED TO LINK THIS APP TO URL :: POSSIBLY DEPLOY TO HEROKU 
       - ONCE IT IS LINKED, REFER TO https://stackoverflow.com/questions/63377385/inappbrowser-not-opening-in-ionic-react-app
         THE ABOVE LINK IS A WAY TO LINK IONIC-REACT PROJECT TO A URL. 
       - ALSO SEE https://medium.com/@bamboriz1/how-to-convert-website-into-an-app-for-free-with-ionic-4-9201a6f993dc
         THE ABOVE LINK DOES NOT USE IONIC W/ REACT BUT INSTEAD USES ANGULAR 
       - WE NEED TO LOOK AT TRYING TO CONVERT WEBSITE INTO IONIC-REACT PROJECT
*/



// loading environment variables, makes process.env.API_KEY access API_KEY in .env file
require('dotenv').config();

// create app server w/express
const app = require('express')();



// accesing opentok library and initializing opentok client
const openTok = require('opentok');
const OT = new openTok(process.env.API_KEY, process.env.API_SECRET);

// serving index.html to browser via 'GET' request [visiting index.html]
app.get('/', function(request, response) {

        console.log('GET request to /');

        // serving the index.html file back to browser
        response.sendFile(__dirname + '/views/index.html');
})




// serving session.html to browser via 'GET' request [visiting session.html]
// :name is dynamic element that refers to the name of the session the user puts in
app.get('/session/:name', function(request, response) {

    // request.params.name renders ":name" from /session/:name
    console.log('GET request to /session/' + request.params.name);

    // serving the session.html file back to browser
    response.sendFile(__dirname + '/views/session.html');
})


// set of current sessions running in app
let sessions = {};


app.post('/session/:name', function(request, response) {

    // value in url :name, this is the name of the session user puts in
    // the name is a 'request' to the server.
    const name = request.params.name;


    // if sessionId already exists, generate video 
    if(sessions[name]) {

            // generating video token from openTok Api
            const token = OT.generateToken(sessions[name], {
                
                // role:
                // 'subscriber' : can only see other people's video and audio
                // 'moderator' : is a 'publisher' with the ability to kick other people out
                // 'publisher' : can share video and audio and see other people's

                role: "publisher",
                data: 'roomname=' + name
            })

            // the server should 'respond' with existing name & API_KEY (from .env)
            response.send({
            sessionId: sessions[name],
            apiKey: process.env.API_KEY,
            token: token
            })
    }

    // if sessionId does not exist, request a new session be created via openTok api
    else {

        // create session via opentok cloud on browser load
        OT.createSession(function(error, session) {

            // display error if there is one
            if(error) {
    
                console.log(error);
            }

            // we're requesting that the server create a session called 'session' and that the
            // sessionId member be assigned to as the value associated with the key 'name', that
            // the user entered for the video session, so that we can keep track of all current video sessions.  
            sessions[name] = session.sessionId;

            // generating video token from openTok Api
            const token = OT.generateToken(sessions[name], {
                 role: "publisher",
                 data: 'roomname=' + name
            })
    
            // we want the server to respond back in json, with the sessionId, now reflecting
            // sessions[name] and our apiKey from .env file under API_KEY
            response.send({
    
                sessionId: sessions[name],
                apiKey: process.env.API_KEY
            });
    
    
        })

    }

})






// creating port requirement - 3000 for local | process.env.PORT for heroku
const PORT = process.env.PORT || 3000;

// for heroku application to listen on their port
// callback function() runs once the application loads
app.listen(PORT, function() {

    // display if app is working
    console.log('App is working!');
});
