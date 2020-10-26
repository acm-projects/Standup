import { connected } from 'process';
import { db, currentUser} from '../firebaseServices';


var OpenTok = require('opentok');
var OTClient = require('@opentok/client');

const apiKey = process.env.REACT_APP_OPENTOK_API_KEY;
const apiSecret = process.env.REACT_APP_OPENTOK_API_SECRET;




var OT = new OpenTok(apiKey, apiSecret);
var Session;
var connectedToSession = false;

// Makes an OpenTok session server-side
function makeSession() {
  
  OT.createSession({mediaMode: "routed"}, function(error, session) {
    if (error) return console.log(error);
    
    var sessionID = session.sessionId;

    db.collection('users').doc(currentUser?.uid).update({"currentSessionID": sessionID})
    console.log("sessionID: " + sessionID)
    
    var token = session.generateToken();
    db.collection('users').doc(currentUser?.uid).update({"OTToken": token})
    connectToSession(token, sessionID);
    
          
  }); 
  
  
}



// Publishes an audio-video feed to the session
function publishSession() {
  var publisher = OTClient.initPublisher({insertMode: "after"}, {resolution: '1280x720', frameRate: 30});
  try {
    if (Session != undefined) {
      Session.publish(publisher, function(error) {
        if (error) console.log(error);
        else console.log("Publishing Session");
      });
      publisher.on('streamCreated', function (event) {
        console.log('The publisher started streaming.');
      });
    }
  } catch (e) {
      console.log("Unable to Publish");
  };
}


// Connects and subscribes user to a session on client-side
var connectionCount = 0;

function connectToSession(token, sessionID) {

  Session = OTClient.initSession(apiKey, sessionID);
  Session.on({
    connectionCreated: function (event) {
      console.log(connectionCount + ' connections.');
    },
    connectionDestroyed: function (event) {
      connectionCount--;
      console.log(connectionCount + ' connections.');
    },
    sessionDisconnected: function sessionDisconnectHandler(event) {
      // The event is defined by the SessionDisconnectEvent class
      console.log('Disconnected from the session.');
      //document.getElementById('disconnectBtn').style.display = 'none';
      if (event.reason == 'networkDisconnected') {
        alert('Your network connection terminated.')
      }
      connectionCount--;
    }
  });
  Session.on("streamCreated", function(event) {
    Session.subscribe(event.stream);
  });
  // Replace token with your own value:
  Session.connect(token, function(error) {
    if (error) {
      console.log('Unable to connect: ', error.message);
    } else {
      //document.getElementById('disconnectBtn').style.display = 'block';
      console.log('Connected to the session.');
      connectionCount++;
      connectedToSession = true;
    }
  });
}

// Disconnects user from a session and updates Firebase-Firestore data for that user
function disconnect() {
  if (Session)
    Session.disconnect();
    db.collection("users").doc(currentUser?.uid).update({
      "OTToken": "",
      "currentSessionID": ""
    });
}






function getSession() {
  return Session;
}

export {
  makeSession,
  connectToSession,
  publishSession,
  disconnect,
  getSession,
  
}