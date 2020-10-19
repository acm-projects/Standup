import { IonButton, IonContent, IonPage } from '@ionic/react';
import React, { useContext } from 'react';



import { UserContext } from '../UserContextProvider';
import { firebaseLogin, firebaseLogout } from '../firebaseServices';

import {initializeSession, disconnect, joinSession} from './opentokServices';


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
      
      <IonButton onClick={joinSession}>Join</IonButton>


      </IonContent>
      
     
    </IonPage>
  );
};


export default Home;
