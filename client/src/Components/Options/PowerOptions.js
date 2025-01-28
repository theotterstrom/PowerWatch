import { Container, Row, Col, Form, Dropdown } from "react-bootstrap";
import React, { useState } from "react";
export default ({ initData }) => {
    const { allDataStates, dateStates, devices } = initData;

    const {
        alldates,
        enddate,
        startdate,
        month
    } = dateStates;

    const [dropdownText, setDropdownText] = useState("Alla");
    const [monthText, setMonthText] = useState(month.value);

    const setStartDateFunc = date => {
        if (date > new Date().toISOString()) {
            alert("Date cannot be greater than todays date")
        } else {
            startdate.set(date);
        }
    };
    const setEndDateFunc = date => {
        if (date > new Date().toISOString()) {
            alert("Date cannot be greater than todays date")
        } else {
            enddate.set(date);
        }
    };

    const handleSelect = (eventKey, groups) => {
        setDropdownText(eventKey)
        const rightGroup = groups[eventKey];
        for (const [deviceName, state] of Object.entries(allDataStates)) {
            if (eventKey === "Alla") {
                state.set(true);
                continue;
            };
            const displayName = devices.value.find(obj => obj.deviceName === deviceName).displayName;
            if (rightGroup.includes(displayName)) {
                state.set(true)
            } else {
                state.set(false)
            }
        };
    };

    const handleMonthSelect = eventKey => {
        setMonthText(eventKey || "None");
        month.set(eventKey || "None");
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

    const splitFormChecks = () => {
        const firstHalf = devices.value.filter((obj, index) => {
            if (index > devices.value.length / 2 - 1) {
                return false
            }
            return true;
        });
        const secondHalf = devices.value.filter((obj, index) => {
            if (index > devices.value.length / 2 - 1) {
                return true
            }
            return false;
        });
        const firstHalfForms = firstHalf.map((obj, index) =>
            <Form.Check
                type="checkbox"
                key={index}
                label={obj.displayName}
                checked={allDataStates[obj.deviceName].value}
                onChange={() => allDataStates[obj.deviceName].set(!allDataStates[obj.deviceName].value)}
            />);
        
        const secondHalfForms = secondHalf.map((obj, index) =>
            <Form.Check
                type="checkbox"
                key={index + 20}
                label={obj.displayName}
                checked={allDataStates[obj.deviceName].value}
                onChange={() => allDataStates[obj.deviceName].set(!allDataStates[obj.deviceName].value)}
            />)
        return [firstHalfForms, secondHalfForms];
    };

    const groups = devices.value.reduce((acc, cur) => {
        if (cur.group) {
            for (const group of cur.group) {
                if (acc[group]) {
                    acc[group].push(cur.displayName)
                } else {
                    acc[group] = [cur.displayName]
                }
            }
        }
        return acc;
    }, {});

    return (
        <>
            {window.innerWidth <= 768 ? <>
                <Col className="p-5 pt-0 pb-0 mt-4 mb-4">
                    <Form.Label>Start Date</Form.Label>
                    <Form.Control style={{ height: "30px" }} type="date" value={startdate.value} onChange={(e) => setStartDateFunc(e.target.value)} />
                    <Form.Label className="mt-3">End Date</Form.Label>
                    <Form.Control style={{ height: "30px" }} type="date" value={enddate.value} onChange={(e) => setEndDateFunc(e.target.value)} />

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

                    <Row className="mt-3">
                        <Col xs={3} className="justify-content-center d-flex">
                            <Form.Check onChange={() => alldates.set(!alldates.value)} />
                        </Col>
                        <Col xs={3}></Col>
                        <Col xs={6} className="p-0 p-2 pt-2 pb-0">
                            <h6 className="allDatesPowerTitle">Show all dates</h6>
                        </Col>
                    </Row>
                    <Row className="mt-3">
                        <Col xs={6}>
                            <div className="d-flex m-0 p-0">
                                <Dropdown onSelect={(eventKey) => handleSelect(eventKey, groups)}>
                                    <Dropdown.Toggle variant="primary" id="dropdown-basic">
                                        {dropdownText}
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        {Object.entries(groups).map(([groupName, members]) => (<Dropdown.Item key={groupName} eventKey={groupName} >{groupName}</Dropdown.Item>))}
                                        <Dropdown.Item eventKey="Alla">Alla</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </div>
                        </Col>
                        <Col className="pb-0 mt-2" xs={6}>
                            <h6>Filter by group</h6>
                        </Col>
                    </Row>
                </Col>
            </> : <>
                <Row className="mt-5 justify-content-center pageOptions">
                    <Col>
                        {splitFormChecks()[0]}

                        {1024 <= window.innerWidth ? <>
                            <div className="d-flex" style={{ marginTop: "100px" }}>

                                <Dropdown onSelect={(eventKey) => handleSelect(eventKey, groups)}>
                                    <Dropdown.Toggle variant="primary" id="dropdown-basic">
                                        {dropdownText}
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        {Object.entries(groups).map(([groupName, members]) => (<Dropdown.Item key={groupName} eventKey={groupName} >{groupName}</Dropdown.Item>))}
                                        <Dropdown.Item eventKey="Alla">Alla</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                                <p className="p-0 m-0 pb-2 mt-2">&nbsp;&nbsp;Filter houses</p>
                            </div>
                        </> : <></>}

                    </Col>
                    <Col>
                        {splitFormChecks()[1]}

                    </Col>
                    <Col lg={12} xl={4} className="mt-md-4 mt-xl-0">

                        <Form.Label>Start Date</Form.Label>
                        <Form.Control
                            style={{ height: "30px", fontSize: window.innerWidth <= 1024 ? "20px" : "unset" }}
                            type="date"
                            value={startdate.value}
                            onChange={(e) => setStartDateFunc(e.target.value)}
                            className="dateToggles"
                        />
                        <Form.Label className="mt-3">End Date</Form.Label>
                        <Form.Control
                            style={{ height: "30px", fontSize: window.innerWidth <= 1024 ? "20px" : "unset" }}
                            type="date"
                            value={enddate.value}
                            onChange={(e) => setEndDateFunc(e.target.value)}
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
                                <Form.Check onChange={() => alldates.set(!alldates.value)} />&nbsp;&nbsp;&nbsp;
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
                                        <Form.Check onChange={() => alldates.set(!alldates.value)} />&nbsp;&nbsp;&nbsp;
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
                                    <Dropdown onSelect={(eventKey) => handleSelect(eventKey, groups)}>
                                        <Dropdown.Toggle variant="primary" id="dropdown-basic">
                                            {dropdownText}
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu style={{ position: "absolute" }}>
                                            {Object.entries(groups).map(([groupName, members]) => (<Dropdown.Item key={groupName} eventKey={groupName} >{groupName}</Dropdown.Item>))}
                                            <Dropdown.Item eventKey="Alla">Alla</Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </Col>
                                <Col md={3}></Col>
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
};