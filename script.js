// Define constants for API and image base URLs, and DOM elements we'll be interacting with
// Define constants for the Movie Database API base URL, API key, and image base URL
const abu = "https://api.themoviedb.org/3";
const ak = "2258ef2b00db55085e9bed453366836d";
const ibu = 'https://image.tmdb.org/t/p/w300';

// Get the movies grid, search input, search form, and category title elements from the HTML document
const mg = document.getElementById("movies-grid");
const si = document.getElementById("search-input");
const sf = document.getElementById("search-form");
const ct = document.getElementById("category-title");


// Fetch movies currently playing in theaters
// Define an asynchronous function that fetches currently playing movies
async function fetchMoviesNowPlaying() {
  // Make a request to the external API to get the list of movies
  const response = await fetch(`${abu}/movie/now_playing?api_key=${ak}`);

  // Convert the response body to a JavaScript object using JSON parsing
  const jr = await response.json();

  // Map the response data to an array of movie objects, including the IMDb ID for each movie
  const movies = await Promise.all(
    jr.results.map(async (movie) => ({
      id: movie.id,
      title: movie.title,
      poster_path: movie.poster_path,
      vote_average: movie.vote_average,
      imdb_id: await getIMDbId(movie.id), // Get the IMDb ID of each movie
    }))
  );

  // Display the list of movies in the user interface
  displayMovies(movies);
}

// Search for movies with a given query
// Define an asynchronous function that searches for movies by a query string
async function searchMovies(query) {
  // Make a request to the external API to search for movies that match the query
  const response = await fetch(`${abu}/search/movie?api_key=${ak}&query=${query}`);

  // Convert the response body to a JavaScript object using JSON parsing
  const jr = await response.json();

  // Map the response data to an array of movie objects, including the IMDb ID for each movie
  const movies = await Promise.all(
    jr.results.map(async (movie) => ({
      id: movie.id,
      title: movie.title,
      poster_path: movie.poster_path,
      vote_average: movie.vote_average,
      imdb_id: await getIMDbId(movie.id), // Get the IMDb ID of each movie
    }))
  );

  // Display the list of movies in the user interface
  displayMovies(movies);
}


// Display an array of movies on the page
// Define a function that displays a list of movies in the user interface
function displayMovies(movies) {
  // Set the innerHTML of the mg element to a string of movie cards
  mg.innerHTML = movies
    .map((movie) => {
      // Check if the current movie is a favorite by checking if its ID is in the favorites array
      const isFavorite = favorites.includes(movie.id);

      // Generate a movie card for the current movie, including its title, poster, IMDb rating, and a button to add/remove it from favorites
      return `<div class="movie-card ${isFavorite ? 'favorite' : ''}">
                  <a href="https://imdb.com/title/${movie.imdb_id}/">
                    <img src="${ibu}${movie.poster_path}"/>
                    <p>⭐ ${movie.vote_average}</p>
                    <h1>${movie.title}</h1>
                  </a>
                  <button class="favorite-btn" data-id="${movie.id}">
                    ${isFavorite ? '❤️ Remove from Favorites' : '🤍 Add to Favorites'}
                  </button>
                </div>`;
    })
    .join(''); // Join the array of movie cards into a single string and set it as the innerHTML of the mg element
}

// Create an empty array to hold the IDs of favorite movies
const favorites = [];

// Define a function that handles the click event on a favorite button
function handleFavoriteButtonClick(event) {
  // Get the ID of the movie associated with the clicked button from the button's data-id attribute
  const movieId = parseInt(event.target.dataset.id);

  // Find the index of the movie ID in the favorites array
  const mi = favorites.indexOf(movieId);

  // If the movie is already a favorite, remove it from the favorites array; otherwise, add it to the favorites array
  if (mi > -1) {
    favorites.splice(mi, 1);
  } else {
    favorites.push(movieId);
  }
}

// Add an event listener to the document to listen for click events on any element
document.addEventListener('click', (event) => {
  // If the clicked element is a favorite button, call the handleFavoriteButtonClick function
  if (event.target.classList.contains('favorite-btn')) {
    handleFavoriteButtonClick(event);
  }
});

// Define a function that handles the submit event on the search form
function handlesfSubmit(_event) {
  // Prevent the default behavior of the form, which is to refresh the page on submit
  _event.preventDefault();

  // Update the category title to indicate that the search results will be displayed
  ct.innerHTML = "Search Results";

  // Get the user's search query from the search input
  const searchQuery = si.value;

  // Call the searchMovies function with the user's search query
  searchMovies(searchQuery);
}

// Define an async function that fetches the IMDb ID for a given movie ID
async function getIMDbId(movieId) {
  // Send a request to the Movie Database API to get the external IDs for the specified movie
  const response = await fetch(`${abu}/movie/${movieId}/external_ids?api_key=${ak}`);

  // Convert the response to JSON
  const jr = await response.json();

  // Return the IMDb ID from the JSON response
  return jr.imdb_id;
}

// Add an event listener to the search form to listen for submit events
sf.addEventListener("submit", handlesfSubmit);

// Call the fetchMoviesNowPlaying function to display the list of movies currently playing in theaters
fetchMoviesNowPlaying();




 