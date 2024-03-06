let jsonobject = null;

document.addEventListener("DOMContentLoaded", async function(){
    console.log("HTML DOM tree loaded, and ready for manipulation.");
    // === YOUR FUNCTION CALL TO INITIATE THE GENERATION OF YOUR WEB PAGE SHOULD GO HERE ===
    await getImdbDb(null,null,100)
    
    
});

const serverUrl = "http://127.0.0.1:3000";
let moviesLoaded = 0;

// Function to get movies from IMDb database
async function getImdbDb(filter, sort, limit){
    let filterUrl = null;

    if (filter === true){
        try{
            const fromYear = document.getElementById("from-year-bar").value;
            const toYear = document.getElementById("to-year-bar").value;
            //const radioButtons = document.getElementsByClassName("radio-genre-button");
            console.log(fromYear);
            console.log(toYear);
            filterUrl = "" + fromYear + "/" + toYear;
            console.log(filterUrl);

            // for(let i = 0; i < radioButtons.length; i++){
            //     if (radioButtons[i].checked){
            //         filterUrl = filterUrl + "/" + radioButtons[i].value;
            //     }
            // }

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
            window.location.href = "movieInfo.html";
        }
        
        const listItem = document.createElement("li");

        console.log(movie.bechdel)
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
    
    console.log("Average Bechdel score:", average);
    console.log("Number of movies with Bechdel score 0:", zero);
    console.log("Number of movies with Bechdel score 1:", one);
    console.log("Number of movies with Bechdel score 2:", two);
    console.log("Number of movies with Bechdel score 3:", three);
}