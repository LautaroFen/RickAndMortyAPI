// Video intro----------------------------------------------------------------
function toggleVideo() {
    const intro = document.querySelector('.intro');
    const video = document.querySelector('.video');
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

    // Cambiar imagen en "Ubicaciones"
    $("#ubicaciones").hover(
        function () { $("#beth").attr("src", "./IMG/beth.png"); },
        function () { $("#beth").attr("src", "./IMG/bethNo.png"); }
    );

    // Cambiar imagen en "Contactanos"
    $("#contactanos").hover(
        function () { $("#summer").attr("src", "./IMG/summer.png"); },
        function () { $("#summer").attr("src", "./IMG/summerNo.png"); }
    );
});

// Principio de filtros de búsqueda--------------------------------------------

const charactersEl   = $('#fotos-card');
const nameFilterEl   = $('#search');
const charactersPerPage = 12;
let currentPage      = 1;
let allCharacters    = [];

// Función para obtener los filtros seleccionados
function getSelectedFilters() {
    const selectedStatus  = $('input[name="status"]:checked').val()  || "";
    const selectedGender  = $('input[name="gender"]:checked').val()  || "";
    const selectedSpecies = $('input[name="species"]:checked').val() || "";

    return { status: selectedStatus, gender: selectedGender, species: selectedSpecies };
}

// Función común para actualizar filtros y búsqueda
function updateFilters() {
    const name = nameFilterEl.val().trim();
    const { status, gender, species } = getSelectedFilters();
    displayCharacters(name, status, gender, species);
}

// Función para obtener todos los personajes de la API
async function getAllCharacters(name = "", status = "", gender = "", species = "") {
    let all = [];
    // Preparamos parámetros
    const params = new URLSearchParams();
    if (name)    params.append("name", name);
    if (status)  params.append("status", status);
    if (gender)  params.append("gender", gender);
    if (species) params.append("species", species);

    const baseURL = `https://rickandmortyapi.com/api/character/?${params.toString()}`;

    try {
        // Petición inicial
        const res1 = await fetch(baseURL);
        if (!res1.ok) return [];
        const data1 = await res1.json();
        all = data1.results;
        const totalPages = data1.info.pages;

        // Peticiones siguientes
        for (let page = 2; page <= totalPages; page++) {
            const resPage = await fetch(`${baseURL}&page=${page}`);
            if (!resPage.ok) break;
            const dataPage = await resPage.json();
            all = all.concat(dataPage.results);
        }
    } catch (err) {
        console.error('Error fetching characters:', err);
        return [];
    }

    return all;
}

// Función para mostrar los personajes en pantalla
async function displayCharacters(name = "", status = "", gender = "", species = "") {
    allCharacters = await getAllCharacters(name, status, gender, species);
    currentPage = 1;
    renderPage(currentPage);
    renderPagination();
}

// Función para renderizar las cards o el mensaje de "no resultados"
function renderPage(page) {
    charactersEl.empty();
    const start = (page - 1) * charactersPerPage;
    const end   = start + charactersPerPage;
    const slice = allCharacters.slice(start, end);

    if (slice.length === 0) {
        charactersEl.append(`
            <div class="col-12 text-center my-5">
                <h3>No se encontraron resultados con esos filtros :(</h3>
            </div>
        `);
        return;
    }

    slice.forEach(character => {
        charactersEl.append(`
            <div class="col-12 col-sm-6 col-md-4 col-lg-3 mb-4 d-flex">
              <div class="card w-100">
                <div class="card-body d-flex flex-column align-items-center text-center">
                  <img src="${character.image}" class="mb-3" style="width:100%;object-fit:cover;">
                  <h2 class="h5 mb-1">${character.name}</h2>
                  <p class="mb-1">Status: ${character.status}</p>
                  <p class="mb-1">Especie: ${character.species}</p>
                  <p class="mb-1">Gender: ${character.gender}</p>
                </div>
              </div>
            </div>
        `);
    });
}

// Función de paginación
function renderPagination() {
    const totalPages = Math.ceil(allCharacters.length / charactersPerPage);
    const paginationEl = $('#pagination').empty();
    if (totalPages <= 1) return;

    const visiblePages = 3;
    const createPage = (page) => $(
        `<li class="page-item ${page === currentPage ? 'active' : ''}">` +
        `<a class="page-link" href="#">${page}</a>` +
        `</li>`
    ).click(() => {
        currentPage = page;
        renderPage(currentPage);
        renderPagination();
    });

    const addEllipsis = () => $('<li class="page-item disabled"><span class="page-link">...</span></li>');

    paginationEl.append(createPage(1));
    if (currentPage > visiblePages + 2) paginationEl.append(addEllipsis());
    for (let i = Math.max(2, currentPage - visiblePages); i <= Math.min(totalPages - 1, currentPage + visiblePages); i++) {
        paginationEl.append(createPage(i));
    }
    if (currentPage < totalPages - visiblePages - 1) paginationEl.append(addEllipsis());
    paginationEl.append(createPage(totalPages));
}

// Inicialización
$(function() {
    displayCharacters();

    // Listeners combinados
    $('input[name="status"], input[name="gender"], input[name="species"]').on('change', updateFilters);
    nameFilterEl.on('input', updateFilters);
    // Prevenir Enter
    nameFilterEl.on('keydown', function(e) {
        if (e.key === 'Enter' || e.keyCode === 13) {
            e.preventDefault();
            return false;
        }
    });
});
