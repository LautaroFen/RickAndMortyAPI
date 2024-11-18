//Video intro----------------------------------------------------------------
function toggleVideo() {
    const intro = document.querySelector('.intro');
    const video = document.querySelector('video');
    intro.classList.toggle('active');
    video.currentTime = 0;
    video.pause();
}

$(document).ready(function () {
    // Cambiar imagen en "Inicio"
    $("#inicio").hover(
        function () { $("#rick").attr("src", "./IMG/rick.png"); },
        function () { $("#rick").attr("src", "./IMG/rickNo.png"); }
    );

    // Cambiar imagen en "Multiverse"
    $("#multiverse").hover(
        function () { $("#morty").attr("src", "./IMG/morty.png"); },
        function () { $("#morty").attr("src", "./IMG/mortyNo.png"); }
    );

    // Cambiar imagen en "Characters"
    $("#ubicaciones").hover(
        function () { $("#beth").attr("src", "./IMG/beth.png"); },
        function () { $("#beth").attr("src", "./IMG/bethNo.png"); }
    );

    // Cambiar imagen en segundo "Multiverse"
    $("#contactanos").hover(
        function () { $("#summer").attr("src", "./IMG/summer.png"); },
        function () { $("#summer").attr("src", "./IMG/summerNo.png"); }
    );
});
//Principio de filtros de busqueda--------------------------------------------
const charactersEl = $('#fotos-card');
const nameFilterEl = $('#search');


// Función para obtener personajes desde la API
async function getCharacters(name) {
    let url = 'https://rickandmortyapi.com/api/character/';

    // Filtrar por estado, especie y género
    const selectedStatus = $('input[id="state "]:checked').val();
    const selectedSpecies = $('input[id="species"]:checked').val();
    const selectedGender = $('input[id="gender"]:checked').val();

    console.log(selectedStatus);
    console.log(selectedSpecies);
    console.log(selectedGender);

    if (name || selectedStatus || selectedSpecies || selectedGender) {
        url += '?';
        if (name) {
            url += `name=${name}&`;
        }
        if (selectedStatus) {
            url += `status=${selectedStatus}&`;
        }
        if (selectedSpecies) {
            url += `species=${selectedSpecies}&`;
        }
        if (selectedGender) {
            url += `gender=${selectedGender}&`;
        }
        url = url.slice(0, -1); // Eliminar el último '&' si existe
    }

    console.log(url); // Ver URL generada

    const response = await fetch(url);
    console.log(response);
    const data = await response.json();
    return data.results;
}

// Función para renderizar los personajes dentro del DOM
async function displayCharacters(name) {
    const characters = await getCharacters(name);
    charactersEl.empty();

    characters.forEach((character) => {
        const card = $(`
            <div class="col-sm-6 col-xl-4 mb-4">
                <div class="card h-100">
                <div class="card-body d-flex flex-column align-items-center text-center">
                    <div class="image mb-3">
                        <img src="${character.image}"style="max-height: 200px; min-height: 220px; object-fit: cover;">
                    </div>
                    <div>
                        <h2 class="h5">${character.name}</h2>
                        <p class="mb-1">Status: ${character.status}</p>
                        <p class="mb-1">Especie: ${character.species}</p>
                        <p class="mb-1">Gender: ${character.gender}</p>
                    </div>
                </div>
            </div>

        `);
        charactersEl.append(card);
    });
    console.log(characters);
}

// Llamar a la función de inicio
displayCharacters();

// Eventos de filtros
nameFilterEl.on('input', () => {
    displayCharacters(nameFilterEl.val());
});
selectedStatus.on('check', () => {
    displayCharacters(selectedStatus.val(), selectedGender.val(), selectedSpecies.on())
})
selectedGender.on('check', () => {
    displayCharacters(selectedStatus.val(), selectedGender.val(), selectedSpecies.on())
})
selectedSpecies.on('check', () => {
    displayCharacters(selectedStatus.val(), selectedGender.val(), selectedSpecies.on())
})

//Final de filtros de busqueda--------------------------------------------


