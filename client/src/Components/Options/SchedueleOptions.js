import { Row, Col, Form, Dropdown } from "react-bootstrap";
export default ({ allDataStates }) => {
    const {
        pricedate,
        currentdevice,
        currentscheduele,
        currentprice,
        currentdevicestatus,
        prices,
        schedueles,
        devicestatuses
    } = allDataStates;

    const namePriceMap = {
        "Garage": "Garage",
        "Lovebo AT": "LoveATtim",
        "Lovebo VV": "LoveVVtim",
        "Nillebo AT": "NilleATtim",
        "Nillebo VP": "NilleVPtim",
        "Nillebo VV": "NilleVVtim",
        "Ottebo": "Ottebo",
        "Pool Start": "PoolStart",
        "Pool": "PoolTid"
    };
    const dataMap = {
        "Nillebo AT": "34945475764D",
        "Nillebo VP": "485519CB191D",
        "Nillebo VV": "485519CB0E7D",
        "Pool Start": "",
        "Lovebo AT": "349454747F84",
        "Lovebo VV": "",
        "Ottebo": "485519C15B8B",
        "Garage": "",
        "Pool": "483FDA28828B",
    };
    const setPriceDate = date => {
        if (date > new Date().toISOString()) {
            alert("Date cannot be greater than todays date")
        } else if (date < new Date("2024-12-22").toISOString()) {
            alert("Measurement started on 23 December 2024");
        } else {
            pricedate.set(date)
            const corrPrice = prices.value.find(obj => obj.date === date).values;
            currentprice.set(corrPrice)
            const currentDevice = currentdevice.value;
            const corrScheduele = schedueles.value.find(obj => obj.date === date).values[namePriceMap[currentDevice]];
            currentscheduele.set(corrScheduele);
        }
    };

    const handlePriceSelect = (eventKey) => {
        currentdevice.set(eventKey);
        const corrScheduele = schedueles.value.find(obj => obj.date === pricedate.value).values[namePriceMap[eventKey]];
        currentscheduele.set(corrScheduele);
        const currentDevice = devicestatuses.value.find(obj => obj.device_status.mac === dataMap[eventKey]);
        if (!currentDevice) {
            currentdevicestatus.set("OFFLINE")
        } else {
            const currentOnOff = currentDevice.device_status.relays[0].ison ? "ON" : "OFF";
            currentdevicestatus.set(currentOnOff)
        }
    };

    return (
        <Row className="mt-lg-5 mt-4 schedueleOptionsContainer">
            <Col lg={4} xs={8}>
                <Form.Label>Date</Form.Label>
                <Form.Control
                    style={{ height: "30px" }}
                    type="date"
                    value={pricedate.value}
                    onChange={(e) => setPriceDate(e.target.value)}
                />
            </Col>
            <Col xs={8}>
                <Row>
                    <Col lg={4} xs={7} className="mt-lg-0 mt-3">
                        <Form.Label>Device</Form.Label>
                        <Dropdown onSelect={handlePriceSelect}>
                            <Dropdown.Toggle variant="primary" id="dropdown-basic">
                                {currentdevice.value}
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item eventKey="Nillebo AT">Nillebo AT</Dropdown.Item>
                                <Dropdown.Item eventKey="Nillebo VP">Nillebo VP</Dropdown.Item>
                                <Dropdown.Item eventKey="Nillebo VV">Nillebo VV</Dropdown.Item>
                                <Dropdown.Item eventKey="Lovebo AT">Lovebo AT</Dropdown.Item>
                                <Dropdown.Item eventKey="Lovebo VV">Lovebo VV</Dropdown.Item>
                                <Dropdown.Item eventKey="Ottebo">Ottebo</Dropdown.Item>
                                <Dropdown.Item eventKey="Pool">Pool</Dropdown.Item>
                                <Dropdown.Item eventKey="Pool Start">Pool Start</Dropdown.Item>
                                <Dropdown.Item eventKey="Garage">Garage</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </Col>
                    <Col xs={5} className="mt-lg-0 mt-3">
                        Status<br></br>
                        {currentdevicestatus.value}
                    </Col>
                </Row>
            </Col>
        </Row>
    );
};