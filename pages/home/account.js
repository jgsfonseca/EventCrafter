import { auth, db } from './firebase-config.js';
import { doc, getDoc, updateDoc, deleteDoc } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';

document.addEventListener("DOMContentLoaded", function () {
    auth.onAuthStateChanged(async user => {
        const userEmailElement = document.getElementById("user-email");
        const userNameElement = document.getElementById("user-name");
        const userPhoneElement = document.getElementById("user-phone");

        if (user) {
            userEmailElement.textContent = `Email: ${user.email}`;

            // Obter dados adicionais do Firestore
            const docRef = doc(db, "users", user.uid);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                console.log("Document data:", docSnap.data());
                // Exibir dados adicionais na página
                userNameElement.textContent = `Nome: ${docSnap.data().name}`;
                userPhoneElement.textContent = `Número: ${docSnap.data().phone}`;

                // Preencher os campos do modal
                document.getElementById("user-name-input").value = docSnap.data().name || '';
                document.getElementById("user-phone-input").value = docSnap.data().phone || '';
            } else {
                console.log("No such document!");
            }
        } else {
            userEmailElement.textContent = "Nenhum usuário está logado.";
            // Redirecionar para a página de login
            window.location.href = "index.html";
        }
    });

    // Adicionar evento de submit ao formulário do modal de editar informações
    document.getElementById("user-info-form").addEventListener("submit", async function(event) {
        event.preventDefault();

        const user = auth.currentUser;
        if (user) {
            const name = document.getElementById("user-name-input").value;
            const phone = document.getElementById("user-phone-input").value;

            // Atualizar informações no Firestore
            const docRef = doc(db, "users", user.uid);
            await updateDoc(docRef, {
                name: name,
                phone: phone
            });

            // Atualizar a página com as novas informações
            document.getElementById("user-name").textContent = `Nome: ${name}`;
            document.getElementById("user-phone").textContent = `Número: ${phone}`;

            // Fechar o modal
            const modal = bootstrap.Modal.getInstance(document.getElementById("editModal"));
            modal.hide();
        }
    });

    // Adicionar evento de submit ao formulário do modal de eliminar conta
    document.getElementById("delete-account-form").addEventListener("submit", async function(event) {
        event.preventDefault();

        const user = auth.currentUser;
        const confirmEmail = document.getElementById("confirm-email-input").value;

        if (user && confirmEmail === user.email) {
            // Eliminar a conta do Firestore
            const docRef = doc(db, "users", user.uid);
            await deleteDoc(docRef);

            // Eliminar a conta de autenticação
            await user.delete();

            // Redirecionar para a página inicial
            window.location.href = "../../index.html";
        } else {
            alert("O email não corresponde ao email da conta.");
        }
    });
});
