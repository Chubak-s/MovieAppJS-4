//const API_KEY = "5HY9A2G-Z6PM1C1-M7Q5YFG-D23RKER";
const API_KEY = "8HYETHK-ZJM4TCN-J819Z7J-HYXH2EH";
const API_URL_RANDOM = "https://api.kinopoisk.dev/v1.3/movie/random"

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
    for (let i = 0; i < 8; i++){
        const movie = await GetMovie(API_URL_RANDOM);
        movies.push(movie);
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

async function ShowMovies(){
    const movies = await Movies();
    const moviesEl = document.querySelector(".movies");
    movies.forEach((movie) => {
        const movieEl = document.createElement('div');
        movieEl.classList.add("movie");
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
        moviesEl.appendChild(movieEl)
    });
}

ShowMovies();