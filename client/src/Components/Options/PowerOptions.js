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
            <Row className="justify-content-center mt-sm-2 mt-md-2 mt-lg-3">
                <Col xl={8} lg={7} md={12} sm={10} xs={11} className="p-3 d-lg-block d-none">
                    <Row className="p-0 m-0" style={{ height: "100%" }}>
                        <Col className="d-flex flex-column">
                            {splitFormChecks()[0]}

                            <Container className="mt-auto m-0 p-0 d-flex flex-column-reverse">
                                <Container className="m-0 p-0 d-flex mt-4">
                                    <Dropdown onSelect={(eventKey) => handleSelect(eventKey, groups)}>
                                        <Dropdown.Toggle variant="primary" id="dropdown-basic">
                                            {dropdownText}
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu>
                                            {Object.entries(groups).map(([groupName, members]) => (<Dropdown.Item key={groupName} eventKey={groupName} >{groupName}</Dropdown.Item>))}
                                            <Dropdown.Item eventKey="Alla">Alla</Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                    &nbsp;<p className="mt-1">Group</p>
                                </Container>
                            </Container>

                        </Col>
                        <Col>
                            {splitFormChecks()[1]}
                        </Col>
                    </Row>

                </Col>
                <Col xl={4} lg={5} md={12} sm={10} xs={11} className="p-3 d-flex flex-column justify-content-between">
                    <Form.Label>Start Date</Form.Label>
                    <Form.Control type="date" value={startdate.value} onChange={(e) => setStartDateFunc(e.target.value)} />
                    <Form.Label className="mt-3">End Date</Form.Label>
                    <Form.Control type="date" value={enddate.value} onChange={(e) => setEndDateFunc(e.target.value)} />
                    <Form.Label className="mt-3">Month filter</Form.Label>
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
                    <Container className="justify-content-between d-flex">

                        <Container className="m-0 p-0 mt-4 d-lg-none d-flex">
                            <Dropdown onSelect={(eventKey) => handleSelect(eventKey, groups)}>
                                <Dropdown.Toggle variant="primary" id="dropdown-basic">
                                    {dropdownText}
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    {Object.entries(groups).map(([groupName, members]) => (
                                        <Dropdown.Item key={groupName} eventKey={groupName}>
                                            {groupName}
                                        </Dropdown.Item>
                                    ))}
                                    <Dropdown.Item eventKey="Alla">Alla</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                            &nbsp;<p className="mt-1">Group</p>
                        </Container>

                        <Container className="m-0 p-0 d-flex mt-4">
                            <Form.Check onChange={() => alldates.set(!alldates.value)} />
                            &nbsp;<p>Show all dates</p>
                        </Container>
                    </Container>

                </Col>
            </Row>
        </>
    );
};