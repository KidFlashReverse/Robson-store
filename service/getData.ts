import { doc, getDoc } from "firebase/firestore";
import { app, db } from "./firebase";

export default async function getData({collection, id}: any) {
    const docRef = doc(db, collection, id);

    let result = null;
    let error = null;

    try{
        result = await getDoc(docRef);
    }catch(e){
        console.log(e);
        error = e;
    }

    return { result, error }
};