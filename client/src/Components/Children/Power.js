import generatePowerData from "../Datagenerators/GeneratePowerData";
import { Container, Row, Col } from "react-bootstrap";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import PowerOptions from "../Options/PowerOptions";
import { useState } from "react";

ChartJS.register(LineElement, PointElement, LinearScale, Title, Tooltip, Legend);

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

  const { chartData, chartOptions } = generatePowerData(allDataStates, dateStates);

  const verticalLinePlugin = {
    id: 'verticalLinePlugin',
    beforeDraw: (chart) => {
        if (chart.tooltip._active && chart.tooltip._active.length) {
            const ctx = chart.ctx;
            const activePoint = chart.tooltip._active[0]; // Get the active tooltip point
            const x = activePoint.element.x; // Get the x-coordinate of the tooltip point
            const topY = chart.scales.y.top; // Top of the chart
            const bottomY = chart.scales.y.bottom; // Bottom of the chart

            // Draw the vertical line
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(x, topY);
            ctx.lineTo(x, bottomY);
            ctx.lineWidth = 2;
            ctx.strokeStyle = 'gray'; // Style for the line
            ctx.setLineDash([5, 5]);
            ctx.stroke();
            ctx.restore();
        }
    },
};
ChartJS.register(verticalLinePlugin);

  return (
    <Container className="mt-4 container-fluid power pt-5 pb-5 mainContainer">
      <Row className="justify-content-center">
        <Col md={10} lg={8} className="p-0">
          <Container className="p-0">
          <h3 className="title mt-3">Power Consumption & Temperature</h3>
            <PowerOptions allDataStates={allDataStates} dateStates={dateStates}  />
            <Container className="chartContainer p-0 m-0">
              <Line data={chartData} options={chartOptions} className="mt-md-3"/>
            </Container>
          </Container>
        </Col>
      </Row>
    </Container>
  );
};