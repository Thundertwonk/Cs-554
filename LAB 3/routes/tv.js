const express = require("express");
const router = express.Router();
const bluebird=require ("bluebird");
const axios=require ("axios")
const redis=require ("redis")
const client=redis.createClient();
const xss = require("xss");


bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);
router.get("/", async (req, res) => {

    try {
        const exists=await client.existsAsync('movieList');
        ///console.log(exist);
        if(exists){
            
            console.log("show stock movie list from cache");

            let html=await client.getAsync('movieList');
            res.send(html);
            return;
        }
        else{
           
            let {data}=await axios.get('http://api.tvmaze.com/shows');
            //console.log(data);

            res.render('showList',{shows:data},async(err,html)=>{
                await client.setAsync('movieList',html);
                res.send(html);
                console.log(data);

            });
        }
        
    } catch (e) {
        res.status(404).render("error",{error:"API error"});
    }
});


router.get("/show/:id", async (req, res) => {

    try {
        const exists=await client.existsAsync(req.params.id);
        ///console.log(exist);
        if(exists){
            
            console.log("show id movie list from cache");

            let html=await client.getAsync(req.params.id);
            res.send(html);
            return;
        }
        else{
           
            let {data}=await axios.get('http://api.tvmaze.com/shows/'+req.params.id);
           // console.log(data);

            res.render('singleshow',{shows:data},async(err,html)=>{
                await client.setAsync(req.params.id,html);
                res.send(html);

            });
        }
        
    } catch (e) {
        res.status(404).render("error",{error:"Check id or API error"});
    }
});



router.post("/search", async (req, res) => {

    try {
        let searchTerm=xss(req.body.search);
        if(!searchTerm.trim()){
            res.render("error",{error:"Input cannot be empty"});
            return;
        }
        searchTerm=searchTerm.toLowerCase();
        let exist=await client.ZSCOREAsync("terms",searchTerm);
        
        
       
        if(exist!==null){
            
            console.log("show id movie list from cache");

            await client.ZINCRBYAsync("terms",1,searchTerm)
            let html=await client.getAsync(searchTerm);
            res.send(html);
            return;
        }
        else {
           
            let {data}=await axios.get('http://api.tvmaze.com/search/shows?q='+searchTerm);
            //console.log(data);
            if(data.length===0){
               
                res.render('error',{error:"No Result"},async(err,html)=>{
                    await client.ZADDAsync("terms",1,searchTerm);
                    await client.setAsync(searchTerm,html);
                    res.send(html);
            
             });
             }
            else{
            res.render('searchShow',{shows:data},async(err,html)=>{
                await client.ZADDAsync("terms",1,searchTerm);
                await client.setAsync(searchTerm,html);
                res.send(html);

            });
        }
        }
        
    } catch (e) {
        res.status(404).render("error",{error:"API error"});
    }
});



router.get("/popularsearches", async (req, res) => {

    try {
       
        let popular=await client.ZREVRANGEBYSCOREAsync("terms","+inf","-inf","LIMIT","0","10");
        
       res.render("popularsearch",{pop:popular});
       return;
        
        
    } catch (e) {
        res.status(404).render("error",{error:"check redis"});
    }
});


module.exports = router;