import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, collection, onSnapshot, doc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyAy30zzz4XkaIqKoeFYHD8gCdOV1nfm7Ik",
    authDomain: "eventcrafter-projetofinal.firebaseapp.com",
    projectId: "eventcrafter-projetofinal",
    storageBucket: "eventcrafter-projetofinal.appspot.com",
    messagingSenderId: "653081750350",
    appId: "1:653081750350:web:a7a7797df46a64abf94c1f"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

let currentUser = null;

// Observa a autenticação do usuário
onAuthStateChanged(auth, (user) => {
  if (user) {
    currentUser = user;
    loadMeetings();
  } else {
    // Redireciona para a página de login se não estiver logado
    window.location.href = "../../index.html";
  }
});

// Carrega a lista de reuniões do Firestore
function loadMeetings() {
  const meetingsRef = collection(db, 'agendar-reuniao');
  onSnapshot(meetingsRef, (snapshot) => {
    const meetingList = document.getElementById('meeting-list');
    meetingList.innerHTML = '';
    snapshot.forEach((doc) => {
      const meeting = doc.data();
      const li = document.createElement('li');
      li.innerHTML = `
        <p>${meeting.name} - ${meeting.date} ${meeting.time} - ${meeting.email} - ${meeting.phone}</p>
        <p>Descrição: ${meeting.description}</p>
        <button class="btn btn-danger delete-btn" data-id="${doc.id}">Excluir</button>
      `;
      meetingList.appendChild(li);
    });
    document.querySelectorAll('.delete-btn').forEach(button => {
      button.addEventListener('click', () => deleteMeeting(button.getAttribute('data-id')));
    });
  });
}

// Exclui uma reunião do Firestore
async function deleteMeeting(meetingId) {
  const meetingDocRef = doc(db, 'agendar-reuniao', meetingId);
  await deleteDoc(meetingDocRef);
}
