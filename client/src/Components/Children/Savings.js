import generateSavingsData from "../Datagenerators/GenerateSavingsData";
import { Container, Row, Col } from "react-bootstrap";
import SavingsOptions from "../Options/SavingsOptions";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import LineGenerator from './LineGenerator';

const SavingsOptionsChild = React.memo(({ allDataStates, dateStates, devices, savingsData }) => {
  const initData = useMemo(() => ({ allDataStates, dateStates, devices, savingsData }), [allDataStates, dateStates, devices, savingsData]);
  return <SavingsOptions initData={initData} />
});

const LineChild = React.memo(({ lineDataProp }) => {
  const lineData = useMemo(() => ({ lineDataProp }), [lineDataProp]);
  return <LineGenerator lineData={lineData} />
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

  const { savingsData, totalSpending, totalSaved } = generateSavingsData(allDataStates, savings, dateStates, devices);

  return (
    <Container className="mt-4 container-fluid power pt-5 pb-5 mainContainer">
      <Row className="justify-content-center">
        <Col xl={8} lg={8} md={10} className="p-0">
          <Container className="p-0 justify-content-center">
            <Container className="container-fluid d-flex justify-content-center">
              <Col xl={12} lg={12} md={12} sm={8} xs={8} className="text-center text-lg-start">
                <h3 className="mt-3">Savings</h3>
              </Col>
            </Container>
            <SavingsOptionsChild allDataStates={allDataStates} dateStates={dateStates} devices={devices} savingsData={{ totalSpending, totalSaved }} />
            <LineChild lineDataProp={savingsData} />
          </Container>
        </Col>
      </Row>
    </Container>
  );
};