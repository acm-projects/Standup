import { IonButton, IonContent, IonPage } from '@ionic/react';
import React from 'react';

import { db, firebaseLogout , useFirebaseUser, useDatabase} from '../firebaseServices';

import { makeSession, connectToSession, publishSession, disconnect, getSession} from './opentokServices';

const Home: React.FC = () => {

  var token = useDatabase("users", "B3ylsUbJZnUe2gNnAeJuPZPCprD3", "OTToken");
  var sessionID = useDatabase("users", "B3ylsUbJZnUe2gNnAeJuPZPCprD3", "currentSessionID");
  var user = useFirebaseUser();
  
  return (
    <IonPage>
     
    <IonContent>

      Home
      <p>UID: {user?.uid}</p>
      <p>Token: {token}</p>
      <p>SessionID: {sessionID}</p>
      <p>Email: {user?.email}</p>      
      <p>Is connected? {(sessionID == "") ? "False" : "True"}</p>
      <IonButton onClick={firebaseLogout}>Logout</IonButton>
      <IonButton onClick={makeSession}>Create a Session</IonButton>
      <IonButton onClick={() => {connectToSession(token, sessionID)}}>Connect</IonButton>
      <IonButton onClick={disconnect}>Disconnect</IonButton>
      <IonButton onClick={(sessionID == "") ? () => {console.log("Not connected, cannot publish!")} : publishSession}>Publish Session</IonButton>


      </IonContent>
      
     
    </IonPage>
  );
};


export default Home;
