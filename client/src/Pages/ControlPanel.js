import React, { useState, useEffect, useMemo } from "react";
import { Container, Navbar, Nav, NavDropdown, Row, Col, Tab, Tabs, Dropdown } from "react-bootstrap";
import apiUrl from '../Components/Helpers/APIWrapper'
import axios from 'axios';
import ControlPanelPop from '../Components/Children/ControlPanelPop';
import Devices from "../Components/Children/ControlPanelChildren/Devices";
import Groups from "../Components/Children/ControlPanelChildren/Groups";
import Cloud from "../Components/Children/ControlPanelChildren/Cloud";
import { useNavigate } from 'react-router-dom';

const PopUp = React.memo(({ showWindow, method, devices, setDevices }) => {
  return <ControlPanelPop showWindow={showWindow} method={method} devices={devices} setDevices={setDevices} />
});

const DeviceSettings = React.memo(({ showPopUp, devices }) => {
  const initData = useMemo(() => ({ showPopUp, devices }), [showPopUp, devices]);
  return <Devices initData={initData} />
});

const GroupSettings = React.memo(({ showPopUp, groups }) => {
  const initData = useMemo(() => ({ showPopUp, groups }), [showPopUp, groups]);
  return <Groups initData={initData} />
});

const CloudSettings = React.memo(() => {
  return <Cloud />
});

const ControlPanel = () => {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);
  const [devices, setDevices] = useState([]);
  const [showWindow, setShowWindow] = useState(true);
  const [method, setMethod] = useState(null);

  const [mobileShow, setMobileShow] = useState("Device Settings");

  const navbarToggle = () => setExpanded(!expanded);

  useEffect(() => {
    const fetchDevices = async () => {
      const deviceRes = await axios.get(`${apiUrl}/devices`, {
        withCredentials: true
      });
      setDevices(deviceRes.data);
    };

    fetchDevices();

  }, []);

  if (Object.keys(devices).length === 0) {
    return <>
      <div className="loading-container">
        <div className="loading-circle"></div>
        <img className="backgroundBlock" src="/images/power.jpg" />
        <div className="backgroundBlock"></div>
      </div>
    </>;
  };

  const showPage = (page) => {
    
    navigate('/energywatch', { state: { pageSet: page } });
  };
  
  


  const showPopUp = (method) => {
    setShowWindow(true)
    setMethod(method)
  };


  const groups = devices.reduce((acc, cur) => {
    if (cur.group) {
      for (const group of cur.group) {
        if (acc[group]) {
          acc[group].push(cur.displayName)
        } else {
          acc[group] = [cur.displayName]
        }
      }
    }
    return acc;
  }, {});

  return (<>
    {/* Header */}
    <Navbar
      style={{
        backgroundColor: "rgb(0, 34, 102)",
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        zIndex: 100,
      }}
      variant="dark"
      expand="lg"
      expanded={expanded}
      onToggle={navbarToggle}
    >
      <Container>
        <Navbar.Brand onClick={() => showPage("power")} style={{ cursor: "pointer" }}>
          <img style={{ height: "40px" }} src="/images/new1.png" alt="EnergyWatch Logo" />
          &nbsp;EnergyWatch
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
            <NavDropdown className="custom-dropdown" title="More" id="nav-dropdown" style={{ color: "white" }}>
              <NavDropdown.Item style={{ backgroundColor: "#002266", color: "white" }} onClick={() => showPowerHourFunc()}>
                Set power hours
              </NavDropdown.Item>
              <NavDropdown.Item style={{ backgroundColor: "#002266", color: "white" }} onClick={() => showPage("control")}>
                Control Panel
              </NavDropdown.Item>
              <NavDropdown.Item className="mt-2" style={{ backgroundColor: "#002266", color: "white" }} onClick={() => handleLogout()}>
                Log Out
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>

    <img className="backgroundBlock" src="/images/power.jpg" />
    <div className="backgroundBlock"></div>

    <Container className="mt-4 container-fluid savings pt-5 pb-5 mainContainer">
      {window.innerWidth <= 768 ? <>

        <main>
          <Container className="m-0">
            <Row className="justify-content-center text-center mt-4">
              <h3>Control Panel</h3>
            </Row>
            <Row className="justify-content-center mt-4">
              <Col xs={10}>
                <Dropdown
                  style={{ backgroundColor: "#f8f9fa", borderRadius: "5px" }}
                  onSelect={(eventKey) => setMobileShow(eventKey)}
                >
                  <Dropdown.Toggle variant="light" style={{ width: "100%", textAlign: "start" }}>
                    {mobileShow !== "start" ? mobileShow : "Select Panel"}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item eventKey="Device Settings">Device Settings</Dropdown.Item>
                    <Dropdown.Item eventKey="Group Settings">Group Settings</Dropdown.Item>
                    <Dropdown.Item eventKey="Cloud Settings">Cloud Settings</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </Col>
            </Row>
          </Container>
          {mobileShow === "Device Settings" &&
            <Container className="controlPanelContainer">
              <DeviceSettings devices={devices} showPopUp={showPopUp} />
            </Container>
          }
          {mobileShow === "Group Settings" &&
            <Container className="controlPanelContainer">
              <GroupSettings groups={groups} showPopUp={showPopUp} />
            </Container>
          }
          {mobileShow === "Cloud Settings" &&
            <Container className="controlPanelContainer">
              <CloudSettings />
            </Container>}
        </main>

      </> : <>
        <Row className="justify-content-center">
          <Col md={10} lg={8} className="p-0">
            <Container className="p-0 mt-4">
              <Tabs defaultActiveKey="devices" id="devices-tabs" style={{ borderBottom: "0" }}>
                <Tab eventKey="devices" title="Devices" className="controlPanelContainer">
                  <DeviceSettings devices={devices} showPopUp={showPopUp} />
                </Tab>
                <Tab eventKey="deviceGroups" title="Device Groups" className="controlPanelContainer">
                  <GroupSettings groups={groups} showPopUp={showPopUp} />
                </Tab>
                <Tab eventKey="cloudSettings" title="Cloud Settings" className="controlPanelContainer">
                  <CloudSettings />
                </Tab>
              </Tabs>
            </Container>
          </Col>
        </Row>
      </>}

    </Container>
    <main>
      {showWindow && <PopUp showWindow={setShowWindow} method={method} devices={devices} setDevices={setDevices} />}
    </main>
  </>
  );
};
export default ControlPanel;