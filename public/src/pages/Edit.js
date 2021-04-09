import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";

import api from '../api.js'

// Bootstrap
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

// Map
import Marker from '../components/Marker';
import GoogleMapReact from 'google-map-react';

export default function Edit() {
  const [accessCode, setAccessCode] = useState("");

  const [pet, setPet] = useState(null);
  const [petName, setPetName] = useState("");
  const [animalType, setAnimalType] = useState("Cat");
  const [description, setDescription] = useState("");
  const [city, setCity] = useState("Vancouver");
  const [postingType, setPostingType] = useState("Lost");
  const [captchaToken, setCaptchaToken] = useState("");

  // Coordinates
  const [latitude, setLat] = useState(49);
  const [longitude, setLong] = useState(-123);

  const [saveBtnClicked, setSaveBtnClicked] = useState(false);
  const [deleteBtnClicked, setDeleteBtnClicked] = useState(false);

  let { id } = useParams();
  let api_url_get = api.gateway + "postings?uuid=" + id;
  let api_url_edit = api.gateway + "postings/edit?uuid=" + id;

  function checkMissingAttributes(){
    let postObj = {
        'accessCode': accessCode,
        'contactEmail': pet.contactEmail,
        'contactPhone': pet.contactPhone,
        'city': city,
        'coordinates': [latitude, longitude],
        'description': description,
        'petName': petName,
        'dateLostFound': pet.dateLostFound,
        'animalType': animalType,
        "active": 1
    }

    var missingAttribute = false;
    for (var attribute in postObj) {
        if (attribute != "description" && attribute != "token" && postObj[attribute] == "") {
            missingAttribute = true;
        }
    }

    if (missingAttribute) {
        return null;
    }
    else {
        // console.log("missing attributes function", postObj);
        return postObj;
    }
  }

  async function postDetails(postObj){
    setSaveBtnClicked(true);
    // console.log(postObj);
    
    await fetch(api_url_edit, {
      method: 'PUT', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json'
      },
      redirect: 'follow', // manual, *follow, error
      referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: JSON.stringify(postObj) // body data type must match "Content-Type" header
    })
    .then(response => response.json())
    .then(data => {
      // console.log('Success:', data);
    })
  }

  async function deletePosting(uuid){
    let api_url = api.gateway + "/postings/delete?uuid=" + uuid;
    
    if(accessCode){
      await fetch(api_url, {
          method: 'DELETE', // *GET, POST, PUT, DELETE, etc.
          mode: 'cors', // no-cors, *cors, same-origin
          cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
          credentials: 'same-origin', // include, *same-origin, omit
          headers: {
            'Content-Type': 'application/json'
          },
          redirect: 'follow', // manual, *follow, error
          referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url,
          body: JSON.stringify({'accessCode': accessCode})
      })
      .then(response => response.json())
      .then(data => {
        console.log(data);
        alert("Attempting to delete posting.");
      })
    }
  }

  async function getCaptchaToken() {
    var captchaToken = null;
    await new Promise(function(resolve, reject) {
      window.grecaptcha.ready(() => {
        window.grecaptcha.execute('6LdVDokaAAAAAG7_Zls7IZ1XPpraaUvWlqF3ciY-', {action: 'submit'}).then(token => {
          // console.log("captcha token", token);
          if (token) {
              captchaToken = token;
              resolve();
          }
          else {
              reject();
          }
        });
      });
    });

    return captchaToken;
  }

  useEffect(() => {
    async function getPet(){
      // console.log(api_url_get)
      await fetch(api_url_get, {
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
            // console.log(data);
            setPet(data.body);
            
            setPetName(data.body.petName);
            setAnimalType(data.body.animalType);
            setDescription(data.body.description);
            setCity(data.body.city);
            setPostingType(data.body.postingType);
            setLat(data.body.coordinates[0]);
            setLong(data.body.coordinates[1]);
          })
      }
      // Add reCaptcha
      // const script = document.createElement("script")
      // script.src = "https://www.google.com/recaptcha/api.js?render=6LdVDokaAAAAAG7_Zls7IZ1XPpraaUvWlqF3ciY-"
      // document.body.appendChild(script)
      getPet();
    }, [])

  return (
    <Container>
        <h1 className="display-4 mt-4">Edit Post Details</h1>
        <Col>
          <Form>
            <Form.Group>
              <Form.Label>Access Code</Form.Label>
              <Form.Control type="text" placeholder="Please insert the access code found in the email that was sent after post creation." onChange={(e) => setAccessCode(e.target.value)}/>
            </Form.Group>

            <Form.Group>
              <Form.Label>Pet Name</Form.Label>
              <Form.Control type="text" placeholder="Clifford" onChange={(e) => setPetName(e.target.value)} value={petName}/>
            </Form.Group>

            <Form.Group>
              <Form.Label>Animal Type</Form.Label>
              <Form.Control as="select" onChange={(e) => setAnimalType(e.target.value)} value={animalType}>
                <option>Dog</option>
                <option>Cat</option>
                <option>Bird</option>
                <option>Reptile</option>
                <option>Cow</option>
                <option>Other</option>
              </Form.Control>
            </Form.Group>
            
            <Form.Group>
              <Form.Label>Description</Form.Label>
              <Form.Control type="text" placeholder="Big red dog" onChange={(e) => setDescription(e.target.value)} value={description}/>
            </Form.Group>

            <Form.Group>
              <Form.Label>City</Form.Label>
              <Form.Control as="select" onChange={(e) => setCity(e.target.value)} value={city}>
                <option>Vancouver</option>
                <option>North Vancouver</option>
                <option>Burnaby</option>
                <option>Surrey</option>
                <option>Richmond</option>
                <option>New Westminster</option>
                <option>Coquitlam</option>
                <option>Delta</option>
                <option>Other</option>
              </Form.Control>
            </Form.Group>

            <Form.Group>
              <Form.Label>Posting Type</Form.Label>
              <Form.Control as="select" onChange={(e) => setPostingType(e.target.value)} value={postingType}>
                <option>Lost</option>
                <option>Found</option>
              </Form.Control>
            </Form.Group>

          </Form>
        </Col>

        <Col>
          <h1 className="display-4 mt-4">Map</h1>
          <p className="lead">Click anywhere on the map to mark a location on where the pet was {postingType.toLowerCase()}.</p>
          <div style={{ height: '60vh', width: '100%' }}>
            <GoogleMapReact
              bootstrapURLKeys={{key: "AIzaSyBvegNY-5thSCCntrobyjDyHkqWsKteQVc"}}
              defaultCenter={{lat: latitude, lng: longitude}}
              zoom={10}
              onClick={ ({x, y, lat, lng}) => {
                setLat(lat);
                setLong(lng);
                // console.log("lat:", latitude, "lng:", longitude);
              }}  
            >
              <Marker lat={latitude} lng={longitude} text="1"/>
            </GoogleMapReact>
          </div>
        </Col>
        
        <Col>
          <Button className="my-4 mr-4" variant="success" disabled={saveBtnClicked} onClick={async() => {
              var postObj = checkMissingAttributes();
              // console.log("postobj", postObj);
              
              if (postObj != null && accessCode) {
                  // postObj.token = await getCaptchaToken();
                  await postDetails(postObj);
                  alert("Post saved!");
                  window.location.href = "/";
              }
              else {
                  alert("Form is incomplete");
              }
            }}
          >
            Save Changes
          </Button>


          <Button className="my-4 mr-4" variant="outline-danger" disabled={deleteBtnClicked} onClick={() => {
              if(accessCode){
                let deleteDecision = window.confirm("Are you sure you want to delete this post?");
                if(deleteDecision){
                  deletePosting(id);
                  setDeleteBtnClicked(true);
                  // window.location.href = "/";
                }
              }
              else{
                alert("Please enter a valid access code.");
              }
          }}>
            Delete Posting
          </Button>

          <Button variant="outline-secondary" href="/">
            Cancel
          </Button>
        </Col>


    </Container>
  );
}