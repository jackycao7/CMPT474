import React from "react";

import Container from 'react-bootstrap/Container'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'

import cat from './cat.jpg'

export default function Homepage(props) {
    let listings = props.data;

    if(listings){
        return (
            <Container>
                <h1 className="display-4">Lost Pets</h1>
                <Container className="row row-cols-3 row-cols-sm-3 row-cols-md-3 g-3">
                    {
                        listings.map((listing) => (
                            <Col key={listing.UUID}>
                                <Card className="shadow-sm m-1">
                                    <Card.Img variant="top" src={cat}></Card.Img> 
                                    <Card.Body>
                                        <Card.Title className="lead">{listing.petName}</Card.Title>
                                        <Card.Text>{listing.animalType}</Card.Text>
                                        <Button variant="primary" onClick={() => window.location.href = "/pet/" + listing.UUID }>View</Button>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))
                    }
                </Container>
            </Container>
        );
    }
    else{
        // add loading animation
        return(null);
    }
}