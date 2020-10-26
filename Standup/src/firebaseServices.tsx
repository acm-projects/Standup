
import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import { useEffect, useState } from 'react';
import firebaseConfig from './firebaseConfig.json';
const googleAuthProvider = new firebase.auth.GoogleAuthProvider();

firebase.initializeApp(firebaseConfig);

var currentUser: firebase.User | null; // Stores the current user in a firebase.User object

const db = firebase.firestore();


// Login with Google Auth
function firebaseLogin() {
    firebase.auth().signInWithRedirect(googleAuthProvider) 
}

// Logout function
function firebaseLogout() {
    db.collection("users").doc(currentUser?.uid).update({
        "OTToken": "",
        "currentSessionID": ""
    });
    firebase.auth().signOut();
    
}





// Adds a user to the 'users' collection in Firestore
function addUserToFirestore(user: firebase.User | null) {
    if (user) {
        db.collection('users').doc(user?.uid).get().then((docSnapshot) => {
            if (docSnapshot.exists) {
                db.collection('users').doc(user?.uid).update({
                    "displayName": user?.displayName,
                });
                console.log("updated user in database");
            }
            else {
                db.collection('users').doc(user?.uid).set({
                    "displayName": user?.uid,
                    "OTToken": "",
                    "currentSessionID": ""
                });
                console.log("added user to database");
            }
        });
    }
}






// Returns a firebase.User object (might be null, so use with ? operator cautiously)
function useFirebaseUser() {
    const [user, setUser] = useState(null as firebase.User | null);
    useEffect(() => {
        firebase.auth().onAuthStateChanged(user => {
            user ? setUser(user) : setUser(null);
            addUserToFirestore(user);
        });
    }, []);
    
    currentUser = user;
    return user;
}

 
// Custom react Hook function 
function useDatabase(collectionID, docID, fieldID) {
    console.log("collection: " + collectionID + " | doc: " + docID + " | field: " + fieldID);
    const [fieldData, setFieldData] = useState("null");
    useEffect(() => {
        db.collection(collectionID).doc(docID).onSnapshot((snapshot) => {
            const newData = snapshot.data();
            console.log(newData);
            if (newData !== undefined) 
                setFieldData(newData[fieldID]);
            });
            
        }, []);
    console.log("fieldData: " + fieldData);
    return fieldData;
}


export {
    firebaseLogin,
    firebaseLogout,
    useFirebaseUser,
    useDatabase,
    db,
    currentUser,
}


