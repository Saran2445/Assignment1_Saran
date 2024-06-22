const { Long } = require("mongodb");
const mongoose = require("mongoose"); //import Mongoose
//const uri = "mongodb+srv://saransaba24:eiQHDOjrBB4lJDMd@cluster0.tmq90m6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
//const dbUrl = `mongodb://${process.env.DBUSER}:${process.env.DBPWD}@${process.env.DBHOST}/?authSource=testdb`;
const dbUrl = `mongodb+srv://${process.env.DBUSER}:${process.env.DBPWD}@${process.env.DBHOST}`;

//set up Schema and model
const GameSchema = new mongoose.Schema({
  name: String,
  genre: String,
  year: String,
  img_url: String,
  about: String
});
const Game = mongoose.model("Game", GameSchema);

const ObjectId = require('mongodb').ObjectId;

//MONGODB FUNCTIONS
async function connect() {
  await mongoose.connect(dbUrl); //connect to mongodb
}

//Get all Movies from the movies collection
async function getGames() {
  await connect();
  return await Game.find({}).sort({year: 1}); //return array for find all
}
//Initialize movies collection with some data.
async function initializeGames() {
  const gameList = [{
      name: "IGI",
      genre: "First Person Shooter",
      year: "2000",
      img_url: "https://images.unsplash.com/photo-1620231150904-a86b9802656a?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      about: "IGI (I'm Going In) is a tactical first-person shooter known for its realistic gameplay, challenging missions, and stealth-based mechanics."
    }];
  await Game.insertMany(gameList);
}

async function getGameDetails(gameId){
  await connect();
  let idFilter = { _id: new ObjectId(gameId)};
  console.log(gameId);
  return await Game.findOne(idFilter);
}
//Function to add new game to the collection
async function addGame(newGame){
  await connect();
  await Game.insertMany(newGame);
}


module.exports = {
  getGames,
  initializeGames,
  getGameDetails,
  addGame
}