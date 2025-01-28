import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Container, Navbar, Nav, NavDropdown } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import "chart.js/auto";
import Power from "../Components/Children/Power";
import Savings from "../Components/Children/Savings";
import Scheduele from "../Components/Children/Scheduele";
import PowerHour from "../Components/Children/PowerHour";
import apiUrl from '../Components/Helpers/APIWrapper'
import LogOut from "../Components/Children/LogOut";
import { useLocation, useNavigate } from 'react-router-dom';

import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';


const PowerChild = React.memo(({ readings, temps, devices }) => {
  const initData = useMemo(() => ({ readings, temps, devices }), [readings, temps, devices])
  return <Power initData={initData} />
});

const SavingsChild = React.memo(({ savings, devices }) => {
  const initData = useMemo(() => ({ savings, devices }), [savings, devices]);
  return <Savings initData={initData} />;
});

const SchedueleChild = React.memo(({ schedueles, prices, devicestatuses, devices }) => {
  const initData = useMemo(() => ({ schedueles, prices, devicestatuses, devices }), [schedueles, prices, devicestatuses, devices]);
  return <Scheduele initData={initData} />;
});

const PowerHourChild = React.memo(({ powerhour, togglePowerHour, devices }) => {
  const initData = useMemo(() => ({ powerhour, togglePowerHour, devices }));
  return <PowerHour initData={initData} />
});

const LogOutChild = React.memo(({ logout, togglelogout }) => {
  const initData = useMemo(() => ({ logout, togglelogout }));
  return <LogOut initData={initData} />
});

