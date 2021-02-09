const express = require("express");
const router = express.Router();
const  data = require("../data/movies.js");
//const bandmeth=require("../data/bands");
let trequestcounter=1;
urlCount={};
router.use("/",async (req,res,next)=>{
   
    
       trequestcounter=trequestcounter++;
        console.log("Total requests "+trequestcounter++);

   
        console.log(JSON.stringify(req.body)+" "+req.method+" "+req.originalUrl);
        let url=req.originalUrl

        if(urlCount[url]===undefined){
            urlCount[url]=1;

        }
        else{
            urlCount[url]++;
        }
        console.log(req.originalUrl+"     count of requests       "+urlCount[url]);
    
    next();
  });

router.get("/movies/:id",async (req,res) => {
    //console.log(req.params.id);
    try{
        const test=await data.getMovie(req.params.id);
       // const bandauth= await bandmeth.getBand(test.author);
        
        // test.author={
        //     _id:bandauth._id,
        //     bandName:bandauth.bandName
        // };
        
        res.json(test);}
    catch(e){
        res.status(404).json({error: e});
        //console.log(e);
    }
    
});




router.post("/movies", async(req, res) => {
  
   
  
    try{
        //console.log(req.body.comments[0].comment);
        
        const moviePdata = req.body;
        const output=await data.addMovie(moviePdata.title,moviePdata.cast,moviePdata.info.director,moviePdata.info.yearReleased,moviePdata.plot,moviePdata.rating);
        res.json(output);}
    catch(e){
        res.status(404).json({error: e});
        //console.log(e);
    }
});
/////////////////
router.put("/movies/:id", async(req, res) => {
    try{
        const test=req.params.id;

        let comments=[];
        const moviePdata = req.body;
        const output=await data.updateMovie(test,moviePdata.title,moviePdata.cast,moviePdata.info.director,moviePdata.info.yearReleased,moviePdata.plot,moviePdata.rating);
        res.json(output);
      
       }
    catch(e){
        res.status(404).json({error: e});
        //console.log(e);
    }
});
//////////////////////
router.patch("/movies/:id", async(req, res) => {
    try{
        
        const movieObj=await data.getMovie(req.params.id);
        
       const moviePdata = req.body;
     if(moviePdata.title && moviePdata.title!==movieObj.title){
        movieObj.title=moviePdata.title;
     }
    
     if(moviePdata.cast){
     for(let i=0;i<moviePdata.cast.length;i++){
        let flag=0;
        for(let j=0;j<movieObj.cast.length;j++){
         if(JSON.stringify(movieObj.cast[j])===JSON.stringify(moviePdata.cast[i])){
            flag=1;
         }
     }
     if(flag===0){
         movieObj.cast.push(moviePdata.cast[i])
     }
    }
}


     if(moviePdata.info && moviePdata.info.director!==movieObj.info.director){
        movieObj.info.director=moviePdata.info.director
     }
    
     if(moviePdata.info && moviePdata.info.yearReleased!==movieObj.info.yearReleased){
         movieObj.info.yearReleased=moviePdata.info.yearReleased;
     }
     if(moviePdata.plot && moviePdata.plot!==movieObj.plot){
         movieObj.plot=moviePdata.plot;
     }
     
     if(moviePdata.rating && moviePdata.rating!==movieObj.rating){
         movieObj.rating=moviePdata.rating;
     }

let test=req.params.id;

    
        const output=await data.updateMovie(test,movieObj.title,movieObj.cast,movieObj.info.director,movieObj.info.yearReleased,movieObj.plot,movieObj.rating);
        res.json(output);
      
       }
    catch(e){
        res.status(404).json({error: e});
        //console.log(e);
    }
});

//////////////

router.post("/movies/:id/comments", async(req, res) => {
  
   
 
    try{
        let test=req.params.id;
       
       let movieObj=await data.getMovie(test);

     
        
        let moviePdata = req.body;
     
        if(moviePdata.comments){
            for(let i=0;i<moviePdata.comments.length;i++){
               let flag=0;
               for(let j=0;j<movieObj.comments.length;j++){
                if(JSON.stringify(movieObj.comments[j].name)===JSON.stringify(moviePdata.comments[i].name) && JSON.stringify(movieObj.comments[j].comment)===JSON.stringify(moviePdata.comments[i].comment)){
                   flag=1;
                }
            }
            if(flag===0){
                movieObj.comments.push(moviePdata.comments[i])
            }
           }
       }
      
        const output=await data.addComment(test,movieObj.comments);
        res.json(output);}
    catch(e){
        res.status(404).json({error: e});
        
    }
});

////////////////

router.delete("/movies/:movieId/:commentId",async (req,res) => {
    //console.log(req.params.id);
    try{
        
        let movieId=req.params.movieId;
let commentId=req.params.commentId
        const test=await data.removeComment(movieId,commentId);
       // const bandauth= await bandmeth.getBand(test.author);
        
        // test.author={
        //     _id:bandauth._id,
        //     bandName:bandauth.bandName
        // };
       
        res.json(test);}
    catch(e){
        res.status(404).json({error: e});
        //console.log(e);
    }
    
});

///////////////



router.get("/movies",async (req,res) => {
    //console.log(req.params.id);
    try{
        
       let skip=req.query.skip;
       let take=req.query.take;
     if(skip<take) throw 'check query'

     if(typeof skip!==number || typeof take!==number)throw "check query"


       if(!skip){
           skip=0
       }
       if(!take){
           take=0;
       }
       
        const test=await data.getAllMovies(skip,take);
       // const bandauth= await bandmeth.getBand(test.author);
        
        // test.author={
        //     _id:bandauth._id,
        //     bandName:bandauth.bandName
        // };
       
        res.json(test);}
    catch(e){
        res.status(404).json({error: e});
        //console.log(e);
    }
    
});





module.exports = router;
