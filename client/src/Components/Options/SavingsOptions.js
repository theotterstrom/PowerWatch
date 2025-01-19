import { Container, Row, Col, Form, Dropdown } from "react-bootstrap";
import React, { useState } from "react";

export default ({ dataStates }) => {
    const [dropdownText, setDropdownText] = useState("Alla");
    const {
        nilleboatsavings,
        nillebovpsavings,
        nillebovvsavings,
        loveboatsavings,
        lovebovvsavings,
        ottebosavings,
        garagesavings,
        poolsavings,
        savingsstartdate,
        savingsenddate,
        allsavingsdate,
    } = dataStates;

    const setSavingStartDateFunc = date => {
        if (date > new Date().toISOString()) {
            alert("Date cannot be greater than todays date")
        } else {
            savingsstartdate.set(date);
        }
    };
    const setSavingEndDateFunc = date => {
        if (date > new Date().toISOString()) {
            alert("Date cannot be greater than todays date")
        } else {
            savingsenddate.set(date);
        }
    };

    const handleSelect = (eventKey) => {
        setDropdownText(eventKey);
        let filterList = {
            nilleboatsavings,
            nillebovpsavings,
            nillebovvsavings,
            loveboatsavings,
            lovebovvsavings,
            ottebosavings,
            garagesavings,
            poolsavings,
        };

        const loopFunction = (housenames) => {
            for (const [key, value] of Object.entries(filterList)) {
                if (housenames.some(word => key.toLowerCase().includes(word))) {
                    filterList[key].set(true);
                } else {
                    filterList[key].set(false);
                }
            }
        };

        if (eventKey === "Nillebo") {
            loopFunction(["nillebo", "utetemp"]);
        } else if (eventKey === "Ottebo") {
            loopFunction(["ottebo", "utetemp"]);
        } else if (eventKey === "Lovebo") {
            loopFunction(["lovebo", "utetemp"]);
        } else if (eventKey === "Övrigt") {
            loopFunction(["garage", "pool", "utetemp"]);
        } else if (eventKey === "Alla") {
            loopFunction(Object.entries(filterList).map(([key, value]) => key.toLowerCase()));
        } else if (eventKey === "Temperatur") {
            loopFunction(["temp"])
        }
    };
    return (
        <>
            {window.innerWidth <= 768 ? <>
                <Col className="p-5 pt-0 pb-0 mt-4 mb-4">
                    <Form.Label>Start Date</Form.Label>
                    <Form.Control
                        style={{ height: "30px" }}
                        type="date"
                        value={savingsstartdate.value}
                        onChange={(e) => setSavingStartDateFunc(e.target.value)}
                    />
                    <Form.Label className="mt-3">End Date</Form.Label>
                    <Form.Control
                        style={{ height: "30px" }}
                        type="date"
                        value={savingsenddate.value}
                        onChange={(e) => setSavingEndDateFunc(e.target.value)}
                    />

                    <Row className="mt-4">
                        <Col xs={3} className="justify-content-center d-flex">
                            <Form.Check onChange={() => allsavingsdate.set(!allsavingsdate.value)} />
                        </Col>
                        <Col xs={2}></Col>
                        <Col xs={7} className="p-0">
                            <h6>Show all dates</h6>
                        </Col>
                    </Row>
                    <Row className="mt-3">
                        <Col xs={5}>
                            <div className="d-flex m-0 p-0">
                                <Dropdown onSelect={handleSelect}>
                                    <Dropdown.Toggle variant="primary" id="dropdown-basic">
                                        {dropdownText}
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        <Dropdown.Item eventKey="Nillebo">Nillebo</Dropdown.Item>
                                        <Dropdown.Item eventKey="Lovebo">Lovebo</Dropdown.Item>
                                        <Dropdown.Item eventKey="Ottebo">Ottebo</Dropdown.Item>
                                        <Dropdown.Item eventKey="Övrigt">Övrigt</Dropdown.Item>
                                        <Dropdown.Item eventKey="Alla">Alla</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </div>
                        </Col>
                        <Col className="p-0 mt-2" xs={7}>
                            <h6>Filter by houses</h6>
                        </Col>
                    </Row>
                </Col>
            </> : <>
                <Row className="mb-4 mt-5 justify-content-center pageOptions">
                    <Col>
                        <Form.Check
                            type="checkbox"
                            label="Nillebo Ackumulatortank"
                            checked={nilleboatsavings.value}
                            onChange={() => nilleboatsavings.set(!nilleboatsavings.value)}
                        />
                        <Form.Check
                            type="checkbox"
                            label="Nillebo Värmepump"
                            checked={nillebovpsavings.value}
                            onChange={() => nillebovpsavings.set(!nillebovpsavings.value)}
                        />
                        <Form.Check
                            type="checkbox"
                            label="Nillebo Varmvatten"
                            checked={nillebovvsavings.value}
                            onChange={() => nillebovvsavings.set(!nillebovvsavings.value)}
                        />
                        <Form.Check
                            type="checkbox"
                            label="Lovebo Varmvatten"
                            checked={lovebovvsavings.value}
                            onChange={() => lovebovvsavings.set(!lovebovvsavings.value)}
                        />
                        <Col>
                            {window.innerWidth <= 1024 ? <>
                            </> : <>
                                <div className="mt-5">
                                    <h6>Filter by houses</h6>
                                    <Dropdown onSelect={handleSelect}>
                                        <Dropdown.Toggle variant="primary" id="dropdown-basic">
                                            {dropdownText}
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu>
                                            <Dropdown.Item eventKey="Nillebo">Nillebo</Dropdown.Item>
                                            <Dropdown.Item eventKey="Lovebo">Lovebo</Dropdown.Item>
                                            <Dropdown.Item eventKey="Ottebo">Ottebo</Dropdown.Item>
                                            <Dropdown.Item eventKey="Övrigt">Övrigt</Dropdown.Item>
                                            <Dropdown.Item eventKey="Alla">Alla</Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </div>
                            </>}
                        </Col>
                    </Col>
                    <Col>
                        <Form.Check
                            type="checkbox"
                            label="Lovebo Ackumulatortank"
                            checked={loveboatsavings.value}
                            onChange={() => loveboatsavings.set(!loveboatsavings.value)}
                        />
                        <Form.Check
                            type="checkbox"
                            label="Ottebo"
                            checked={ottebosavings.value}
                            onChange={() => ottebosavings.set(!ottebosavings.value)}
                        />
                        <Form.Check
                            type="checkbox"
                            label="Garage"
                            checked={garagesavings.value}
                            onChange={() => garagesavings.set(!garagesavings.value)}
                        />
                        <Form.Check
                            type="checkbox"
                            label="Pool"
                            checked={poolsavings.value}
                            onChange={() => poolsavings.set(!poolsavings.value)}
                        />
                    </Col>
                    <Col lg={12} xl={4} className="mt-md-4 mt-xl-0">
                        <Form.Label>Start Date</Form.Label>
                        <Form.Control
                            style={{ height: "30px" }}
                            type="date"
                            value={savingsstartdate.value}
                            onChange={(e) => setSavingStartDateFunc(e.target.value)}
                        />
                        <Form.Label className="mt-3">End Date</Form.Label>
                        <Form.Control
                            style={{ height: "30px" }}
                            type="date"
                            value={savingsenddate.value}
                            onChange={(e) => setSavingEndDateFunc(e.target.value)}
                        />
                        <Container className="d-flex p-0 mt-2">
                            <Form.Check className="mt-2" onChange={() => allsavingsdate.set(!allsavingsdate.value)} />&nbsp;&nbsp;&nbsp;
                            {window.innerWidth <= 1024 ? <>
                                <Col md={2}></Col>
                            </> : <>
                            </>}
                            <Form.Label className="mt-2">Show all dates</Form.Label>
                        </Container>
                    </Col>
                </Row>
                {window.innerWidth <= 1024 ? <>
                    <Row className="d-flex">
                        <Col md={3} style={{ position: "absolute" }}>
                            <Dropdown onSelect={handleSelect}>
                                <Dropdown.Toggle variant="primary" id="dropdown-basic">
                                    {dropdownText}
                                </Dropdown.Toggle>
                                <Dropdown.Menu style={{ position: "absolute" }}>
                                    <Dropdown.Item eventKey="Nillebo">Nillebo</Dropdown.Item>
                                    <Dropdown.Item eventKey="Lovebo">Lovebo</Dropdown.Item>
                                    <Dropdown.Item eventKey="Ottebo">Ottebo</Dropdown.Item>
                                    <Dropdown.Item eventKey="Övrigt">Övrigt</Dropdown.Item>
                                    <Dropdown.Item eventKey="Alla">Alla</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </Col>
                        <Col md={3}></Col>
                        <Col>
                            <p className="p-0 m-0 pb-2" style={{ fontSize: "20px" }}>Filter by houses</p>
                        </Col>
                    </Row>
                </> : <></>}
            </>}
        </>
    );
}