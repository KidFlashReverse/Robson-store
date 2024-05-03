import { doc, getDoc, getDocs, collectionGroup, DocumentData } from "firebase/firestore";
import { app, db } from "./firebase";
import { useEffect, useState } from "react";

export default function getAllData(collection: any, set: any) {
    const collectionG = collectionGroup(db, collection);
    let error = null;

    const handleGetData = async() => {
        try{
            const query = await getDocs(collectionG);
            const data = query.docs.map(doc => {return {...doc.data(), id: doc.id}});
            set(data);
        }catch (e){
            console.log(e);
        }
    }

    handleGetData();

    return null;
};