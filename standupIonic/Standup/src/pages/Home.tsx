import { IonButton, IonContent, IonPage } from '@ionic/react';
import React, { useContext } from 'react';



import { UserContext } from '../UserContextProvider';
import { firebaseLogin, firebaseLogout } from '../firebaseServices';


var OpenTok = require('opentok');
var OTClient = require('@opentok/client');

var sessionID = 0;

const apiKey = process.env.REACT_APP_OPENTOK_API_KEY;
const apiSecret = process.env.REACT_APP_OPENTOK_API_SECRET;



const OT = new OpenTok(apiKey, apiSecret);

var token = 0;
// The session will the OpenTok Media Router:
OT.createSession({mediaMode:"routed"}, function(err, session) {
    if (err) return console.log(err);

    // save the sessionId
    sessionID = session.sessionId;
    token = OT.generateToken(sessionID);
    console.log("created session");
  });


// Handling all of our errors here by alerting them
function handleError(error) {
  if (error) {
    alert(error.message);
  }
}
var session;

function initializeSession() {

  
  console.log("session ID: " + sessionID);
  session = OTClient.initSession(apiKey, sessionID);


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
