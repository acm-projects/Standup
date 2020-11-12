import { IonButton, IonContent, IonPage, IonCard, IonCardContent, IonSlide, IonImg, IonSlides, IonCardHeader, IonText, IonCardTitle, IonCardSubtitle, IonFab, IonFabButton, IonIcon, IonHeader, IonTitle, IonItemDivider } from '@ionic/react';
import { useEffect, useState } from 'react';
import React from 'react';
import { firebaseLogout, useFirebaseUser, useDatabase, useCollection, useUsersInSession, db } from '../firebaseServices';

import { makeSession, connectToSession, publishSession, disconnect, setPublisherConnectionID } from '../opentokServices';

import { add, thumbsDown, thumbsUp, open } from 'ionicons/icons';

import { useRef } from "react";

const Lobby: React.FC = () => {

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
    var displayName = useDatabase("users", uid, "displayName")

    var roomCount = 0;

    if (publisherConnectionID != "null" && sessionID != "null") {
        setPublisherConnectionID(sessionID, publisherConnectionID);
    }
    else {
        publisherConnectionID = "null";
    }


    const slideOpts = {
        initialSlide: 0,
        speed: 400
    };



    const mySlides = useRef(null);

    const handleSlideChange = async () => {
        const swiper = mySlides.current.getSwiper();
        // setDisablePrevBtn(swiper.isBeginning);
        // setDisableNextBtn(swiper.isEnd);
    };

    const goToNext = async () => {
        const swiper = await mySlides.current.getSwiper();
        swiper.slideNext();
    };


    const goToPrev = async () => {
        const swiper = await mySlides.current.getSwiper();
        swiper.slidePrev();
    };

    var userRole;


    if (isPublisher) {
        userRole = "Entertainer"
    }
    else {
        userRole = "Audience"
    }







    const [countUp, setCountUp] = useState(0);
    const [countDown, setCountDown] = useState(0);



    return (
        <IonPage>

            <IonContent>




                <IonSlides pager={false} options={slideOpts} ref={mySlides} onIonSlideDidChange={handleSlideChange}>
                    <IonSlide className="comedyRoomIonSlide">

                        <div>

                            <div>
                                <IonCard className="ion-margin-top">
                                    <IonCardContent>

                                        <IonTitle className="bigTitle" color="primary">Join a Room!</IonTitle>



                                    </IonCardContent>
                                </IonCard>

                                <IonCard className="comedyRooms">
                                    <IonCardContent className="comedyRooms">

                                        <h1>Available Comedy Rooms</h1>



                                        {allSessions?.map((session) => {
                                            if (session.id != "default")
                                                roomCount++;
                                            /* Only shows the button if the user is not currently in another session */
                                            return (<ul key={session.id}>
                                                {(session.id == "default") ? console.log() : <h1>Room {roomCount}</h1>}
                                                {(sessionID == "null" && session.id !== "default") ? <IonButton onClick={() => { connectToSession(uid, session.id, isPublisher); goToNext(); }}  >Join<IonIcon className="joinBtnIco" icon={open} /></IonButton> : console.log()}
                                            </ul>
                                            );
                                        })}


                                        <IonItemDivider></IonItemDivider>



                                    </IonCardContent>
                                </IonCard>




                            </div>

                            <IonFab vertical="bottom" horizontal="end" slot="fixed">

                                {

                                    (sessionID == "null") ? <IonFabButton onClick={() => { makeSession(uid); goToNext(); }} >
                                        <IonIcon icon={add} /></IonFabButton> : <IonFabButton></IonFabButton>

                                }

                            </IonFab>


                        </div>









                    </IonSlide>
                    <IonSlide>

                        <div>

                            <div className="comedyRoomIonSlide">
                                <IonTitle slot="start" color="primary">Howdy, {userRole}! </IonTitle>
                            </div>





                            <div id="videoTarget" className="videoTarget">
                                <IonCard className="videoCardContainer">
                                    <IonCardContent className="videoCard">



                                    </IonCardContent>

                                </IonCard>
                            </div>

                            <IonCard className="comedyRooms">
                                <IonCardContent className="comedyRooms">
                                    {(sessionID != "null" && isPublisher) ? <IonButton onClick={() => { publishSession(uid, sessionID); goToNext(); }}>Start The Show!</IonButton> : console.log()}
                                    <IonCardTitle>Audience Count: {(allUsersInSession.length)}</IonCardTitle>

                                    {(sessionID != "null") ? <IonButton onClick={() => { disconnect(uid, sessionID, isPublisher, allUsersInSession); goToPrev(); }}>Disconnect</IonButton> : console.log()}

                                    <IonCardSubtitle>Upvotes: {countUp}</IonCardSubtitle>
                                    <IonCardSubtitle>Downvotes: {countDown}</IonCardSubtitle>




                                </IonCardContent>
                            </IonCard>




                        </div>

                        <IonFab vertical="bottom" horizontal="end" slot="fixed">
                            <IonFabButton onClick={() => setCountUp(countUp + 1)}>
                                <IonIcon icon={thumbsUp} />
                            </IonFabButton>
                        </IonFab>


                        <IonFab vertical="bottom" horizontal="start" slot="fixed">
                            <IonFabButton onClick={() => setCountDown(countDown + 1)}>
                                <IonIcon icon={thumbsDown} />
                            </IonFabButton>
                        </IonFab>


                    </IonSlide>
                </IonSlides>








            </IonContent>


        </IonPage >
    );
};


export default Lobby;
