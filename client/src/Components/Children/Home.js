import { Container, Row, Col, Form, Button, Tabs, Tab, Carousel } from "react-bootstrap";
import React, { useState, useEffect, useContext, useMemo } from "react";
import MakeRequest from "../Helpers/MakeRequest";
export default ({ currentPage }) => {


    const [login1, setLogin1] = useState('');
    const [login2, setLogin2] = useState('');

    const [create1, setCreate1] = useState('');
    const [create2, setCreate2] = useState('');
    const [create3, setCreate3] = useState('');

    const handleLoginSubmit = async (event) => {
        event.preventDefault()
        const response = await MakeRequest({
            login1,
            login2
        }, 'login', 'post');
        if (response?.data) {
            alert("Login successful!")
            window.location.reload();
        } else {
            alert("Login failed")
        };
    };

    const handleUserCreate = async (event) => {
        event.preventDefault();
        const response = await MakeRequest({
            create1,
            create2,
            create3
        }, 'createuser', 'post');
        alert(response.response?.data?.message || response?.data?.message)
    };

    return (<>
        {currentPage === "Start" ? <>

            <Container style={{ color: "white", marginTop: "20vh" }}>
                <Carousel>
                    <Carousel.Item interval={5000}>
                        <Container style={{ fontSize: "40px" }}>
                            Spara pengar med smart-styrning
                        </Container>
                        <Container className="mt-4">
                            <Row>
                                <Col xl={7}>
                                    <p>Powerwatch låter dig styra dina enheter efter dygnets billigaste elpristimmar.</p><br></br>
                                    <p>Genom att schemabelägga dina enheter efter ditt valda schema, säkerställer Powerwatch att dina enheter bara är påslagna de billigaste timmarna på dygnet.</p>
                                    <p>På detta sättet kan du spara pengar och få en överblick över ditt hem eller din arbetsplats energiförbrukning.</p>
                                </Col>
                            </Row>
                        </Container>
                    </Carousel.Item>
                    <Carousel.Item interval={5000}>
                        <Container style={{ fontSize: "40px" }}>
                            Övervaka i realtid
                        </Container>
                        <Container className="mt-4">
                            <Row>
                                <Col xl={7}>
                                    <p>Genom Powerwatch övervakningssystem kan du övervaka alla dina enheter i realtid.</p><br></br>
                                    <p>Se till exempel elförbrukning & kostnad per enhet, hus, rum...</p>
                                    <p>Många olika filter baserat på tidsintervaller och grupperingar sorterar dina enheter och gör det enkelt för analys och bevakning.</p>

                                </Col>
                            </Row>
                        </Container>
                    </Carousel.Item>
                    <Carousel.Item interval={5000}>
                        <Container style={{ fontSize: "40px" }}>
                            Centraliserad styrning
                        </Container>
                        <Container className="mt-4">
                            <Row>
                                <Col xl={7}>
                                    <p>Powerwatch tillåter även direktstyrning av alla dina enheter.</p><br></br>
                                    <p>Kontrollpanelens många funktioner låter dig kontrollera dina enheter live.</p>
                                </Col>
                            </Row>
                        </Container>
                    </Carousel.Item>
                    <Carousel.Item interval={5000}>
                        <Container style={{ fontSize: "40px" }}>
                            Enkel installation
                        </Container>
                        <Container className="mt-4">
                            <Row>
                                <Col xl={7}>
                                    <p>Powerwatch stödjer många olika smarta enheter.</p><br></br>
                                    <p>Detta gör installationen enkel, och du behöver inte ändra elavtal eller göra något större ingrepp på hemmet för att dra igång.</p>
                                </Col>
                            </Row>
                        </Container>
                    </Carousel.Item>
                </Carousel>

            </Container>
        </> : <></>}
        {currentPage === "Logga in" ? <>
            <Container style={{ color: "white", marginTop: "15vh" }} className="mx-0 px-0">
                <h1>Logga in</h1>
                <Col xl={5} md={7} sm={10} xs={12} style={{ backgroundColor: "var(--newBlue2)", borderRadius: "var(--bodyRadius)" }} className="px-4 py-2 pb-4">
                    <Form className="mt-4" onSubmit={handleLoginSubmit} >
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control type="email" placeholder="Enter email" required onChange={(e) => setLogin1(e.target.value)} />
                        </Form.Group>
                        <Form.Group controlId="formBasicPassword" className="mt-2">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" placeholder="Password" required onChange={(e) => setLogin2(e.target.value)} />
                        </Form.Group>
                        <Container className="p-0 mx-0 my-3">
                            <a onClick={() => console.log("HEJ")} className="my-3 p-0 text-light" style={{ cursor: "pointer" }}>I forgot my password</a><br></br>
                        </Container>
                        <Button variant="dark" type="submit" className="submit-btn">
                            Log In
                        </Button>
                    </Form>
                </Col>
            </Container>
        </> : <></>}
        {currentPage === "Registrera" ? <>

            <Container style={{ color: "white", marginTop: "15vh" }} className="mx-0 px-0">
            <h1>Registrera</h1>
                <Col xl={5} md={7} sm={10} xs={12} style={{ backgroundColor: "var(--newBlue2)", borderRadius: "var(--bodyRadius)" }} className="px-4 py-2 pb-4">
                    <Form className="mt-4" onSubmit={handleUserCreate}>

                        <Form.Group controlId="formBasicEmailReg">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control type="email" placeholder="Enter email" required onChange={(e) => setCreate1(e.target.value)} />
                        </Form.Group>
                        <Form.Group controlId="formCustomerIdReg" className="mt-2">
                            <Form.Label>Customer Id</Form.Label>
                            <Form.Control type="string" placeholder="Enter customer id" required onChange={(e) => setCreate3(e.target.value)} />
                        </Form.Group>

                        <Form.Group controlId="formBasicPasswordReg" className="mt-2">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" placeholder="Password" required onChange={(e) => setCreate2(e.target.value)} />
                        </Form.Group>

                        <Button variant="dark" type="submit" className="submit-btn mt-4">
                            Register
                        </Button>
                    </Form>
                </Col>
            </Container>
            {/* 
            <Container className="homeContainer">
                <Row className="d-flex justify-content-start text-start pt-4 pb-4 px-5" style={{ fontSize: "16px" }}>
                    <p>If you have your customer-id ready, you can register new accounts below</p>
                    <Row>
                        <Col xl={6} md={8} xs={12}>
                            <Form className="mt-4" onSubmit={handleUserCreate}>

                                <Form.Group controlId="formBasicEmailReg">
                                    <Form.Label>Email address</Form.Label>
                                    <Form.Control type="email" placeholder="Enter email" required onChange={(e) => setCreate1(e.target.value)} />
                                </Form.Group>
                                <Form.Group controlId="formCustomerIdReg" className="mt-2">
                                    <Form.Label>Customer Id</Form.Label>
                                    <Form.Control type="string" placeholder="Enter customer id" required onChange={(e) => setCreate3(e.target.value)} />
                                </Form.Group>

                                <Form.Group controlId="formBasicPasswordReg" className="mt-2">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control type="password" placeholder="Password" required onChange={(e) => setCreate2(e.target.value)} />
                                </Form.Group>

                                <Button variant="primary" type="submit" className="submit-btn mt-4">
                                    Register
                                </Button>
                            </Form>
                        </Col>
                    </Row>
                </Row>
            </Container> */}
        </> : <></>}
        {currentPage === "Help" ? <></> : <></>}
        {currentPage === "FAQ" ? <></> : <></>}
        {currentPage === "Powerwatch" ? <></> : <></>}
    </>)
};