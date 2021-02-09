import { gql } from '@apollo/client';

const GET_IMAGES = gql`
  query($pageNum: Int){
    unsplashImages(pageNum: $pageNum ){
      id
      url
      posterName
      description
      numBinned
      userPosted
    }
  }
`

const GET_USER_POSTS=gql`
query{
  userPostedImages{
      id 
      url
      posterName 
      description 
      userPosted 
      binned
      numBinned
  }
}
`



const POST_USER_POSTS=gql`
mutation uploadImage($url:String!, $posterName: String, $description: String ){
  uploadImage(url:$url, posterName:$posterName, description:$description, numBinned:0){
      id 
      url 
      posterName 
      description 
      userPosted 
      binned
      numBinned
  }
}
`
const DEL_POST = gql`
    mutation deleteImage($id: ID!){
        deleteImage(id:$id){
            id
             url 
             posterName 
             description 
             userPosted 
             binned
        }
    }
`;

const TRUE_BIN = gql`
    mutation updateImage($id: ID!, $url:String, $posterName: String, $description: String, $userPosted: Boolean, $binned: Boolean, $numBinned: Int!){
        updateImage(id:$id, url:$url, posterName:$posterName, description:$description, userPosted:$userPosted, binned: $binned, numBinned: $numBinned){
            id 
            url
             posterName
              description
               userPosted
                binned 
                numBinned
        }
    }
`;
const GET_BIN_PICS = gql`
query {
  binnedImages{
    id
    url
    description
    posterName
    userPosted
    binned
    numBinned
  }
}


`;

const GET_POPULAR=gql`
query{
  getTopTenBinnedPosts{
    id
    posterName
    description
    numBinned
    binned
    url
    userPosted
    
    
  }
}
`;

export default{
    GET_IMAGES,
    GET_USER_POSTS,
    POST_USER_POSTS,
    DEL_POST,
    GET_BIN_PICS,
    TRUE_BIN,
    GET_POPULAR

};