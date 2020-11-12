import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonIcon, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';




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
import { useFirebaseUser } from './firebaseServices';
import { person, home, happy } from 'ionicons/icons';

/*Pages Imports */
import Home from './pages/Home';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Lobby from "./pages/Lobby";

// Firebase services initialization & configurations



// Main App
const App: React.FC = () => (
    
  <IonApp>



  <IonReactRouter>

    <IonTabs>


      <IonRouterOutlet>
        <Route path="/home" component={useFirebaseUser() ? Home : Login} exact={true} />
        <Route path="/profile" component={useFirebaseUser() ? Profile : Login} exact={true} />
        <Route path="/lobby" component={useFirebaseUser() ? Lobby : Login} exact={true} />
        <Route exact path="/" render={() => <Redirect to="/home" />} />

      </IonRouterOutlet>



      {useFirebaseUser() ?

        < IonTabBar slot="bottom">
          <IonTabButton tab="profile" href="/profile">
            <IonIcon icon={person} />
          </IonTabButton>
          <IonTabButton tab="home" href="/home">
            <IonIcon icon={home} />
          </IonTabButton>
          <IonTabButton tab="comedyroom" href="/lobby">
            <IonIcon icon={happy} />
          </IonTabButton>
        </IonTabBar>

        :

        // Disable Tab Bar when user isn't logged in.
        <IonTabBar>
          // Empty tabbar
        </IonTabBar>

      }
    </IonTabs>





  </IonReactRouter>





</IonApp >
);

export default App;
