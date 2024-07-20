import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, getDocs, query, where, doc, setDoc, getDoc, addDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

document.addEventListener("DOMContentLoaded", () => {
    // Configuração do Firebase
    const firebaseConfig = {
        apiKey: "AIzaSyAy30zzz4XkaIqKoeFYHD8gCdOV1nfm7Ik",
        authDomain: "eventcrafter-projetofinal.firebaseapp.com",
        projectId: "eventcrafter-projetofinal",
        storageBucket: "eventcrafter-projetofinal.appspot.com",
        messagingSenderId: "653081750350",
        appId: "1:653081750350:web:a7a7797df46a64abf94c1f"
    };

    // Inicializar o Firebase
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    const auth = getAuth(app);

    // Referência para a coleção "musica"
    const musicosCollection = collection(db, "musica");

    // Elementos do DOM
    const musicosContainer = document.getElementById("musicos-container");
    const citySelect = document.getElementById("city-select");
    const genreSelect = document.getElementById("genre-select");
    const filterButton = document.getElementById("filter-button");
    const scheduleMeetingForm = document.getElementById("scheduleMeetingForm");

    let selectedMusicoId = null;

    // Função para buscar e exibir os dados dos músicos
    async function fetchMusicos(city = "", genre = "") {
        musicosContainer.innerHTML = "";
        let q = musicosCollection;

        if (city) {
            q = query(q, where("localizacao", "==", city));
        }

        if (genre) {
            q = query(q, where("tipo", "==", genre));
        }

        try {
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                const musico = doc.data();
                const musicoCard = document.createElement("div");
                musicoCard.classList.add("col-md-4", "mb-4");

                musicoCard.innerHTML = `
                    <div class="card">
                        ${musico.fotourl ? `<img src="${musico.fotourl}" class="card-img-top" alt="Foto do Músico">` : ""}
                        <div class="card-body">
                            <h5 class="card-title">${musico.nome}</h5>
                            <p class="card-text">Localização: ${musico.localizacao}</p>
                            <p class="card-text">Email: ${musico.email}</p>
                            <p class="card-text">Descrição: ${musico.descricao}</p>
                            <p class="card-text">Tipo: ${musico.tipo}</p>
                            <button class="btn btn-primary schedule-meeting-button" data-bs-toggle="modal" data-bs-target="#scheduleMeetingModal" data-musico-id="${doc.id}">Agendar Reunião</button>
                        </div>
                    </div>
                `;

                musicosContainer.appendChild(musicoCard);
            });

            // Adicionar evento para os botões "Agendar Reunião"
            document.querySelectorAll(".schedule-meeting-button").forEach(button => {
                button.addEventListener("click", async (e) => {
                    selectedMusicoId = e.target.getAttribute("data-musico-id");
                    const user = auth.currentUser;

                    if (user) {
                        const userDoc = await getDoc(doc(db, "users", user.uid));
                        if (userDoc.exists()) {
                            const userData = userDoc.data();
                            document.getElementById("meetingName").value = userData.name || "";
                            document.getElementById("meetingEmail").value = userData.email || "";
                            document.getElementById("meetingPhone").value = userData.phone || "";
                        }
                    }
                });
            });
        } catch (error) {
            console.error("Erro ao buscar músicos: ", error);
        }
    }

    // Função para buscar e preencher as opções de cidades no dropdown
    async function populateCityOptions() {
        const cities = new Set();
        const querySnapshot = await getDocs(musicosCollection);
        querySnapshot.forEach((doc) => {
            cities.add(doc.data().localizacao);
        });

        cities.forEach((city) => {
            const option = document.createElement("option");
            option.value = city;
            option.textContent = city;
            citySelect.appendChild(option);
        });
    }

    // Adicionar listener para o botão de filtro
    filterButton.addEventListener("click", () => {
        const selectedCity = citySelect.value;
        const selectedGenre = genreSelect.value;
        fetchMusicos(selectedCity, selectedGenre);
    });

    // Adicionar evento para o formulário de agendar reunião
    scheduleMeetingForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const meetingData = {
            musicoId: selectedMusicoId,
            name: document.getElementById("meetingName").value,
            email: document.getElementById("meetingEmail").value,
            phone: document.getElementById("meetingPhone").value,
            date: document.getElementById("meetingDate").value,
            time: document.getElementById("meetingTime").value,
            description: document.getElementById("meetingDescription").value
        };

        // Verificar se já existe uma reunião para o mesmo músico na mesma data e hora
        const existingMeetingsQuery = query(
            collection(db, "agendar-reuniao"),
            where("musicoId", "==", selectedMusicoId),
            where("date", "==", meetingData.date),
            where("time", "==", meetingData.time)
        );

        const existingMeetingsSnapshot = await getDocs(existingMeetingsQuery);

        if (!existingMeetingsSnapshot.empty) {
            alert("Já existe uma reunião marcada para essa data e hora.");
            return;
        }

        try {
            await addDoc(collection(db, "agendar-reuniao"), meetingData);
            alert("Reunião agendada com sucesso!");
            // Fechar o modal
            const modalElement = document.getElementById('scheduleMeetingModal');
            const modal = bootstrap.Modal.getInstance(modalElement);
            modal.hide();
        } catch (error) {
            console.error("Erro ao agendar reunião: ", error);
            alert("Ocorreu um erro ao agendar a reunião.");
        }
    });

    // Buscar e preencher as opções de cidades ao carregar a página
    populateCityOptions();

    // Buscar e exibir todos os músicos ao carregar a página
    fetchMusicos();
});

