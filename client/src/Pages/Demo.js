import React, { useState, useEffect, useContext, useMemo } from "react";
import { Container, Row, Col, Form, Button, Tabs, Tab } from "react-bootstrap";
import requestMaker from "../Components/Helpers/MakeRequest";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import apiUrl from "../Components/Helpers/APIWrapper";
import NavBar from "../Components/Children/NavBar";
import HomePage from "../Components/Children/Home"

const NavBarChild = React.memo(({ isAuthenticated, setCurrentHomePage, page }) => {
    const initData = useMemo(() => ({ isAuthenticated, setCurrentHomePage, page }), [isAuthenticated, setCurrentHomePage, page]);
    return <NavBar states={initData} />
});


const Home = () => {
    const [currentPage, setCurrentHomePage] = useState("demo");
    const demoLogin = async () => {
        const response = await requestMaker({
            login1: "demo",
            login2: "demo"
        }, 'login', 'post');
        if (response?.data) {
            alert("Login successful!")
            navigate('/dashboards')
        } else {
            alert("Login failed")
        };
    };

    const navigate = useNavigate();

    return (
        <>
            <NavBarChild isAuthenticated={false} setCurrentHomePage={setCurrentHomePage} page={"demo"} />
            <div className="backGroundHolder">
                <div className="backgroundBlock m-0 p-0">
                </div>
                <img src="/images/power.jpg" className="backgroundImg" alt="Home" />
            </div>
            <div className="d-flex justify-content-center">
                <Col xl={8} md={10} xs={11} className="m-0 p-0">
                   <Container style={{marginTop: "10vh", color: "white"}}>
                    <h2>Demo for PowerWatch</h2>
                    <p>You will be logged in as a demo-user with random data to show the functionality of the website</p>
                    <Button onClick={demoLogin}>Start the demo</Button>
                   </Container>
                </Col>
            </div>
        </>
    );
};

export default Home;
