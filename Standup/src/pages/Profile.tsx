import { IonButton, IonCard, IonCardContent, IonCardSubtitle, IonRow, IonCardTitle, IonContent, IonPage, IonText, IonTitle, IonIcon } from '@ionic/react';
import { useEffect, useState } from 'react';
import React from 'react';
import { firebaseLogout, useFirebaseUser, useDatabase, useCollection, useUsersInSession, db } from '../firebaseServices';

import { makeSession, connectToSession, publishSession, disconnect, setPublisherConnectionID } from '../opentokServices';


import { logOut } from 'ionicons/icons';

const Profile: React.FC = () => {

    var user = useFirebaseUser();
    var uid = user ? user.uid : "null";
    var token = useDatabase("users", uid, "OTToken");
    var sessionID = useDatabase("users", uid, "currentSessionID");
    var displayName = useDatabase("users", uid, "displayName")
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

                <IonCard>
                    <IonCardContent>


                        <IonRow margin-bottom margin-top padding-top>

                            <IonButton item-left color="primary" onClick={firebaseLogout}><IonIcon icon={logOut}></IonIcon>Logout</IonButton>
                            <IonCardTitle color="secondary" className="vertical-align smaller-title" text-center margin-left>Done already?</IonCardTitle>
                        </IonRow>

                    </IonCardContent>
                </IonCard>

                <IonCard>

                    <IonCardContent>
                        <IonCardTitle color="primary">
                            Profile
                    </IonCardTitle>
                        <h2>Name: {displayName}</h2>
                        <h2>Email: {user?.email}</h2>
                        <h2>Rank: Rookie</h2>
                        <h2>Total upvotes: 0</h2>
                        <h2>Total downvotes: 0</h2>


                    </IonCardContent>

                </IonCard>






            </IonContent>


        </IonPage >
    );
};


export default Profile;
