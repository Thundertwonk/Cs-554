import { Request, Response } from 'express';
import {getMovie,addComment,addMovie,removeComment,getAllMovies,updateMovie} from '../data/movieData'


export class Movies {
	public routes(app): void {
		app.route('/api/movies/:id').get(async(req: Request, res: Response) => {
			try{
                const test=await getMovie(req.params.id);
        
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

		app.route("/api/movies/:id/comments").post(async(req: Request, res: Response) => {
            try{
                let test=req.params.id;
               
            
             
             
                
                let moviePdata = await req.body;
                if(typeof moviePdata.name!=="string"){
                        throw "name is not a string"
                }
                if(typeof moviePdata.comment!=="string"){
                    throw "comment is not a string"
            }
             
                
              
                const output=await addComment(test,moviePdata);
                res.json(output);}
            catch(e){
                res.status(404).json({error: e});
                
            }
		});

		app.route('/api/movies/:movieId/:commentId').delete(async(req: Request, res: Response) => {
           try{ let movieId=req.params.movieId;
            let commentId=req.params.commentId;
            
            const test=await removeComment(movieId,commentId);
           
             res.json(test);}
         catch(e){
             res.status(404).json({error: e});
             //console.log(e);
         }
         
        });
        
        app.route('/api/movies').get(async(req: Request, res: Response) => {
            try{ 
              let skip:any=req.query.skip;
              let take:any=req.query.take;
              if(skip && Number.isNaN(parseInt(skip))){
                  
                throw "skip should be number"
            }
            if(take && Number.isNaN(parseInt(take))){
                  
                throw "take should be number"
            }
                const test=await getAllMovies(skip,take);
               
                 res.json(test);}
             catch(e){
                 res.status(404).json({error: e});
                 //console.log(e);
             }
    });
        	app.route('/api/movies/:id').patch(async(req: Request, res: Response) => {
                try{
        
                    const movieObj:any=await getMovie(req.params.id);
                    
                   const moviePdata = req.body;
                 if(moviePdata.title && moviePdata.title!==movieObj.title){
                    if(typeof moviePdata.title!=='string'){
                        throw "title is not string"
                    }
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
                    if(typeof moviePdata.info.director!=='string'){
                        throw "director is not string"
                    }
                    movieObj.info.director=moviePdata.info.director
                 }
                
                 if(moviePdata.info && moviePdata.info.yearReleased!==movieObj.info.yearReleased){
                    if(Number.isNaN(parseInt(moviePdata.info.yearReleased))){
                  
                        throw "yearReleased should be number"
                    }

                     movieObj.info.yearReleased=moviePdata.info.yearReleased;
                 }
                 if(moviePdata.plot && moviePdata.plot!==movieObj.plot){
                      
            if(typeof moviePdata.plot!=='string'){
                throw "plot is not string"
            }
                     movieObj.plot=moviePdata.plot;
                 }
            
                 if(moviePdata.rating && moviePdata.rating!==movieObj.rating){
                    if(Number.isNaN(parseInt(moviePdata.rating))){
                        throw "rating should be number"
                    }
                   
                     movieObj.rating=moviePdata.rating;
                 }
            
            let test=req.params.id;
            
                
                    const output=await updateMovie(test,movieObj.title,movieObj.cast,movieObj.info.director,movieObj.info.yearReleased,movieObj.plot,movieObj.rating);
                    res.json(output);
                  
                   }
                catch(e){
                    res.status(404).json({error: e});
                    //console.log(e);
                }
        });
        
        app.route('/api/movies/:id').put(async(req: Request, res: Response) => {
            try{
                const test=req.params.id;
        
                
                const moviePdata = req.body;
                if(Number.isNaN(parseInt(moviePdata.rating))){
                    throw "rating should be number"
                }
               
                if(Number.isNaN(parseInt(moviePdata.info.yearReleased))){
                  
                    throw "yearReleased should be number"
                }
                if(typeof moviePdata.title!=='string'){
                    throw "title is not string"
                }
            
                if(typeof moviePdata.info.director!=='string'){
                    throw "director is not string"
                }
                if(typeof moviePdata.plot!=='string'){
                    throw "plot is not string"
                }
                const output=await updateMovie(test,moviePdata.title,moviePdata.cast,moviePdata.info.director,moviePdata.info.yearReleased,moviePdata.plot,moviePdata.rating);
                res.json(output);
              
               }
            catch(e){
                res.status(404).json({error: e});
                //console.log(e);
            }
        });

        app.route('/api/movies').post(async(req: Request, res: Response) => {
			
            try{
                //console.log(req.body.comments[0].comment);
                
                const moviePdata = req.body;
                if(Number.isNaN(parseInt(moviePdata.rating))){
                    throw "rating should be number"
                }
                
                if(Number.isNaN(parseInt(moviePdata.info.yearReleased))){
                  
                    throw "yearReleased should be number"
                }
             
                if(typeof moviePdata.title!=='string'){
                    throw "title is not string"
                }
               
                if(typeof moviePdata.info.director!=='string'){
                    throw "director is not string"
                }
                if(typeof moviePdata.plot!=='string'){
                    throw "plot is not string"
                }
                
                const output=await addMovie(moviePdata.title,moviePdata.cast,moviePdata.info.director,moviePdata.info.yearReleased,moviePdata.plot,moviePdata.rating);
                res.json(output);}
            catch(e){
                res.status(404).json({error: e});
                //console.log(e);
            }
        });
        
	}
}