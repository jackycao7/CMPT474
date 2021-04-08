import React, { useState } from "react";

import api from "../api";

// Bootstrap
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';

async function deletePosting(uuid){
    // await fetch(api.gateway, {
    //     method: 'POST', // *GET, POST, PUT, DELETE, etc.
    //     mode: 'cors', // no-cors, *cors, same-origin
    //     cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    //     credentials: 'same-origin', // include, *same-origin, omit
    //     headers: {
    //       'Content-Type': 'application/json'
    //     },
    //     redirect: 'follow', // manual, *follow, error
    //     referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    //     body: JSON.stringify(uuid)
    // })
    // .then(() => {
    //     alert("Post has been deleted.");
    // })
}

export default function Delete(){
    const [btnClicked, setBtnClicked] = useState(false);

    return(
        <Container>
            <h1 className="display-4">Delete</h1>
            <p className="lead">Are you sure you want to delete ?</p>
            <Container fluid>
                <Row md={4}>
                    <Col>
                        <Button disabled={btnClicked} onClick={() => {
                            deletePosting();
                            setBtnClicked(true);
                        }}>
                            Yes
                        </Button>
                    </Col>
                    
                    <Col>
                        <Button href="/home">No</Button>
                    </Col>
                </Row>
            </Container>
        </Container>
    );
}