import { IonButton, IonContent, IonPage } from '@ionic/react';
import { useEffect, useState } from 'react';
import React from 'react';
import { firebaseLogout, useFirebaseUser, useDatabase, useCollection, useUsersInSession, db} from '../firebaseServices';

import { makeSession, connectToSession, publishSession, disconnect, setPublisherConnectionID } from '../opentokServices';

const Home: React.FC = () => {

  var user = useFirebaseUser();
  var uid = user ? user.uid : "null";
  var token = useDatabase("users", uid, "OTToken");
  var sessionID = useDatabase("users", uid, "currentSessionID");
  var allUsersInSession = useUsersInSession(sessionID);
  var isPublisher = useDatabase("users", uid, "isPublisher");
  var allSessions = useCollection("sessions");
  var connectionID = useDatabase("users", uid, "connectionID");
  var upvotes = useDatabase("sessions", sessionID, "upvotes");
  var downvotes = useDatabase("sessions", sessionID, "downvotes");
  var publisherConnectionID = useDatabase("sessions", sessionID, "publisherConnectionID");
  
  if (publisherConnectionID != "null" && sessionID != "null") {
    setPublisherConnectionID(sessionID, publisherConnectionID);
  }
  else {
    publisherConnectionID = "null";
  }

  return (
    <IonPage>
     
    <IonContent>

      <h1>Home</h1>
      <p>UID: {uid}</p>
      <p>Token: {token}</p>
      <p>SessionID: {sessionID}</p>
      <p>Email: {user?.email}</p>      
      <p>Is connected? {(sessionID == "null") ? "False" : "True"}</p>
      <p>Is publisher? {isPublisher ? "True" : "False"}</p>
      <p>ConnectionID: {connectionID}</p>
      <p>Publisher ConnnectionID: {publisherConnectionID} </p>
      {/*Buttons to be implemented in final product*/}
      <IonButton onClick={firebaseLogout}>Logout</IonButton>
      {/*Creates a Session, should only be available if sessionID == "null"*/}
      {(sessionID == "null") ? <IonButton onClick={() => {makeSession(uid)}}>Create a Session</IonButton> : console.log()}
      {/*Disconnects from the user's current session, should only be available if sessionID != "null"*/}
      {(sessionID != "null") ? <IonButton onClick={() => {disconnect(uid, sessionID, isPublisher, allUsersInSession);}}>Disconnect</IonButton> : console.log()}
      {/*Publishes video feed to a session, should only be available if sessionID == "null" and if current user is a publisher*/}
      {(sessionID != "null" && isPublisher) ? <IonButton onClick={() => {publishSession(uid, sessionID)}}>Publish Session</IonButton> : console.log()}
      {/*Lists out all available sessions*/}
      
      <div> 
        <h2>All Available Sessions</h2>
        {allSessions?.map((session) => {
          if (session.id != "default")
            /* Only shows the button if the user is not currently in another session */
            return (<li key={session.id}>
                      {(session.id == "default") ? console.log() : session.id}
                      {(sessionID == "null") ? <IonButton onClick={() => connectToSession(uid, session.id, isPublisher)}>Join</IonButton> : console.log()}
                    </li>
            );
        })}
      </div>
      {/* Lists out all the users in the user's current session */}
      <div> 
        <h2>All Users in Session: {sessionID}</h2>
        {
            allUsersInSession.toString()
        }
      </div>

      </IonContent>
      
     
    </IonPage>
  );
};


export default Home;
