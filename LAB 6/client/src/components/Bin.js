import React from 'react';
import queries from './queries.js';
import { useQuery } from '@apollo/client';
import BinButton from './BinButton'


function Bin() {
 const {data} = useQuery(queries.GET_BIN_PICS,
        {
            pollingInterval:500
        });
    if(!data || data.binnedImages.length===0) return (<h1>No Binned Pics</h1>);
   
    let binnedImages = data.binnedImages;
    let li=(binnedImages.map(dat=>(
        <li key={dat.id}>
      
                   <div className="card">
       <img className="thumbnail" src={dat.url} alt="Avatar"></img>
       <div className="container">
         <h1><b>{dat.posterName}</b></h1> 
         <p>{dat.description}</p> 
         <BinButton postData={dat}  />
       </div>
     </div>
     <br/>
     </li>
      
    )));
    return(
        <div>
          {li}
        </div>
    );
}
export default Bin;
