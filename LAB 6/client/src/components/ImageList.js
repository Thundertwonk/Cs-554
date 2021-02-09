import React from 'react';
import { useQuery } from '@apollo/client';
import queries from './queries.js';
import {useState,useEffect} from 'react'
import { set } from 'lodash';
import BinButton from "./BinButton";


const ImageList = () => {
    const [pageNum,setpageNum]=useState(1);
    const {data,refetch} = useQuery(queries.GET_IMAGES,
        {
          variables: { pageNum:pageNum },});
    
          useEffect(
            () => {
                setpageNum(1);
            },[]);
    if(!data) return null;
    let images = data.unsplashImages;
 
    let list=(images.map(dat=>(
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

    
    )));
   
    return(
        <div>
         {setpageNum}
         <button className="btn btn-primary"onClick={()=>{setpageNum(pageNum+1);refetch();}}>Get More</button>
          {list}
        </div>
    );
}

export default ImageList
;