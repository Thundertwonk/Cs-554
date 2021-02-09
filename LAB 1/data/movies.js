const mongoCollections = require('../config/mongoCollections');
const movies = mongoCollections.movies;
//const bands= mongoCollections.bands;
const { ObjectId } = require('mongodb')

async function getMovie(id){
    if (!id) throw 'You must provide an id to search for';
    id = ObjectId(id);
   // console,log("i here");
		const movieCollection = await movies();
		const movie = await movieCollection.findOne({ _id: id });
		if (movie === null) throw 'No movie with that id';

		return movie;
}

async function getAllMovies(n,y){
    const albumCollection = await movies();

    const movieList = await albumCollection.find({}).toArray();


    for(let i=0;i<n;i++){
        movieList.shift();
    }
if(y===0){
    let tempmovie=[];
     for(let j=0;j<20-n;j++){
    tempmovie.push(movieList[j]);
     }
   
     return tempmovie;
}
if(y>0){
    let tempmovie=[];
for(let j=0;j<y-n;j++){
tempmovie.push(movieList[j]);
if(y===99){
    return tempmovie;
}
}
return tempmovie;
}

    return movieList;

}

async function addMovie(title,castinput,director,yearReleased,plot,rating){
    if (!title) throw 'You must provide a title for the movie';
    if(!castinput) throw 'You must provide cast members';
    if(!director) throw 'You must provide a director';
    if(!yearReleased) throw 'You must provide Yearrealeased';
    if(!plot) throw 'You must provide a plot';
    if(!rating) throw 'You must provide a rating';
    //if(!commentInput) throw 'You must provide comments';


     let castIterator=[];

     for(let i=0;i<castinput.length;i++){
        if(!castinput[i].firstName || !castinput[i].lastName) throw 'check details of cast';
        if(typeof castinput[i].firstName!=='string' ||typeof castinput[i].lastName!=='string' ) throw 'check caast data type |must be string';

        castIterator.push(castinput[i]);
     }
/
commentIterator=[]

		
		const albumCollection = await movies();
      
		let newMovie = {
             title,
             cast:castIterator,
            info:{director,yearReleased},
            plot,
            rating,
            comments:commentIterator
		};

		const insertInfo = await albumCollection.insertOne(newMovie);
		if (insertInfo.insertedCount === 0) throw 'Could not add movie';

		const newId = insertInfo.insertedId;

		const movie = await this.getMovie(newId);
		return movie;
}


async function updateMovie(movieId,title,castinput,director,yearReleased,plot,rating){
    if (!title) throw 'You must provide a title for the movie';
    if(!castinput) throw 'You must provide cast members';
    if(!director) throw 'You must provide a director';
    if(!yearReleased) throw 'You must provide Yearrealeased';
    if(!plot) throw 'You must provide a plot';
    if(!rating) throw 'You must provide a rating';
   // if(!commentInput) throw 'You must provide comments';
movieId=ObjectId(movieId);
let oldData =await getMovie(movieId);
    let comments=oldData.comments;
    
     let castIterator=[];

     for(let i=0;i<castinput.length;i++){
        if(!castinput[i].firstName || !castinput[i].lastName) throw 'check details of cast';
        if(typeof castinput[i].firstName!=='string' ||typeof castinput[i].lastName!=='string' ) throw 'check caast data type |must be string';

        castIterator.push(castinput[i]);
     }

		
		const albumCollection = await movies();
      
		let newMovie = {
             title,
             cast:castIterator,
            info:{director,yearReleased},
            plot,
            rating,
            comments
           
		};

        const updatedInfo = await albumCollection.updateOne({ _id: movieId }, { $set: newMovie });
        if (updatedInfo.modifiedCount === 0) {
            throw 'could not update movie successfully';
        }

		//onst newId = updatedInfo.insertedId;

		const upMovie = await this.getMovie(movieId);
		return upMovie;
}


async function addComment(movieId,commentInput){

    if(!movieId) throw 'check movieid';
    if(!commentInput) throw 'check commentInput'
    movieId=ObjectId(movieId);

    let albumCollection=await movies();
    commentIterator=[]
    for(let i=0;i<commentInput.length;i++){
        if(!commentInput[i].name || !commentInput[i].comment) throw 'check details of comments';
        if(typeof commentInput[i].name!=='string' ||typeof commentInput[i].comment!=='string' ) throw 'check caast data type |must be string';
        
        
        commentInput[i]={'_id':ObjectId(),...commentInput[i]};
        commentIterator.push(commentInput[i]);
       
     }
     
     let updatedcomments={
         comments:commentIterator
     }
    
     updatedInfo=await albumCollection.updateOne({_id: movieId}, {$set: updatedcomments});

     if (updatedInfo.modifiedCount === 0) {
        throw 'could not update movie comment successfully';
    }
return await getMovie(movieId);
}

async function removeComment(movieId,commentId){
    //if (!id) throw 'You must provide an id to search for';
   
    
    // console.log(movieId);
    //commentId=ObjectId(commentId)
    if(!movieId) throw 'check movieid';
    if(!commentId) throw 'check commentId'
     let albumCollection = await movies();
   movieId=ObjectId(movieId);
   commentId=ObjectId(commentId);
    
    
    let movieObj=await getMovie(movieId);
  
    for(let i =0;i<movieObj.comments.length;i++){
       // console.log();
        if(JSON.stringify(movieObj.comments[i]._id)===JSON.stringify(commentId)){
            movieObj.comments.splice(i,1);
           // console.log(movieObj);
        }
       
    }
 
    //const deletionInfo = await albumCollection.deleteOne({ _id: commentId });
    let updatedcomments={
        comments:movieObj.comments
    }
   
    updatedInfo=await albumCollection.updateOne({_id: movieId}, {$set: updatedcomments});
                                                                                                   
    return await getMovie(movieId)
}


module.exports={getMovie,addMovie,updateMovie,addComment,removeComment,getAllMovies}