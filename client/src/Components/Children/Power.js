import React, { useState, useEffect, useCallback, useMemo } from "react";
import generatePowerData from "../Datagenerators/GeneratePowerData";
import { Container, Row, Col } from "react-bootstrap";
import { Line } from "react-chartjs-2";
import PowerOptions from "../Options/PowerOptions";
import ToolTip from "./ToolTip";

const ToolTipChild = React.memo(({ chartStates, page }) => {
  const initData = useMemo(() => ({ chartStates, page }), [chartStates, page]);
  return <ToolTip initData={initData} />
});

export default ({ initData }) => {
  const { readings, temps } = initData;
  const [nilleboAT, setnilleboAT] = useState(true);
  const [nilleboVP, setnilleboVP] = useState(true);
  const [nilleboVV, setnilleboVV] = useState(true);
  const [loveboAT, setloveboAT] = useState(true);
  const [otteboData, setotteboData] = useState(true);
  const [poolData, setpoolData] = useState(true);
  const [nilleboTemp, setnilleboTemp] = useState(true);
  const [otteboTemp, setotteboTemp] = useState(true);
  const [loveTemp, setloveTemp] = useState(true);
  const [uteTemp, setuteTemp] = useState(true);

  const today = new Date();
  const oneWeekAgoDate = new Date();
  oneWeekAgoDate.setDate(today.getDate() - 7);

  const [startDate, setStartDate] = useState(oneWeekAgoDate.toISOString().split("T")[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split("T")[0]);
  const [allDates, setAllDates] = useState(false);

  const [currentDate, setCurrentDate] = useState(null);
  const [dataValues, setCurrentDataValues] = useState([]);

  const chartStates = {
    currentdate: { value: currentDate, set: setCurrentDate },
    datavalues: { value: dataValues, set: setCurrentDataValues }
  };

  const allDataStates = {
    nilleboAt: { value: nilleboAT, set: setnilleboAT },
    nillebovp: { value: nilleboVP, set: setnilleboVP },
    nillebovv: { value: nilleboVV, set: setnilleboVV },
    loveboat: { value: loveboAT, set: setloveboAT },
    ottebo: { value: otteboData, set: setotteboData },
    pool: { value: poolData, set: setpoolData },
    nillebotemp: { value: nilleboTemp, set: setnilleboTemp },
    ottebotemp: { value: otteboTemp, set: setotteboTemp },
    lovetemp: { value: loveTemp, set: setloveTemp },
    utetemp: { value: uteTemp, set: setuteTemp },
    readings,
    temps,
  };

  const dateStates = {
    startdate: { value: startDate, set: setStartDate },
    enddate: { value: endDate, set: setEndDate },
    alldates: { value: allDates, set: setAllDates },
  };

  const { chartData, chartOptions } = generatePowerData(allDataStates, dateStates, chartStates);

  return (
    <Container className="mt-4 container-fluid power pt-5 pb-5 mainContainer">
      <Row className="justify-content-center">
        <Col md={10} lg={8} className="p-0">
          <Container className="p-0">
            <h3 className="title mt-3">Power Consumption & Temperature</h3>
            <PowerOptions allDataStates={allDataStates} dateStates={dateStates} />
            <Container className="chartContainer p-0 m-0">
              <ToolTipChild chartStates={chartStates} page={"power"} />
              <Line data={chartData} options={chartOptions} className="mt-md-3 powerChart" />
            </Container>
          </Container>
        </Col>
      </Row>
    </Container>
  );
};