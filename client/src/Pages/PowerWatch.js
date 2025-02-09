import React, { useState, useEffect, useMemo } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import "chart.js/auto";
import Power from "../Components/Children/Power";
import Savings from "../Components/Children/Savings";
import Scheduele from "../Components/Children/Scheduele";
import apiUrl from '../Components/Helpers/APIWrapper'
import NavBar from "../Components/Children/NavBar";
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Row, Col } from "react-bootstrap";

import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  Title,
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

const NavBarChild = React.memo(({ setCurrentPage }) => {
  const states = useMemo(() => ({ setCurrentPage, isAuthenticated: true }), [setCurrentPage]);
  return <NavBar states={states} />
})

const PowerWatch = () => {

  const location = useLocation();
  const navigate = useNavigate();

  let pageSet = location?.state?.pageSet;

  const [currentPage, setCurrentPage] = useState(pageSet ?? "power");
  const [savings, setSavings] = useState([]);
  const [prices, setPrices] = useState([]);
  const [schedueles, setSchedueles] = useState([]);
  const [temps, setTemps] = useState([]);
  const [readings, setReadings] = useState([]);
  const [devices, setDevices] = useState([]);
  const [deviceStatuses, setDeviceStatuses] = useState([]);

  const apiData = useMemo(() => ({
    savingsState: { value: savings, set: setSavings },
    pricesState: { value: prices, set: setPrices },
    scheduelesState: { value: schedueles, set: setSchedueles },
    tempsState: { value: temps, set: setTemps },
    readingsState: { value: readings, set: setReadings },
    devicestatusesState: { value: deviceStatuses, set: setDeviceStatuses },
    devices: { value: devices, set: setDevices }
  }), [savings, prices, schedueles, temps, readings, deviceStatuses, devices]);

  useEffect(() => {
    navigate('/monitor', { state: { pageSet: currentPage } });
  }, [currentPage]);

  useEffect(() => {
    const run = async () => {
      try {
        const [initDataRes, deviceStatusRes] = await Promise.all([
          axios.get(`${apiUrl}/initdata`, {
            withCredentials: true
          }),
          axios.get(`${apiUrl}/devicestatuses`, {
            withCredentials: true
          })
        ])
        const [readings, savings, prices, schedules, tempreadings, devices] = initDataRes.data.data
        setPrices(prices);
        setSchedueles(schedules);
        setDeviceStatuses(deviceStatusRes.data);
        setDevices(devices);
        setSavings(savings.reverse());
        setReadings(readings.reverse());
        setTemps(tempreadings);
      } catch (e) {
        console.error("Error fetching data:", e);
      }
    };
    run();
  }, []);

  if (Object.keys(readings).length === 0 || Object.keys(savings).length === 0) {
    setTimeout(async () => {

    }, 30000);

    return <>
      <div className="loading-container">
        <div className="loading-circle"></div>
        <div className="backGroundHolder">
          <div className="backgroundBlock m-0 p-0">
          </div>
          <img src="/images/power.jpg" className="backgroundImg" alt="Home" />
        </div>
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

  ChartJS.register(LineElement, PointElement, LinearScale, Title, Legend, verticalLinePlugin);

  window.addEventListener("touchend", () => {
    const toolTipContainer = document.getElementById("chartjs-tooltip");
    if (!toolTipContainer) return;
    setTimeout(() => {
      toolTipContainer.style.display = "none"
    }, 200)
  });

  return (
    <>
      <NavBarChild setCurrentPage={setCurrentPage} />
      <div className="backGroundHolder">
        <div className="backgroundBlock m-0 p-0">
        </div>
        <img src="/images/power.jpg" className="backgroundImg" alt="Home" />
      </div>

      <div className="d-flex justify-content-center m-0 p-0"  style={{ zIndex: 100, width: "100vw", color: "white" }}>
        <Col xl={8} md={10} xs={11} className="mx-0 my-5 p-0">
            {currentPage === "power" && <PowerChild readings={apiData.readingsState} temps={apiData.tempsState} devices={apiData.devices} />}
            {currentPage === "savings" && <SavingsChild savings={apiData.savingsState} devices={apiData.devices} />}
            {currentPage === "scheduele" && <SchedueleChild schedueles={apiData.scheduelesState} prices={apiData.pricesState} devicestatuses={apiData.devicestatusesState} devices={apiData.devices} />}
        </Col>
      </div>

    </>
  );
};

export default PowerWatch;
