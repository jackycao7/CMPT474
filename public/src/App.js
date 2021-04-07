import React, { useState, useEffect }  from 'react';

// Components
import api from './api.js'
import Homepage from './pages/Homepage'
import Pet from './pages/Pet'
import Create from './pages/Create'

// React Router DOM
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";

// Bootstrap
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav';

export default function App() {
  const [pageNumber, setPageNumber] = useState(1);
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
  }, [pageNumber])

  return (
    <Router>
      <div>
        <Navbar bg="dark" variant="dark" expand="lg">
          <Navbar.Brand href="/">Petfindr</Navbar.Brand>
          <Nav.Link>
            <Link to="/">Home</Link>
          </Nav.Link>

          {/* <Nav.Link>
            <Link to="/pet">Pet</Link>
          </Nav.Link> */}

          <Nav.Link>
            <Link to="/create">Make a Post</Link>
          </Nav.Link>
        </Navbar>

        <Switch>
          <Route path="/pet/:id">
            <Pet data={listings}/>
          </Route>

          <Route path="/create">
            <Create />
          </Route>

          <Route path="/">
            <Homepage data={listings}/>
          </Route>
        </Switch>
      </div>
    </Router>
  );
}