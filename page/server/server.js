// declaration and loading (inclusion) of various modules
const http = require("node:http");
const MongoClient = require("mongodb").MongoClient;

//MongoDB server
const dbHostname = "127.0.0.1";
const dbPort = 27017;
const dbServerUrl = "mongodb://" + dbHostname + ":" + dbPort + "";

// inizialize MongoDB connector instance
const dbClient = new MongoClient(dbServerUrl);

// initialization of server properties
const hostname = "127.0.0.1";
const port = 3000;
const serverUrl = "http://" + hostname + ":" + port + "";

// initialization of server object
const server = http.createServer(async (req, res) => {
    console.log("create server");
    const requestUrl = new URL(serverUrl + req.url);
    const pathComponents = requestUrl.pathname.split("/");

    if(req.method == "GET"){

        if(pathComponents){
            const dbBechdel = await getDbBechdel(pathComponents);
            routing_data(res, JSON.stringify(dbBechdel));
        }else{
            const dbImdb = await getDbImdb(pathComponents);
            routing_data(res, JSON.stringify(dbImdb));
        }
        
    }
    else if(req.method == "OPTIONS"){
        sendResponse(res, 204, null, null);
    }
    else if(req.method == "POST"){
        sendResponse(res, 200, "text/plain", "Welcome on the ARTIST");
    }
});

// start up of the initialized (and configured) server
server.listen(port, hostname, () => {
    console.log("The server running and listening at\n" + serverUrl);
});

// convenience function (template) for composing a HTTP response message
function sendResponse(res, statusCode, contentType, data){
    //configure HTTP response status code, and (if required) Content-Type header
    console.log("sendResponse");
    res.statusCode = statusCode;
    if(contentType != null){
        res.setHeader("Content-Type", contentType);
    }

    // configure HTTP response message header to allow Cross-Origin Resource 
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "*");

    if(data != null){
        res.end(data);      //data in HTTP message body
    }else{  
        res.end();          //empty HTTP message body
    }
}

function routing_data(res, jsonString) {
    try {
        const movieJsonDataFromDb = JSON.parse(jsonString);
        console.log(1, movieJsonDataFromDb);

        sendResponse(res, 200, "application/json", jsonString);

    } catch (error) {
        // Handle JSON parsing error
        console.error("Error parsing JSON:", error);
        sendResponse(res, 500, "text/plain", "Internal Server Error");
    }
}

/*  These are the three different collections  
    const dbCollectionName_ActorInfo = db.collection("actorinfo");
    const dbCollectionName_bechdel = db.collection("bechdel");
    const dbCollectionName_imdb = db.collection("imdb");*/

async function getDbBechdel(){
    
    const db = dbClient.db("tnm115-project");
    const dbCollection = db.collection("bechdel");

    const filterQuery = {};
    const sortQuery = {name: 1};
    const projectionQuery = { _id: 1, name: 1};
    const findResult = await dbCollection.find(filterQuery).sort(sortQuery).project(projectionQuery).toArray();
    //console.log("Found/Projected Documents:", findResult);
    return findResult;
}

async function getDbImdb(){
    
    const db = dbClient.db("tnm115-project");
    const dbCollectionName_imdb = db.collection("imdb");

    const filterQuery = {};
    const sortQuery = {name: 1};
    const projectionQuery = { _id: 1, name: 1};
    const findResult = await dbCollection.find(filterQuery).sort(sortQuery).project(projectionQuery).toArray();
    //console.log("Found/Projected Documents:", findResult);
    return findResult;
}
/*  for search movie later
async function getDatabase(searchName){
    const db = dbClient.db("tnm115-project");
    const dbCollection = db.collection("bechdel");   

    const filterQuery = {name: searchName};
    const sortQuery = {name: 1};
    const findResult = await dbCollection.find(filterQuery).sort(sortQuery).toArray();
    //console.log("Found/Projected Documents:", findResult);
    return findResult;
}*/