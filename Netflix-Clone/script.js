// Oyage API Key eka saha TMDB links
const api = "c9c388aaaeb18508c8aad49cd31fc8cf";
const base_url = "https://api.themoviedb.org/3";
const img_url = "https://image.tmdb.org/t/p/original";

// API endpoints (Mona data da ganna oni kiyala kiyana links)
//const requests = {
  //  fetchNetflixOriginals: `${base_url}/discover/tv?api_key=${api}&with_networks=213`,
  //  fetchTrending: `${base_url}/trending/all/week?api_key=${api}&language=en-US`,
//};

// API endpoints (Mona data da ganna oni kiyala kiyana links)
const requests = {
    fetchNetflixOriginals: `${base_url}/discover/tv?api_key=${api}&with_networks=213`,
    fetchTrending: `${base_url}/trending/all/week?api_key=${api}&language=en-US`,
    fetchActionMovies: `${base_url}/discover/movie?api_key=${api}&with_genres=28`,
    fetchComedyMovies: `${base_url}/discover/movie?api_key=${api}&with_genres=35`,
    fetchHorrorMovies: `${base_url}/discover/movie?api_key=${api}&with_genres=27`,
};

// 1. Loku Banner Eka Auto Update Kireema
async function setBanner() {
    try {
        const response = await fetch(requests.fetchNetflixOriginals);
        const data = await response.json();
        
        // Random movie ekak thoraganeema
        const movies = data.results;
        const randomMovie = movies[Math.floor(Math.random() * movies.length)];

        // HTML elements walata data dima
        const banner = document.getElementById("banner");
        const title = document.getElementById("banner-title");
        const description = document.getElementById("banner-description");

        banner.style.backgroundImage = `url("${img_url}${randomMovie.backdrop_path}")`;
        title.innerText = randomMovie.name || randomMovie.title || randomMovie.original_name;
        
        // Description eka digai nam eka kapala pennanna
        let desc = randomMovie.overview;
        description.innerText = desc.length > 150 ? desc.substring(0, 150) + "..." : desc;
        
    } catch (error) {
        console.error("Banner error: ", error);
    }
}

// 2. Movie Rows Walata Posters Add Kireema
// 2. Movie Rows Walata Posters Add Kireema (Click Function Ekkama)
async function buildRow(elementId, fetchUrl, isLargeRow = false) {
    try {
        const response = await fetch(fetchUrl);
        const data = await response.json();
        const rowPosters = document.getElementById(elementId);

        data.results.forEach(movie => {
            if ((isLargeRow && movie.poster_path) || (!isLargeRow && movie.backdrop_path)) {
                const img = document.createElement("img");
                img.className = `row-poster ${isLargeRow ? "row-posterLarge" : ""}`;
                img.src = `${img_url}${isLargeRow ? movie.poster_path : movie.backdrop_path}`;
                img.alt = movie.name || movie.title;
                
                // Poster eka click kalama trailer eka load wenna function eka call kireema
                img.onclick = () => playTrailer(movie.id, isLargeRow);
                
                rowPosters.appendChild(img);
            }
        });
    } catch (error) {
        console.error("Row error: ", error);
    }
}

// 3. YouTube Trailer Eka Play Kireema
async function playTrailer(movieId, isTvShow) {
    const modal = document.getElementById("trailer-modal");
    const player = document.getElementById("youtube-player");
    
    // TMDB eken movie ekada tv show ekakda kiyala hoyala API link eka hadima
    const type = isTvShow ? "tv" : "movie";
    const trailerUrl = `${base_url}/${type}/${movieId}/videos?api_key=${api}`;

    try {
        const response = await fetch(trailerUrl);
        const data = await response.json();
        
        // Videos thiyenawanam Trailer eka hoyaganeema
        const videos = data.results;
        const trailer = videos.find(vid => vid.site === "YouTube" && vid.type === "Trailer") || videos[0];

        if (trailer) {
            // Video eka play kireema (autoplay=1 nisa auto play wenawa)
            player.src = `https://www.youtube.com/embed/${trailer.key}?autoplay=1`;
            modal.style.display = "block";
        } else {
            alert("Sorry, Trailer is not available for this movie!");
        }
    } catch (error) {
        console.error("Trailer loading error: ", error);
    }
}

// 4. Modal Eka Close Kireema
function closeTrailer() {
    const modal = document.getElementById("trailer-modal");
    const player = document.getElementById("youtube-player");
    modal.style.display = "none";
    player.src = ""; // Close karama video eka nawaththanna link eka makima
}

// Hama function ekama run kireema
setBanner();
buildRow("originals", requests.fetchNetflixOriginals, true); // Originals lokuwata pennanawa
buildRow("trending", requests.fetchTrending, false); // Trending podiyata pennanawa
// Hama function ekama run kireema
setBanner();
buildRow("originals", requests.fetchNetflixOriginals, true); 
buildRow("trending", requests.fetchTrending, false); 
buildRow("action", requests.fetchActionMovies, false); // Action row eka
buildRow("comedy", requests.fetchComedyMovies, false); // Comedy row eka
buildRow("horror", requests.fetchHorrorMovies, false); // Horror row eka