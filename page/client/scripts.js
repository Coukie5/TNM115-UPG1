let jsonobject = null;

document.addEventListener("DOMContentLoaded", async function(){
    console.log("HTML DOM tree loaded, and ready for manipulation.");
    // === YOUR FUNCTION CALL TO INITIATE THE GENERATION OF YOUR WEB PAGE SHOULD GO HERE ===
    await getImdbDb()
    
    
});

const serverUrl = "http://127.0.0.1:3000";

//Get names/id
async function getImdbDb(){
        
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

//Get title/id bechdel
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

function loadMovies(){
    const divContainer = document.createElement("div");
    divContainer.className = "movies-container";

    console.log(jsonobject)

    const listElement = document.createElement("ol");
    jsonobject.forEach(function(movie) {
        
        const itemInfo = document.createElement("a");
        itemInfo.onclick = function(){
            window.location.href = "movieInfo.html";
        }

        const divMovieBox = document.createElement("div");
        divMovieBox.className = "movie-box";
        
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
        
        const textStar = document.createElement("p");
        textStar.className = "flexitem";
        textStar.innerHTML = "Actors: " + movie.IMDb.star[0] + ", " + movie.IMDb.star[1];
        divDirAct.appendChild(textStar);
        listItem.appendChild(divDirAct);

        const textVotes = document.createElement("p");
        textVotes.innerHTML = "Votes: " + movie.IMDb.votes;
        listItem.appendChild(textVotes);
        
        itemInfo.appendChild(listItem)
        divMovieBox.appendChild(itemInfo);
        listElement.appendChild(divMovieBox);
    }); 
    divContainer.appendChild(listElement);
    const target = document.getElementById("target-movies")
    target.appendChild(divContainer);
}