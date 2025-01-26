import { Container, Row, Col } from "react-bootstrap";
import { useEffect, useState, useMemo } from "react";
import SchedueleOptions from "../Options/SchedueleOptions";

export default ({ initData }) => {
  const { schedueles, prices, devicestatuses } = initData;
  const [currentDevice, setCurrentDevice] = useState("Nillebo AT");
  const [currentScheduele, setCurrentScheduele] = useState([]);
  const [currentPrice, setCurrentPrice] = useState([]);
  const [currentDevicesStatus, setCurrentDeviceStatus] = useState();
  const [priceDate, setPriceDate] = useState(new Date().toISOString().split("T")[0]);

  useEffect(() => {
    const defaultScheduele = schedueles.value.find(obj => obj.date === new Date().toISOString().split("T")[0]);
    const todaysPrices = prices.value.find(obj => obj.date === new Date().toISOString().split("T")[0]);
    const defaultDeviceStatus = devicestatuses.value.find(obj => obj.device_status.mac === "34945475764d")?.device_status.relays[0].ison ? "ON" : "OFF";
    setCurrentDeviceStatus(defaultDeviceStatus);
    setCurrentScheduele(defaultScheduele.values["NilleATtim"]);
    setCurrentPrice(todaysPrices.values)
  }, []);


  const allDataStates = useMemo(() => ({
    pricedate: { value: priceDate, set: setPriceDate },
    currentdevice: { value: currentDevice, set: setCurrentDevice },
    currentscheduele: { value: currentScheduele, set: setCurrentScheduele },
    currentprice: { value: currentPrice, set: setCurrentPrice },
    currentdevicestatus: { value: currentDevicesStatus, set: setCurrentDeviceStatus },
    schedueles,
    prices,
    devicestatuses
  }), [priceDate, currentDevice, currentScheduele, currentPrice, currentDevicesStatus, schedueles.value, prices.value, devicestatuses.value]);

  const numbers = Array.from({ length: 24 }, (_, i) => i);
  return (
    <Container className="mt-4 container-fluid prices pt-5 pb-5 mainContainer">
      <Row className="justify-content-center">
        <Col md={8} className="p-0">
          <Container className="p-0">
            <h3 className="title mt-3">Prices & Schedueles</h3>
            <SchedueleOptions allDataStates={allDataStates} />
            <Row className="justify-content-center  schedueleHolder">
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