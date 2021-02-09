import React from 'react';
import { useQuery, useMutation } from '@apollo/client';
import queries from './queries.js';
 import BinButton from "./BinButton";


import {Link} from 'react-router-dom';
function PostList() {
    const[removeImage] = useMutation(queries.DEL_POST,{
        refetchQueries: [{query:queries.GET_USER_POSTS}],
    });
    const {data} = useQuery(queries.GET_USER_POSTS);
    if(!data) return (<h1>Error</h1>);
    let Userdata = data.userPostedImages;
    let li = (Userdata.map(dat=>{
        return (
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
        </div>
      </div>
      <br/>
                  <form
                    onSubmit={e => {
                        e.preventDefault();
                        removeImage({
                            variables:{id:dat.id}
                        });
                        alert("removed");
                    }}
                    >
                    <button type="submit" >Remove Post</button>
                  </form>
                  <BinButton postData={dat} />
             </li>
        )}));
    return(
        <div>
          <Link to='/new-post'>Upload Post</Link>
          {li}
        </div>
    );
}

export default PostList;
