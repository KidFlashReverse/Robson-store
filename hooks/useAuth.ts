import { useContext, useEffect, useState } from "react";
import { auth } from "../service/firebase";
import { User, UserCredential, signInWithEmailAndPassword } from "firebase/auth";
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';

export const useAuth = () => {
    const [user, setUser] = useState<UserCredential | User>();

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            if(user){
                setUser(user);
            }else{
                signInWithEmailAndPassword(auth, 'adm@adm.com', 'adm123').then((userCredential) => {
                    setUser(userCredential.user);
                })
            }
        });

        return () => unsubscribe();
    }, []);

    return user;
};

export default useAuth;