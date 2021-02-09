import React from 'react';
import { useMutation } from '@apollo/client';
import queries from './queries.js';
function UploadPost() {
    let url, posterName, description;
    const[uploadImage] = useMutation(queries.POST_USER_POSTS,{
        refetchQueries: [{query:queries.GET_USER_POSTS}],
    });
    return(
        <div>
          <form
            onSubmit={e => {
                e.preventDefault();
               
                uploadImage({ 
                    variables:{
                        url:url.value,
                        posterName:posterName.value,
                        description: description.value } });
                alert("Uploaded Post");
               
            }}
            >
            <div className="form-group">
              <label>
                Url :
                <br />
                <input
                  ref={node => {
                      url = node;
                  }}
                  required
                  autoFocus={true}
                  />
              </label>
            </div>
            <br />
            <div className="form-group">
              <label>
                Description :
                <br />
                <input
                  ref={node => {
                      description = node;
                  }}
               
                  />
              </label>
            </div>
            <br />
            <div className="form-group">
              <label>
                PostAuthor :
                <br />
                <input
                  ref={node => {
                      posterName = node;
                  }}
                  />
              </label>
            </div>
            <button type="submit">Upload</button>
          </form>
        </div>
    );
}

export default UploadPost;
