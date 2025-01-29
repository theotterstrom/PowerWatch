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

const NavBarChild = React.memo(({ setCurrentPage }) => {
  const states = useMemo(() => ({ setCurrentPage }), [setCurrentPage]);
  return <NavBar states={states} />
})

const EnergyWatch = () => {

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
        const storedDevices = localStorage.getItem("devices");
        const allContent = 
        storedPrices.length > 0 && 
        storedDeviceStatuses.length > 0 && 
        storedSavings.length > 0 && 
        storedReadings.length > 0 && 
        storedTemps.length > 0 && 
        storedDevices.length > 0;

        if (allContent && storedPrices && storedSchedueles && storedDeviceStatuses && storedSavings && storedReadings && storedTemps  && storedDevices) {
          setPrices(JSON.parse(storedPrices));
          setSchedueles(JSON.parse(storedSchedueles));
          setDeviceStatuses(JSON.parse(storedDeviceStatuses));
          setSavings(JSON.parse(storedSavings));
          setReadings(JSON.parse(storedReadings));
          setTemps(JSON.parse(storedTemps));
          return;
        }; */

        const urlList = ["prices", "schedueles", "devicestatuses", "devices"];
        const [pricesRes, scheduelesRes, deviceStatusRes, deviceRes] = await Promise.all(
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
      } catch (e) {
        console.error("Error fetching data:", e);
      }
    };
    run();
  }, []);

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
      <NavBarChild setCurrentPage={setCurrentPage} />
      <img className="backgroundBlock" src="/images/power.jpg" />
      <div className="backgroundBlock"></div>
      <main>
        {currentPage === "power" && <PowerChild readings={apiData.readingsState} temps={apiData.tempsState} devices={apiData.devices} />}
        {currentPage === "savings" && <SavingsChild savings={apiData.savingsState} devices={apiData.devices}/>}
        {currentPage === "scheduele" && <SchedueleChild schedueles={apiData.scheduelesState} prices={apiData.pricesState} devicestatuses={apiData.devicestatusesState} devices={apiData.devices} />}
      </main>
    </div>
  );
};

export default EnergyWatch;
