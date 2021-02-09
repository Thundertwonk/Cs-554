import React from 'react';
import queries from './queries.js';
import { useQuery } from '@apollo/client';
import BinButton from  './BinButton';

function Popularity() {
    const {loading,error,data,refetch} = useQuery(queries.GET_POPULAR, {
      
        pollInterval: 500,
      });
    if(loading) return `loading`;
    if(!data) return null;
    let getTopTenBinnedPosts = data.getTopTenBinnedPosts;
    let score = 0;
  
    let trend="Data with 0 likes or no data(not relevant)";
    for(let img of getTopTenBinnedPosts){
        score+=img.numBinned;
    }
    if(score >0)
        if(score>=200)
        {
            trend="Mainstream"
        }
    else{
        trend=" Non-mainstream";
    }

   
    return(
        <div>
          <h1>{trend}</h1>
          {getTopTenBinnedPosts.map(dat=>(
        
          <li key={dat.id}>
           
        {/* <img className="thumbnail" src={dat.url} alt="Avatar"></img>
          
        <div className="container">
                           <h2></h2>
                           <p></p>
                           </div>
             */}
                   <div className="card">
       <img className="thumbnail" src={dat.url} alt="Avatar"></img>
       <div className="container">
         <h1>{dat.posterName}</h1> 
         <p>{dat.description}</p> 
         <BinButton postData={dat}  />
       </div>
     </div>
     <br/>
     </li>
          ))}
        </div>
              
    );
}

export default Popularity;
