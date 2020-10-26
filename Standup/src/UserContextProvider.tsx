import React, { useState, useEffect } from 'react';
import * as firebase from 'firebase/app';
import 'firebase/app';

// Necessary to define our own type that matches the firebase.User type so that react works
type FirebaseContext = {
    user: firebase.User | null;
 };

// Creates react context for Firebase user
const UserContext = React.createContext<Partial<FirebaseContext>>({});

const UserContextProvider = ({ children }) => {
    const [user, setUser] = useState(null as firebase.User | null);
    
useEffect(() => {
    firebase.auth().onAuthStateChanged((user: any) => {
      setUser(user);
   });
   
}, []);

return (
    <UserContext.Provider value={{
        user}}>{children} </UserContext.Provider>
  );
}

export {
    UserContext,
    UserContextProvider,
};