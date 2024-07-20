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

    // Referência para a coleção "quintas"
    const quintasCollection = collection(db, "quintas");

    // Elementos do DOM
    const espacosContainer = document.getElementById("espacos-container");
    const citySelect = document.getElementById("city-select");
    const filterButton = document.getElementById("filter-button");
    const scheduleMeetingForm = document.getElementById("scheduleMeetingForm");

    let selectedQuintaId = null;

    // Função para buscar e exibir os dados das quintas
    async function fetchQuintas(city = "") {
        espacosContainer.innerHTML = "";
        let q;
        if (city) {
            q = query(quintasCollection, where("localizacao", "==", city));
        } else {
            q = quintasCollection;
        }

        try {
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                const quinta = doc.data();
                const quintaCard = document.createElement("div");
                quintaCard.classList.add("col-md-4", "mb-4");

                quintaCard.innerHTML = `
                    <div class="card">
                        ${quinta.fotoUrl ? `<img src="${quinta.fotoUrl}" class="card-img-top" alt="Foto da Quinta">` : ""}
                        <div class="card-body">
                            <img class="card-title-img" src="${quinta.fotourl}">
                            <h5 class="card-title">${quinta.nome}</h5>
                            <p class="card-text">Localização: ${quinta.localizacao}</p>
                            <p class="card-text">Telemóvel: ${quinta.contacto}</p>
                            <p class="card-text">Email: ${quinta.email}</p>
                            <p class="card-text">Descrição: ${quinta.descricao}</p>
                            <button class="btn btn-primary schedule-meeting-button" data-bs-toggle="modal" data-bs-target="#scheduleMeetingModal" data-quinta-id="${doc.id}">Agendar Reunião</button>
                        </div>
                    </div>
                `;

                espacosContainer.appendChild(quintaCard);
            });

            // Adicionar evento para os botões "Agendar Reunião"
            document.querySelectorAll(".schedule-meeting-button").forEach(button => {
                button.addEventListener("click", async (e) => {
                    selectedQuintaId = e.target.getAttribute("data-quinta-id");
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
            console.error("Erro ao buscar quintas: ", error);
        }
    }

    // Função para buscar e preencher as opções de cidades no dropdown
    async function populateCityOptions() {
        const cities = new Set();
        const querySnapshot = await getDocs(quintasCollection);
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
        fetchQuintas(selectedCity);
    });

    // Adicionar evento para o formulário de agendar reunião
    scheduleMeetingForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const meetingData = {
            quintaId: selectedQuintaId,
            name: document.getElementById("meetingName").value,
            email: document.getElementById("meetingEmail").value,
            phone: document.getElementById("meetingPhone").value,
            date: document.getElementById("meetingDate").value,
            time: document.getElementById("meetingTime").value,
            description: document.getElementById("meetingDescription").value
        };

        // Verificar se já existe uma reunião para a mesma quinta na mesma data e hora
        const existingMeetingsQuery = query(
            collection(db, "agendar-reuniao"),
            where("quintaId", "==", selectedQuintaId),
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

    // Buscar e exibir as quintas ao carregar a página
    fetchQuintas();
});



/*
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, getDocs, query, where, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
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

    // Referência para a coleção "quintas"
    const quintasCollection = collection(db, "quintas");

    // Elementos do DOM
    const espacosContainer = document.getElementById("espacos-container");
    const citySelect = document.getElementById("city-select");
    const filterButton = document.getElementById("filter-button");
    const scheduleMeetingForm = document.getElementById("scheduleMeetingForm");

    // Função para buscar e exibir os dados das quintas
    async function fetchQuintas(city = "") {
        espacosContainer.innerHTML = "";
        let q;
        if (city) {
            q = query(quintasCollection, where("localizacao", "==", city));
        } else {
            q = quintasCollection;
        }

        try {
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                const quinta = doc.data();
                const quintaCard = document.createElement("div");
                quintaCard.classList.add("col-md-4", "mb-4");

                quintaCard.innerHTML = `
                    <div class="card">
                        ${quinta.fotoUrl ? `<img src="${quinta.fotoUrl}" class="card-img-top" alt="Foto da Quinta">` : ""}
                        <div class="card-body">
                            <img class="card-title-img" src="${quinta.fotourl}">
                            <h5 class="card-title">${quinta.nome}</h5>
                            <p class="card-text">Localização: ${quinta.localizacao}</p>
                            <p class="card-text">Telemóvel: ${quinta.contacto}</p>
                            <p class="card-text">Email: ${quinta.email}</p>
                            <p class="card-text">Descrição: ${quinta.descricao}</p>
                            <button class="btn btn-primary schedule-meeting-button" data-bs-toggle="modal" data-bs-target="#scheduleMeetingModal" data-quinta-id="${doc.id}">Agendar Reunião</button>
                        </div>
                    </div>
                `;

                espacosContainer.appendChild(quintaCard);
            });

            // Adicionar evento para os botões "Agendar Reunião"
            document.querySelectorAll(".schedule-meeting-button").forEach(button => {
                button.addEventListener("click", async (e) => {
                    const quintaId = e.target.getAttribute("data-quinta-id");
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
            console.error("Erro ao buscar quintas: ", error);
        }
    }

    // Função para buscar e preencher as opções de cidades no dropdown
    async function populateCityOptions() {
        const cities = new Set();
        const querySnapshot = await getDocs(quintasCollection);
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
        fetchQuintas(selectedCity);
    });

    // Adicionar evento para o formulário de agendar reunião
    scheduleMeetingForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const meetingData = {
            name: document.getElementById("meetingName").value,
            email: document.getElementById("meetingEmail").value,
            phone: document.getElementById("meetingPhone").value,
            date: document.getElementById("meetingDate").value,
            time: document.getElementById("meetingTime").value,
            description: document.getElementById("meetingDescription").value
        };

        try {
            await setDoc(doc(collection(db, "agendar-reuniao")), meetingData);
            alert("Reunião agendada com sucesso!");
            document.getElementById("scheduleMeetingModal").modal('hide');
        } catch (error) {
            console.error("Erro ao agendar reunião: ", error);
            alert("Ocorreu um erro ao agendar a reunião.");
        }
    });

    // Buscar e preencher as opções de cidades ao carregar a página
    populateCityOptions();

    // Buscar e exibir as quintas ao carregar a página
    fetchQuintas();
});

*/