import React, { useState, useEffect, useContext } from "react";
import { Container, Row, Col, Form, Button, Tabs, Tab } from "react-bootstrap";
import '../Styles/Home.css';
import requestMaker from "../Components/Helpers/MakeRequest";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import apiUrl from "../Components/Helpers/APIWrapper";

const Home = () => {

  const [key, setKey] = useState('login');
  const [inKey, setInKey] = useState('purpose');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [login1, setLogin1] = useState('');
  const [login2, setLogin2] = useState('');

  const [create1, setCreate1] = useState('');
  const [create2, setCreate2] = useState('');
  const [create3, setCreate3] = useState('');

  const navigate = useNavigate();

  const handleLoginSubmit = async (event) => {
    event.preventDefault()
    const response = await requestMaker({
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
    const response = await requestMaker({
      create1,
      create2,
      create3
    }, 'createuser', 'post');
    alert(response.response?.data?.message || response?.data?.message)
  };

  const checkAuth = async () => {
    try {
      const response = await axios.get(`${apiUrl}/check-auth`, {
        withCredentials: true,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        }
      });

      if (!response) {
        setIsAuthenticated(false);
        return;
      };

      if (response.status === 200) {
        setIsAuthenticated(true);  // User is authenticated
      } else {
        setIsAuthenticated(false);  // User is not authenticated
      };
    } catch (error) {
      console.error('Authentication check failed:', error);
      setIsAuthenticated(false);
    }
  };

  const redirect = (e) => {
    e.preventDefault();
    navigate("/energywatch");
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <Container className="mt-5">
      <h2 className="text-center">Welcome to EnergyWatch</h2>
      <Row className="justify-content-center">
        <Col md={6} className="form-container">

          {!isAuthenticated ? (
            <Tabs activeKey={key} onSelect={(k) => setKey(k)} className="mb-3">
              <Tab eventKey="login" title="Login" className="tab-content">
                <Form className="mt-4" onSubmit={handleLoginSubmit} >
                  <Form.Group controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control type="email" placeholder="Enter email" required onChange={(e) => setLogin1(e.target.value)} />
                  </Form.Group>

                  <Form.Group controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Password" required onChange={(e) => setLogin2(e.target.value)} />
                  </Form.Group>

                  <Button variant="primary" type="submit" className="submit-btn mt-3">
                    Log In
                  </Button>
                </Form>
              </Tab>
              <Tab eventKey="register" title="Register" className="tab-content">
                <Form className="mt-4" onSubmit={handleUserCreate}>

                  <Form.Group controlId="formBasicEmailReg">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control type="email" placeholder="Enter email" required onChange={(e) => setCreate1(e.target.value)} />
                  </Form.Group>
                  <Form.Group controlId="formBasicEmailReg">
                    <Form.Label>Customer Id</Form.Label>
                    <Form.Control type="number" placeholder="Enter customer-id" required onChange={(e) => setCreate3(e.target.value)} />
                  </Form.Group>

                  <Form.Group controlId="formBasicPasswordReg">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Password" required onChange={(e) => setCreate2(e.target.value)} />
                  </Form.Group>

                  <Button variant="primary" type="submit" className="submit-btn mt-3">
                    Register
                  </Button>
                </Form>
              </Tab>
            </Tabs>
          ) : (
            <Tabs activeKey={inKey} onSelect={(k) => setInKey(k)}>
              <Tab eventKey="purpose" title="Purpose" className="tab-content">
                The purpose of this website is to track the energyconsumption of our houses in Mörtvik, Sweden.
              </Tab>
              <Tab eventKey="technology" title="Technology" className="tab-content">
                On every large power-consuming device, we've installed a <a href="https://www.shelly.com/products/shelly-plus-1-x1">shelly-switch</a> that
                tracks and controls the power consumption of that device.
                <Row className="mt-3"></Row>
                Furthermore, this application scrapes the web for the power prices of tomorrow,
                checks the cheapest hours and sets a scheduele for each device depending on the cheapest hours.
                <Row className="mt-3"></Row>
                In summary, this application saves money, displays power consumption and savings and controls the devices mentioned above.
              </Tab>
              <Tab eventKey="project" title="Project" className="tab-content">
                <Form onSubmit={redirect}>
                  <Button variant="primary" type="submit" className="submit-btn">EnergyWatch</Button>
                </Form>
              </Tab>
            </Tabs>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
