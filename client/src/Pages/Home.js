import React, { useState, useEffect, useContext, useMemo } from "react";
import { Container, Row, Col, Form, Button, Tabs, Tab } from "react-bootstrap";
import requestMaker from "../Components/Helpers/MakeRequest";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import apiUrl from "../Components/Helpers/APIWrapper";
import NavBar from "../Components/Children/NavBar";
import HomePage from "../Components/Children/Home"

const NavBarChild = React.memo(({ isAuthenticated, setCurrentHomePage }) => {
  const initData = useMemo(() => ({ isAuthenticated, setCurrentHomePage }), [isAuthenticated, setCurrentHomePage]);
  return <NavBar states={initData} />
});


const Home = () => {

  const [key, setKey] = useState('login');
  const [inKey, setInKey] = useState('purpose');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [login1, setLogin1] = useState('');
  const [login2, setLogin2] = useState('');

  const [create1, setCreate1] = useState('');
  const [create2, setCreate2] = useState('');
  const [create3, setCreate3] = useState('');

  const [currentPage, setCurrentHomePage] = useState("Start");

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
    navigate("/monitor");
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <>

      <NavBarChild isAuthenticated={isAuthenticated} setCurrentHomePage={setCurrentHomePage} />

      <div className="backGroundHolder">
        <div className="backgroundBlock m-0 p-0">
        </div>
           <img src="/images/power.jpg" className="backgroundImg" alt="Home" /> 
      </div>

      <div className="d-flex justify-content-center">
        <Col xl={8} md={10} xs={11} className="m-0 p-0">
          <main>
            {currentPage === "Start" && <HomePage currentPage={currentPage} />}
            {currentPage === "Logga in" && <HomePage currentPage={currentPage} />}
            {currentPage === "Registrera" && <HomePage currentPage={currentPage} />}
            {currentPage === "Help" && <HomePage currentPage={currentPage} />}
            {currentPage === "FAQ" && <HomePage currentPage={currentPage} />}
            {currentPage === "Powerwatch" && <HomePage currentPage={currentPage} />}
          </main>
        </Col>
      </div>
    </>
  );
};

export default Home;
