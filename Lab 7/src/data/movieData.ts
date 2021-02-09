// const mongoCollection = require('../config/mongoCollections');
// const movies = mongoCollection.movies;
import movies from '../config/mongoCollections'
//const bands= mongoCollections.bands;
const { ObjectId } = require('mongodb')
import mongodb =require("mongodb");


 interface Movie {
	_id:string,
	title:string,
    cast:castIterator[],
   info:{string,number},
   plot:string,
   rating:number,
   comments:comment[]
}

 interface comment {
	_id:string,
	name:string,
	comment:string
}

 interface castIterator {
	
	firstName:string,
	lastName:string
}




export async function addMovie(title: string, castinput: castIterator, director: string, yearReleased: string,plot:string,rating:number):Promise<Array<Movie>> {
  
    if (!title) throw 'You must provide a title for the movie';
    if(!castinput) throw 'You must provide cast members';
    if(!director) throw 'You must provide a director';
    if(!yearReleased) throw 'You must provide Yearrealeased';
    if(!plot) throw 'You must provide a plot';
    if(!rating) throw 'You must provide a rating';
    //if(!commentInput) throw 'You must provide comments';



     let castIterator:string[]=[];

     for(let i=0;i<Object.keys(castinput).length;i++){
        if(!castinput[i].firstName || !castinput[i].lastName) throw 'check details of cast';
        if(typeof castinput[i].firstName!=='string' ||typeof castinput[i].lastName!=='string' ) throw 'check caast data type |must be string';

        castIterator.push(castinput[i]);
     }



		
		const movieCollection = await movies.movies();
      
		let newMovie = {

             title,
             cast:castIterator,
            info:{director,yearReleased},
            plot,
            rating,
            comments:[]
		};

		const insertInfo:any = await movieCollection.insertOne(newMovie);
		if (insertInfo.insertedCount === 0) throw 'Could not add movie';

		const newId:string = insertInfo.insertedId;

		const movie:any = await getMovie(newId);
		return movie;
}

export async function getMovie (id:string):Promise<Array<Movie>>{
    if (!id) throw 'You must provide an id to search for';
    
    id = ObjectId(id);
   // console,log("i here");
		const movieCollection = await movies.movies();
        const movie = await movieCollection.findOne({ _id: id });
    

		if (movie === null) throw 'No movie with that id';

		return movie;
}

export async function addComment(movieId:string,commentInput:comment): Promise<Movie>{

    if(!movieId) throw 'check movieid';
    if(!commentInput.name || !commentInput.comment) throw 'check commentInput'
 
    movieId=ObjectId(movieId);

    let movieCollection=await movies.movies();
   
 
     
     let updatedcomments:comment={
         _id:ObjectId(),
         name:commentInput.name,
         comment:commentInput.comment

     }
    
    
    let  updatedInfo=await movieCollection.updateOne({_id: movieId}, {$push: {comments:updatedcomments}});

     if (updatedInfo.modifiedCount === 0) {
        throw 'could not update movie comment successfully';
    }
let movie:any=await getMovie(movieId);

return movie;


}

export async function removeComment(movieId:string,commentId:string): Promise<Movie> {
    if (!movieId) throw "Please provide a valid task ID";
    if (!commentId) throw "Please provide a valid comment ID";

        const movieCollection = await movies.movies();

        const updatedInfo = await movieCollection.updateOne({ _id: ObjectId(movieId)}, { $pull: { comments: { _id: ObjectId(commentId) }}});
   
        if (updatedInfo.modifiedCount === 0) {
            throw 'could not delete movie comment';
        }

        let output:any=await getMovie(movieId);
        return output;
   
}

export async function getAllMovies(skip:string,take:string): Promise<Movie> {
    let Take:number=0;
    let Skip:number=0;

    if (!skip){
      Skip=0;
    }
    else{
      Skip=parseInt(skip)
    }
   
    if (!take ) {
        Take=20;
    }
    else{
        Take=parseInt(take);

    }
   

    if(Take<0){
        throw "Take cannot be negative"
    }
if(Take>100){
    Take=100;
}



if(Skip<0){
    throw "Skip cannot be negative"
}
        const movieCollection = await movies.movies();

       
		let updatedInfo:any= await movieCollection.find().toArray();
   
        if (updatedInfo.modifiedCount === 0) {
            throw 'could not delete movie comment';
        }
        
       updatedInfo=updatedInfo.slice(Skip,updatedInfo.length+1);
       updatedInfo=updatedInfo.slice(0,Take)
        return updatedInfo;
   
}


export async function updateMovie (movieId:string,title:string,castinput:castIterator,director:string,yearReleased:string,plot:string,rating:string):Promise<Array<Movie>>{
    if (!title) throw 'You must provide a title for the movie';
    if(!castinput) throw 'You must provide cast members';
    if(!director) throw 'You must provide a director';
    if(!yearReleased) throw 'You must provide Yearrealeased';
    if(!plot) throw 'You must provide a plot';
    if(!rating) throw 'You must provide a rating';

    
   // if(!commentInput) throw 'You must provide comments';
movieId=ObjectId(movieId);
let oldData:Object[] =await getMovie(movieId);
    let commentsArr:Object[]=[];
    commentsArr.push(Object(oldData)["comments"]);

    
     let castIterator:Object[]=[];
     for(let i=0;i<Object.keys(castinput).length;i++){
        if(!castinput[i].firstName || !castinput[i].lastName) throw 'check details of cast';
        if(typeof castinput[i].firstName!=='string' ||typeof castinput[i].lastName!=='string' ) throw 'check caast data type |must be string';

        castIterator.push(castinput[i]);
     }

		let year=parseFloat(yearReleased)
		const albumCollection = await movies.movies();
      
		let newMovie = {
             title,
             cast:castIterator,
            info:{director,year},
            plot,
            rating:parseFloat(rating),
            comments:Object(oldData)["comments"]
           
		};

        const updatedInfo = await albumCollection.updateOne({ _id: movieId }, { $set: newMovie });
        if (updatedInfo.modifiedCount === 0) {
            throw 'could not update movie successfully';
        }

		//onst newId = updatedInfo.insertedId;

		const upMovie = await this.getMovie(movieId);
		return upMovie;
}

// module.exports={addMovie,getMovie}