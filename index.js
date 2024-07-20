function onChangeEmail() {
    toggleButtonsDisable();
    toggleEmailErrors();
}

function onChangePassword() {
    toggleButtonsDisable();
    togglePasswordErrors();
}

function login() {
    const auth = window.firebaseAuth;
    const signInWithEmailAndPassword = window.firebaseSignInWithEmailAndPassword;

    const email = form.email().value;
    const password = form.password().value;

    if (!email || !password) {
        alert('Email e senha são obrigatórios');
        return;
    }

    signInWithEmailAndPassword(auth, email, password)
        .then(response => {
            console.log('Login successful');
            const user = response.user;

            // Fetch user details from Firestore
            const db = window.firebaseFirestore;
            const collection = window.firebaseCollection;
            const doc = window.firebaseDoc;
            const getDoc = window.firebaseGetDoc;

            const docRef = doc(collection(db, "users"), user.uid);

            getDoc(docRef).then(docSnap => {
                if (docSnap.exists()) {
                    const userData = docSnap.data();
                    if (userData.admin) {
                        showAdminPopup();
                    } else {
                        window.location.href = "pages/home/home.html";
                    }
                } else {
                    console.error("No such document!");
                }
            }).catch(error => {
                console.error("Error getting document:", error);
            });
        })
        .catch(error => {
            alert(error.message);
            console.error('Error', error);
        });
}

function showAdminPopup() {
    const popup = document.createElement('div');
    popup.innerHTML = `
        <div class="popup">
            <p>Escolha a sua página de destino:</p>
            <button onclick="window.location.href='pages/home/home.html'">Home</button>
            <button onclick="window.location.href='pages/admin/admin.html'">Admin</button>
        </div>
    `;
    document.body.appendChild(popup);

    // Adicione o estilo para o popup
    const style = document.createElement('style');
    style.innerHTML = `
        .popup {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: white;
            padding: 20px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            z-index: 1000;
        }
        .popup button {
            margin: 5px;
        }
    `;
    document.head.appendChild(style);
}

function recoverPassword() {
    const auth = window.firebaseAuth;
    const sendPasswordResetEmail = window.firebaseSendPasswordResetEmail;

    const email = form.email().value;

    if (!email) {
        alert('Email é obrigatório');
        return;
    }

    sendPasswordResetEmail(auth, email)
        .then(() => {
            alert('Email enviado com sucesso');
        })
        .catch(error => {
            alert(error.message);
            console.error('Error', error);
        });
}

function register() {
    window.location.href = "pages/register/register.html";
}

function toggleEmailErrors() {
    const email = form.email().value;
    form.emailRequiredError().style.display = email ? "none" : "block";
    form.emailInvalidError().style.display = validateEmail(email) ? "none" : "block";
}

function togglePasswordErrors() {
    const password = form.password().value;
    form.passwordRequiredError().style.display = password ? "none" : "block";
}

function toggleButtonsDisable() {
    const emailValid = isEmailValid();
    form.recoverPasswordButton().disabled = !emailValid;

    const passwordValid = isPasswordValid();
    form.loginButton().disabled = !emailValid || !passwordValid;
}

function isEmailValid() {
    const email = form.email().value;
    return email ? validateEmail(email) : false;
}

function isPasswordValid() {
    return form.password().value ? true : false;
}

const form = {
    email: () => document.getElementById("email"),
    emailInvalidError: () => document.getElementById("email-invalid-error"),
    emailRequiredError: () => document.getElementById("email-required-error"),
    loginButton: () => document.getElementById("login-button"),
    password: () => document.getElementById("password"),
    passwordRequiredError: () => document.getElementById("password-required-error"),
    recoverPasswordButton: () => document.getElementById("recover-password-button"),
}


/*
function onChangeEmail() {
    toggleButtonsDisable();
    toggleEmailErrors();
}

function onChangePassword() {
    toggleButtonsDisable();
    togglePasswordErrors();
}

function login() {
    const auth = window.firebaseAuth;
    const signInWithEmailAndPassword = window.firebaseSignInWithEmailAndPassword;

    const email = form.email().value;
    const password = form.password().value;

    if (!email || !password) {
        alert('Email e senha são obrigatórios');
        return;
    }

    signInWithEmailAndPassword(auth, email, password)
        .then(response => {
            console.log('Login successful');
            window.location.href = "pages/home/home.html";
        })
        .catch(error => {
            alert(error.message);
            console.error('Error', error);
        });
}

function recoverPassword() {
    const auth = window.firebaseAuth;
    const sendPasswordResetEmail = window.firebaseSendPasswordResetEmail;

    const email = form.email().value;

    if (!email) {
        alert('Email é obrigatório');
        return;
    }

    sendPasswordResetEmail(auth, email)
        .then(() => {
            alert('Email enviado com sucesso');
        })
        .catch(error => {
            alert(error.message);
            console.error('Error', error);
        });
}

function register() {
    window.location.href = "pages/register/register.html";
}

function toggleEmailErrors() {
    const email = form.email().value;
    form.emailRequiredError().style.display = email ? "none" : "block";
    form.emailInvalidError().style.display = validateEmail(email) ? "none" : "block";
}

function togglePasswordErrors() {
    const password = form.password().value;
    form.passwordRequiredError().style.display = password ? "none" : "block";
}

function toggleButtonsDisable() {
    const emailValid = isEmailValid();
    form.recoverPasswordButton().disabled = !emailValid;

    const passwordValid = isPasswordValid();
    form.loginButton().disabled = !emailValid || !passwordValid;
}

function isEmailValid() {
    const email = form.email().value;
    return email ? validateEmail(email) : false;
}

function isPasswordValid() {
    return form.password().value ? true : false;
}

const form = {
    email: () => document.getElementById("email"),
    emailInvalidError: () => document.getElementById("email-invalid-error"),
    emailRequiredError: () => document.getElementById("email-required-error"),
    loginButton: () => document.getElementById("login-button"),
    password: () => document.getElementById("password"),
    passwordRequiredError: () => document.getElementById("password-required-error"),
    recoverPasswordButton: () => document.getElementById("recover-password-button"),
}
*/