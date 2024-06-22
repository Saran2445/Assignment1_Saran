const express = require("express");
const path = require("path"); //needed when setting up static/file paths
const dotenv = require("dotenv");

//load the environment variables from .env
dotenv.config();

const db = require("./modules/games/db"); //load db.js

//set up the Express app
const app = express();
const port = process.env.PORT || "8888";

//set up application template engine
app.set("views", path.join(__dirname, "views")); //the first "views" is the setting name
//the second value above is the path: __dirname/views
app.set("view engine", "pug");

//set up folder for static files
app.use(express.static(path.join(__dirname, "public")));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//USE PAGE ROUTES FROM ROUTER(S)
app.get("/", async (request, response) => {
  let gameList = await db.getGames();
  //if there's nothing in the movies collection, initialize with some content then get the movies again
  if (!gameList.length) {
    await db.initializeGames(); //load data into movies
    gameList = await db.getGames();
  }
  console.log(gameList);
  response.render("index", { games: gameList });
});

app.get("/gameDetails/:id", async(request, response) =>{
  let  gameDetails = await db.getGameDetails(request.params.id);
  console.log(gameDetails);
  response.render("details", {game: gameDetails});
});

app.get("/about", async(request, response) =>{
  response.render("about");
});

app.get("/admin/game/add", async(request, response) => {
  response.render("game-add",{title: "Add Game"});
});

app.post("/admin/game/add/submit", async(request, response) =>{
  let name = request.body.gameName;
  let genre = request.body.gameGenre;
  let year = request.body.gameYear;
  let imgUrl = request.body.gameImgUrl;
  let about = request.body.gameAbout;


  let newGame ={
      name: name,
      genre: genre,
      year: year,
      img_url: imgUrl,
      about: about,
    
  }
  console.log(newGame);
  await db.addGame(newGame);
  response.redirect("/");
});




//set up server listening
app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
}); 

