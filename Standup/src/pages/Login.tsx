import { IonButton, IonContent, IonPage } from '@ionic/react';
import React from 'react';
import { db, firebaseLogin } from '../firebaseServices';


const Login: React.FC = () => {

  return (
    <IonPage>
     
        <IonContent>
            <h1>Login</h1>  
            <IonButton onClick={firebaseLogin}>Login with Google</IonButton>
        </IonContent>      
     
    </IonPage>
  );
};


export default Login;
