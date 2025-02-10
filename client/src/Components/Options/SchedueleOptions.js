import { Row, Col, Form, Dropdown, Container } from "react-bootstrap";
export default ({ initData }) => {
    const { allDataStates } = initData;
    const {
        pricedate,
        currentdevice,
        currentscheduele,
        currentprice,
        currentdevicestatus,
        prices,
        devices,
        schedueles,
        devicestatuses
    } = allDataStates;

    const scheduleDevices = JSON.parse(JSON.stringify(devices)).filter(obj => obj.deviceType === "Relay");

    const setPriceDate = date => {
        if (date > new Date().toISOString()) {
            alert("Date cannot be greater than todays date")
        } else if (date < new Date("2024-12-22").toISOString()) {
            alert("Measurement started on 23 December 2024");
        } else {
            pricedate.set(date)
            const corrPrice = prices.value.find(obj => obj.date === date).values;
            currentprice.set(corrPrice)
            if (currentdevice.value !== "Välj enhet") {
                const currentDevice = scheduleDevices.find(obj => obj.displayName === currentdevice.value)
                const corrScheduele = schedueles.value.find(obj => obj.date === date).values[currentDevice.deviceName];
                currentscheduele.set(corrScheduele);
            };
        };
    };

    const handlePriceSelect = (eventKey) => {
        currentdevice.set(eventKey);

        const currentDevice = scheduleDevices.find(obj => obj.displayName === eventKey)
        const corrScheduele = schedueles.value.find(obj => obj.date === pricedate.value).values[currentDevice.deviceName];
        currentscheduele.set(corrScheduele);
        const corrDevice = devicestatuses.value.find(obj => obj.device_status.mac.includes(currentDevice.id.toUpperCase()));

        if (!currentDevice) {
            currentdevicestatus.set("OFFLINE")
        } else {
            const currentOnOff = corrDevice.device_status.relays[0].ison ? "ON" : "OFF";
            currentdevicestatus.set(currentOnOff)
        }
    };

    return (
        <Row className="my-5 mx-0 p-0 justify-content-md-start justify-content-center">

            <Col xxl={12} className="m-0 p-0 mt-lg-0 mt-2 ">
                <div style={{ fontSize: "18px", fontWeight: "bold" }}>
                    <i className="fa-solid fa-calendar-days"></i>&nbsp; Scheman & Dagspriser
                </div>
            </Col>

            <Col xl={3} lg={4} md={4} sm={6} xs={10} className="m-0 p-0 mt-4">
                <Form.Label>Datum</Form.Label>
                <Form.Control
                    type="date"
                    value={pricedate.value}
                    onChange={(e) => setPriceDate(e.target.value)}
                />
            </Col>

            <Col xl={3} lg={4} md={4} sm={6} xs={11} className="mt-4">
                <Container className="d-flex">
                    <div className="d-block">
                        <Form.Label>Enhet</Form.Label>
                        <Dropdown onSelect={handlePriceSelect}>
                            <Dropdown.Toggle variant="primary" id="dropdown-basic">
                                {currentdevice.value}
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                {scheduleDevices.map(obj => (<Dropdown.Item eventKey={obj.displayName}>{obj.displayName}</Dropdown.Item>))}
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>
                    <div className="d-block mx-5">
                        Status<br />
                        {currentdevicestatus.value}
                    </div>
                </Container>
            </Col>

            {/*             <Col xl={3} lg={4} md={4} xs={12} className="mt-4">
                Status<br />
                {currentdevicestatus.value}
            </Col> */}
        </Row>
    );
};