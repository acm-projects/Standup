
import { IonButton, IonContent, IonPage, IonSlides, IonSlide, IonHeader, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonImg } from '@ionic/react';
import React from 'react';
import { firebaseLogin } from '../firebaseServices';

import { useRef } from "react";


const slideOpts = {
  initialSlide: 0,
  speed: 400
};


const Login: React.FC = () => {



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
  );
};

export default Login;