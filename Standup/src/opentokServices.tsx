import { db } from './firebaseServices';

var OpenTok = require('opentok');
var OTClient = require('@opentok/client');

const apiKey = null;
const apiSecret = null;

var OT = new OpenTok(apiKey, apiSecret);



// Define our own object type for OpenTok Session objects
type OTClientSession = {
  publish: (arg0: any, arg1: (error: any) => void) => void,
  on: (arg0: string, arg1: ((event: any) => void) | undefined) => void,
  subscribe: (arg0: any) => void,
  connect: (arg0: any, arg1: (error: any) => void) => void,
  disconnect: () => void
} | undefined;

type OTPublisher = { on: (arg0: string, arg1: (event: any) => void) => void; };

interface Session {
  clientSessions: Map<string, OTClientSession>,
  publisher: OTPublisher | undefined,
  subscriber: any,
  publisherConnectionID: string,
}

let sessionsMap = new Map();

// Sets the client's publisherConnectionID to the input, needed for disconnect logic
function setPublisherConnectionID(sessionID, publisherConnectionID) {
  if (sessionsMap.get(sessionID) != undefined) {
    sessionsMap.get(sessionID).publisherConnectionID = publisherConnectionID;
    console.log("Set publisher connection id: " + publisherConnectionID)
  }
}

// Makes an OpenTok session server-side
function makeSession(uid) {

  OT.createSession({ mediaMode: "routed" }, function (error, session) {
    if (error) return console.log(error);

    var sessionID = session.sessionId;


    console.log("sessionID: " + sessionID)

    //Adding an undefined instance of a Client-side session for future use, identifiable by the sessionID
    var tempMap = new Map<string, OTClientSession>();
    tempMap.set("", undefined);
    var dummySession: Session = { clientSessions: tempMap, publisher: undefined, subscriber: undefined, publisherConnectionID: "null" };
    sessionsMap.set(sessionID, dummySession);

    addSessionToFirestore(sessionID);

    console.log("Map size:" + sessionsMap.size);
    connectToSession(uid, sessionID, true);

    db.collection('users').doc(uid).update({ isPublisher: true });


  });

}



// Publishes an audio-video feed to the session
function publishSession(uid, sessionID) {
  if (sessionID == "null") {
    return console.log("Cannot publish session: " + sessionID);
  }
  if (sessionsMap.get(sessionID).publisher) {
    return console.log("Cannot publish more than once!");
  }
  //Adds a client-session for the publisher to our own Session interface identified by the sessionID
  addSession(uid, sessionID);

  var session = getClientSession(uid, sessionID);


  var videoTarget = document.getElementById('videoTarget');

  var publisher = OTClient.initPublisher(videoTarget, { insertMode: "replace" }, { resolution: '1280x1280', frameRate: 30 });
  sessionsMap.get(sessionID).publisher = publisher;

  try {
    if (session != undefined) {
      session.publish(publisher, function (error) {
        if (error) console.log(error);
        else console.log("Publishing Session");
      });
      publisher.on('streamCreated', function (event) {
        console.log('The publisher started streaming.');

      });
    }
    else console.log("Unable to Publish!")
  } catch (e) {
    console.log("Unable to Publish due to error!");
  };


}


// Connects and subscribes user to a session on client-side

