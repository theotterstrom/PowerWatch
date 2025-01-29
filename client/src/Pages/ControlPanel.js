import React, { useState, useEffect, useMemo } from "react";
import { Container, Navbar, Nav, NavDropdown, Row, Col, Tab, Tabs, Dropdown } from "react-bootstrap";
import apiUrl from '../Components/Helpers/APIWrapper'
import axios from 'axios';
import ControlPanelPop from '../Components/Children/ControlPanelChildren/ControlPanelPop';
import Devices from "../Components/Children/ControlPanelChildren/Devices";
import Groups from "../Components/Children/ControlPanelChildren/Groups";
import Cloud from "../Components/Children/ControlPanelChildren/Cloud";
import Header from "../Components/Children/NavBar";

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

const NewNavBar = React.memo(() => {
  return <Header />
})

const ControlPanel = () => {
  const [devices, setDevices] = useState([]);
  const [showWindow, setShowWindow] = useState(true);
  const [method, setMethod] = useState(null);
  const [mobileShow, setMobileShow] = useState("Device Settings");

  useEffect(() => {
    const fetchDevices = async () => {
      const deviceRes = await axios.get(`${apiUrl}/devices`, {
        withCredentials: true
      });
      setDevices(deviceRes.data);
    };
    fetchDevices();
  }, []);

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
      <NewNavBar />

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