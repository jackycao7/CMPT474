import React, { useState, useEffect }  from 'react';

// Components
import api from './api.js';
import logo from './components/logo.svg';
import Homepage from './pages/Homepage';
import Pet from './pages/Pet';
import Create from './pages/Create';

// React Router DOM
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";

// Bootstrap
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav';

export default function App() {
  const [listings, setListings] = useState([]);
  const [numListings, setNumListings] = useState(0);

  useEffect(() => {
      async function fetchListings(){
          await fetch(api.gateway, {
              method: 'GET', // *GET, POST, PUT, DELETE, etc.
              mode: 'cors', // no-cors, *cors, same-origin
              cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
              credentials: 'same-origin', // include, *same-origin, omit
              headers: {
                'Content-Type': 'application/json'
              },
              redirect: 'follow', // manual, *follow, error
              referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
          })
          .then(res => res.json())
          .then(data => {
              setNumListings(data.body.numPostings);
              setListings(data.body.postings);
          })
      }
      fetchListings();
  }, [])

  return (
    <Router>
      <div>
        <Navbar bg="dark" variant="dark" sticky="top">
          <Navbar.Brand href="/">
          <img
            src={logo}
            className="d-inline-block align-top"
            alt="a"
          /> {' '}
            Petfindr
          </Navbar.Brand>
          <Nav className="mr-auto">
            <Nav.Link href="/home">Home</Nav.Link>
            <Nav.Link href="/create">Make a Post</Nav.Link>
          </Nav>
        </Navbar>

        <Switch>
          <Route path="/pet/:id">
            <Pet data={listings}/>
          </Route>

          <Route path="/create">
            <Create />
          </Route>

          <Route path="/">
            <Homepage data={listings} numListings={numListings} />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}