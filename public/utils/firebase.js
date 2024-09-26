// firebase.js
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection, addDoc, getDocs, updateDoc, doc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC6UmDxecjF0jF_f7yKfChzhH5xh4AbZfQ",
  authDomain: "task-list-pwa-40c7c.firebaseapp.com",
  projectId: "task-list-pwa-40c7c",
  storageBucket: "task-list-pwa-40c7c.appspot.com",
  messagingSenderId: "974967889968",
  appId: "1:974967889968:web:a949bdc48542b69dbbcdf5",
  measurementId: "G-C4188E1NTP"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// Funções de interação com o Firebase - Firestore
//AddTask
export const addTaskToFirestore = async (task) => {
  try {
    const docRef = await addDoc(collection(db, "tasks"), task);
    console.log("Documento gravado com sucesso. ID = ", docRef.id);
  } catch (e) {
    console.error("Erro ao adicionar documento: ", e);
  }
};
//GetTasks
export const getTasksFromFirestore = async () => {
  const querySnapshot = await getDocs(collection(db, "tasks"));
  return querySnapshot.docs.map(doc => doc.data());
};