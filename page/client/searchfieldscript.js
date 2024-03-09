//Eventlistener for the search input field
document.addEventListener('DOMContentLoaded', function() {
    console.log('HTML DOM tree loaded, and ready for manipulation.');
    getMovieRandom(randomizeMovie())
    let searchInput = document.querySelector('.search-data-middle');

    if (searchInput) {
        searchInput.addEventListener('input', function(event) {
            let inputValue = event.target.value;
            console.log(inputValue);
            getMoviesDbSearch(inputValue);
        });
    } else {
        console.log('Element with class .search-data-middle not found');
    }
});

const serverUrl = "http://127.0.0.1:3001";

// Function to find the searched movie/movies in the database
async function getMoviesDbSearch(search){
    console.log(search)
    const response = await fetch(serverUrl + "/search/" + search, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        }
    });
    if(response.ok){
        response.json().then((jsonBody) => {
            console.log("The client request to the server was successful.");
            jsonobject = jsonBody;
            console.log(jsonobject);
        });
        
        
    }else{
        console.log("The client request tot the server was unsuccessful.");
        console.log(response.status + " | " + response.statusText);
    }
}

function randomizeMovie(){
    let random = Math.floor(Math.random()*10);
    console.log(random)
    return random;
}

async function getMovieRandom(random){

    const response = await fetch(serverUrl + "/random/" + random , {
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
            console.log(jsonobject);
            loadRandomMovie();
        });
        
        
    }else{
        console.log("The client request tot the server was unsuccessful.");
        console.log(response.status + " | " + response.statusText);
    }
}

function loadRandomMovie(){
    const div = document.getElementById("black-box");
    const header = document.createElement("h1");
    header.innerHTML = "Popular Movie";
    div.appendChild(header);
    const a = document.createElement("a");
    a.href = "movieInfo.html?movie=" + jsonobject[0].IMDb._id;
    a.innerHTML = jsonobject[0].IMDb.name;
    div.appendChild(a);
}