/*
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, getDocs, query, where, doc, updateDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

document.addEventListener("DOMContentLoaded", () => {
    // Configuração do Firebase
    const firebaseConfig = {
        apiKey: "AIzaSyAy30zzz4XkaIqKoeFYHD8gCdOV1nfm7Ik",
        authDomain: "eventcrafter-projetofinal.firebaseapp.com",
        projectId: "eventcrafter-projetofinal",
        storageBucket: "eventcrafter-projetofinal.appspot.com",
        messagingSenderId: "653081750350",
        appId: "1:653081750350:web:a7a7797df46a64abf94c1f"
    };

    // Inicializar o Firebase
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    const auth = getAuth(app);
    const storage = getStorage(app);

    // Referência para a coleção "musica"
    const musicosCollection = collection(db, "musica");

    // Elementos do DOM
    const musicosContainer = document.getElementById("musicos-container");
    const citySelect = document.getElementById("city-select");
    const genreSelect = document.getElementById("genre-select");
    const filterButton = document.getElementById("filter-button");

    // Função para buscar e exibir os dados dos músicos
    async function fetchMusicos(city = "", genre = "") {
        musicosContainer.innerHTML = "";

        // Construir a query base
        let q = query(musicosCollection);

        // Aplicar filtro por cidade, se selecionado
        if (city) {
            q = query(q, where("localizacao", "==", city));
        }

        // Aplicar filtro por tipo de música, se selecionado
        if (genre) {
            q = query(q, where("tipo", "==", genre));
        }

        try {
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                const musico = doc.data();
                const musicoCard = document.createElement("div");
                musicoCard.classList.add("col-md-4", "mb-4");

                musicoCard.innerHTML = `
                    <div class="card">
                        ${musico.fotourl ? `<img src="${musico.fotourl}" class="card-img-top" alt="Foto do Músico">` : ""}
                        <div class="card-body">
                            <h5 class="card-title">${musico.nome}</h5>
                            <p class="card-text">Localização: ${musico.localizacao}</p>
                            <p class="card-text">Email: ${musico.email}</p>
                            <p class="card-text">Descrição: ${musico.descricao}</p>
                            <p class="card-text">Tipo: ${musico.tipo}</p>
                        </div>
                    </div>
                `;

                musicosContainer.appendChild(musicoCard);
            });
        } catch (error) {
            console.error("Erro ao buscar músicos: ", error);
        }
    }

    // Função para buscar e preencher as opções de cidades no dropdown
    async function populateCityOptions() {
        const cities = new Set();
        const querySnapshot = await getDocs(musicosCollection);
        querySnapshot.forEach((doc) => {
            cities.add(doc.data().localizacao);
        });

        cities.forEach((city) => {
            const option = document.createElement("option");
            option.value = city;
            option.textContent = city;
            citySelect.appendChild(option);
        });
    }

    // Adicionar listener para o botão de filtro
    filterButton.addEventListener("click", () => {
        const selectedCity = citySelect.value;
        const selectedGenre = genreSelect.value;
        fetchMusicos(selectedCity, selectedGenre);
    });

    // Buscar e preencher as opções de cidades ao carregar a página
    populateCityOptions();

    // Buscar e exibir todos os músicos ao carregar a página
    fetchMusicos();
});*/