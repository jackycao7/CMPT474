import React from "react";
import { useParams } from "react-router-dom";

import api from '../api.js'

// Bootstrap
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Image from 'react-bootstrap/Image';

// Google Maps React
import GoogleMapReact from 'google-map-react';
import Marker from '../components/Marker';


export default function Pet(props) {

  let listings = props.data;
  let { id } = useParams();
  
  let pet = listings.find(x => x.UUID === id);

  if(pet){
    console.log(pet);
    let latitude = pet.latitude;
    let longitude = pet.longitude;
    
    return (
      <Container>
        <Row>
          <Col>
            <Image rounded src={"https://" + api.albumBucketName + ".s3.amazonaws.com/" + pet.imgKey}/>
          </Col>
        </Row>

        <h1 className="display-3">{pet.petName}</h1>
        <p className="lead">{pet.description}</p>

        <h1 className="display-4 my-4">Details</h1>

        <h4>Animal</h4>
        <p className="lead">{pet.animalType}</p>

        <h4>Status</h4>
        <p className="lead">{pet.postingType}</p>

        <h4>Date Posted</h4>
        <p className="lead">{pet.datePosted}</p>

        <h4>City</h4>
        <p className="lead">{pet.city}</p>

        <h1 className="display-4 my-4">Map</h1>
        <div style={{ height: '60vh', width: '100%' }}>
          <GoogleMapReact
            bootstrapURLKeys={{key: "AIzaSyBvegNY-5thSCCntrobyjDyHkqWsKteQVc"}}
            defaultCenter={{lat: 49, lng: -123}}
            zoom={5}
          >
            <Marker lat={latitude} lng={longitude} text="1"/>
          </GoogleMapReact>
        </div>

        <h1 className="display-4 my-4">Contact</h1>
      </Container>
    );
  }
  else{
    return(null);
  }
}