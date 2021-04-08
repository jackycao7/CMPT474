import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import api from '../api.js'

// Bootstrap
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Image from 'react-bootstrap/Image';
import Card from 'react-bootstrap/Card';
import FormControl from 'react-bootstrap/FormControl'
import InputGroup from 'react-bootstrap/InputGroup'

// Google Maps React
import GoogleMapReact from 'google-map-react';
import Marker from '../components/Marker';


export default function Pet(props) {
  let { id } = useParams();
  let api_url = api.gateway + "postings?uuid=" + id;

  const [pet, setPet] = useState(null);

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
            setPet(data.body)
            console.log(pet);
        })
    }
    fetchListings();
  }, [])
  

  if(pet){
    let latitude = pet.coordinates[0];
    let longitude = pet.coordinates[1];
    console.log(pet)
    return (
      <Container>
        <Row className="justify-content-md-center mb-4">
          <Card className="shadow-lg">
            <Image rounded src={"https://" + api.albumBucketName + ".s3.amazonaws.com/" + pet.imgKey}/>
          </Card>
        </Row>

        <h1 className="display-2">{pet.petName}</h1>
        <p className="lead">{pet.description}</p>

        <h1 className="display-4 my-4">Details</h1>
        <Row>
          <Col>
            <h4>Animal</h4>
            <p className="lead">{pet.animalType}</p>
          </Col>
        
          <Col>
            <h4>Status</h4>
            <p className="lead">{pet.postingType}</p>
          </Col>
        </Row>
        
        <Row>
          <Col>
            <h4>Date Posted</h4>
            <p className="lead">{pet.datePosted}</p>
          </Col>
          
          <Col>
            <h4>City</h4>
            <p className="lead">{pet.city}</p>
          </Col>
        </Row>
        
        
        <h1 className="display-4 mt-4">Map</h1>
        <p  className="lead mx-1">{ pet.postingType === "Lost" ? pet.petName + " was last seen here" : pet.petName + " was found here"}</p>
        <div style={{ height: '60vh', width: '100%' }}>
          <GoogleMapReact
            bootstrapURLKeys={{key: "AIzaSyBvegNY-5thSCCntrobyjDyHkqWsKteQVc"}}
            defaultCenter={{lat: latitude, lng: longitude}}
            zoom={12}
          >
            <Marker lat={latitude} lng={longitude} text="1"/>
          </GoogleMapReact>
        </div>

        <h1 className="display-4 my-4">Contact</h1>
        <InputGroup className="my-4">
          <FormControl as="textarea" aria-label="With textarea" />
        </InputGroup>
      </Container>
    );
  }
  else{
    return(null);
  }
}