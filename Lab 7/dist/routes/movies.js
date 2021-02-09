"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Movies = void 0;
const movieData_1 = require("../data/movieData");
class Movies {
    routes(app) {
        app.route('/api/movies/:id').get((req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const test = yield movieData_1.getMovie(req.params.id);
                // const bandauth= await bandmeth.getBand(test.author);
                // test.author={
                //     _id:bandauth._id,
                //     bandName:bandauth.bandName
                // };
                res.json(test);
            }
            catch (e) {
                res.status(404).json({ error: e });
                //console.log(e);
            }
        }));
        app.route("/api/movies/:id/comments").post((req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let test = req.params.id;
                let moviePdata = yield req.body;
                if (typeof moviePdata.name !== "string") {
                    throw "name is not a string";
                }
                if (typeof moviePdata.comment !== "string") {
                    throw "comment is not a string";
                }
                const output = yield movieData_1.addComment(test, moviePdata);
                res.json(output);
            }
            catch (e) {
                res.status(404).json({ error: e });
            }
        }));
        app.route('/api/movies/:movieId/:commentId').delete((req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let movieId = req.params.movieId;
                let commentId = req.params.commentId;
                const test = yield movieData_1.removeComment(movieId, commentId);
                res.json(test);
            }
            catch (e) {
                res.status(404).json({ error: e });
                //console.log(e);
            }
        }));
        app.route('/api/movies').get((req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let skip = req.query.skip;
                let take = req.query.take;
                if (skip && Number.isNaN(parseInt(skip))) {
                    throw "skip should be number";
                }
                if (take && Number.isNaN(parseInt(take))) {
                    throw "take should be number";
                }
                const test = yield movieData_1.getAllMovies(skip, take);
                res.json(test);
            }
            catch (e) {
                res.status(404).json({ error: e });
                //console.log(e);
            }
        }));
        app.route('/api/movies/:id').patch((req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const movieObj = yield movieData_1.getMovie(req.params.id);
                const moviePdata = req.body;
                if (moviePdata.title && moviePdata.title !== movieObj.title) {
                    if (typeof moviePdata.title !== 'string') {
                        throw "title is not string";
                    }
                    movieObj.title = moviePdata.title;
                }
                if (moviePdata.cast) {
                    for (let i = 0; i < moviePdata.cast.length; i++) {
                        let flag = 0;
                        for (let j = 0; j < movieObj.cast.length; j++) {
                            if (JSON.stringify(movieObj.cast[j]) === JSON.stringify(moviePdata.cast[i])) {
                                flag = 1;
                            }
                        }
                        if (flag === 0) {
                            movieObj.cast.push(moviePdata.cast[i]);
                        }
                    }
                }
                if (moviePdata.info && moviePdata.info.director !== movieObj.info.director) {
                    if (typeof moviePdata.info.director !== 'string') {
                        throw "director is not string";
                    }
                    movieObj.info.director = moviePdata.info.director;
                }
                if (moviePdata.info && moviePdata.info.yearReleased !== movieObj.info.yearReleased) {
                    if (Number.isNaN(parseInt(moviePdata.info.yearReleased))) {
                        throw "yearReleased should be number";
                    }
                    movieObj.info.yearReleased = moviePdata.info.yearReleased;
                }
                if (moviePdata.plot && moviePdata.plot !== movieObj.plot) {
                    if (typeof moviePdata.plot !== 'string') {
                        throw "plot is not string";
                    }
                    movieObj.plot = moviePdata.plot;
                }
                if (moviePdata.rating && moviePdata.rating !== movieObj.rating) {
                    if (Number.isNaN(parseInt(moviePdata.rating))) {
                        throw "rating should be number";
                    }
                    movieObj.rating = moviePdata.rating;
                }
                let test = req.params.id;
                const output = yield movieData_1.updateMovie(test, movieObj.title, movieObj.cast, movieObj.info.director, movieObj.info.yearReleased, movieObj.plot, movieObj.rating);
                res.json(output);
            }
            catch (e) {
                res.status(404).json({ error: e });
                //console.log(e);
            }
        }));
        app.route('/api/movies/:id').put((req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const test = req.params.id;
                const moviePdata = req.body;
                if (Number.isNaN(parseInt(moviePdata.rating))) {
                    throw "rating should be number";
                }
                if (Number.isNaN(parseInt(moviePdata.info.yearReleased))) {
                    throw "yearReleased should be number";
                }
                if (typeof moviePdata.title !== 'string') {
                    throw "title is not string";
                }
                if (typeof moviePdata.info.director !== 'string') {
                    throw "director is not string";
                }
                if (typeof moviePdata.plot !== 'string') {
                    throw "plot is not string";
                }
                const output = yield movieData_1.updateMovie(test, moviePdata.title, moviePdata.cast, moviePdata.info.director, moviePdata.info.yearReleased, moviePdata.plot, moviePdata.rating);
                res.json(output);
            }
            catch (e) {
                res.status(404).json({ error: e });
                //console.log(e);
            }
        }));
        app.route('/api/movies').post((req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                //console.log(req.body.comments[0].comment);
                const moviePdata = req.body;
                if (Number.isNaN(parseInt(moviePdata.rating))) {
                    throw "rating should be number";
                }
                if (Number.isNaN(parseInt(moviePdata.info.yearReleased))) {
                    throw "yearReleased should be number";
                }
                if (typeof moviePdata.title !== 'string') {
                    throw "title is not string";
                }
                if (typeof moviePdata.info.director !== 'string') {
                    throw "director is not string";
                }
                if (typeof moviePdata.plot !== 'string') {
                    throw "plot is not string";
                }
                const output = yield movieData_1.addMovie(moviePdata.title, moviePdata.cast, moviePdata.info.director, moviePdata.info.yearReleased, moviePdata.plot, moviePdata.rating);
                res.json(output);
            }
            catch (e) {
                res.status(404).json({ error: e });
                //console.log(e);
            }
        }));
    }
}
exports.Movies = Movies;
