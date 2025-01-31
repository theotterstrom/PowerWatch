import React, { useState, useEffect, useMemo } from "react";
import { Container, Navbar, Nav, NavDropdown, Row, Col, Tab, Tabs, Dropdown } from "react-bootstrap";
import apiUrl from '../Components/Helpers/APIWrapper'
import axios from 'axios';
import ControlPanelPop from '../Components/Children/ControlPanelChildren/ControlPanelPop';
import Devices from "../Components/Children/ControlPanelChildren/Devices";
import Groups from "../Components/Children/ControlPanelChildren/Groups";
import Cloud from "../Components/Children/ControlPanelChildren/Cloud";
import Header from "../Components/Children/NavBar";

const PopUp = React.memo(({ showWindow, method, devices, setDevices, identifier }) => {
  return <ControlPanelPop showWindow={showWindow} method={method} devices={devices} setDevices={setDevices} identifier={identifier} />
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
  const [showWindow, setShowWindow] = useState(false);
  const [method, setMethod] = useState(null);
  const [mobileShow, setMobileShow] = useState("Device Settings");
  const [fill, setFill] = useState(window.innerWidth < 768);
  const [identifier, setIdentifier] = useState(null);

  useEffect(() => {
    const handleResize = () => {
      setFill(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const fetchDevices = async () => {
      const deviceRes = await axios.get(`${apiUrl}/devices`, {
        withCredentials: true
      });
      setDevices(deviceRes.data);
    };
    fetchDevices();
  }, []);

  const showPopUp = (method, identifier) => {
    setShowWindow(true);
    setMethod(method);
    setIdentifier(identifier);
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
    <Container className="mt-4 container-fluid power pt-5 pb-5 mainContainer">
      <Row className="justify-content-center">
        <Col xl={8} lg={10} md={12} className="p-0">
          <Container className="p-0 justify-content-center">
            <Container className="container-fluid d-flex justify-content-center">
              <Col xl={12} lg={12} md={12} sm={8} xs={8} className="text-center text-lg-start">
                <h3 className="mt-3">Control Panel</h3>
              </Col>
            </Container>
            <Container className="mt-md-5 mt-4">
              <Tabs defaultActiveKey="devices" id="devices-tabs" style={{ borderBottom: "0" }} className="tabHolder" fill={fill}>
                <Tab eventKey="devices" title="Devices" className="ctrlContainer p-md-4 p-2">
                  <DeviceSettings devices={devices} showPopUp={showPopUp} />
                </Tab>
                <Tab eventKey="deviceGroups" title="Device Groups" className="ctrlContainer p-md-4 p-2">
                  <GroupSettings groups={groups} showPopUp={showPopUp} />
                </Tab>
                <Tab eventKey="cloudSettings" title="Cloud Settings" className="ctrlContainer p-md-4 p-2">
                  <CloudSettings />
                </Tab>
              </Tabs>
            </Container>
          </Container>
        </Col>
      </Row>
    </Container>
    <main>
      {showWindow && <PopUp showWindow={setShowWindow} method={method} devices={devices} setDevices={setDevices} identifier={identifier} />}
    </main>
  </>
  );
};
export default ControlPanel;