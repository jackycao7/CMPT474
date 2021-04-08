import React, { useState, useEffect } from "react";

import api from '../api'

import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Dropdown from 'react-bootstrap/Dropdown'
// import Pagination from 'react-bootstrap/Pagination';

export default function Homepage(props) {
    // Filters
    const [postingFilter, setPostingFilter] = useState('Lost');
    const [cityFilter, setCityFilter] = useState('');
    const [sortOrder, setSortOrder] = useState('desc');

    // Listings
    const [listings, setListings] = useState([]);

    let cityParam = cityFilter !== "" ? "&city=" + cityFilter : "";
    let sortParam =  sortOrder !== "" ? "&dateSortOrder=" + sortOrder : "";
    let api_url = api.gateway + "postings?postingType=" + postingFilter + cityParam + sortParam;
    
    // Pagination
    // const [numListings, setNumListings] = useState(0);
    // let numPages = numListings / 6;
    // let pageItems = [];
    // const [pageNumber, setPageNumber] = useState(0);

    // for (let i = 0; i < numPages; i++){
    //     pageItems.push(
    //         <Pagination.Item key={i} active={i === pageNumber} onClick={() => setPageNumber(i)}>{i+1}</Pagination.Item>
    //     );
    // }

    useEffect(() => {
        async function fetchListings(){
            await fetch(api_url, {
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
                // setNumListings(data.body.numPostings);
                setListings(data.body.postings)
                console.log(listings);
            })
        }
        fetchListings();
    }, [api_url])
    
    if(listings){
        return (
            <Container>
                <h1 className="display-4 my-4">Listings</h1>
                <p className="lead">Viewing pets that are {postingFilter.toLowerCase()} {cityFilter !== '' ? "in " + cityFilter : ""}</p>

                <Container>
                    <Row xs={6}>
                        <Col>
                            <Dropdown className="my-4">
                                <Dropdown.Toggle variant="primary" id="dropdown-basic">Filter</Dropdown.Toggle>

                                <Dropdown.Menu title="Posting Type">
                                    <Dropdown.Header>Posting Type</Dropdown.Header>
                                    <Dropdown.Item as="button" onClick={() => setPostingFilter("Lost")}>Lost Pets</Dropdown.Item>
                                    <Dropdown.Item as="button" onClick={() => setPostingFilter("Found")}>Found Pets</Dropdown.Item>
                                </Dropdown.Menu >
                            </Dropdown>
                        </Col>

                        <Col>
                            <Dropdown className="my-4">
                                <Dropdown.Toggle variant="primary" id="dropdown-basic">Sort: {sortOrder === "desc" ? " Oldest" : " Newest"}</Dropdown.Toggle>

                                <Dropdown.Menu title="Sort by date">
                                    <Dropdown.Header>Posting Type</Dropdown.Header>
                                    <Dropdown.Item as="button" onClick={() => setSortOrder("desc")}>Date added (oldest)</Dropdown.Item>
                                    <Dropdown.Item as="button" onClick={() => setSortOrder("asc")}>Date added (newest)</Dropdown.Item>
                                </Dropdown.Menu >
                            </Dropdown>
                        </Col>

                        <Col>
                            <Dropdown className="my-4">
                                <Dropdown.Toggle variant="primary" id="dropdown-basic">Location: {cityFilter !== "" ? cityFilter : "All"}</Dropdown.Toggle>

                                <Dropdown.Menu title="Location">
                                    <Dropdown.Item as="button" onClick={() => setCityFilter("")}>All</Dropdown.Item>
                                    <Dropdown.Item as="button" onClick={() => setCityFilter("Vancouver")}>Vancouver</Dropdown.Item>
                                    <Dropdown.Item as="button" onClick={() => setCityFilter("North Vancouver")}>North Vancouver</Dropdown.Item>
                                    <Dropdown.Item as="button" onClick={() => setCityFilter("Burnaby")}>Burnaby</Dropdown.Item>
                                    <Dropdown.Item as="button" onClick={() => setCityFilter("Surrey")}>Surrey</Dropdown.Item>
                                    <Dropdown.Item as="button" onClick={() => setCityFilter("Richmond")}>Richmond</Dropdown.Item>
                                    <Dropdown.Item as="button" onClick={() => setCityFilter("New Westminster")}>New Westminster</Dropdown.Item>
                                    <Dropdown.Item as="button" onClick={() => setCityFilter("Coquitlam")}>Coquitlam</Dropdown.Item>
                                    <Dropdown.Item as="button" onClick={() => setCityFilter("Delta")}>Delta</Dropdown.Item>
                                </Dropdown.Menu >
                            </Dropdown>
                        </Col>
                    </Row>
                </Container>
                    

                <Container className="row row-cols-3 row-cols-sm-3 row-cols-md-3 g-3">
                    {
                        listings.map((listing) => (
                            <Col key={listing.UUID}>
                                <Card className="shadow-sm m-1">
                                    <Card.Img style={{height:"300px", width: "100%"}}variant="top" src={"https://" + api.albumBucketName + ".s3.amazonaws.com/" + listing.imgKey} /> 
                                    <Card.Body>
                                        <Card.Title>{listing.petName}</Card.Title>
                                        <Card.Text>{listing.animalType}</Card.Text>
                                        <Button variant="primary" onClick={() => window.location.href = "/pet/" + listing.UUID }>View</Button>
                                    </Card.Body>
                                    <Card.Footer>
                                        <small className="text-muted">Posted {listing.datePosted.slice(0, -5)}</small>
                                    </Card.Footer>
                                </Card>
                            </Col>
                        ))
                    }
                </Container>

                {/* <Container className="my-4">
                    <Row className="justify-content-md-center"> 
                        <Pagination> { pageItems } </Pagination>
                    </Row>
                </Container> */}
            </Container>
        );
    }
    else{
        return(<p className="lead">We couldn't find any listings :(</p>);
    }
}