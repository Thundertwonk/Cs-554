import React, { useState, useEffect } from 'react';
import axios from 'axios';


const md5 = require('blueimp-md5');
const publickey = process.env.REACT_APP_PUB_CODE;
const privatekey = process.env.REACT_APP_PRIV_CODE;
const ts = new Date().getTime();
const stringToHash = ts + privatekey + publickey;
const hash = md5(stringToHash);
const baseUrl = 'https://gateway.marvel.com:443/v1/public/characters';


const Character = (props) => {
  const [showData, setShowData] = useState(undefined);
  useEffect(() => {
    async function fetchData() {
      try {
        const {data} = await axios.get(baseUrl+"/"+`${props.match.params.id}`+'?ts=' + ts + '&apikey=' + publickey + '&hash=' + hash);
      
        setShowData(data);
        console.log(data.data.results);
      
     } catch (e) {
        console.log(e);
      }
    }
    fetchData();
  }, [props.match.params.id]);

    return (
     
    <div className="show-body">
      
      <h1 className="cap-first-letter">{showData && showData.data.results[0].name}</h1>
      <br />
      {showData && showData.data.results.map((show) => {
          return(
            <img className="thumbnail" src={show.thumbnail.path+"."+show.thumbnail.extension} alt={show.name}></img>
      )})
          }
      <br/>
      <p>
        <span className="title">Description : </span>
        {showData && showData.data.results[0].description}
        <br />
      
      </p>
      <span className="title">Featured Comics:</span>:
      <dl className="list-unstyled">
        {showData &&
          showData.data.results[0].comics.items.map((item) => {
            return <dt key={item}>{item.name}</dt>;
          })}
      </dl>
      <span className="title">Featured Series:</span>:
      <dl className="list-unstyled">
        {showData &&
          showData.data.results[0].series.items.map((item) => {
            return <dt key={item}>{item.name}</dt>;
          })}
      </dl>
       
    </div>
    
  );
};

export default Character;
