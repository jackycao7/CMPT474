import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";

import api from '../api.js'

// AWS SDK
import { S3Client, PutObjectCommand, ListObjectsCommand } from '@aws-sdk/client-s3';
import { CognitoIdentityClient } from '@aws-sdk/client-cognito-identity';
import { fromCognitoIdentityPool } from '@aws-sdk/credential-provider-cognito-identity';

// Bootstrap
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

// Map
import Marker from '../components/Marker';
import GoogleMapReact from 'google-map-react';

export default function Create() {
  const [petName, setPetName] = useState("");
  const [animalType, setAnimalType] = useState("Cat");
  const [description, setDescription] = useState("");
  const [city, setCity] = useState("Vancouver");
  const [postingType, setPostingType] = useState("Lost");
  const [captchaToken, setCaptchaToken] = useState("");

  // Coordinates
  const [latitude, setLat] = useState(49);
  const [longitude, setLong] = useState(-123);

  const [imageURL, setImageURL] = useState("");
  const [imgFile, setImgFile] = useState(null);
  let imgKey = "";

  const [btnIsDisabled, setBtnState] = useState(false);

  let { id } = useParams();
  let api_url_get = api.gateway + "postings?uuid=" + id;
  let api_url_edit = api.gateway + "postings/edit?uuid=" + id;

  function previewImage(event){
    let r = new FileReader();
    r.onload = function(){
      setImageURL(r.result);
    }
    r.readAsDataURL(event.target.files[0]);
  }

  function checkMissingAttributes(){
    let postObj = {
        'city': city,
        'description': description,
        'coordinates': [latitude, longitude],
        'petName': petName,
        'animalType': animalType,
    }

    var missingAttribute = false;
    for (var attribute in postObj) {
        if (attribute != "imgKey" && attribute != "description" && attribute != "token" && postObj[attribute] == "") {
            missingAttribute = true;
        }
    }

    if (missingAttribute) {
        return null;
    }
    else {
        console.log("missing attributes function", postObj);
        return postObj;
    }
  }

  async function postDetails(postObj){
    setBtnState(true);
    console.log(postObj);
    
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
      console.log('Success:', data);
    })
  }

  async function postImage(){
    if(imgFile){
      try {
        const albumPhotosKey = encodeURIComponent("album1") + "/";
        const data = await s3.send(
            new ListObjectsCommand({
              Prefix: albumPhotosKey,
              Bucket: api.albumBucketName
            })
        );

        const file = imgFile;
        const fileName = file.name + "-" + Date.now();
        const photoKey = albumPhotosKey + fileName;
        const uploadParams = {
          Bucket: api.albumBucketName,
          Key: photoKey,
          Body: file
        };
        try {
          const data = await s3.send(new PutObjectCommand(uploadParams));
          imgKey = photoKey;
          alert("Successfully uploaded photo.");
        } catch (err) {
          alert("There was an error uploading your photo: ", err.message);
        }
      } 
      catch (err) {
        console.log("error:", err);
      }
    }
    else{
      alert("Choose a file to upload first.");
    }
  }

  const s3 = new S3Client({ 
    region: api.bucketRegion,
    credentials: fromCognitoIdentityPool({
      client: new CognitoIdentityClient({ region: api.bucketRegion }),
      identityPoolId: api.IdentityPoolId
    })
  });

  async function getCaptchaToken() {
    var captchaToken = null;
    await new Promise(function(resolve, reject) {
      window.grecaptcha.ready(() => {
        window.grecaptcha.execute('6LdVDokaAAAAAG7_Zls7IZ1XPpraaUvWlqF3ciY-', {action: 'submit'}).then(token => {
          console.log("captcha token", token);
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
      console.log(api_url_get)
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
            console.log(data);
            let pet = data.body;
            setPetName(pet.petName);
            setAnimalType(pet.animalType);
            setDescription(pet.description);
            setCity(pet.city);
            setPostingType(pet.postingType);
            setLat(pet.coordinates[0]);
            setLong(pet.coordinates[1]);
          })
      }
      // Add reCaptcha
    const script = document.createElement("script")
    script.src = "https://www.google.com/recaptcha/api.js?render=6LdVDokaAAAAAG7_Zls7IZ1XPpraaUvWlqF3ciY-"
    document.body.appendChild(script)
      getPet();
    }, [])

  return (
    <Container>
        <h1 className="display-4 mt-4">Edit Post Details</h1>
        <Col>
          <Form>
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

            <img style={{"width": "300px", "height": "300px"}} src={imageURL}/>

            <Form.Group>
              <Form.File 
                label="Upload an image" 
                onChange={(e) => {
                    console.log(e.target.files[0]);
                    previewImage(e);
                    setImgFile(e.target.files[0]);
                  }
                }
              />
            </Form.Group>
          </Form>
        </Col>

        <Col>
          <Row>
            <h1 className="display-4 my-4">Map</h1>
            <div style={{ height: '60vh', width: '100%' }}>
              <GoogleMapReact
                bootstrapURLKeys={{key: "AIzaSyBvegNY-5thSCCntrobyjDyHkqWsKteQVc"}}
                defaultCenter={{lat: latitude, lng: longitude}}
                zoom={10}
                onClick={ ({x, y, lat, lng}) => {
                  setLat(lat);
                  setLong(lng);
                  console.log("lat:", latitude, "lng:", longitude);
                }}  
              >
                <Marker lat={latitude} lng={longitude} text="1"/>
              </GoogleMapReact>
            </div>
          </Row>
          <p className="lead">Click anywhere on the map to mark a location on where the pet was {postingType.toLowerCase()}.</p>
        </Col>
        
        <Button className="my-4" disabled={btnIsDisabled} onClick={async() => {
            var postObj = checkMissingAttributes();
            console.log("postobj", postObj);
            
            if (postObj != null) {
                // postObj.token = await getCaptchaToken();
                await postImage();
                console.log("imgkey", imgKey);
                postObj.imgKey = imgKey;
                await postDetails(postObj);
            }
            else {
                alert("Form is incomplete");
            }
          }}
        >
          Save Changes
        </Button>

    </Container>
  );
}