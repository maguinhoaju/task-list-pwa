// firebase.js
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, updateProfile } from "firebase/auth";
import { getFirestore, collection, doc, addDoc, getDocs, setDoc } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyC6UmDxecjF0jF_f7yKfChzhH5xh4AbZfQ",
  authDomain: "task-list-pwa-40c7c.firebaseapp.com",
  projectId: "task-list-pwa-40c7c",
  storageBucket: "task-list-pwa-40c7c.appspot.com",
  messagingSenderId: "974967889968",
  appId: "1:974967889968:web:a949bdc48542b69dbbcdf5",
  measurementId: "G-C4188E1NTP"
  /*
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,*/
};

const app = initializeApp(firebaseConfig);
// Inicializa o Firebase Analytics
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);

export const addTaskToFirestore = async (task) => {
    try {
        if (typeof task === 'object' && !Array.isArray(task) && task !== null) {
            if (Object.keys(task).length === 0) {
                throw new Error("O objeto de tarefa está vazio.");
            }

            const docRef = await addDoc(collection(db, "tasks"), task);
            console.log('Documento escrito com sucesso: ', docRef.id);
        } else {
            throw new Error("Dados inválidos para adicionar ao Firestore. Esperado um objeto.");
        }
    } catch (error) {
        console.error("Erro ao adicionar o documento:", error);
    }
};

export const getTasksFromFirestore = async () => {
    try {
        const querySnapshot = await getDocs(collection(db, 'tasks'));
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));
    } catch (error) {
        console.error("Erro ao obter tarefas do Firestore:", error);
        return [];
    }
};

export const signUp = async (email, password, displayName, photoURL) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        await updateProfile(user, { displayName, photoURL });

        await addDoc(collection(db, 'users'), {
            uid: user.uid,
            email: user.email,
            displayName,
            photoURL,
            createdAt: new Date(),
        });

        return user;
    } catch (error) {
        console.error("Erro ao criar conta:", error);
        throw error;
    }
};

export const UpdateProfile = async (user, name, photoURL) => {
    try {
        const docRef = doc(db, 'users', user.uid);
        await setDoc(docRef, { name, photoURL });
        alert('Perfil atualizado com sucesso!');
        return user;
    } catch (error) {
        console.error("Erro ao criar conta:", error);
        throw error;
    }
};

export const signIn = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return userCredential.user;
    } catch (error) {
        console.error("Erro ao fazer login:", error);
        throw error;
    }
};

export const logout = async () => {
    try {
        await signOut(auth);
    } catch (error) {
        console.error("Erro ao sair:", error);
        throw error;
    }
};
