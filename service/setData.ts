import { addDoc, collection, doc, setDoc } from "firebase/firestore";
import { app, db } from "./firebase";

export default async function setData(collection: any, data: object) {
    let result = null;
    let error = null;

    const gerateUID = () => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let resultado = '';

        for(let i = 0; i < 20; i++){
            resultado += characters.charAt(Math.floor(Math.random() * characters.length));
        }

        return resultado;
    };

    
    const UID = gerateUID();

    try{
        result = await setDoc(doc(db, collection,UID), data);
    }catch(e){
        console.log(e);
        error = e;
    }

    return { result, error }
};