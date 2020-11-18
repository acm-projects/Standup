import { IonButton, IonCard, IonContent, IonImg, IonLabel, IonList, IonItemSliding, IonItem, IonHeader, IonPage, IonCardTitle, IonTitle, IonText } from '@ionic/react';
import { useEffect, useState } from 'react';
import React from 'react';
import { firebaseLogout, useFirebaseUser, useDatabase, useCollection, useUsersInSession, db } from '../firebaseServices';

import { makeSession, connectToSession, publishSession, disconnect, setPublisherConnectionID } from '../opentokServices';

const Home: React.FC = () => {

  var user = useFirebaseUser();
  var uid = user ? user.uid : "null";
  var token = useDatabase("users", uid, "OTToken");
  var sessionID = useDatabase("users", uid, "currentSessionID");
  var allUsersInSession = useUsersInSession(sessionID);
  var isPublisher = useDatabase("users", uid, "isPublisher");
  var allSessions = useCollection("sessions");
  var allUsers = useCollection("users")
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

  var userCount = 0;

  return (
    <IonPage>

      <IonContent>
          <IonImg src="assets/logoStandup.png"></IonImg>
        <IonCard className="fullPageCard">
          
          <IonCardTitle color="primary" className="topComHead">Top Comedians</IonCardTitle>
          <IonList>
            <IonItem>
              <IonLabel>1st</IonLabel>
              <IonLabel>Cory Pekkala</IonLabel>
            </IonItem>
            <IonItem>
              <IonLabel>2nd</IonLabel>
              <IonLabel>Attack Helicopter</IonLabel>
            </IonItem>
            <IonItem>
              <IonLabel>3rd</IonLabel>
              <IonLabel>Pranay Yadav</IonLabel>
            </IonItem>
            <IonItem>
              <IonLabel>4th</IonLabel>
              <IonLabel>Trent Hardy</IonLabel>
            </IonItem>
            <IonItem>
              <IonLabel>5th</IonLabel>
              <IonLabel>Zulfi</IonLabel>
            </IonItem>
            <IonItem>
              <IonLabel></IonLabel>
              <IonLabel></IonLabel>
            </IonItem>
          </IonList>


        </IonCard>




      </IonContent>


    </IonPage>
  );
};


export default Home;
