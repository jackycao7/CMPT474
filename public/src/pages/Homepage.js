import React, { useState } from "react";

import api from '../api'

import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Pagination from 'react-bootstrap/Pagination';

export default function Homepage(props) {
    let listings = props.data;

    let numListings = props.numListings;
    let numPages = numListings / 6;
    let pageItems = [];
    const [pageNumber, setPageNumber] = useState(0);

    for (let i = 0; i < numPages; i++){
        pageItems.push(
            <Pagination.Item key={i} active={i === pageNumber} onClick={() => setPageNumber(i)}>{i+1}</Pagination.Item>
        );
    }
    
    if(listings){
        console.log(listings);
        return (
            <Container>
                <h1 className="display-4 my-4">Lost Pets</h1>
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

                <Container className="my-4">
                    <Row className="justify-content-md-center"> 
                        <Pagination> { pageItems } </Pagination>
                    </Row>
                </Container>
            </Container>
        );
    }
    else{
        // add loading animation
        return(null);
    }
}