import React, { useState, useEffect, useMemo } from "react";
import { Container, Navbar, Nav, NavDropdown, Col, Row, Dropdown, Button, Fade } from "react-bootstrap";
import { useNavigate, useLocation } from 'react-router-dom';
import axios from "axios";
import apiUrl from "../Helpers/APIWrapper";
import PowerHour from "./PowerHour";
import LogOut from "./LogOut";

const PowerHourChild = React.memo(({ powerhour, togglePowerHour, devices }) => {
    const initData = useMemo(() => ({ powerhour, togglePowerHour, devices }), [powerhour, togglePowerHour, devices]);
    return <PowerHour initData={initData} />
});

const LogOutChild = React.memo(({ logout, togglelogout }) => {
    const initData = useMemo(() => ({ logout, togglelogout }), [logout, togglelogout]);
    return <LogOut initData={initData} />
});

export default ({ states }) => {
    const navigate = useNavigate();
    const location = useLocation();
    let setCurrentPage = states?.setCurrentPage;
    const isAuthenticated = states?.isAuthenticated;
    const setCurrentHomePage = states?.setCurrentHomePage;

    const [showPowerHour, setShowPowerHour] = useState(false);
    const [powerHour, setPowerHour] = useState([]);
    const [devices, setDevices] = useState([]);
    const [expanded, setExpanded] = useState(false);
    const [showLogOut, setShowLogOut] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [showContactDropdown, setShowContactDropdown] = useState(false);
    const [showDashDropdown, setShowDashDropdown] = useState(false);
    const [showControl, setShowControl] = useState(false);

    if (!setCurrentPage) {
        setCurrentPage = (page) => {
            navigate('/monitor', { state: { pageSet: page } });
        };
    };
    useEffect(() => {
        const fetchData = async () => {
            const urlList = ["getcurrenthour", "devices"];
            const [powerhourRes, deviceRes] = await Promise.all(
                urlList.map((name) => axios.get(`${apiUrl}/${name}`, {
                    withCredentials: true
                }))
            );
            setDevices(deviceRes.data);
            setPowerHour(powerhourRes.data[0]);
        };
        if (isAuthenticated) {
            fetchData();
        };
    }, []);


    const apiData = useMemo(() => ({
        powerhour: { value: powerHour, set: setPowerHour },
        devices: { value: devices, set: setDevices }
    }), [powerHour, devices]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            const dropDownElement = document.getElementsByClassName("navBarButton")[0];
            const navbarContent = document.getElementById("navbar-nav");
            if (
                expanded &&
                dropDownElement &&
                navbarContent &&
                !dropDownElement.contains(e.target) &&
                !navbarContent.contains(e.target)
            ) {
                setExpanded(false);
            };
        };
        window.addEventListener("click", handleClickOutside);
        return () => {
            window.removeEventListener("click", handleClickOutside);
        };
    }, [expanded]);
    const showPage = (page) => {
        if (page === "control") {
            if (location.pathname.split("/").pop() !== "controlpanel") {
                navigate('/controlpanel');
            } else {
                setExpanded(false);
            }
        } else {
            setExpanded(false);
            setCurrentPage(page);
        };
    };
    const showPowerHourFunc = () => {
        setExpanded(false);
        setShowPowerHour(true);
    };
    const handleLogout = () => {
        setExpanded(false);
        setShowLogOut(true)
    };

    return (<>
        <div className="d-flex justify-content-center m-0 p-0 position-fixed" style={{ zIndex: 100, width: "100vw" }}>
            <Col xl={8} md={10} xs={11} className="m-0 p-0">
                <Navbar className="headerBar px-3 p-0" expand="lg" expanded={expanded} onToggle={() => setExpanded(!expanded)}>
                    <Navbar.Brand onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
                        <div className="titleHolder d-sm-block d-none">
                            <img style={{ height: "40px" }} src="/images/PW 1.png" alt="EnergyWatch Logo" />
                        </div>
                        
                        <div className="titleHolder d-sm-none d-block">
                            <img style={{ height: "40px" }} src="/images/p.png" alt="EnergyWatch Logo" />
                        </div>
                    </Navbar.Brand>
                    {isAuthenticated ? <>
                        <Navbar.Toggle aria-controls="navbar-nav" className="navBarButton" />
                        <Navbar.Collapse id="navbar-nav" className="ms-lg-5" >

                            {/*  X Large */}
                            <Container className="d-lg-block d-none">
                                <Row className="justify-content-start">
                                    {/* Start */}
                                    <div style={{ width: "100px" }} className="mx-3 p-0 m-0">
                                        <Dropdown show={showDropdown} onToggle={(isOpen) => setShowDropdown(isOpen)} style={{ width: "100%", overflow: "visible" }}>
                                            <Dropdown.Toggle variant="transparent" id="dropdown-basic" style={{ fontWeight: "bold", letterSpacing: "4px", fontSize: "16px", color: "white" }} className="startToggle ">
                                                Start {showDropdown ? <i className="fa-solid fa-caret-up"></i> : <i className="fa-solid fa-caret-down"></i>}
                                            </Dropdown.Toggle>
                                            <Dropdown.Menu className="mt-3 p-3" style={{ width: "350px", background: "var(--newBlue2)", color: "white" }} >
                                                <Row style={{ fontWeight: "bold", fontSize: "16px" }}>
                                                    <Col>
                                                        <p>Allmänt</p>
                                                        <Row>
                                                            <Button onClick={() => {
                                                                setShowDropdown(false); // Collapse dropdown
                                                                setCurrentHomePage("Start");
                                                            }} className="m-0 text-start menuButton" variant="transparent" style={{ fontWeight: "bold", letterSpacing: "4px", color: "white" }}>
                                                                <i className="fa fa-info-circle" aria-hidden="true"></i>&nbsp; Info
                                                            </Button>

                                                        </Row>
                                                    </Col>
                                                    <Col>
                                                        <p>Konto</p>
                                                        <Row>
                                                            <Button
                                                                onClick={() => showPage("myaccount")} className="m-0 text-start menuButton" variant="transparent" style={{ fontWeight: "bold", letterSpacing: "4px", color: "white" }}>
                                                                <i className="fa fa-user" aria-hidden="true"></i>&nbsp; Mitt konto
                                                            </Button>

                                                        </Row>
                                                    </Col>
                                                </Row>
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </div>
                                    {/* Dashboards */}
                                    <div style={{ width: "170px" }} className="mx-3 p-0 m-0">
                                        <Dropdown show={showDashDropdown} onToggle={(isOpen) => setShowDashDropdown(isOpen)} style={{ width: "100%", overflow: "visible" }}>
                                            <Dropdown.Toggle variant="transparent" id="dropdown-basic" style={{ fontWeight: "bold", letterSpacing: "4px", fontSize: "16px", color: "white" }} className="startToggle">
                                                Dashboards {showDashDropdown ? <i className="fa-solid fa-caret-up"></i> : <i className="fa-solid fa-caret-down"></i>}
                                            </Dropdown.Toggle>
                                            <Dropdown.Menu className="mt-3 p-3" style={{ width: "300px", background: "var(--newBlue2)", color: "white" }}>
                                                <Row style={{ fontWeight: "bold", fontSize: "20px" }}>
                                                    <Button onClick={() => showPage("power")} className="text-start menuButton" variant="transparent" style={{ fontWeight: "bold", letterSpacing: "4px", color: "white" }}>
                                                        <i className="fa-solid fa-bolt"></i>&nbsp; Energi & Temperatur
                                                    </Button>
                                                    <Button onClick={() => showPage("savings")} className="text-start menuButton m-1" variant="transparent" style={{ fontWeight: "bold", letterSpacing: "4px", color: "white" }}>
                                                        <i className="fa-solid fa-dollar-sign"></i>&nbsp; Kostnader
                                                    </Button>
                                                    <Button onClick={() => showPage("scheduele")} className=" text-start menuButton" variant="transparent" style={{ fontWeight: "bold", letterSpacing: "4px", color: "white" }}>
                                                        <i className="fa-solid fa-calendar-days"></i>&nbsp; Scheman & Dagspriser
                                                    </Button>
                                                </Row>
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </div>
                                    {/* Kontroller */}
                                    <div style={{ width: "120px" }} className="mx-1 p-0 m-0">
                                        <Dropdown show={showControl} onToggle={(isOpen) => setShowControl(isOpen)} style={{ width: "100%", overflow: "visible" }}>
                                            <Dropdown.Toggle variant="transparent" id="dropdown-basic" style={{ fontWeight: "bold", letterSpacing: "4px", fontSize: "16px", color: "white" }} className="startToggle">
                                                Kontroller {showControl ? <i className="fa-solid fa-caret-up"></i> : <i className="fa-solid fa-caret-down"></i>}
                                            </Dropdown.Toggle>
                                            <Dropdown.Menu className="mt-3 p-3" style={{ width: "250px", background: "var(--newBlue2)", color: "white" }}>
                                                <Row style={{ fontWeight: "bold", fontSize: "20px" }}>
                                                    <Button onClick={() => showPowerHourFunc()} className="text-start menuButton" variant="transparent" style={{ fontWeight: "bold", letterSpacing: "4px", color: "white" }}>
                                                        <i className="fa-solid fa-hourglass-start"></i>&nbsp; Sätt scheman
                                                    </Button>
                                                    <Button onClick={() => showPage("control")} className="text-start menuButton" variant="transparent" style={{ fontWeight: "bold", letterSpacing: "4px", color: "white" }}>
                                                        <i className="fa-solid fa-gear"></i>&nbsp; Kontrollpanel
                                                    </Button>
                                                </Row>
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </div>
                                </Row>
                            </Container>

                            {/* Small */}
                            <div className="d-lg-none d-block mt-2">
                                <Nav className="me-auto">

                                    <Nav.Link onClick={() => {
                                        setExpanded(false)
                                        setCurrentHomePage("Start")
                                    }} style={{ color: "white" }} >
                                        &nbsp;Info
                                        
                                    </Nav.Link>
                                    <div style={{borderBottom: "1px solid rgba(255, 255, 255, 0.45)", height: "1px", width: "100%"}} className="my-2"></div>

                                    <Nav.Link onClick={() => showPage("myaccount")} style={{ color: "white" }}>
                                    &nbsp;Mitt konto
                                    </Nav.Link>
                                    <div style={{borderBottom: "1px solid rgba(255, 255, 255, 0.45)", height: "1px", width: "100%"}} className="my-2"></div>

                                    <NavDropdown onClick={()=> setShowDashDropdown(!showDashDropdown)}  className="custom-dropdown menumore" title={<span style={{ color: "white", fontWeight: "bold" }}> &nbsp;Dashboards {showDashDropdown ? <i className="fa-solid fa-caret-up"></i> : <i className="fa-solid fa-caret-down"></i>}</span>}>
                                        <NavDropdown.Item style={{ backgroundColor: "#004786", color: "white" }} onClick={() => showPage("power")}>
                                            <i className="fa-solid fa-bolt"></i>&nbsp; <b>Energi & Temperatur</b>
                                        </NavDropdown.Item>
                                        <NavDropdown.Item style={{ backgroundColor: "#004786", color: "white" }} onClick={() => showPage("savings")} className="my-2">
                                            <i className="fa-solid fa-dollar-sign"></i>&nbsp; <b>Kostnader</b>
                                        </NavDropdown.Item>
                                        <NavDropdown.Item className="mt-2" style={{ backgroundColor: "#004786", color: "white" }} onClick={() => showPage("schedueles")}>
                                            <i className="fa-solid fa-calendar-days"></i>&nbsp; <b>Scheman & Dagspriser</b>
                                        </NavDropdown.Item>
                                    </NavDropdown>
                                    <div style={{borderBottom: "1px solid rgba(255, 255, 255, 0.45)", height: "1px", width: "100%"}} className="my-2"></div>

                                    <NavDropdown onClick={()=> setShowControl(!showControl)}  className="custom-dropdown menumore" title={<span style={{ color: "white", fontWeight: "bold" }}> &nbsp;Kontroller {showControl ? <i className="fa-solid fa-caret-up"></i> : <i className="fa-solid fa-caret-down"></i>}</span>}>
                                        <NavDropdown.Item style={{ backgroundColor: "#004786", color: "white" }} onClick={() => showPowerHourFunc()}>
                                        <i className="fa-solid fa-hourglass-start"></i>&nbsp; <b>Sätt scheman</b>
                                        </NavDropdown.Item>
                                        <NavDropdown.Item style={{ backgroundColor: "#004786", color: "white" }} onClick={() => showPage("control")}>
                                        <i className="fa-solid fa-gear"></i>&nbsp; <b>Kontrollpanel</b>
                                        </NavDropdown.Item>
                                    </NavDropdown>

                                </Nav>
                            </div>
                        </Navbar.Collapse>
                    </> : <>

                        <Navbar.Toggle aria-controls="navbar-nav" className="navBarButton" />
                        <Navbar.Collapse id="navbar-nav" className="ms-lg-5">

                            <Container className="d-lg-block d-none">
                                <Row>
                                    <Col xl={3}>
                                        <Dropdown className="mt-2" show={showDropdown} onToggle={(isOpen) => setShowDropdown(isOpen)} style={{ width: "100%", overflow: "visible" }}>
                                            <Dropdown.Toggle variant="transparent" id="dropdown-basic" style={{ fontWeight: "bold", letterSpacing: "4px", fontSize: "22px", color: "white" }} className="startToggle">
                                                Kom igång
                                            </Dropdown.Toggle>
                                            <Dropdown.Menu className="mt-4 p-3" style={{ width: "350px", background: "var(--newBlue2)", color: "white" }}>
                                                <Row style={{ fontWeight: "bold", fontSize: "20px" }}>
                                                    <Col>
                                                        <p>Allmänt</p>
                                                        <Row>
                                                            <Button onClick={() => {
                                                                setShowDropdown(false); // Collapse dropdown
                                                                setCurrentHomePage("Start");
                                                            }} className="m-0 text-start menuButton" variant="transparent" style={{ fontWeight: "bold", letterSpacing: "4px", color: "white" }}>
                                                                <i className="fa fa-info-circle" aria-hidden="true"></i>&nbsp; Info
                                                            </Button>
                                                            <br />
                                                            <Button onClick={() => {
                                                                setShowDropdown(false);
                                                                setCurrentHomePage("Powerwatch");
                                                            }} className="m-0 my-3 text-start menuButton" variant="transparent" style={{ fontWeight: "bold", letterSpacing: "4px", color: "white" }}>
                                                                <i className="fa fa-search" aria-hidden="true"></i>&nbsp; Demo
                                                            </Button>
                                                        </Row>
                                                    </Col>
                                                    <Col>
                                                        <p>Konto</p>
                                                        <Row>
                                                            <Button onClick={() => {
                                                                setShowDropdown(false);
                                                                setCurrentHomePage("Logga in");
                                                            }} className="m-0 text-start menuButton" variant="transparent" style={{ fontWeight: "bold", letterSpacing: "4px", color: "white" }}>
                                                                <i className="fa fa-sign-in p-0 m-0" aria-hidden="true"></i>&nbsp; Logga in
                                                            </Button>
                                                            <Button onClick={() => {
                                                                setShowDropdown(false);
                                                                setCurrentHomePage("Registrera");
                                                            }} className="m-0 my-3 text-start menuButton" variant="transparent" style={{ fontWeight: "bold", letterSpacing: "4px", color: "white" }}>
                                                                <i className="fa fa-user-plus" aria-hidden="true"></i>&nbsp; Registrera
                                                            </Button>
                                                        </Row>
                                                    </Col>
                                                </Row>
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </Col>
                                    <Col xl={3}>
                                        <Dropdown className="mt-2" show={showContactDropdown} onToggle={(isOpen) => setShowContactDropdown(isOpen)} style={{ width: "100%", overflow: "visible" }}>
                                            <Dropdown.Toggle variant="transparent" id="dropdown-basic" style={{ fontWeight: "bold", letterSpacing: "4px", fontSize: "22px", color: "white" }} className="startToggle">
                                                Kontakt
                                            </Dropdown.Toggle>
                                            <Dropdown.Menu className="mt-4 p-3" style={{ width: "320px", background: "var(--newBlue2)", color: "white", cursor: "pointer" }} onClick={() => console.log("Hej")}>
                                                <Row style={{ fontWeight: "bold", fontSize: "20px" }}>
                                                    <Col xl={12}>
                                                        <i className="fa fa-envelope" aria-hidden="true"></i>&nbsp;info@powerwatch.se
                                                    </Col>
                                                </Row>
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </Col>
                                </Row>
                            </Container>

                            <Container className="d-lg-none d-block mt-3">
                                <Nav className="me-auto">
                                    <Nav.Link onClick={() => {
                                        setExpanded(false)
                                        setCurrentHomePage("Start")
                                    }} style={{ color: "white" }}>
                                        <i className="fa fa-info-circle" aria-hidden="true"></i>&nbsp; Info
                                    </Nav.Link>

                                    <Nav.Link onClick={() => {
                                        setExpanded(false);
                                        setCurrentHomePage("Logga in");
                                    }} style={{ color: "white" }}>
                                        <i className="fa fa-sign-in p-0 m-0" aria-hidden="true"></i>&nbsp; Logga in
                                    </Nav.Link>

                                    <Nav.Link onClick={() => {
                                        setExpanded(false);
                                        setCurrentHomePage("Registrera")
                                    }} style={{ color: "white" }}>
                                        <i className="fa fa-user-plus" aria-hidden="true"></i>&nbsp; Registrera
                                    </Nav.Link>

                                    <Nav.Link onClick={() => {
                                        setExpanded(false);
                                        setCurrentHomePage("Powerwatch")
                                    }} style={{ color: "white" }}>
                                        <i className="fa fa-search" aria-hidden="true"></i>&nbsp; Demo
                                    </Nav.Link>

                                </Nav>
                            </Container>
                        </Navbar.Collapse>
                    </>}
                </Navbar>
            </Col>
        </div>
        <main>
            {showPowerHour && <PowerHourChild powerhour={apiData.powerhour} togglePowerHour={setShowPowerHour} devices={apiData.devices} />}
            {showLogOut && <LogOutChild logout={showLogOut} togglelogout={setShowLogOut} />}
        </main>
    </>)
};