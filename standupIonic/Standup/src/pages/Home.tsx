import { IonButton, IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import React, { useContext } from 'react';


import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import { UserContext } from '../UserContextProvider';
import { firebaseLogin, firebaseLogout } from '../firebaseServices';


var OpenTok = require('opentok');
var OTClient = require('@opentok/client');

var sessionID = 0;
var connectionID = 0;

const apiKey = 46950334;
const apiSecret = "0a5385cf4291179ab005da5ecff555e8c5b4637d";

const OT = new OpenTok(apiKey, apiSecret);

var token = 0;
// The session will the OpenTok Media Router:
OT.createSession({mediaMode:"routed"}, function(err, session) {
    if (err) return console.log(err);

    // save the sessionId
    sessionID = session.sessionId;
    token = OT.generateToken(sessionID);
    console.log("create:" + sessionID);
  });


// Handling all of our errors here by alerting them
function handleError(error) {
  if (error) {
    alert(error.message);
  }
}
var session;

function initializeSession() {

  
  console.log("initializeSession" + sessionID);
  session = OTClient.initSession(apiKey, sessionID);

  // Subscribe to a newly created stream

  // Create a publisher
  var publisher = OTClient.initPublisher('publisher', handleError);

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

function disconnect() {
  session.disconnect();
}



const Home: React.FC = () => {


  const currentUser = useContext(UserContext);

  return (
    <IonPage>
     
     <IonContent>

      Home
      
      <p>User: {currentUser.user?.displayName}</p>
      <p>Email: {currentUser.user?.email}</p>      

      <IonButton onClick={currentUser.user ? firebaseLogout: firebaseLogin}>
        Login/Logout      
      </IonButton>
      <IonButton onClick={initializeSession}>Create a Vonage Session</IonButton>
      <IonButton onClick={disconnect}>Disconnect</IonButton>
     </IonContent>
      
     
    </IonPage>
  );
};


export default Home;
