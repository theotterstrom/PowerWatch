import { Container, Row, Col, Form, Dropdown, Button } from "react-bootstrap";
import React, { useState, useEffect } from "react";
export default ({ initData }) => {
    const { allDataStates, dateStates, devices } = initData;

    const {
        alldates,
        enddate,
        startdate,
        month,
        timefilter
    } = dateStates;

    const [expanded, setExpanded] = useState(false);
    const [currentFilter, setCurrentFilter] = useState("Dates");
    const [currentGroup, setGroup] = useState("Alla");
    const filterArr = ["Devices", "Dates"];

    const setStartDateFunc = date => {
        if (date > new Date().toISOString()) {
            alert("Date cannot be greater than todays date")
        } else if (new Date(date) > new Date(enddate.value)) {
            alert("Date cannot be earlier than end date")
        } else {
            startdate.set(date);
        }
    };
    const setEndDateFunc = date => {
        if (date > new Date().toISOString()) {
            alert("Date cannot be greater than todays date")
        } else if (new Date(date) < new Date(startdate.value)) {
            alert("Date cannot be earlier than start date")
        } else {
            enddate.set(date);
        }
    };

    const handleSelect = (eventKey, groups) => {
        setGroup(eventKey)
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

    const generateMonthOptions = () => {
        let months = [];
        const startDate = new Date("2024-12-01");
        const currentDate = new Date();
        const monthNames = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        let iteratorDate = new Date(startDate);
        let firstMonth;
        while (iteratorDate <= currentDate) {
            const year = iteratorDate.getFullYear();
            const month = String(iteratorDate.getMonth() + 1).padStart(2, "0");
            const monthStr = `${year} ${monthNames[parseInt(month) - 1]}`;
            firstMonth = monthStr;
            months.push(
                <Dropdown.Item key={monthStr} eventKey={monthStr}>{monthStr}</Dropdown.Item>
            );
            iteratorDate.setMonth(iteratorDate.getMonth() + 1);
        }

        return {
            months,
            firstMonth
        };
    };

    const splitFormChecks = () => {
        const totalDevices = devices.value.length;
        const firstHalfSize = Math.ceil(totalDevices / 2); // Ensures first half is larger if odd
        const secondHalfSize = Math.floor(totalDevices / 2);

        const firstHalf = devices.value.slice(0, firstHalfSize);
        const secondHalf = devices.value.slice(firstHalfSize, firstHalfSize + secondHalfSize);

        const firstHalfForms = firstHalf.map((obj, index) =>
            <Form.Check
                type="checkbox"
                key={index}
                label={obj.displayName}
                checked={allDataStates[obj.deviceName].value}
                onChange={() => allDataStates[obj.deviceName].set(!allDataStates[obj.deviceName].value)}
            />
        );

        const secondHalfForms = secondHalf.map((obj, index) =>
            <Form.Check
                type="checkbox"
                key={index + 100}
                label={obj.displayName}
                checked={allDataStates[obj.deviceName].value}
                onChange={() => allDataStates[obj.deviceName].set(!allDataStates[obj.deviceName].value)}
            />
        );

        const firstGroupSize = Math.ceil(totalDevices / 3);
        const secondGroupSize = Math.ceil((totalDevices - firstGroupSize) / 2);
        const thirdGroupSize = totalDevices - firstGroupSize - secondGroupSize;

        const firstGroup = devices.value.slice(0, firstGroupSize);
        const secondGroup = devices.value.slice(firstGroupSize, firstGroupSize + secondGroupSize);
        const thirdGroup = devices.value.slice(firstGroupSize + secondGroupSize);

        const createFormChecks = (group, offset) =>
            group.map((obj, index) => (
                <Form.Check
                    type="checkbox"
                    key={index + offset}
                    label={obj.displayName}
                    checked={allDataStates[obj.deviceName].value}
                    onChange={() => allDataStates[obj.deviceName].set(!allDataStates[obj.deviceName].value)}
                />
            ));

        return {
            firstHalfForms,
            secondHalfForms,
            firstThirdForms: createFormChecks(firstGroup, 200),
            secondThirdForms: createFormChecks(secondGroup, 300),
            thirdThirdForms: createFormChecks(thirdGroup, 400)
        };
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

    const nextFilter = () => {
        setCurrentFilter((prev) => {
            const currentIndex = filterArr.indexOf(prev);
            const nextIndex = (currentIndex + 1) % filterArr.length;
            return filterArr[nextIndex];
        });
    };

    const prevFilter = () => {
        setCurrentFilter((prev) => {
            const currentIndex = filterArr.indexOf(prev);
            const prevIndex = (currentIndex - 1 + filterArr.length) % filterArr.length;
            return filterArr[prevIndex];
        });
    };

    return (
        <>
            <Container className="d-flex justify-content-lg-start justify-content-center m-0 p-0">
                <Button onClick={() => setExpanded(!expanded)} variant="transparent" style={{ color: "white" }}>
                    Filter options {expanded ? '▲' : '▼'}
                </Button>
            </Container>


            <Container className="powerOptionsDrop p-0 m-0" style={{
                maxHeight: expanded ? "400px" : "0", // 500px is an arbitrary large value
                transition: "max-height 1s ease",
                overflow: "hidden",
            }}>
                <Container className="d-flex justify-content-center p-0 m-0">
                    <Button className="mx-4" variant="transparent" style={{ color: "white" }} onClick={prevFilter}>⯇</Button>
                    <p className="text-center mt-3 bg-dan" style={{ width: "100px" }}>{currentFilter}</p>
                    <Button className="mx-4" variant="transparent" style={{ color: "white" }} onClick={nextFilter}>⯈</Button>
                </Container>
                {currentFilter === "Devices" &&
                    <Row className="m-0 p-0 mt-sm-2 mt-md-2 mt-lg-3 d-flex justify-content-start" style={{ height: "100%" }}>

                        <Col xl={4} lg={4} xs={6} className="d-lg-block d-md-none d-sm-none d-xs-block">
                            {splitFormChecks().firstHalfForms}
                        </Col>

                        <Col xl={4} lg={4} xs={6} className="d-lg-block d-md-none d-sm-none d-xs-block">
                            {splitFormChecks().secondHalfForms}
                        </Col>

                        <Col md={4} sm={4} xs={4} className="d-lg-none d-md-block d-sm-block d-none">
                            {splitFormChecks().firstThirdForms}
                        </Col>
                        <Col md={4} sm={4} xs={4} className="d-lg-none d-md-block d-sm-block d-none">
                            {splitFormChecks().secondThirdForms}
                        </Col>
                        <Col md={4} sm={4} xs={4} className="d-lg-none d-md-block d-sm-block d-none">
                            {splitFormChecks().thirdThirdForms}
                        </Col>

                        <Col xl={0} lg={0} md={2} sm={2} xs={1} className="d-lg-none d-block"></Col>
                        <Col xl={4} lg={4} md={8} sm={8} xs={10} className="p-2 mt-lg-0 mt-4" style={{ border: "1px solid white", borderRadius: "5px", color: "white" }}>
                            <Col sm={12} xs={12} className="text-center"><b>Groups</b></Col>
                            <Row className="text-center mt-2">
                                <Col>
                                    {Object.entries(groups)
                                        .filter((_, index) => index % 2 === 0)
                                        .map(([groupName]) => (
                                            <div
                                                key={groupName}
                                                className="mt-1"
                                                style={{
                                                    cursor: "pointer",
                                                    borderRadius: "4px",
                                                    background: currentGroup === groupName ? "white" : "transparent",
                                                    color: currentGroup === groupName ? "black" : "inherit"
                                                }}
                                                onClick={() => handleSelect(groupName, groups)}
                                            >
                                                {groupName}
                                            </div>
                                        ))}
                                </Col>
                                <Col>
                                    {Object.entries(groups)
                                        .filter((_, index) => index % 2 !== 0)
                                        .map(([groupName]) => (
                                            <div
                                                key={groupName}
                                                className="mt-1"
                                                style={{
                                                    cursor: "pointer",
                                                    borderRadius: "4px",
                                                    background: currentGroup === groupName ? "white" : "transparent",
                                                    color: currentGroup === groupName ? "black" : "inherit"
                                                }}
                                                onClick={() => handleSelect(groupName, groups)}
                                            >
                                                {groupName}
                                            </div>
                                        ))}
                                    <div
                                        className="mt-1"
                                        style={{
                                            cursor: "pointer",
                                            borderRadius: "4px",
                                            background: currentGroup === "Alla" ? "white" : "transparent",
                                            color: currentGroup === "Alla" ? "black" : "inherit"
                                        }}
                                        onClick={() => handleSelect("Alla", groups)}
                                    >
                                        Alla
                                    </div>
                                </Col>
                            </Row>
                        </Col>
                    </Row>}
                {currentFilter === "Dates" &&
                    <Row className="m-0 p-0 mt-sm-2 mt-md-2 mt-lg-3 d-flex justify-content-start" style={{ height: "100%" }}>
                        <Row>
                            <Col xl={4} lg={4} md={12}>
                                <Container onClick={() => timefilter.set("dates")} className="py-lg-3 py-1 px-2 powerDateB" style={{ border: timefilter.value === "dates" && "1px solid white" }}>
                                    <b>Between two dates</b>
                                </Container>

                                <Container className="m-0 p-0 mt-4 d-lg-block d-none" style={{
                                    opacity: timefilter.value === "dates" ? "100%" : "0", // 500px is an arbitrary large value
                                    transition: "opacity 0.5s ease",

                                }}>
                                    <Form.Label>Start Date</Form.Label>
                                    <Form.Control type="date" value={startdate.value} onChange={(e) => setStartDateFunc(e.target.value)} />
                                    <Form.Label className="mt-3">End Date</Form.Label>
                                    <Form.Control type="date" value={enddate.value} onChange={(e) => setEndDateFunc(e.target.value)} />
                                </Container>

                                <Container className="m-0 p-0 mt-4 d-lg-none d-block" style={{
                                    height: timefilter.value === "dates" ? "170px" : "0", // 500px is an arbitrary large value
                                    transition: "height 0.5s ease",
                                    overflow: "hidden"
                                }}>
                                    <Form.Label>Start Date</Form.Label>
                                    <Form.Control type="date" value={startdate.value} onChange={(e) => setStartDateFunc(e.target.value)} />
                                    <Form.Label className="mt-3">End Date</Form.Label>
                                    <Form.Control type="date" value={enddate.value} onChange={(e) => setEndDateFunc(e.target.value)} />
                                </Container>

                            </Col>
                            <Col xl={4} lg={4} md={12}>
                                <Container onClick={() => timefilter.set("month")} className="py-lg-3 py-1  powerDateB" style={{ border: timefilter.value === "month" && "1px solid white" }}>
                                    <b>Specific month</b>
                                </Container>

                                <Container className="m-0 p-0 mt-4 d-lg-block d-none" style={{
                                    opacity: timefilter.value === "month" ? "100%" : "0", // 500px is an arbitrary large value
                                    transition: "opacity 0.5s ease",
                                }}>
                                    <Form.Label>Month</Form.Label>
                                    <Dropdown onSelect={(eventKey) => month.set(eventKey)} className="mt-2" style={{ width: "100%", overflow: "visible" }}>
                                        <Dropdown.Toggle variant="light" id="dropdown-basic" style={{ width: "100%", textAlign: "start", height: "35px", padding: "0 0 0 20px" }}>
                                            {generateMonthOptions().firstMonth}
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu>
                                            {generateMonthOptions().months}
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </Container>

                                <Container className="m-0 p-0 mt-4 d-lg-none d-block" style={{
                                    height: timefilter.value === "month" ? "100px" : "0", // 500px is an arbitrary large value
                                    transition: "height 0.5s ease",
                                    overflow: "hidden"

                                }}>
                                    <Form.Label>Month</Form.Label>
                                    <Dropdown onSelect={(eventKey) => month.set(eventKey)} className="mt-2" style={{ width: "100%", overflow: "visible" }}>
                                        <Dropdown.Toggle variant="light" id="dropdown-basic" style={{ width: "100%", textAlign: "start", height: "35px", padding: "0 0 0 20px" }}>
                                            {generateMonthOptions().firstMonth}
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu>
                                            {generateMonthOptions().months}
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </Container>

                            </Col>
                            <Col xl={4} lg={4} md={12}>
                                <Container onClick={() => timefilter.set("day")} className="py-lg-3 py-1  powerDateB" style={{ border: timefilter.value === "day" && "1px solid white" }}>
                                    <b>Hours in a day</b>
                                </Container>

                                <Container className="m-0 p-0 mt-4 d-lg-block d-none" style={{
                                    opacity: timefilter.value === "day" ? "100%" : "0", // 500px is an arbitrary large value
                                    transition: "opacity 0.5s ease"
                                }}>
                                    <Form.Label>Date</Form.Label>
                                    <Form.Control type="date" value={startdate.value} onChange={(e) => setStartDateFunc(e.target.value)} />
                                </Container>
                                <Container className="m-0 p-0 mt-1 d-lg-none d-block" style={{
                                    height: timefilter.value === "day" ? "100px" : "0", // 500px is an arbitrary large value
                                    transition: "height 0.5s ease",
                                    overflow: "hidden"
                                }}>
                                    <Form.Label>Date</Form.Label>
                                    <Form.Control type="date" value={startdate.value} onChange={(e) => setStartDateFunc(e.target.value)} />
                                </Container>
                            </Col>
                        </Row>
                    </Row>}
            </Container>
        </>
    );
};