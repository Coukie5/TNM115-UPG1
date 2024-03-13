let jsonobject = null;

document.addEventListener("DOMContentLoaded", async function(){
    console.log("HTML DOM tree loaded, and ready for manipulation.");
    // === YOUR FUNCTION CALL TO INITIATE THE GENERATION OF YOUR WEB PAGE SHOULD GO HERE ===
    //generateGenreBoxes();
    await getImdbDb(null,null,100)
    
});

const serverUrl = "http://127.0.0.1:3001";
let moviesLoaded = 0;

// Function to get movies from IMDb database
async function getImdbDb(filterBool, sort, limit){
    let filterUrl = null;

    if (filterBool === true){
        try{
            const fromYear = document.getElementById("from-year-bar").value;
            const toYear = document.getElementById("to-year-bar").value;
            const selectedGenres = document.getElementsByClassName("selected"); 
            
            console.log(fromYear);
            console.log(toYear);
            filterUrl = "" + fromYear + "/" + toYear;

            for (let i = 0; i < selectedGenres.length; i++){
                filterUrl = filterUrl + "/" + selectedGenres[i].innerHTML;
            }
            console.log(filterUrl);

        }
        catch(err){
            console.log(err);
        }
    } 
    
    const response = await fetch(serverUrl + "/" + sort + "/" + limit + "/" + filterUrl , {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        body: null
    });
    if(response.ok){
        response.json().then((jsonBody) => {
            console.log("The client request to the server was successful.");
            jsonobject = jsonBody;
            loadMovies();
        });
        
        
    }else{
        console.log("The client request tot the server was unsuccessful.");
        console.log(response.status + " | " + response.statusText);
    }
}

function loadMoreMovies() {
    moviesLoaded += 100; 
    getImdbDb(null, null, moviesLoaded + 100);
}

// Function to load more movies
async function getBechdelTitleId(){
        
    const response = await fetch(serverUrl , {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        body: null
    });
    if(response.ok){
        response.json().then((jsonBody) => {
            console.log("The client request to the server was successful.");
            jsonobject = jsonBody;
            loadMovies();
        });
        
        
    }else{
        console.log("The client request tot the server was unsuccessful.");
        console.log(response.status + " | " + response.statusText);
    }
}

// Function to search for a movie/movies
async function searchMovie(){
    const movieNameTextValue = document.getElementById("moviename").value;
    console.log("Movie name:");
    console.log(movieNameTextValue);
    console.log(typeof(movieNameTextValue));
    console.log("==========");
    await getMoviesDbSearch(movieNameTextValue);
    console.log(jsonobject)
}

// Function to find the searched movie/movies in the database
async function getMoviesDbSearch(search){
    console.log(search)
    const response = await fetch(serverUrl + "/search/" + search, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        body: null
    });
    if(response.ok){
        response.json().then((jsonBody) => {
            console.log("The client request to the server was successful.");
            jsonobject = jsonBody;
            loadMovies();
        });
        
        
    }else{
        console.log("The client request tot the server was unsuccessful.");
        console.log(response.status + " | " + response.statusText);
    }
}

// Function to load movies 
function loadMovies(){
    const container = document.querySelector(".movies-container");
    if (container) {
        container.remove();
    }

    const divContainer = document.createElement("div");
    divContainer.className = "movies-container";

    console.log(jsonobject)

    const listElement = document.createElement("ol");
    jsonobject.forEach(function(movie) {
        const divMovieBox = document.createElement("div");
        divMovieBox.id = movie.IMDb._id;
        divMovieBox.className = "movie-box";
        divMovieBox.onclick = function(){
            window.location.href = "movieInfo.html?movie=" + divMovieBox.id;

        }
        const listItem = document.createElement("li");

        const textElement = document.createElement("h2");
        textElement.innerHTML = movie.IMDb.name;
        
        listItem.appendChild(textElement);

        const divMovieInfo = document.createElement("div");
        divMovieInfo.className = "div-movie-info";

        const textRuntime = document.createElement("p");
        textRuntime.className = "flexitem";
        textRuntime.innerHTML = "Duration: " + movie.IMDb.runtime;
        divMovieInfo.appendChild(textRuntime);

        const textYear = document.createElement("p");
        textYear.className = "flexitem";
        textYear.innerHTML = "Year :" + movie.IMDb.year;
        divMovieInfo.appendChild(textYear);

        const textImdb = document.createElement("p");
        textImdb.className = "flexitem";
        textImdb.innerHTML = "IMDb :" + movie.IMDb.rating;
        divMovieInfo.appendChild(textImdb);
        listItem.appendChild(divMovieInfo);
        
        const textDesc = document.createElement("p");
        textDesc.innerHTML = movie.IMDb.description;
        listItem.appendChild(textDesc);

        const divDirAct = document.createElement("div");
        divDirAct.className = "div-movie-info";

        const textDir = document.createElement("p");
        textDir.className = "flexitem";
        textDir.innerHTML = "Director: " + movie.IMDb.director[0];
        divDirAct.appendChild(textDir);
        
        if (movie.IMDb.star){
            const textStar = document.createElement("p");
            textStar.className = "flexitem";
            let actorText = "Actors: ";

            for(let i = 0; i < movie.IMDb.star.length && i < 2; i++){
                actorText = actorText + movie.IMDb.star[i] + ", ";
            }

            textStar.innerHTML = actorText;
            divDirAct.appendChild(textStar);
            listItem.appendChild(divDirAct);
        }
        

        const textVotes = document.createElement("p");
        textVotes.innerHTML = "Votes: " + movie.IMDb.votes;
        listItem.appendChild(textVotes);

        const textBechdel = document.createElement("p");
        textBechdel.className = ("div-movie-info")
        textBechdel.innerHTML = "Bechdel: passed " + movie.bechdel + " of 3 tests";
        listItem.appendChild(textBechdel);
        
        //itemInfo.appendChild(listItem)
        divMovieBox.appendChild(listItem);
        listElement.appendChild(divMovieBox);
    }); 
    divContainer.appendChild(listElement);
    const target = document.getElementById("target-movies")
    target.appendChild(divContainer);
}

