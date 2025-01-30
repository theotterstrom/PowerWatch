import { Container, Row, Col } from "react-bootstrap";
import { useEffect, useState, useMemo } from "react";
import SchedueleOptions from "../Options/SchedueleOptions";

const ScheduleOptions = React.memo(({ allDataStates }) => {
  const initData = useMemo(() => ({ allDataStates }), [allDataStates]);
  return <SchedueleOptions initData={initData} />
});

export default ({ initData }) => {
  const { schedueles, prices, devicestatuses, devices } = initData;
  const [currentDevice, setCurrentDevice] = useState("Choose device");
  const [currentScheduele, setCurrentScheduele] = useState([]);
  const [currentPrice, setCurrentPrice] = useState([]);
  const [currentDevicesStatus, setCurrentDeviceStatus] = useState();
  const [priceDate, setPriceDate] = useState(new Date().toISOString().split("T")[0]);

  useEffect(() => {
    const todaysPrices = prices.value[prices.value.length -1]; 
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
        <Container className="mt-4 container-fluid power pt-5 pb-5 mainContainer">
          <Row className="justify-content-center">
            <Col xl={8} lg={8} md={10} className="p-0">
              <Container className="p-0 justify-content-center">
                <Container className="container-fluid d-flex justify-content-center">
                  <Col xl={12} lg={12} md={12} sm={8} xs={8} className="text-center text-lg-start">
                    <h3 className="mt-3">Prices & Schedules</h3>
                  </Col>
                </Container>

            <ScheduleOptions allDataStates={allDataStates} />
            <Row className="justify-content-center">
              <Col lg={6} xl={6}>
                <Container className="schedueleContainer p-3 mt-4">
                  <h4>Scheduele</h4>
                  <Container className="mt-4">
                    <Row>
                      {numbers.map((number) => (
                        <Col key={number} xs={3} className="text-center mb-3">
                          {currentScheduele.includes(number) ?
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
          </Container>
        </Col>
      </Row>
    </Container>
  )
}