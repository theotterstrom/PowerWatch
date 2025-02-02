import React, { useState, useEffect, useCallback, useMemo } from "react";
import generatePowerData from "../Datagenerators/GeneratePowerData";
import { Container, Row, Col } from "react-bootstrap";
import PowerOptions from "../Options/PowerOptions";
import LineGenerator from './LineGenerator';

const PowerOptionChild = React.memo(({ allDataStates, dateStates, devices }) => {
  const initData = useMemo(() => ({ allDataStates, dateStates, devices }), [allDataStates, dateStates, devices]);
  return <PowerOptions initData={initData} />
});

const LineChild = React.memo(({ lineDataProp }) => {
  const lineData = useMemo(() => ({ lineDataProp }), [lineDataProp]);
  return <LineGenerator lineData={lineData} />
});

export default ({ initData }) => {
  const { readings, temps, devices } = initData;
  const deviceNames = devices.value.map(obj => obj.deviceName)
  const stateObject = Object.fromEntries(deviceNames.map(obj => [obj, true]));

  const [states, setStates] = useState(stateObject);

  const today = new Date();
  const oneWeekAgoDate = new Date();
  oneWeekAgoDate.setDate(today.getDate() - 7);
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

  const [startDate, setStartDate] = useState(oneWeekAgoDate.toISOString().split("T")[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split("T")[0]);
  const [allDates, setAllDates] = useState(false);
  const [month, setMonth] = useState(`${today.getFullYear()} ${monthNames[today.getMonth()]}`);
  const [timeFilter, setTimeFilter] = useState("dates");
  
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
    startdate: { value: startDate, set: setStartDate },
    enddate: { value: endDate, set: setEndDate },
    alldates: { value: allDates, set: setAllDates },
    month: { value: month, set: setMonth },
    timefilter: { value: timeFilter, set: setTimeFilter }
  }), [startDate, endDate, allDates, month, timeFilter]);

  const { chartData } = generatePowerData(allDataStates, readings, temps, dateStates, devices);

  return (
    <Container className="mt-4 container-fluid power pt-5 pb-5 mainContainer">
      <Row className="justify-content-center">
        <Col xl={8} lg={8} md={10} className="p-0">
          <Container className="p-0 justify-content-center">
            <Container className="container-fluid d-flex justify-content-center">
              <Col xl={12} lg={12} md={12} sm={8} xs={8} className="text-center text-lg-start">
                <h3 className="mt-3">Power Consumption & Temperature</h3>
              </Col>
            </Container>
            <PowerOptionChild allDataStates={allDataStates} dateStates={dateStates} devices={devices} />
            <LineChild lineDataProp={chartData} /> 
          </Container>
        </Col>
      </Row>
    </Container>
  );
};