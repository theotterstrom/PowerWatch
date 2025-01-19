import React, { useState, useEffect, useContext } from "react";
import { Container, Row, Col, Form, Button, Tabs, Tab } from "react-bootstrap";
import '../Styles/Home.css';
import requestMaker from "../Components/Helpers/MakeRequest";
import axios from "axios";

function Home() {

  const [key, setKey] = useState('login');
  const [inKey, setInKey] = useState('content');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [login1, setLogin1] = useState('');
  const [login2, setLogin2] = useState('');

  const [create1, setCreate1] = useState('')
  const [create2, setCreate2] = useState('')

  const handleLoginSubmit = async (event) => {
    event.preventDefault()
    const response = await requestMaker({
      login1,
      login2
    }, 'login', 'post');
    if (response?.data) {
      alert("Login successful!")
    } else {
      alert("Login failed")
    };
  };

  const handleUserCreate = async (event) => {
    event.preventDefault();
    const response = await requestMaker({
      create1,
      create2
    }, 'createuser', 'post');
    alert(response.response?.data?.message || response?.data?.message)
  };

  const checkAuth = async () => {
    try {
      const response = await axios.get('https://localhost:3001/check-auth', {
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

      if (response.data.authenticated) {
        setIsAuthenticated(true);  // User is authenticated
      } else {
        setIsAuthenticated(false);  // User is not authenticated
      };
    } catch (error) {
      console.error('Authentication check failed:', error);
      setIsAuthenticated(false);
    }
  };


  const handleLogout = async (event) => {
    event.preventDefault();
    const response = await requestMaker({}, 'logout', 'post');
    setIsAuthenticated(false);
    window.location.reload();
  };


  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <Container className="mt-5">
      <h2 className="text-center">Welcome to Our App</h2>
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

                  <Button variant="primary" type="submit" className="submit-btn">
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

                  <Form.Group controlId="formBasicPasswordReg">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Password" required onChange={(e) => setCreate2(e.target.value)} />
                  </Form.Group>

                  <Button variant="primary" type="submit" className="submit-btn">
                    Register
                  </Button>
                </Form>
              </Tab>
            </Tabs>
          ) : (
            <Tabs activeKey={inKey} onSelect={(k) => setInKey(k)} className="mb-3">
              <Tab eventKey="content" title="Content" className="tab-content">
                <Form className="mt-4" onSubmit={() => { }}>
                  <Button variant="primary" type="submit" className="submit-btn">Get content</Button>
                </Form>
              </Tab>
              <Tab eventKey="logout" title="Log Out" className="tab-content">
                <Form className="mt-4" onSubmit={handleLogout}>
                  <Button variant="primary" type="submit" className="submit-btn">Log out</Button>
                </Form>
              </Tab>
              <Tab eventKey="mypage" title="My Page" className="tab-content">
                <Form className="mt-4" onSubmit={() => { }}>
                  <Button variant="primary" type="submit" className="submit-btn">My Page</Button>
                </Form>
              </Tab>
            </Tabs>
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default Home;
