import { Container, Row, Col, Form, Dropdown } from "react-bootstrap";
import React, { useState } from "react";

export default ({ dataStates }) => {

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
        savingsmonth
    } = dataStates;

    const [dropdownText, setDropdownText] = useState("Alla");
    const [monthText, setMonthText] = useState(savingsmonth.value);

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

    const handleMonthSelect = eventKey => {
        setMonthText(eventKey || "None");
        savingsmonth.set(eventKey || "None");
    };

    const generateMonthOptions = () => {
        let months = [];
        const startDate = new Date("2024-12-01");
        const currentDate = new Date();
        const monthNames = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        let iteratorDate = new Date(startDate);
        while (iteratorDate <= currentDate) {
            const year = iteratorDate.getFullYear();
            const month = String(iteratorDate.getMonth() + 1).padStart(2, "0");
            const monthStr = `${year} ${monthNames[parseInt(month) - 1]}`;
            months.push(
                <Dropdown.Item key={monthStr} eventKey={monthStr}>{monthStr}</Dropdown.Item>
            );
            iteratorDate.setMonth(iteratorDate.getMonth() + 1);
        }
        months.unshift(
            <Dropdown.Item key="None" eventKey="None">None</Dropdown.Item>
        );
        return months;
    };

    return (
        <>
            {window.innerWidth <= 768 ? <>
                <Col className="p-5 pt-0 pb-0 mt-4 mb-4">
                    <Form.Label>Start Date</Form.Label>
                    <Form.Control style={{ height: "30px" }} type="date" value={savingsstartdate.value} onChange={(e) => setSavingStartDateFunc(e.target.value)} />
                    <Form.Label className="mt-3">End Date</Form.Label>
                    <Form.Control style={{ height: "30px" }} type="date" value={savingsenddate.value} onChange={(e) => setSavingEndDateFunc(e.target.value)} />

                    <Container className="p-0 mt-3">
                        <p className="m-0 p-0">Month Filter</p>
                        <Container className="d-flex p-0 m-0">
                            <Dropdown onSelect={handleMonthSelect} className="mt-2" style={{ width: "85%" }}>
                                <Dropdown.Toggle variant="light" id="dropdown-basic" style={{ width: "100%", textAlign: "start", height: "35px", padding: "0 0 0 20px" }}>
                                    {monthText}
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    {generateMonthOptions()}
                                </Dropdown.Menu>
                            </Dropdown>
                            &nbsp;&nbsp;<i onClick={() => handleMonthSelect()} className="fa-solid fa-xmark mt-2" style={{ color: "white", fontSize: "40px", cursor: "pointer" }}></i>
                        </Container>
                    </Container>

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

                        {window.innerWidth <= 1024 ? <>
                        </> : <>
                            <div className="d-flex" style={{ marginTop: "150px" }}>
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
                                <p className="p-0 m-0 pb-2 mt-2">&nbsp;&nbsp;Filter houses</p>
                            </div>
                        </>}

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

                        {1024 <= window.innerWidth ? <>
                            <Container className="p-0 mt-3">
                                <p className="m-0 p-0">Month Filter</p>
                                <Container className="d-flex p-0 m-0">
                                    <Dropdown onSelect={handleMonthSelect} className="mt-2" style={{ width: "85%" }}>
                                        <Dropdown.Toggle variant="light" id="dropdown-basic" style={{ width: "100%", textAlign: "start", height: "35px", padding: "0 0 0 20px" }}>
                                            {monthText}
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu>
                                            {generateMonthOptions()}
                                        </Dropdown.Menu>
                                    </Dropdown>
                                    &nbsp;&nbsp;<i onClick={() => handleMonthSelect()} className="fa-solid fa-xmark mt-2" style={{ color: "white", fontSize: "40px", cursor: "pointer" }}></i>
                                </Container>
                            </Container>
                            <Container className="d-flex p-0 mt-4">
                                <Form.Check onChange={() => allsavingsdate.set(!allsavingsdate.value)} />&nbsp;&nbsp;&nbsp;
                                {window.innerWidth <= 1024 ? <>
                                    <Col md={2}></Col>
                                </> : <></>}
                                <Form.Label>Show all dates</Form.Label>
                            </Container>
                        </> : <>
                            <Row>
                                <Col md={6}>
                                    <Container className="p-0 mt-3">
                                        <p className="m-0 p-0">Month Filter</p>
                                        <Container className="d-flex p-0 m-0">
                                            <Dropdown onSelect={handleMonthSelect} className="mt-2" style={{ width: "100%" }}>
                                                <Dropdown.Toggle variant="light" id="dropdown-basic" style={{ width: "100%", textAlign: "start", height: "35px", padding: "0 0 0 20px" }}>
                                                    {monthText}
                                                </Dropdown.Toggle>
                                                <Dropdown.Menu>
                                                    {generateMonthOptions()}
                                                </Dropdown.Menu>
                                            </Dropdown>
                                            &nbsp;&nbsp;<i onClick={() => handleMonthSelect()} className="fa-solid fa-xmark mt-2" style={{ color: "white", fontSize: "40px", cursor: "pointer" }}></i>
                                        </Container>
                                    </Container>
                                </Col>

                                <Col md={6} className="mt-5">
                                    <Container className="d-flex p-0 mt-3 justify-content-end">
                                        <Form.Check onChange={() => allsavingsdate.set(!allsavingsdate.value)} />&nbsp;&nbsp;&nbsp;
                                        <Form.Label>Show all dates</Form.Label>
                                    </Container>
                                </Col>
                            </Row>
                        </>}
                    </Col>
                </Row>

                <Row className="mb-3">
                    <Col className="checkContainer">
                        {window.innerWidth <= 1024 ? <>
                            <Row className="d-flex mt-3">
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
                                <Col md={2}></Col>
                                <Col>
                                    <p className="p-0 m-0 pb-2" style={{ fontSize: "20px" }}>Filter by houses</p>
                                </Col>
                            </Row>
                        </> : <>
                        </>}
                    </Col>
                </Row>
            </>}
        </>
    );
}