function connectToSession(uid, sessionID, isPublisher) {
  if (sessionID == "null") {
    return console.log("Unable to connect to session: " + sessionID);
  }

  //using our own Session object and sessionsMap
  if (sessionsMap.get(sessionID) != undefined && sessionsMap.get(sessionID).clientSessions != undefined && getClientSession(uid, sessionID) != undefined) {
    return console.log("Already connected to this session!!!");
  }
  else if (sessionsMap.get(sessionID) == undefined) {
    addSession(uid, sessionID);
    console.log("inside if");
  }
  else if (sessionsMap.get(sessionID).clientSessions == undefined) {
    var tempMap = new Map<string, OTClientSession>();
    tempMap.set(uid, OTClient.initSession(apiKey, sessionID));
    sessionsMap.get(sessionID).clientSessions = tempMap;
    console.log("inside else if");
  }
  else {
    sessionsMap.get(sessionID).clientSessions.set(uid, OTClient.initSession(apiKey, sessionID)); // Adds another client session to our Session object in sessionMaps
  }

  var session = getClientSession(uid, sessionID);
  var token = OT.generateToken(sessionID);

  session.on({
    connectionCreated: function (event) {
      //console.log(getNumConnected(sessionID) + ' connections.');
      console.log("ConnectionCreatedEvent: ConnectionID:" + event.connection.connectionId);
    },
    connectionDestroyed: function (event) {
      //console.log(getNumConnected(sessionID) + ' connections.');
      // Updates relavent firebase info
      var publisherConnectionID = sessionsMap.get(sessionID).publisherConnectionID;
      console.log(event.connection.connectionId + " | " + publisherConnectionID)
      if ((event.connection.connectionId === publisherConnectionID)) {
        db.collection("users").doc(uid).update({
          "OTToken": "null",
          "currentSessionID": "null",
          "isPublisher": false,
          "connectionID": "null"
        });
        session.disconnect();
        console.log("Updated All Users");
      }


      console.log("ConnectionDestroyedEvent: " + event.connection.connectionId);
    },
    sessionDisconnected: function sessionDisconnectHandler(event) {
      // The event is defined by the SessionDisconnectEvent class
      console.log('Disconnected from the session.');
      //document.getElementById('disconnectBtn').style.display = 'none';
      if (event.reason == 'networkDisconnected') {
        alert('Your network connection terminated.')
      }
      // Updates relavent firebase info
      db.collection("users").doc(uid).update({
        "OTToken": "null",
        "currentSessionID": "null",
        "isPublisher": false,
        "connectionID": "null"
      });

    },
    streamCreated: function (event) {
      if (sessionsMap.get(sessionID).subscriber == undefined) {
        sessionsMap.get(sessionID).subscriber = session.subscribe(event.stream);
        console.log("subscribed to stream");
      }
    },
    streamDestroyed: function (event) {
      db.collection("sessions").doc(sessionID).delete();
      console.log("StreamDestroyedEvent");

    }
  });

  // Replace token with your own value:
  var publisherID = "null";
  session.connect(token, function (error) {
    if (error) {
      console.log('Unable to connect: ', error.message);
    } else {
      //document.getElementById('disconnectBtn').style.display = 'block';
      console.log('Connected to the session.');
      //console.log(getNumConnected(sessionID) + " connected to this session.");
      // Updates relevant info in Firebase
      db.collection('users').doc(uid).update({
        "OTToken": token,
        "currentSessionID": sessionID,
        "connectionID": session.connection.connectionId
      });
      if (isPublisher == true) {
        db.collection("sessions").doc(sessionID).update({
          "publisherConnectionID": session.connection.connectionId,
        });
        publisherID = session.connection.connectionId;
      }
    }
  });
  //console.log("Added session: " + sessionID + " with " + getNumConnected(sessionID) + " connections.");

  return publisherID;
}

// Disconnects user from a session and updates Firebase-Firestore data for that user
function disconnect(uid, sessionID, isPublisher, allUsersInSession) {
  if (sessionID == "null") {
    return console.log("Unable to connect to session: " + sessionID);
  }
  var session = getClientSession(uid, sessionID);
  if (session != undefined) {

    if (sessionsMap.get(sessionID).subscriber != undefined) {
      session.unsubscribe(sessionsMap.get(sessionID).subscriber);
      console.log("unsubscribed to stream");
    }

    session.disconnect();

    // Updates relavent firebase info
    db.collection("users").doc(uid).update({
      "OTToken": "null",
      "currentSessionID": "null",
      "isPublisher": false,
      "connectionID": "null"
    });

    if (isPublisher) {
      if (sessionsMap.get(sessionID).publisher != undefined) {
        session.unpublish(getPublisher(sessionID));
        console.log("Session unpublished!");
      }
      db.collection("sessions").doc(sessionID).delete();
    }

    sessionsMap.delete(sessionID);
  }

  else {
    console.log("This session is not defined, cannot disconnect!");
  }


}




// Adds a Session (defined by us) object to sessionsMap
function addSession(uid, sessionID) {
  var tempMap = new Map<string, OTClientSession>();
  var tempClientSession = OTClient.initSession(apiKey, sessionID);
  tempMap.set(uid, tempClientSession);
  var SessionObj: Session = { clientSessions: tempMap, publisher: undefined, subscriber: undefined, publisherConnectionID: "null" };
  sessionsMap.set(sessionID, SessionObj);
}

// Returns the current client session for the current user if defined
function getClientSession(uid, sessionID) {
  if (sessionsMap.get(sessionID) != undefined && sessionsMap.get(sessionID).clientSessions.get(uid) != undefined) {
    return sessionsMap.get(sessionID).clientSessions.get(uid);
  }
  return undefined;
}

// Returns the publisher of the specified session if defined
function getPublisher(sessionID) {
  if (sessionsMap.get(sessionID) != undefined) {
    return sessionsMap.get(sessionID).publisher;
  }
  return undefined;
}



function addSessionToFirestore(sessionID) {
  if (sessionID != "null") {

    db.collection('sessions').doc(sessionID).set({
      "sessionID": sessionID,
      "upvotes": 0,
      "downvotes": 0,
      "publisherConnectionID": "null",
    });
    console.log("added session to database");

  }
}






export {
  makeSession,
  connectToSession,
  publishSession,
  disconnect,
  setPublisherConnectionID,
  sessionsMap
}