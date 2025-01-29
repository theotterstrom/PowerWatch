import { Container, Row, Col, Form, Dropdown } from "react-bootstrap";
import React, { useState } from "react";

export default ({ initData }) => {
    const { allDataStates, dateStates, devices, savingsData } = initData;
    const { totalSpending, totalSaved } = savingsData;

    const savingsDevices = JSON.parse(JSON.stringify(devices))
    savingsDevices.value = savingsDevices.value.filter(obj => obj.deviceType === "Relay");
    const {
        savingsstartdate,
        savingsenddate,
        allsavingsdate,
        savingsmonth
    } = dateStates;

    const [dropdownText, setDropdownText] = useState("Alla");
    const [monthText, setMonthText] = useState(savingsmonth.value);

    const setSavingStartDateFunc = date => {
        if (date > new Date().toISOString()) {
            alert("Date cannot be greater than todays date")
        } else if(new Date(date) > new Date(savingsenddate.value)){
            alert("Date cannot be earlier than end date")
        } else {
            savingsstartdate.set(date);
        }
    };
    const setSavingEndDateFunc = date => {
        if (date > new Date().toISOString()) {
            alert("Date cannot be greater than todays date")
        } else if(new Date(date) < new Date(savingsstartdate.value)){
            alert("Date cannot be earlier than start date")
        } else {
            savingsenddate.set(date);
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
            const displayName = savingsDevices.value.find(obj => obj.deviceName === deviceName).displayName;
            if (rightGroup.includes(displayName)) {
                state.set(true)
            } else {
                state.set(false)
            }
        };
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
        };
        months.unshift(
            <Dropdown.Item key="None" eventKey="None">None</Dropdown.Item>
        );
        return months;
    };

    const splitFormChecks = () => {
        const firstHalf = savingsDevices.value.filter((obj, index) => {
            if (index > savingsDevices.value.length / 2 - 1) {
                return false
            }
            return true;
        });
        const secondHalf = savingsDevices.value.filter((obj, index) => {
            if (index > savingsDevices.value.length / 2 - 1) {
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

    const groups = savingsDevices.value.reduce((acc, cur) => {
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
                <Container className="d-lg-none d-md-block">
                    <Row>
                        <Col className="savingsText" >
                            <b>Total spending:</b><br></br>
                            <b>Average price:</b><br></br>
                            <div></div>
                            <b>Total saved:</b>
                        </Col>
                        <Col>
                            {(totalSpending[0] / 100).toFixed(2)} SEK<br></br>
                            {(totalSpending[1] / 100).toFixed(2)} SEK
                            <div></div>
                            {(totalSaved / 100).toFixed(2)} SEK
                        </Col>
                    </Row>
                </Container>
                <Col xl={8} lg={7} md={12} sm={10} xs={11} className="p-3 d-lg-block d-none">
                    <Row>
                        <Col className="savingsText" >
                            <b>Total spending:</b><br></br>
                            <b>Average price:</b><br></br>
                            <div></div>
                            <b>Total saved:</b>
                        </Col>
                        <Col>
                            {(totalSpending[0] / 100).toFixed(2)} SEK<br></br>
                            {(totalSpending[1] / 100).toFixed(2)} SEK
                            <div></div>
                            {(totalSaved / 100).toFixed(2)} SEK
                        </Col>
                    </Row>
                    <Row className="p-0 m-0 mt-5" style={{ height: "100%" }}>
                        <Col className="d-flex flex-column">
                            {splitFormChecks()[0]}

                            <Container className="mt-5 m-0 p-0 d-flex flex-column-reverse">
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
                    <Form.Control type="date" value={savingsstartdate.value} onChange={(e) => setSavingStartDateFunc(e.target.value)} />
                    <Form.Label className="mt-3">End Date</Form.Label>
                    <Form.Control type="date" value={savingsenddate.value} onChange={(e) => setSavingEndDateFunc(e.target.value)} />
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
                    <Container className="d-flex justify-content-between">
                        <Container className="m-0 p-0 mt-4 d-lg-none d-md-flex">
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
                            <Form.Check onChange={() => allsavingsdate.set(!allsavingsdate.value)} />
                            &nbsp;<p>Show all dates</p>
                        </Container>
                    </Container>
                </Col>
            </Row>
        </>
    );
}