const EnergyWatch = () => {
  const location = useLocation();
  const navigate = useNavigate();
  let pageSet = location?.state?.pageSet;
  const [expanded, setExpanded] = useState(false);
  const [currentPage, setCurrentPage] = useState(pageSet ?? "power");

  const [showPowerHour, setShowPowerHour] = useState(false);
  const [showLogOut, setShowLogOut] = useState(false);

  const [savings, setSavings] = useState([]);
  const [prices, setPrices] = useState([]);
  const [schedueles, setSchedueles] = useState([]);
  const [temps, setTemps] = useState([]);
  const [readings, setReadings] = useState([]);
  const [powerHour, setPowerHour] = useState({});
  const [devices, setDevices] = useState([]);
  const [deviceStatuses, setDeviceStatuses] = useState([]);

  const apiData = useMemo(() => ({
    savingsState: { value: savings, set: setSavings },
    pricesState: { value: prices, set: setPrices },
    scheduelesState: { value: schedueles, set: setSchedueles },
    tempsState: { value: temps, set: setTemps },
    readingsState: { value: readings, set: setReadings },
    devicestatusesState: { value: deviceStatuses, set: setDeviceStatuses },
    powerhour: { value: powerHour, set: setPowerHour },
    devices: { value: devices, set: setDevices }
  }), [savings, prices, schedueles, temps, readings, deviceStatuses, powerHour, devices]);



  const navbarToggle = () => setExpanded(!expanded);

  const showPage = (page) => {
    if(page === "control"){
      window.location.href = window.location.href.replace(/\/[^/]*$/, "") + "/controlpanel";
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

  useEffect(() => {
    navigate('/energywatch', { state: { pageSet: currentPage } });
  }, [currentPage]);

  useEffect(() => {
    const run = async () => {
      try {
/*         const storedPrices = localStorage.getItem("prices");
        const storedSchedueles = localStorage.getItem("schedueles");
        const storedDeviceStatuses = localStorage.getItem("devicestatuses");
        const storedSavings = localStorage.getItem("savings");
        const storedReadings = localStorage.getItem("readings");
        const storedTemps = localStorage.getItem("temps");
        const storedPowerHour = localStorage.getItem("powerhour");
        const storedDevices = localStorage.getItem("devices");
        const allContent = 
        storedPrices.length > 0 && 
        storedDeviceStatuses.length > 0 && 
        storedSavings.length > 0 && 
        storedReadings.length > 0 && 
        storedTemps.length > 0 && 
        storedPowerHour.length > 0 && 
        storedDevices.length > 0;



        if (allContent && storedPrices && storedSchedueles && storedDeviceStatuses && storedSavings && storedReadings && storedTemps && storedPowerHour && storedDevices) {
          setPrices(JSON.parse(storedPrices));
          setSchedueles(JSON.parse(storedSchedueles));
          setDeviceStatuses(JSON.parse(storedDeviceStatuses));
          setSavings(JSON.parse(storedSavings));
          setReadings(JSON.parse(storedReadings));
          setTemps(JSON.parse(storedTemps));
          setPowerHour(JSON.parse(storedPowerHour));
          return;
        }; */

        const urlList = ["prices", "schedueles", "devicestatuses", "getcurrenthour", "devices"];
        const [pricesRes, scheduelesRes, deviceStatusRes, powerhourRes, deviceRes] = await Promise.all(
          urlList.map((name) => axios.get(`${apiUrl}/${name}`, {
            withCredentials: true
          }))
        );

        const paginationUrls = ["savings?offset=", "readings?offset=", "temperatures?offset="];
        let ackReqs = {
          savings: [],
          readings: [],
          temps: [],
        };

        for (let i = 0; true; i += 400) {
          const [offSetSavings, offSetReadings, offSetTemps] = await Promise.all(
            paginationUrls.map((url) => axios.get(`${apiUrl}/${url}${i}`, {
              withCredentials: true
            }))
          );
          if ([offSetSavings, offSetReadings, offSetTemps].every((req) => req.data.length === 0)) {
            break;
          }
          ackReqs.savings = ackReqs.savings.concat(offSetSavings.data);
          ackReqs.readings = ackReqs.readings.concat(offSetReadings.data);
          ackReqs.temps = ackReqs.temps.concat(offSetTemps.data);
        };

        setPrices(pricesRes.data);
        setSchedueles(scheduelesRes.data);
        setDeviceStatuses(deviceStatusRes.data);
        setDevices(deviceRes.data);
        setPowerHour({
          ...powerhourRes.data,
          secret: ''
        });
        setSavings(ackReqs.savings.reverse());
        setReadings(ackReqs.readings.reverse());
        setTemps(ackReqs.temps);

        localStorage.setItem("prices", JSON.stringify(pricesRes.data));
        localStorage.setItem("schedueles", JSON.stringify(scheduelesRes.data));
        localStorage.setItem("devicestatuses", JSON.stringify(deviceStatusRes.data));
        localStorage.setItem("savings", JSON.stringify(ackReqs.savings.reverse()));
        localStorage.setItem("readings", JSON.stringify(ackReqs.readings.reverse()));
        localStorage.setItem("temps", JSON.stringify(ackReqs.temps));
        localStorage.setItem("devices", JSON.stringify(deviceRes.data));
        localStorage.setItem("powerhour", JSON.stringify(powerhourRes.data));
      } catch (e) {
        console.error("Error fetching data:", e);
      }
    };
    run();
  }, []);

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

  if (Object.keys(readings).length === 0 || Object.keys(savings).length === 0) {
    return <>
      <div className="loading-container">
        <div className="loading-circle"></div>
        <img className="backgroundBlock" src="/images/power.jpg" />
        <div className="backgroundBlock"></div>
      </div>
    </>;
  };

  const verticalLinePlugin = {
    id: 'verticalLinePlugin',
    beforeDraw: (chart) => {
      const toolTipContainer = document.getElementsByClassName("toolTipContainer")[0];
      if (chart.tooltip._active && chart.tooltip._active.length) {
        const ctx = chart.ctx;
        const activePoint = chart.tooltip._active[0];
        const x = activePoint.element.x;
        const topY = chart.scales.y.top;
        const bottomY = chart.scales.y.bottom;
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(x, topY);
        ctx.lineTo(x, bottomY);
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'gray';
        ctx.setLineDash([5, 5]);
        ctx.stroke();
        ctx.restore();
        toolTipContainer.style.display = "block"
      } else {
        toolTipContainer.style.display = "none"
      }
    },
  };
  ChartJS.register(LineElement, PointElement, LinearScale, Title, Tooltip, Legend, verticalLinePlugin);

  window.addEventListener("touchend", () => {
    const toolTipContainer = document.getElementsByClassName("toolTipContainer")[0];
    if(!toolTipContainer) return;
    setTimeout(() => {
      toolTipContainer.style.display = "none"
    }, 200)
  });

  return (
    <div>
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
            &nbsp;PowerWatch
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

      <main>
        {currentPage === "power" && <PowerChild readings={apiData.readingsState} temps={apiData.tempsState} devices={apiData.devices} />}
        {currentPage === "savings" && <SavingsChild savings={apiData.savingsState} devices={apiData.devices}/>}
        {currentPage === "scheduele" && <SchedueleChild schedueles={apiData.scheduelesState} prices={apiData.pricesState} devicestatuses={apiData.devicestatusesState} devices={apiData.devices} />}
        {showPowerHour && <PowerHourChild powerhour={apiData.powerhour} togglePowerHour={setShowPowerHour} devices={apiData.devices}/>}
        {showLogOut && <LogOutChild logout={showLogOut} togglelogout={setShowLogOut} />}
      </main>
    </div>
  );
};

export default EnergyWatch;
