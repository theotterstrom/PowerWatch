import React, { useState, useEffect, useMemo } from "react";
import { Container, Navbar, Nav, NavDropdown } from "react-bootstrap";
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

    const [showPowerHour, setShowPowerHour] = useState(false);
    const [powerHour, setPowerHour] = useState([]);
    const [devices, setDevices] = useState([]);
    const [expanded, setExpanded] = useState(false);
    const [showLogOut, setShowLogOut] = useState(false);

    if (!setCurrentPage) {
        setCurrentPage = (page) => {
            navigate('/energywatch', { state: { pageSet: page } });
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
        fetchData();
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
        <Navbar
            style={{
                backgroundColor: "#004786",
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                zIndex: 10000,
                borderBottomLeftRadius: "10px",
                borderBottomRightRadius: "10px",
            }}
            className="headerBar"
            variant="dark"
            expand="lg"
            expanded={expanded}
            onToggle={() => setExpanded(!expanded)}
        >
            <Container>
                <Navbar.Brand onClick={() => showPage("power")} style={{ cursor: "pointer" }}>
                    <div className="titleHolder">
                        <img style={{ height: "40px" }} src="/images/new1.png" alt="EnergyWatch Logo" />
                        &nbsp;powerwatch
                    </div>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="navbar-nav" className="navBarButton" />
                <Navbar.Collapse id="navbar-nav" className="ms-lg-5">
                    <Nav className="me-auto">
                        <Nav.Link onClick={() => showPage("power")} style={{ color: "white" }}>
                            Power & Temperature
                        </Nav.Link>
                        <Nav.Link onClick={() => showPage("savings")} style={{ color: "white" }} className="ms-lg-2">
                            Savings
                        </Nav.Link>
                        <Nav.Link onClick={() => showPage("scheduele")} style={{ color: "white" }} className="ms-lg-2">
                            Prices & Schedules
                        </Nav.Link>
                        <NavDropdown className="custom-dropdown menumore" title="More" id="nav-dropdown" style={{ color: "white" }}>
                            <NavDropdown.Item style={{ backgroundColor: "#004786", color: "white" }} onClick={() => showPowerHourFunc()}>
                                Set power hours
                            </NavDropdown.Item>
                            <NavDropdown.Item style={{ backgroundColor: "#004786", color: "white" }} onClick={() => showPage("control")} className="mt-2">
                                Control Panel
                            </NavDropdown.Item>
                            <NavDropdown.Item className="mt-2" style={{ backgroundColor: "#004786", color: "white" }} onClick={() => handleLogout()}>
                                Log Out
                            </NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
        <main>
            {showPowerHour && <PowerHourChild powerhour={apiData.powerhour} togglePowerHour={setShowPowerHour} devices={apiData.devices} />}
            {showLogOut && <LogOutChild logout={showLogOut} togglelogout={setShowLogOut} />}
        </main>
    </>)
};