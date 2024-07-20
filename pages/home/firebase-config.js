// firebase-config.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js'

// Configuração do Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAy30zzz4XkaIqKoeFYHD8gCdOV1nfm7Ik",
    authDomain: "eventcrafter-projetofinal.firebaseapp.com",
    projectId: "eventcrafter-projetofinal",
    storageBucket: "eventcrafter-projetofinal.appspot.com",
    messagingSenderId: "653081750350",
    appId: "1:653081750350:web:a7a7797df46a64abf94c1f"
};


// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Obtém a referência para o Auth e Firestore
const auth = getAuth(app);
const db = getFirestore(app);

// Torna o auth e firestore disponível globalmente
export { auth, db };
