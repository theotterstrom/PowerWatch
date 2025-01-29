import generateSavingsData from "../Datagenerators/GenerateSavingsData";
import { Container, Row, Col } from "react-bootstrap";
import { Line } from "react-chartjs-2";
import SavingsOptions from "../Options/SavingsOptions";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import ToolTip from "./ToolTip";

const ToolTipChild = React.memo(({ chartStates, page }) => {
  const initData = useMemo(() => ({ chartStates, page }), [chartStates, page]);
  return <ToolTip initData={initData} />
});

const SavingsOptionsChild = React.memo(({ allDataStates, dateStates, devices }) => {
  const initData = useMemo(() => ({ allDataStates, dateStates, devices }), [allDataStates, dateStates, devices]);
  return <SavingsOptions initData={initData} />
});

export default ({ initData }) => {
  const { savings, devices } = initData;
  const deviceNames = devices.value.filter(obj => obj.deviceType === "Relay").map(obj => obj.deviceName)
  const stateObject = Object.fromEntries(deviceNames.map(obj => [obj, true]));

  const [states, setStates] = useState(stateObject);

  const today = new Date();
  const oneWeekAgoDate = new Date();
  oneWeekAgoDate.setDate(today.getDate() - 7);
  
  // States for date filtering savings
  const [savingStartDate, setSavingStartDate] = useState(oneWeekAgoDate.toISOString().split("T")[0]);
  const [savingEndDate, setSavingEndDate] = useState(new Date().toISOString().split("T")[0]);
  const [allsavingsDate, setAllSavingsDates] = useState(false);
  const [savingsMonth, setSavingsMonth] = useState('None');

  const [currentDate, setCurrentDate] = useState(null);
  const [dataValues, setCurrentDataValues] = useState([]);
  const [chartY, setChartY] = useState(null);

  const chartStates = useMemo(() => ({
    currentdate: { value: currentDate, set: setCurrentDate },
    datavalues: { value: dataValues, set: setCurrentDataValues },
    charty: { value: chartY, set: setChartY }
  }), [currentDate, dataValues, chartY]);

    const allDataStates = useMemo(() => {
      const dynamicStates = Object.fromEntries(
        Object.entries(states).map(([key, value]) => [
          key,
          {
            value,
            set: (newValue) =>
              setStates((prev) => ({
                ...prev,
                [key]: newValue,
              })),
          },
        ])
      );
  
      return {
        ...dynamicStates
      };
    }, [states]);

    const dateStates = useMemo(() => ({
      savingsstartdate: { value: savingStartDate, set: setSavingStartDate },
      savingsenddate: { value: savingEndDate, set: setSavingEndDate },
      allsavingsdate: { value: allsavingsDate, set: setAllSavingsDates },
      savingsmonth: { value: savingsMonth, set: setSavingsMonth },
    }), [savingStartDate, savingEndDate, allsavingsDate, savingsMonth]);
  
  const { savingsData, savingsOptions, totalSpending, totalSaved } = generateSavingsData(allDataStates, savings, dateStates, chartStates, devices);
  
  return (
    <Container className="mt-4 container-fluid savings pt-5 pb-5 mainContainer">
      <Row className="justify-content-center">
        <Col md={10} lg={8} className="p-0">
          <Container className="p-0">
            <h3 className="title mt-3">Savings</h3>
            <Row className="mt-4 savingsHolder">
              <Col xs={6} md={4} lg={3} className="savingsText" >
                <b>Total spending:</b><br></br>
                <b>Average price:</b><br></br>
                <div></div>
                <b>Total saved:</b>
              </Col>
              <Col xs={5} md={4} lg={3}>
                {(totalSpending[0] / 100).toFixed(2)} SEK<br></br>
                {(totalSpending[1] / 100).toFixed(2)} SEK
                <div></div>
                {(totalSaved / 100).toFixed(2)} SEK
              </Col>
            </Row>
            <SavingsOptionsChild allDataStates={allDataStates} dateStates={dateStates} devices={devices} />
            <Container className="savingsChartContainer p-0 m-0">
              <ToolTipChild chartStates={chartStates} page={"savings"} />
              <Line height={200} data={savingsData} options={savingsOptions} className="mt-md-4" />
            </Container>
          </Container>
        </Col>
      </Row>
    </Container>
  );
};