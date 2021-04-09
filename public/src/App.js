import React, { useState, useEffect }  from 'react';

// Components
import logo from './components/logo.svg';
import ghLogo from './components/GitHub-Mark.png';

import Homepage from './pages/Homepage';
import Pet from './pages/Pet';
import Create from './pages/Create';
import Edit from './pages/Edit';

// React Router DOM
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";

// Bootstrap
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav';

export default function App() {

  return (
    <Router>
      <div>
        <Navbar style={{"background-color": "#3F784C"}} variant="dark" sticky="top">
          <Navbar.Brand href="/">
          <img
            src={logo}
            className="d-inline-block align-top"
            alt="p"
          /> {' '}
            PetFindr
          </Navbar.Brand>
          <Nav className="mr-auto">
            <Nav.Link href="/home">Home</Nav.Link>
            <Nav.Link href="/create">Make a Post</Nav.Link>
          </Nav>
          
          <img src={ghLogo} className="justify-content-end" alt="gh" onClick={() => window.location.href = "https://github.com/jackycao7/PetFindr"} style={{cursor:'pointer'}} />
        </Navbar>

        <Switch>
          <Route path="/pet/:id">
            <Pet/>
          </Route>

          <Route path="/create">
            <Create />
          </Route>

          <Route path="/edit/:id">
            <Edit />
          </Route>

          <Route path="/">
            <Homepage />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}