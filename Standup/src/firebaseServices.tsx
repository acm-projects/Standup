
import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import { useEffect, useState } from 'react';
import { forEachChild } from 'typescript';
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
        "OTToken": "null",
        "currentSessionID": "null",
        "isPublisher": false,
        "connectionID": "null"
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
                //console.log("updated user in database");
            }
            else {
                db.collection('users').doc(user?.uid).set({
                    "displayName": user?.uid,
                    "OTToken": "null",
                    "currentSessionID": "null",
                    "isPublisher": false,
                    "connectionID": "null",
                });
                //console.log("added user to database");
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
    //console.log("collection: " + collectionID + " | doc: " + docID + " | field: " + fieldID);
    const [fieldData, setFieldData] = useState("null");
    useEffect(() => {
        db.collection(collectionID).doc(docID).onSnapshot((snapshot) => {
            const newData = snapshot.data();
            //console.log(newData);

            if (newData != undefined) {
                setFieldData(newData[fieldID]);


            }

        });



    }, [collectionID, docID, fieldID]);
    //console.log("fieldData: " + fieldData);



    return fieldData;
}

// Returns an entire collection from firebase firestore
function useCollection(collectionID) {
    const [collection, setCollection] = useState(undefined as firebase.firestore.QueryDocumentSnapshot<firebase.firestore.DocumentData>[] | undefined);

    useEffect(() => {
        db.collection(collectionID).onSnapshot((snapshot) => {
            const allDocs = snapshot.docs;
            setCollection(allDocs);
        });

    }, [collectionID]);

    return collection;
}

// Returns collection of all users in a session
function useUsersInSession(sessionID) {
    const [users, setUsers] = useState<string[]>([]);

    useEffect(() => {
        db.collection("users").where("currentSessionID", "==", sessionID).onSnapshot((snapshot) => {
            const allDocs = snapshot.docs;
            let set = new Set<string>();
            allDocs.forEach((doc) => {
                const newData = doc.data();
                if (newData != undefined) {
                    set.add(newData["connectionID"]);
                }
            })
            let arr = Array.from(set);
            console.log("SessionID: " + sessionID + " | [" + arr.toString() + "]");
            setUsers(arr);
        });

    }, [sessionID]);

    return users;
}

export {
    firebaseLogin,
    firebaseLogout,
    useFirebaseUser,
    useDatabase,
    useCollection,
    useUsersInSession,
    db,
    currentUser,
}


