// const API_KEY = "5HY9A2G-Z6PM1C1-M7Q5YFG-D23RKER";
// const API_KEY = "8HYETHK-ZJM4TCN-J819Z7J-HYXH2EH";
const API_KEY = "H1G2CP3-9W641HN-KWEXWC6-DFXBYD1";
const API_URL_RANDOM = "https://api.kinopoisk.dev/v1.3/movie/random";
const API_URL_SEARCH = "https://api.kinopoisk.dev/v1.2/movie/search?page=1&query="

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
    for (let i = 0; i < 2; i++){
        const movie = await GetMovie(API_URL_RANDOM);
        movies.push(movie);
    }
    return movies;
}
async function SearchedMovies(api){
    let movies = [];
    const movie = await GetMovie(api);
    console.log(movie[1]);
    console.log(movie);

    for (let i = 0; i < 10; i++){
         const movie = await GetMovie(api);
         if (movie.docs[i].name!=""){
             movies.push(movie.docs[i]);
             console.log(movie.docs[i]);
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
            movieEl.innerHTML = `
             <div class="movie_cover-inner">
                    <img src="${movie.poster.url}" alt="movie" class="movie_cover">
                </div>
                <div class="description">
                    <h4>${movie.name}</h4>
                    <p>${movie.genres[0].name}</p>
                </div>
                <div class="rating" style="border-color: ${getClassRating(movie.rating.kp.toFixed(1))}">${movie.rating.kp.toFixed(1)}</div>
        `;
        }
        moviesEl.appendChild(movieEl)
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