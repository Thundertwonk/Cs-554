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
exports.updateMovie = exports.getAllMovies = exports.removeComment = exports.addComment = exports.getMovie = exports.addMovie = void 0;
// const mongoCollection = require('../config/mongoCollections');
// const movies = mongoCollection.movies;
const mongoCollections_1 = require("../config/mongoCollections");
//const bands= mongoCollections.bands;
const { ObjectId } = require('mongodb');
function addMovie(title, castinput, director, yearReleased, plot, rating) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!title)
            throw 'You must provide a title for the movie';
        if (!castinput)
            throw 'You must provide cast members';
        if (!director)
            throw 'You must provide a director';
        if (!yearReleased)
            throw 'You must provide Yearrealeased';
        if (!plot)
            throw 'You must provide a plot';
        if (!rating)
            throw 'You must provide a rating';
        //if(!commentInput) throw 'You must provide comments';
        let castIterator = [];
        for (let i = 0; i < Object.keys(castinput).length; i++) {
            if (!castinput[i].firstName || !castinput[i].lastName)
                throw 'check details of cast';
            if (typeof castinput[i].firstName !== 'string' || typeof castinput[i].lastName !== 'string')
                throw 'check caast data type |must be string';
            castIterator.push(castinput[i]);
        }
        const movieCollection = yield mongoCollections_1.default.movies();
        let newMovie = {
            title,
            cast: castIterator,
            info: { director, yearReleased },
            plot,
            rating,
            comments: []
        };
        const insertInfo = yield movieCollection.insertOne(newMovie);
        if (insertInfo.insertedCount === 0)
            throw 'Could not add movie';
        const newId = insertInfo.insertedId;
        const movie = yield getMovie(newId);
        return movie;
    });
}
exports.addMovie = addMovie;
function getMovie(id) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!id)
            throw 'You must provide an id to search for';
        id = ObjectId(id);
        // console,log("i here");
        const movieCollection = yield mongoCollections_1.default.movies();
        const movie = yield movieCollection.findOne({ _id: id });
        if (movie === null)
            throw 'No movie with that id';
        return movie;
    });
}
exports.getMovie = getMovie;
function addComment(movieId, commentInput) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!movieId)
            throw 'check movieid';
        if (!commentInput.name || !commentInput.comment)
            throw 'check commentInput';
        movieId = ObjectId(movieId);
        let movieCollection = yield mongoCollections_1.default.movies();
        let updatedcomments = {
            _id: ObjectId(),
            name: commentInput.name,
            comment: commentInput.comment
        };
        let updatedInfo = yield movieCollection.updateOne({ _id: movieId }, { $push: { comments: updatedcomments } });
        if (updatedInfo.modifiedCount === 0) {
            throw 'could not update movie comment successfully';
        }
        let movie = yield getMovie(movieId);
        return movie;
    });
}
exports.addComment = addComment;
function removeComment(movieId, commentId) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!movieId)
            throw "Please provide a valid task ID";
        if (!commentId)
            throw "Please provide a valid comment ID";
        const movieCollection = yield mongoCollections_1.default.movies();
        const updatedInfo = yield movieCollection.updateOne({ _id: ObjectId(movieId) }, { $pull: { comments: { _id: ObjectId(commentId) } } });
        if (updatedInfo.modifiedCount === 0) {
            throw 'could not delete movie comment';
        }
        let output = yield getMovie(movieId);
        return output;
    });
}
exports.removeComment = removeComment;
function getAllMovies(skip, take) {
    return __awaiter(this, void 0, void 0, function* () {
        let Take = 0;
        let Skip = 0;
        if (!skip) {
            Skip = 0;
        }
        else {
            Skip = parseInt(skip);
        }
        if (!take) {
            Take = 20;
        }
        else {
            Take = parseInt(take);
        }
        if (Take < 0) {
            throw "Take cannot be negative";
        }
        if (Take > 100) {
            Take = 100;
        }
        if (Skip < 0) {
            throw "Skip cannot be negative";
        }
        const movieCollection = yield mongoCollections_1.default.movies();
        let updatedInfo = yield movieCollection.find().toArray();
        if (updatedInfo.modifiedCount === 0) {
            throw 'could not delete movie comment';
        }
        updatedInfo = updatedInfo.slice(Skip, updatedInfo.length + 1);
        updatedInfo = updatedInfo.slice(0, Take);
        return updatedInfo;
    });
}
exports.getAllMovies = getAllMovies;
function updateMovie(movieId, title, castinput, director, yearReleased, plot, rating) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!title)
            throw 'You must provide a title for the movie';
        if (!castinput)
            throw 'You must provide cast members';
        if (!director)
            throw 'You must provide a director';
        if (!yearReleased)
            throw 'You must provide Yearrealeased';
        if (!plot)
            throw 'You must provide a plot';
        if (!rating)
            throw 'You must provide a rating';
        // if(!commentInput) throw 'You must provide comments';
        movieId = ObjectId(movieId);
        let oldData = yield getMovie(movieId);
        let commentsArr = [];
        commentsArr.push(Object(oldData)["comments"]);
        let castIterator = [];
        for (let i = 0; i < Object.keys(castinput).length; i++) {
            if (!castinput[i].firstName || !castinput[i].lastName)
                throw 'check details of cast';
            if (typeof castinput[i].firstName !== 'string' || typeof castinput[i].lastName !== 'string')
                throw 'check caast data type |must be string';
            castIterator.push(castinput[i]);
        }
        let year = parseFloat(yearReleased);
        const albumCollection = yield mongoCollections_1.default.movies();
        let newMovie = {
            title,
            cast: castIterator,
            info: { director, year },
            plot,
            rating: parseFloat(rating),
            comments: Object(oldData)["comments"]
        };
        const updatedInfo = yield albumCollection.updateOne({ _id: movieId }, { $set: newMovie });
        if (updatedInfo.modifiedCount === 0) {
            throw 'could not update movie successfully';
        }
        //onst newId = updatedInfo.insertedId;
        const upMovie = yield this.getMovie(movieId);
        return upMovie;
    });
}
exports.updateMovie = updateMovie;
// module.exports={addMovie,getMovie}
