import React from 'react';
import logo from './components/img/marvel-logo.png';
import './App.css';
import CharList from './components/CharList';
import Character from './components/Character'
import Error from './components/Error'
import Header from './components/Header'
import ComicList from './components/ComicList'
import Comics from './components/Comics'
import Series from './components/Series'
import SeriesList from './components/SeriesList'

import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';

const App = () => {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">For Marvel Fans. By Marvel Fans.</h1>
          <Link className="showlink" to="/characters/page/0">
            Characters
          </Link>
          <Link className="showlink" to="/comics/page/0">
            Comics
          </Link>
          <Link className="showlink" to="/series/page/0">
            Series
          </Link>
        </header>
        <br />
        <br />
       
          <Switch>
          <Route  exact path="/" component={Header}  />
          <Route exact path="/characters/page/:page"  component={CharList} />
          <Route exact path="/characters/:id"  component={Character} />
          <Route exact path="/comics/page/:page"  component={ComicList} />
          <Route exact path="/comics/:id"  component={Comics} />
          <Route exact path="/series/page/:page"  component={SeriesList} />
          <Route exact path="/series/:id"  component={Series} />


          <Route component={Error} />
          </Switch>
       
      </div>
    </Router>
  );
};

export default App;
