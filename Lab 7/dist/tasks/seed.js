var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const dbConnection = require('../config/mongoConnection');
const data = require('../data/movieData.js');
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const db = yield dbConnection.dbConnection();
        yield db.dropDatabase();
        try {
            for (let i = 0; i < 102; i++) {
                let moviePdata = { "title": "Borat" + i,
                    "cast": [{ "firstName": "Sasha", "lastName": "Cohen" }, { "firstName": "glen", "lastName": "glen" }],
                    "info": { "director": "Larry", "yearReleased": "Charles" },
                    "plot": "Borat, a Kazakh resident, travels to the USA to make a documentary on the country. While on his mission, he learns that the USA is the same as his own country in many ways.",
                    "rating": 5,
                    "comments": undefined
                };
                const output = yield data.addMovie(moviePdata.title, moviePdata.cast, moviePdata.info.director, moviePdata.info.yearReleased, moviePdata.plot, moviePdata.rating, moviePdata.comments);
            }
        }
        catch (e) {
            console.log(e);
        }
        console.log('Done seeding database');
        yield db.serverConfig.close();
    });
}
main();
