import { Container, Row, Col } from "react-bootstrap";
import { useEffect, useState, useMemo } from "react";
import SchedueleOptions from "../Options/SchedueleOptions";

const ScheduleOptions = React.memo(({ allDataStates }) => {
  const initData = useMemo(() => ({ allDataStates }), [allDataStates]);
  return <SchedueleOptions initData={initData} />
});

export default ({ initData }) => {
  const { schedueles, prices, devicestatuses, devices } = initData;
  const [currentDevice, setCurrentDevice] = useState("Välj enhet");
  const [currentScheduele, setCurrentScheduele] = useState([]);
  const [currentPrice, setCurrentPrice] = useState([]);
  const [currentDevicesStatus, setCurrentDeviceStatus] = useState();
  const [priceDate, setPriceDate] = useState(new Date().toISOString().split("T")[0]);

  useEffect(() => {
    const todaysPrices = prices.value[prices.value.length - 1];
    setCurrentPrice(todaysPrices.values)
  }, []);


  const allDataStates = useMemo(() => ({
    pricedate: { value: priceDate, set: setPriceDate },
    currentdevice: { value: currentDevice, set: setCurrentDevice },
    currentscheduele: { value: currentScheduele, set: setCurrentScheduele },
    currentprice: { value: currentPrice, set: setCurrentPrice },
    currentdevicestatus: { value: currentDevicesStatus, set: setCurrentDeviceStatus },
    devices: devices.value,
    schedueles,
    prices,
    devicestatuses
  }), [priceDate, currentDevice, currentScheduele, currentPrice, currentDevicesStatus, devices.value, schedueles.value, prices.value, devicestatuses.value]);

  const numbers = Array.from({ length: 24 }, (_, i) => i);
  return (
    <div className="mx-0 my-5 p-0">
      <ScheduleOptions allDataStates={allDataStates} />
      <Row className="justify-content-center">
        <Col lg={6} xl={6}>
          <Container className="schedueleContainer p-3 mt-md-4 mt-0">
            <Container className="mt-4">
              <Row>
                {numbers.map((number) => (
                  <Col key={number} xs={3} className="text-center mb-3">
                    {currentScheduele && currentScheduele.includes(number) ?
                      <div style={{ backgroundColor: "darkgreen", borderRadius: "90px" }}>
                        {number}
                      </div> : <>
                        {number}
                      </>}
                  </Col>
                ))}
              </Row>
            </Container>
          </Container>
        </Col>
        <Col lg={6} xl={6}>
          <Container className="schedueleContainer p-3 mt-lg-4">
            <h4>Prices</h4>
            <Container className="mt-4">
              <Row>
                {numbers.map((number) => (
                  <Col key={number} xs={3} className="text-center mb-3">
                    {currentPrice.find(obj => obj.hour === number)?.price}
                  </Col>
                ))}
              </Row>
            </Container>
          </Container>
        </Col>
      </Row>
    </div>
  )
}