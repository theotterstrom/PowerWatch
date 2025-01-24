import generateSavingsData from "../Datagenerators/GenerateSavingsData";
import { Container, Row, Col } from "react-bootstrap";
import { Line } from "react-chartjs-2";
import SavingsOptions from "../Options/SavingsOptions";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import ToolTip from "./ToolTip";

const ToolTipChild = React.memo(({ chartStates, page }) => {
  const initData = useMemo(() => ({ chartStates, page }), [chartStates, page]);
  return <ToolTip initData={initData}/>
});

export default ({ initData }) => {
  const { savings } = initData;

  // States for toggling savings visibility
  const [nilleboATSavings, setNilleboAtSavings] = useState(true);
  const [nilleboVPSavings, setNilleboVPSavings] = useState(true);
  const [nilleboVVSavings, setNilleboVVSavings] = useState(true);
  const [loveboATSavings, setLoveboATSavings] = useState(true);
  const [loveboVVSavings, setLoveboVVSavings] = useState(true);
  const [otteboSavings, setOtteboSavings] = useState(true);
  const [garageSavings, setGarageSavings] = useState(true);
  const [poolSavings, setPoolSavings] = useState(true);

  const today = new Date();
  const oneWeekAgoDate = new Date();
  oneWeekAgoDate.setDate(today.getDate() - 7);
  // States for date filtering savings
  const [savingStartDate, setSavingStartDate] = useState(oneWeekAgoDate.toISOString().split("T")[0]);
  const [savingEndDate, setSavingEndDate] = useState(new Date().toISOString().split("T")[0]);
  const [allsavingsDate, setAllSavingsDates] = useState(false);

  const [currentDate, setCurrentDate] = useState(null);
  const [dataValues, setCurrentDataValues] = useState([]);

  const chartStates = {
    currentdate: { value: currentDate, set: setCurrentDate },
    datavalues: { value: dataValues, set: setCurrentDataValues }
  };

  const allDataStates = {
    nilleboatsavings: { value: nilleboATSavings, set: setNilleboAtSavings },
    nillebovpsavings: { value: nilleboVPSavings, set: setNilleboVPSavings },
    nillebovvsavings: { value: nilleboVVSavings, set: setNilleboVVSavings },
    loveboatsavings: { value: loveboATSavings, set: setLoveboATSavings },
    lovebovvsavings: { value: loveboVVSavings, set: setLoveboVVSavings },
    ottebosavings: { value: otteboSavings, set: setOtteboSavings },
    garagesavings: { value: garageSavings, set: setGarageSavings },
    poolsavings: { value: poolSavings, set: setPoolSavings },
    savingsstartdate: { value: savingStartDate, set: setSavingStartDate },
    savingsenddate: { value: savingEndDate, set: setSavingEndDate },
    allsavingsdate: { value: allsavingsDate, set: setAllSavingsDates },
    savings
  };
  const { savingsData, savingsOptions, totalSpendning, totalSaved } = generateSavingsData(allDataStates, chartStates);
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
                {(totalSpendning[0] / 100).toFixed(2)} SEK<br></br>
                {(totalSpendning[1] / 100).toFixed(2)} SEK
                <div></div>
                {(totalSaved / 100).toFixed(2)} SEK
              </Col>
            </Row>
            <SavingsOptions dataStates={allDataStates} />
            <Container className="savingsChartContainer p-0 m-0">

              <Container className="toolTipParent">
              <ToolTipChild chartStates={chartStates}  page={"savings"} />
            </Container>
              <Line data={savingsData} options={savingsOptions} className="mt-md-4"/>
            </Container>
          </Container>
        </Col>
      </Row>
    </Container>
  );
};