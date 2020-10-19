var OpenTok = require('opentok');
var OTClient = require('@opentok/client');

var sessionID = 0;

const apiKey = process.env.REACT_APP_OPENTOK_API_KEY;
const apiSecret = process.env.REACT_APP_OPENTOK_API_SECRET;



const OT = new OpenTok(apiKey, apiSecret);


// Handling all of our errors here by alerting them
function handleError(error) {
    if (error) {
        alert(error.message);
    }
}

// The session will the OpenTok Media Router:

OT.createSession({mediaMode:"routed"}, function(err, session) {
    if (err) return console.log(err);

    // save the sessionId
    sessionID = session.sessionId;
    
    console.log("created session");

    });


var session;
var publisher;
var subscriber;

// Initialize a session
function initializeSession() {

  
  console.log("session ID: " + sessionID);
  session = OTClient.initSession(apiKey, sessionID);
  
  var token = OT.generateToken(sessionID, {
      role: 'publisher'
    });
  

  // Create a publisher
  publisher = OTClient.initPublisher('publisher', handleError);

  // Connect to the session
  session.connect(token, function(error) {
    // If the connection is successful, publish to the session
    if (error) {
      handleError(error);
    } else {
      session.publish(publisher, handleError);
    }
  });

}




// Join the session
function joinSession() {
    var token = OT.generateToken(sessionID, {
        role: "subscriber"
    });

    session.connect(token, function(error) {
        if (error) {
              console.log("Error connecting: ", error.name, error.message);
        } else {
              console.log("Connected to the session.");
        }
    });
    console.log(sessionID)
}



function disconnect() {
  session.disconnect();
}

export {
    disconnect,
    initializeSession,
    joinSession,
}