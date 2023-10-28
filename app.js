//const API_KEY = "5HY9A2G-Z6PM1C1-M7Q5YFG-D23RKER";
 const API_KEY = "8HYETHK-ZJM4TCN-J819Z7J-HYXH2EH";
// const API_KEY = "H1G2CP3-9W641HN-KWEXWC6-DFXBYD1";
const API_URL_RANDOM = "https://api.kinopoisk.dev/v1.3/movie/random";
const API_URL_SEARCH = "https://api.kinopoisk.dev/v1.2/movie/search?page=1&query="
const API_URL_ID = "https://api.kinopoisk.dev/v1.3/movie/"
async function GetMovie(url){
        const response = await fetch(url, {
            headers: {
                "Content-Type": "application/json",
                "X-API-KEY": API_KEY,
            },
        });
        const respData = await response.json();
        return respData;
}

async function Movies(){
    let movies = [];
    for (let i = 0; i < 12; i++){
        const movie = await GetMovie(API_URL_RANDOM);
        movies.push(movie);
    }
    return movies;
}
async function SearchedMovies(api){
    let movies = [];

    for (let i = 0; i < 10; i++){
         const movie = await GetMovie(api);
         if (movie.docs[i].rating>5){
             movies.push(movie.docs[i]);
         }
    }

    return movies;
}

function getClassRating(rating) {
    if (rating >= 7) {
        return "green";
    }
    if (rating > 5) {
        return "orange";
    } else return "red";
}

async function ShowMovies(api){

    document.querySelector('.movies').innerHTML = "";
    let movies = await Movies();
    if (api != ""){movies = await SearchedMovies(api);}
    const moviesEl = document.querySelector(".movies");
    movies.forEach((movie) => {
        const movieEl = document.createElement('div');
        movieEl.classList.add("movie");
        if (api!=""){
            movieEl.innerHTML = `
             <div class="movie_cover-inner">
                    <img src="${movie.poster}" alt="movie" class="movie_cover">
                </div>
                <div class="description">
                    <h4>${movie.name}</h4>
                    <p>${movie.genres.join(', ')}</p>
                </div>
                <div class="rating" style="border-color: ${getClassRating(movie.rating.toFixed(1))}">${movie.rating.toFixed(1)}</div>
            `;
        } else{
            let arrayGenres=[];
            for (let i=0; i<movie.genres.length; i++){
                arrayGenres.push(movie.genres[i].name);
            }
            movieEl.innerHTML = `
             <div class="movie_cover-inner">
                    <img src="${movie.poster.url}" alt="movie" class="movie_cover">
                </div>
                <div class="description">
                    <h4>${movie.name}</h4>
                    <p>${arrayGenres.join(', ')}</p>
                </div>
                <div class="rating" style="border-color: ${getClassRating(movie.rating.kp.toFixed(1))}">${movie.rating.kp.toFixed(1)}</div>
        `;
        }
        movieEl.addEventListener("click", ()=>openModal(movie.id));
        console.log(movie.id);
        moviesEl.appendChild(movieEl);
    });
}

ShowMovies("");

const form = document.querySelector('form');
const search = document.querySelector('.header_search');

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const apiSearch = `${API_URL_SEARCH}${search.value}`
    console.log(apiSearch);
    if (apiSearch){
        ShowMovies(apiSearch);

        search.value="";
    }
})

//Modal
const modalEl = document.querySelector(".modal")
async function openModal(id){

    const idAPI = `${API_URL_ID}${id}`
    let currMovie = await GetMovie(idAPI);
    console.log(idAPI);
    console.log(currMovie);
    modalEl.classList.add("modal--show");
    modalEl.innerHTML = `
        <div class="modalCard">
        <img src="${currMovie.poster.url}" alt="film" class="modalImg">
        <div class="modalDescription">
            <h3>Название - ${currMovie.name}</h3>
            <ul>
                <li>Жанр - ${currMovie.genres[0].name}</li>
                <li>Описание - ${currMovie.description}</li>
            </ul>
        </div>
        <button type="button" class="modal_button_close">Закрыть</button>
        </div>
        `
    const btnClose = document.querySelector(".modal_button_close");
    btnClose.addEventListener("click", ()=>closeModal());
}

function closeModal(){
    modalEl.classList.remove("modal--show")
}

window.addEventListener("click", (e)=>{
    if (e.target===modalEl){
        closeModal();
    }
})