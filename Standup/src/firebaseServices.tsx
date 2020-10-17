
import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

const googleAuthProvider = new firebase.auth.GoogleAuthProvider();

// Login with Google Auth
const firebaseLogin = () => {
    firebase.auth().signInWithRedirect(googleAuthProvider) 
};

const firebaseLogout = () => {
    firebase.auth().signOut();
};



export {
    firebaseLogin,
    firebaseLogout,
}


