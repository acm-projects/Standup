import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';

/*Pages Imports */
import Home from './pages/Home';


/* Firebase Initialization */
import * as firebase from 'firebase/app';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';

import { UserContext, UserContextProvider } from './UserContextProvider';

// Firebase services initialization & configurations
var firebaseConfig = {
  apiKey: "AIzaSyCPDJA--fR3525vZXh_bkF-Piplurm5IJQ",
  authDomain: "standuptest-8d545.firebaseapp.com",
  databaseURL: "https://standuptest-8d545.firebaseio.com",
  projectId: "standuptest-8d545",
  storageBucket: "standuptest-8d545.appspot.com",
  messagingSenderId: "58134839933",
  appId: "1:58134839933:web:630bb5ef233e9a84cee714",
  measurementId: "G-85RB1CTVEG"
};

firebase.initializeApp(firebaseConfig);

// Main App
const App: React.FC = () => (

    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          <Route path="/home" component={Home} exact={true} />
          <Route exact path="/" render={() => <Redirect to="/home" />} />
       
        </IonRouterOutlet>
      </IonReactRouter>
      
    </IonApp>
);

export default App;
