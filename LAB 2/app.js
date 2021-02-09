  
const express = require("express");
const path = require("path");

const app = express();

app.use("/public", express.static(__dirname + "/public"));

app.get('/', (req, res)=> {
    res.sendFile(path.resolve("public/html/main.html"));
});

app.use("*", (req, res) => {
    res.status(404).sendFile(path.resolve("public/html/error.html"));
});



app.listen(3000, () => {
    console.log("We've now got a server!");
    console.log("Your routes will be running on http://localhost:3000");
  });