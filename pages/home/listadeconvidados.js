import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, collection, addDoc, updateDoc, deleteDoc, onSnapshot, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

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
    loadGuests();
  } else {
    // Redireciona para a página de login se não estiver logado
    window.location.href = "../../index.html";
  }
});

// Carrega a lista de convidados do Firestore
function loadGuests() {
  const guestsRef = collection(db, 'users', currentUser.uid, 'guests');
  onSnapshot(guestsRef, (snapshot) => {
    const guestList = document.getElementById('guest-list');
    guestList.innerHTML = '';
    snapshot.forEach((doc) => {
      const guest = doc.data();
      const li = document.createElement('li');
      li.innerHTML = `
        <p>${guest.name} - ${guest.phone}</p>
        <button class="btn btn-secondary edit-btn" data-id="${doc.id}">Editar</button>
        <button class="btn btn-danger delete-btn" data-id="${doc.id}">Excluir</button>
      `;
      guestList.appendChild(li);
    });
    document.querySelectorAll('.edit-btn').forEach(button => {
      button.addEventListener('click', () => editGuest(button.getAttribute('data-id')));
    });
    document.querySelectorAll('.delete-btn').forEach(button => {
      button.addEventListener('click', () => deleteGuest(button.getAttribute('data-id')));
    });
  });
}

// Adiciona ou edita um convidado no Firestore
document.getElementById('save-guest').addEventListener('click', async () => {
  const guestName = document.getElementById('guest-name').value;
  const guestPhone = document.getElementById('guest-phone').value;
  const guestId = document.getElementById('guest-id').value;
  const guestsRef = collection(db, 'users', currentUser.uid, 'guests');
  if (guestId) {
    const guestDocRef = doc(guestsRef, guestId);
    await updateDoc(guestDocRef, { name: guestName, phone: guestPhone });
  } else {
    await addDoc(guestsRef, { name: guestName, phone: guestPhone });
  }
  document.getElementById('guest-form').reset();
  document.getElementById('guest-id').value = '';
  document.querySelector('#guestModal .btn-close').click();
});

// Preenche o formulário de edição com os dados do convidado
async function editGuest(guestId) {
  const guestDocRef = doc(db, 'users', currentUser.uid, 'guests', guestId);
  const guestDoc = await getDoc(guestDocRef);
  const guest = guestDoc.data();
  document.getElementById('guest-name').value = guest.name;
  document.getElementById('guest-phone').value = guest.phone;
  document.getElementById('guest-id').value = guestId;
  const guestModal = new bootstrap.Modal(document.getElementById('guestModal'));
  guestModal.show();
}

// Exclui um convidado do Firestore
async function deleteGuest(guestId) {
  const guestDocRef = doc(db, 'users', currentUser.uid, 'guests', guestId);
  await deleteDoc(guestDocRef);
}
