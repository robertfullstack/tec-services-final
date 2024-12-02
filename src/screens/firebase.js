import { initializeApp } from 'firebase/app';
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    sendPasswordResetEmail // Adicionando a função de reset de senha
} from 'firebase/auth';
import {
    getDatabase,
    ref,
    set,
    get,
    onValue,
    update,
    remove,
    push // Adicionando a importação do push
} from 'firebase/database';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyAcZPFz6ixQ83zakCuCwgJmslzm3k2IaEQ",
    authDomain: "tec-services-ef073.firebaseapp.com",
    databaseURL: "https://tec-services-ef073-default-rtdb.firebaseio.com",
    projectId: "tec-services-ef073",
    storageBucket: "tec-services-ef073.appspot.com",
    messagingSenderId: "221821393571",
    appId: "1:221821393571:web:f107b64915d1b9f525bd16"
};

// Inicializando o Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);
const storage = getStorage(app);

// Exportando os módulos do Firebase
export {
    auth,
    database,
    storage,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    sendPasswordResetEmail, // Agora exportando a função de reset de senha
    ref,
    set,
    get,
    onValue,
    update,
    remove,
    push // Exportando a função push
};
