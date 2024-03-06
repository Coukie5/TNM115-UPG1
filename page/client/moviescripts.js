document.addEventListener("DOMContentLoaded", async function(){
    console.log("HTML DOM tree loaded, and ready for manipulation.");
    // === YOUR FUNCTION CALL TO INITIATE THE GENERATION OF YOUR WEB PAGE SHOULD GO HERE ===

    const webpageURL = new URL(document.URL);

    const param = webpageURL.searchParams.get("movie");

    await getMoviesDbId(param);
    
});

const serverUrl = "http://127.0.0.1:3001";
async function getMoviesDbId(search){
    console.log(search)
    const response = await fetch(serverUrl + "/id/" + search, {
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
            loadMovieInfo();
        });
        
        
    }else{
        console.log("The client request tot the server was unsuccessful.");
        console.log(response.status + " | " + response.statusText);
    }
}

function loadMovieInfo() {
    const container = document.querySelector(".movieInfo-container");
    if (container) {
        container.remove();
    }

    const divContainer = document.createElement("div");
    divContainer.className = "movieInfo-container";

    console.log(jsonobject)
    // Header
        const divMovieBox = document.createElement("div");
        divMovieBox.className = "movieInfo-header";

        console.log(jsonobject[0].bechdel)
        const textElement = document.createElement("h1");
        textElement.innerHTML = jsonobject[0].IMDb.name;
        
        divMovieBox.appendChild(textElement);
        divContainer.appendChild(divMovieBox);


    //Info: IMDb, Duration, Year
        const divMovieInfo = document.createElement("div");
        divMovieInfo.className = "movieInfo-Data-item";

        const textIMDb = document.createElement("p");
        textIMDb.innerHTML = "IMDb: " + jsonobject[0].IMDb.rating;
        divMovieInfo.appendChild(textIMDb);

        const textRuntime = document.createElement("p");
        textRuntime.innerHTML = "Duration: " + jsonobject[0].IMDb.runtime;
        divMovieInfo.appendChild(textRuntime);

        const textYear = document.createElement("p");
        textYear.innerHTML = "Year :" + jsonobject[0].IMDb.year;
        divMovieInfo.appendChild(textYear);

        divContainer.appendChild(divMovieInfo);


    //Description
        const divMovieDesc = document.createElement("div");
        divMovieDesc.className = "movieInfo-Desc";

        const textDesc = document.createElement("p");
        textDesc.innerHTML = jsonobject[0].IMDb.description;
        divMovieDesc.appendChild(textDesc);

        divContainer.appendChild(divMovieDesc);
    
    //Genre
        const divMovieGenre = document.createElement("div");
        divMovieGenre.className = "movieInfo-genre";

    const listElement = document.createElement("ul");
    jsonobject[0].IMDb.genre.forEach(function(genre) {
        const listItem = document.createElement("li");
        listItem.innerHTML = genre;
        listElement.appendChild(listItem);
    });
    divMovieGenre.appendChild(listElement);
    divContainer.appendChild(divMovieGenre);

    //IMDb movie link
    const divMovieLink = document.createElement("div");
    divMovieLink.className = "movieInfo-link";

    const movieLink = document.createElement("a");
    movieLink.target="_blank";
    movieLink.innerHTML = "https://www.imdb.com/title/" + jsonobject[0].IMDb._id;
    divMovieLink.appendChild(movieLink);
    divContainer.appendChild(divMovieLink);
                
    //Bechdel passed text
    const textBechdel = document.createElement("p");
    textBechdel.className = ("movieInfo-bechdel-text")
    textBechdel.innerHTML = "Bechdel: passed " + jsonobject[0].bechdel + " of 3 tests";
    divContainer.appendChild(textBechdel);

    //Bechdel box
    const divBechdelBox = document.createElement("div");
    divBechdelBox.className = "movieInfo-bechdel-box";

    const headCriteria = document.createElement("h3");
    headCriteria.className = "h3-criteria";
    headCriteria.innerHTML = "Criteria for bechdel test";
    divBechdelBox.appendChild(headCriteria);

    const listCriteria = document.createElement("ul");
    listCriteria.className = "list-criteria";
    if(jsonobject[0].bechdel == 1){
        const itemCriteria1 = document.createElement("li");
        itemCriteria1.innerHTML = "The movie must feature at least two named female characters.";
        listCriteria.appendChild(itemCriteria1);
        const itemCriteria2 = document.createElement("li");
        itemCriteria2.style.textDecoration = "line-through";
        itemCriteria2.innerHTML = "These characters must have a conversation with each other.";
        listCriteria.appendChild(itemCriteria2);
        const itemCriteria3 = document.createElement("li");
        itemCriteria3.style.textDecoration = "line-through";
        itemCriteria3.innerHTML = "The conversation must be about something other than a man.";
        listCriteria.appendChild(itemCriteria3);
    }
    if(jsonobject[0].bechdel == 2){
        const itemCriteria1 = document.createElement("li");
        itemCriteria1.innerHTML = "The movie must feature at least two named female characters.";
        listCriteria.appendChild(itemCriteria1);
        const itemCriteria2 = document.createElement("li");
        itemCriteria2.innerHTML = "These characters must have a conversation with each other.";
        listCriteria.appendChild(itemCriteria2);
        const itemCriteria3 = document.createElement("li");
        itemCriteria3.style.textDecoration = "line-through";
        itemCriteria3.innerHTML = "The conversation must be about something other than a man.";
        listCriteria.appendChild(itemCriteria3);
    }
    if(jsonobject[0].bechdel == 3){
        const itemCriteria1 = document.createElement("li");
        itemCriteria1.innerHTML = "The movie must feature at least two named female characters.";
        listCriteria.appendChild(itemCriteria1);
        const itemCriteria2 = document.createElement("li");
        itemCriteria2.innerHTML = "These characters must have a conversation with each other.";
        listCriteria.appendChild(itemCriteria2);
        const itemCriteria3 = document.createElement("li");
        itemCriteria3.innerHTML = "The conversation must be about something other than a man.";
        listCriteria.appendChild(itemCriteria3);
    }else{
        const itemCriteria1 = document.createElement("li");
        itemCriteria1.innerHTML = "The movie must feature at least two named female characters.";
        itemCriteria1.style.textDecoration = "line-through";
        listCriteria.appendChild(itemCriteria1);
        const itemCriteria2 = document.createElement("li");
        itemCriteria2.style.textDecoration = "line-through";
        itemCriteria2.innerHTML = "These characters must have a conversation with each other.";
        listCriteria.appendChild(itemCriteria2);
        const itemCriteria3 = document.createElement("li");
        itemCriteria3.style.textDecoration = "line-through";
        itemCriteria3.innerHTML = "The conversation must be about something other than a man.";
        listCriteria.appendChild(itemCriteria3);
    }

    divBechdelBox.appendChild(listCriteria);
    
    divContainer.appendChild(divBechdelBox);
        console.log(divContainer)
    const target = document.getElementById("target-movies")
    target.appendChild(divContainer);
}