// Function to calculate average bechdel score and number of movies for each catagory 
function calculate(){
    let average = 0;
    let sum = 0;
    let zero = 0;
    let one = 0;
    let two = 0;
    let three = 0;
    
    jsonobject.forEach(function(movie) {
        sum += movie.bechdel;
        switch(movie.bechdel) {
            case 0:
                zero++;
                break;
            case 1:
                one++;
                break;
            case 2:
                two++;
                break;
            case 3:
                three++;
                break;
            default:
                break;
        }
    });
    
    average = sum/jsonobject.length;

    document.getElementById('score-result0').innerText = zero;
    document.getElementById('score-result1').innerText = one;
    document.getElementById('score-result2').innerText = two;
    document.getElementById('score-result3').innerText = three;
    document.getElementById('score-result-average').innerText = average.toFixed(2);
}

function sortBy() {
    var sortBy = document.getElementById("sortOptions").value;
    switch (sortBy) {
    case 'votes':
        getImdbDb(true, 'votes', 100);
        break;
      case 'name':
        getImdbDb(true, 'name', 100);
        break;
      case 'rating':
        getImdbDb(true, 'rating', 100);
        break;
      case 'runtime':
        getImdbDb(true, 'runtimeValue', 200);
        break;
      case 'bechdel':
        getImdbDb(true, 'bechdel', 100);
        break;
      case 'year':
        getImdbDb(true, 'year', 100);
        break;
      default:
        break;
    }
}

const genres = ['Action', 'Adventure', 'Animation', 'Biography', 'Comedy', 'Crime', 'Drama', 
                'Family', 'Fantasy', 'Film-Noir', 'History', 'Horror', 'Music', 'Musical', 'Mystery',
                'Romance', 'Sci-Fi', 'Sport', 'Thriller', 'War', 'Western'];

function genreSelected() {
    const item = event.target;
    item.classList.toggle("selected");
}
function filterDiv() {

    const filterBox = document.getElementById("filter-box");
    if (filterBox.style.display === "none"){
        filterBox.style.display = "flex";
    }
    else {
        filterBox.style.display = "none";
    }

/* Skrev om lite av koden så att filter-boxen redan finns från början // Felix
    const divContainer = document.getElementById('filter-box');
    divContainer.className = 'filter-container';

    if (divContainer.style.display === "block") {
        divContainer.style.display = "none";
    }
    else {
        divContainer.style.display = "block";
        divContainer.innerHTML = '';
        const divRelease = document.createElement('div');
    divRelease.className = 'filter-release';

    const headerRelease = document.createElement('h3');
    headerRelease.innerHTML = 'Release year';
    divRelease.appendChild(headerRelease);

    const divYear = document.createElement('div');
    divYear.className = 'filter-year';

    const inputFrom = document.createElement('input');
    inputFrom.type = 'text';
    inputFrom.id = 'from-year-bar';
    inputFrom.value = '';
    inputFrom.placeholder = 'YYYY';
    divYear.appendChild(inputFrom);

    const labelYear = document.createElement('label');
    labelYear.innerHTML = 'to';
    labelYear.htmlFor = inputFrom.id;
    divYear.appendChild(labelYear);

    const inputTo = document.createElement('input');
    inputTo.type = 'text';
    inputTo.id = 'to-year-bar';
    inputTo.value = '';
    inputTo.placeholder = 'YYYY';
    divYear.appendChild(inputTo);
    divRelease.appendChild(divYear);
    divContainer.appendChild(divRelease);

    const divGenre = document.createElement('div');
    divGenre.className = 'filter-genre';

    const headerGenre = document.createElement('h3');
    headerGenre.innerHTML = 'Genre';
    divGenre.appendChild(headerGenre);

    const listElement = document.createElement("ul");
    genres.forEach(function(genre) {
        const listItem = document.createElement("li");
        listItem.innerHTML = genre;
        listItem.onclick = function(){
            listItem.classList.toggle("selected");
        }
        listElement.appendChild(listItem);
    });
    divGenre.appendChild(listElement);
    divContainer.appendChild(divGenre);
    }
*/
}