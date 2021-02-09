import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../App.css';
import  { Redirect } from 'react-router-dom'
import Search from './Search';



const md5 = require('blueimp-md5');
const publickey = process.env.REACT_APP_PUB_CODE;
const privatekey = process.env.REACT_APP_PRIV_CODE;
const ts = new Date().getTime();
const stringToHash = ts + privatekey + publickey;
const hash = md5(stringToHash);
const baseUrl = 'https://gateway.marvel.com:443/v1/public/characters';
const url = baseUrl + '?ts=' + ts + '&apikey=' + publickey + '&hash=' + hash;

const CharList = (props) => {

    const [charData, setCharData] = useState(undefined);
   const [page, setPageValue] = useState(undefined);
   const [searchTerm, setSearchTerm] = useState('');
   
    
   
    useEffect(
        () => {
            console.log("enter useeffect");
            setPageValue(parseInt(props.match.params.page));
        

           
            async function fetchData() {
               if(searchTerm){
                try{const { data } = await axios.get(`${url}&offset=${props.match.params.page * 20}&limit=20&name=${searchTerm}`);
                    
                data.data.total=10;
                setCharData(data);
                    console.log(data.data.results);
               }
               catch (e) {
                console.log(e);
            }
               }
               else{
               
                try {
                   

                    const { data } = await axios.get(`${url}&offset=${props.match.params.page * 20}&limit=20`);
                    setCharData(data);
                    console.log(data.data.results);
                   
                   
                  
                   

                } catch (e) {
                    console.log(e);
                }
            }
            }

            fetchData();
        }, [ searchTerm,props.match.params.page]
    );
    
    const searchValue = async (value) => {
        setSearchTerm(value);
      };
    

        return (
            <div>
                <Search searchValue={searchValue} />
                {charData && page > Math.ceil(charData.data.total /20)  ? (<Redirect to='/Error'  />) : (

                    <div className="show-body">
                        {charData && charData.data.results.map((show) => {
                            return (
                               
                                 <Link to={`/characters/${show.id}`}>
                                  
                                 <br/>
                                 
                                
                          <img className="thumbnail" src={show.thumbnail.path+"."+show.thumbnail.extension} alt="Avatar"></img>
                          <div className="container">
                            <h2>{show.name}</h2>
                           
                            
                         
                        </div>
                        </Link> 
                              
                            )
                        }
                        )
                        }

                        <div >
                            
                            {charData ===null || page<=0 ? (<p></p>) : (<a  href={`/characters/page/${page - 1}`} title="button"><button className="pagination" >Previous</button></a>)}

                         
                         
                            {charData && page<= Math.floor(charData.data.total /20) ? (
                               <a href={`/characters/page/${page}` }aria-label="button"><button className="pagination" aria-label="button"> {page}</button></a>

                            ) : (<p></p>)}
                           

                            {charData && page + 1 <=Math.floor(charData.data.total /20) ? (
                                <a  href={`/characters/page/${page + 1}`}aria-label="button"><button className="pagination"aria-label="button">{page + 1} </button></a>

                            ) : (<p></p>)}

                            {charData && page + 2 <=  Math.floor(charData.data.total /20) ? (
                                <a  href={`/characters/page/${page + 2}`}aria-label="button"><button className="pagination"aria-label="button">{page + 2} </button></a>

                            ) : (<p></p>)}

                            {charData && page + 3 <= Math.floor(charData.data.total /20) ? (
                                <a  href={`/characters/page/${page + 4}`}aria-label="button"><button className="pagination"aria-label="button">{page + 3}</button> </a>

                            ) : (<p></p>)}

                            {charData && page + 4 <=  Math.floor(charData.data.total /20) ? (
                                <a  href={`/characters/page/${page + 5}`}aria-label="button"><button className="pagination"aria-label="button">{page + 4}</button> </a>

                            ) : (<p></p>)}

                            {charData && page >= Math.floor(charData.data.total /20) ? (<p>End</p>) : (<a  href={`/characters/page/${page + 1}`}aria-label="button"><button className="pagination"aria-label="button">Next</button></a>)}
                        </div>
                    </div>

                )}


            </div>
        )
    
}

export default CharList;