const dbConnection = require('../config/mongoConnection');
const data = require('../data/movies.js');


async function main() {
  const db = await dbConnection();
  await db.dropDatabase();

 for(let i=0;i<102;i++){
     moviePdata={"title": "Borat"+i,
     "cast": [{"firstName": "Sasha", "lastName": "Cohen"},{"firstName": "glen", "lastName": "glen"}],
     "info": {"director": "Larry", "yearReleased": "Charles"},  
     "plot": "Borat, a Kazakh resident, travels to the USA to make a documentary on the country. While on his mission, he learns that the USA is the same as his own country in many ways.",
     "rating": 5,
    }
    const output=await data.addMovie(moviePdata.title,moviePdata.cast,moviePdata.info.director,moviePdata.info.yearReleased,moviePdata.plot,moviePdata.rating,moviePdata.comments);

 }

  console.log('Done seeding database');

  await db.serverConfig.close();
}

main();