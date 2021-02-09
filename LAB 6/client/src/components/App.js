import React from 'react';
// import logo from './components/img/marvel-logo.png';
import './App.css';
import Error from './Error.js';
import PostUpload from './PostUpload.js'
import Bin from './Bin.js';
import ImageList from './ImageList'
import Posts from './Posts';
import Popular from './popular';

import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';

import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  ApolloProvider
} from '@apollo/client';
const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({
    uri: 'http://localhost:4000'
  })
});

function App(name) {
  return (
    <ApolloProvider client={client}>
    <Router>
      <div className="App">
        <header className="App-header">
          
          
          <Link className="showlink" to="/" >
           Home
          </Link>
          <Link className="showlink" to="/my-bin">
            My Bin
          </Link>
          <Link className="showlink" to="/my-posts">
            My post
          </Link>
          <Link className="showlink" to="/popularity">
        Popular Posts
          </Link>

        
        </header>
        <br />
        <br />
       
          <Switch>
          <Route  exact path="/"  onClick={name.setpageNum} component={ImageList}  />
               
          <Route   path="/my-bin" exact component={Bin}  />
          <Route   path="/my-posts" exact component={Posts}  />
          <Route  exact path="/new-post" component={PostUpload}  />
          <Route  exact path="/popularity" component={Popular}  />
         

          <Route component={Error} />
          </Switch>
       
      </div>
    </Router>
    </ApolloProvider>
  );
};

export default App;
