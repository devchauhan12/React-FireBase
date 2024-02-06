import React from 'react'
import { db } from './firebase';
import { child, get, ref } from 'firebase/database';
const Realtime = () => {
    const dbf = ref(db);
    get(child(dbf, `/Users`)).then((snapshot) => {
        if (snapshot.exists()) {
            console.log(snapshot.val());
        } else {
            console.log("No data available");
        }
    }).catch((error) => {
        console.error(error);
    });

    return (
        <h1>hii</h1>
    )
}

export default Realtime