import React from 'react';
import queries from './queries.js';
import { useQuery,useMutation } from '@apollo/client';

function BinButton(props) {
    let postData  = props.postData;
 
    
    let Bin = true;
   
    const {loading,error,data} = useQuery(queries.GET_BIN_PICS);

    const [updateImage] = useMutation(queries.TRUE_BIN,{
        refetchQueries: [{query:queries.GET_BIN_PICS}],
    });
    if(loading || error){
        return (<h1>There was some error in the backend</h1>);
    }
    else{
      
  
       let binnedImages = data.binnedImages;
   
     for(let i=0;i<binnedImages.length;i++){
        if(postData.id === binnedImages[i].id){
             Bin = false;
            break;
        }
     }
       
    }
    
    let button = undefined;
    if(Bin===true){
        button="Add to bin";
       
    }
        else{
            button="Remove from Bin";
        }
    
    return (
        <div>
          <form
            onSubmit={e => {
                e.preventDefault();
                updateImage({
                    variables:{
                        id:postData.id,
                        url:postData.url,
                        posterName:postData.posterName,
                        description:postData.description,
                      binned:Bin,
                        userPosted:postData.userPosted,
                        numBinned:postData.numBinned
                    }
                });
                if(Bin)
                    alert("Binned!");
                else
                    alert("Unbinned!");
            }}
            >
            <button type="submit" >{button}</button>
          </form>
        </div>
    );
        }

export default BinButton;
