<<<<<<< Updated upstream
import React, { useState } from 'react';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonPage, IonButtons, IonMenuButton, IonRow, IonCol, IonButton, IonList, IonItem, IonLabel, IonInput, IonText } from '@ionic/react';
import './Login.scss';
import { setIsLoggedIn, setUsername } from '../data/user/user.actions';
import { connect } from '../data/connect';
import { RouteComponentProps } from 'react-router';

interface OwnProps extends RouteComponentProps {}
=======
import { IonButton, IonContent, IonPage, IonSlides, IonSlide, IonHeader, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonImg } from '@ionic/react';
import React from 'react';
import { firebaseLogin } from '../firebaseServices';

import { useRef } from "react";


const slideOpts = {
  initialSlide: 0,
  speed: 400
};


>>>>>>> Stashed changes

interface DispatchProps {
  setIsLoggedIn: typeof setIsLoggedIn;
  setUsername: typeof setUsername;
}

interface LoginProps extends OwnProps,  DispatchProps { }

const Login: React.FC<LoginProps> = ({setIsLoggedIn, history, setUsername: setUsernameAction}) => {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [usernameError, setUsernameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    if(!username) {
      setUsernameError(true);
    }
    if(!password) {
      setPasswordError(true);
    }

    if(username && password) {
      await setIsLoggedIn(true);
      await setUsernameAction(username);
      history.push('/tabs/schedule', {direction: 'none'});
    }
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





  return (
<<<<<<< Updated upstream
    <IonPage id="login-page">
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton></IonMenuButton>
          </IonButtons>
          <IonTitle>Login</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>

        <div className="login-logo">
          <img src="assets/img/appicon.svg" alt="Ionic logo" />
        </div>

        <form noValidate onSubmit={login}>
          <IonList>
            <IonItem>
              <IonLabel position="stacked" color="primary">Username</IonLabel>
              <IonInput name="username" type="text" value={username} spellCheck={false} autocapitalize="off" onIonChange={e => setUsername(e.detail.value!)}
                required>
              </IonInput>
            </IonItem>

            {formSubmitted && usernameError && <IonText color="danger">
              <p className="ion-padding-start">
                Username is required
              </p>
            </IonText>}

            <IonItem>
              <IonLabel position="stacked" color="primary">Password</IonLabel>
              <IonInput name="password" type="password" value={password} onIonChange={e => setPassword(e.detail.value!)}>
              </IonInput>
            </IonItem>

            {formSubmitted && passwordError && <IonText color="danger">
              <p className="ion-padding-start">
                Password is required
              </p>
            </IonText>}
          </IonList>

          <IonRow>
            <IonCol>
              <IonButton type="submit" expand="block">Login</IonButton>
            </IonCol>
            <IonCol>
              <IonButton routerLink="/signup" color="light" expand="block">Signup</IonButton>
            </IonCol>
          </IonRow>
        </form>

      </IonContent>

    </IonPage>
=======








    <IonPage>





      <IonContent>


        <IonSlides pager={true} options={slideOpts} ref={mySlides} onIonSlideDidChange={handleSlideChange}>
          <IonSlide>

            <div className="splashBack">
              <IonImg src="assets/logoStandup.png"></IonImg>



              <IonButton className="generatecssdotcome_parallelogram" onClick={() => goToNext()}>
                <div className='generatecssdotcome_parallelogram_text'>Get Started </div>
              </IonButton>
            </div>









          </IonSlide>
          <IonSlide>
            <div>
              <IonImg src="assets/logo2.PNG"></IonImg>
              <IonButton onClick={firebaseLogin}>Login with Google</IonButton>
            </div>
          </IonSlide>
        </IonSlides>






      </IonContent>

    </IonPage >
>>>>>>> Stashed changes
  );
};

export default connect<OwnProps, {}, DispatchProps>({
  mapDispatchToProps: {
    setIsLoggedIn,
    setUsername
  },
  component: Login
})