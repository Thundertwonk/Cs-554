"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const movies_1 = require("./routes/movies");
let trequestcounter = 1;
let urlCount = {};
class App {
    constructor() {
        this.movieRoutes = new movies_1.Movies();
        this.Logger = (req, res, next) => {
            trequestcounter = trequestcounter++;
            console.log("Total requests " + trequestcounter++);
            console.log(JSON.stringify(req.body) + " " + req.method + " " + req.originalUrl);
            let url = req.originalUrl;
            if (urlCount[url] === undefined) {
                urlCount[url] = 1;
            }
            else {
                urlCount[url]++;
            }
            console.log(req.originalUrl + "     count of requests       " + urlCount[url]);
            next();
        };
        this.app = express();
        this.config();
        this.movieRoutes.routes(this.app);
    }
    config() {
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: false }));
        this.app.use(this.Logger);
    }
}
exports.default = new App().app;
