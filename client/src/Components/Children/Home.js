import { Container, Row, Col, Form, Button, Tabs, Tab } from "react-bootstrap";
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
        {currentPage === "Home" ? <>
            <Container className=" m-0 p-0">
                <Row className="d-flex justify-content-start text-start pt-4 pb-4 px-5" style={{ fontSize: "30px" }}>
                    <p>Welcome to Powerwatch</p>
                    <Container>
                        <div className="lineItem"></div><br></br>
                        <Row>
                            <Col xl={10} lg={12} className="">
                                <div className="text-start homeText" style={{ fontSize: "14px" }}>
                                    <p><b>What is Powerwatch?</b></p>
                                    Powerwatch is the simple application of monitoring your smart devices in your home or workplace. It allows you to control and monitor your costs and energyconsumption in real time! Not only this, Powerwatch allows you to set up schedules for your devices and only uses these devices when the powerprices are as cheapest.
                                </div>
                                <div className="text-start mt-3" style={{ fontSize: "14px" }}>
                                    <p><b>Why Powerwatch?</b></p>
                                    As we see it, there are two types of ways of using electricity: the way it's been done since Benjamin Franklins time, and the way of the 21st century.
                                    <p className="mt-2">The new way of using electricity includes smart-devices, wireless control and smart-consumption. If this fits your vision of how your home or workplace should look like, look no further!</p>
                                    <p className="mt-2">By including Powerwatch in your solution of smart-devices, you take the next step into the future!</p>
                                </div>
                            </Col>
                        </Row>

                        {/*                         <div className="text-start mt-3" style={{ fontSize: "14px", width: "60%" }}>
                            <p><b>Ok i'm sold, what's next?</b></p>
                            Send us an email in the form down below to get a quota, or contact us via <email>info@powerwatch.se</email>
                            
                        </div> */}
                    </Container>
                </Row>

            </Container>
        </> : <></>}
        {currentPage === "Log In" ? <>
            <Container className="homeContainer">
                <Row className="d-flex justify-content-start text-start pt-4 pb-4 px-5" style={{ fontSize: "16px" }}>
                    <p>If your already registered with Powerwatch, please log in below</p>
                    <Row>
                        <Col xl={6} md={8} xs={12}>
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
                                    <a onClick={() => console.log("HEJ")} className="my-3 p-0" style={{ cursor: "pointer" }}>I forgot my password</a><br></br>
                                </Container>
                                <Button variant="primary" type="submit" className="submit-btn">
                                    Log In
                                </Button>
                            </Form>
                        </Col>
                    </Row>
                </Row>
            </Container>
        </> : <></>}
        {currentPage === "Create Account" ? <>
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
            </Container>
        </> : <></>}
        {currentPage === "Help" ? <></> : <></>}
        {currentPage === "FAQ" ? <></> : <></>}
        {currentPage === "Powerwatch" ? <></> : <></>}
    </>)
};