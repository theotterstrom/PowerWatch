import { Container, Row, Col, Form, Dropdown, Button } from "react-bootstrap";
import React, { useState, useEffect } from "react";

export default ({ initData }) => {
    const { allDataStates, dateStates, devices, filterStr, filterData } = initData;

    const {
        alldates,
        enddate,
        startdate,
        month,
        timefilter
    } = dateStates;

    const [expanded, setExpanded] = useState(false);

    const [currentGroup, setGroup] = useState("Alla");
    const [currentPanel, setCurrentPanel] = useState("empty");

    const [currentFilter, setCurrentFilter] = useState("Mellan datum");
    const filterArr = ["Mellan datum", "Månad", "Timmar per dag"];

    const [spanTitle, setSpanTitle] = useState(filterStr.timeStr.interval)

    useEffect(() => {
        if (currentFilter === "Mellan datum") {
            timefilter.set("dates")
            setSpanTitle(filterStr.timeStr.interval)
        } else if (currentFilter === "Månad") {
            timefilter.set("month")
            setSpanTitle(filterStr.timeStr.month)
        } else if (currentFilter === "Timmar per dag") {
            timefilter.set("day")
            setSpanTitle(filterStr.timeStr.day)
        }
    }, [currentFilter])

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
        const firstHalfSize = Math.ceil(totalDevices / 2);
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

    window.addEventListener('click', (event) => {
        const powerOptionPanel = document.getElementsByClassName("powerOptionPanel")[0];
        const chartTextVals = Array.from(document.getElementsByClassName("chartTextVals"));
        const excludeArrow = Array.from(document.getElementsByClassName("exludeArrow"));

        const excludeElements = [powerOptionPanel, ...chartTextVals, ...excludeArrow];

        // Check if event target is inside any of the excluded elements
        if (!excludeElements.some(el => el.contains(event.target))) {
            setExpanded(false);
            setCurrentPanel("empty");
        } else {
            setExpanded(true);
        }
    });

    return (
        <>
            <Row className="my-5 mx-0 p-0 justify-content-center justify-content-lg-start text-lg-start text-center">
                <Col xl={6} lg={6} md={9} sm={10} className="m-0 p-0 mt-lg-3 mt-2 ">
                    <Container className="chartText">
                        {`Du konsumerade `}
                        <span className="chartTextVals p-1" onClick={() => {
                            setCurrentPanel("power")
                            setExpanded(true)
                        }}>{filterStr.watt}</span><br></br>
                        {` ${currentFilter === "Timmar per dag" ? "den" : currentFilter === "Månad" ? "under" : "mellan"} `}
                        <span className="chartTextVals p-1" onClick={() => {
                            setCurrentPanel("time")
                            setExpanded(true)
                        }}>{spanTitle}</span><br></br>
                        {` fördelat på `}
                        <span className="chartTextVals p-1" onClick={() => {
                            setCurrentPanel("devices")
                            setExpanded(true)
                        }}>{filterStr.deviceNo} enheter.</span>
                    </Container>
                </Col>
                <Col xl={6} lg={6} md={9} sm={10} className="m-0 p-0 mt-lg-3 mt-4  position-relative">
                    <Container className="powerOptionPanel py-4" style={{ maxHeight: expanded ? "300px" : "0" }}>
                        <div onClick={() => {
                            setCurrentPanel(expanded ? "empty" : "time");
                            setExpanded(!expanded);
                        }} className="position-absolute" style={{ right: "20px", top: "10px", cursor: "pointer" }}>
                            <i className={expanded ? "fa fa-arrow-up exludeArrow" : "fa fa-arrow-down exludeArrow"} ></i>
                        </div>
                        {currentPanel === "empty" ? <>
                            <p className="text-center" style={{ marginTop: "-12px", height: "200px", pointerEvents: "none" }}>Alternativ</p>
                        </> : <></>}
                        {currentPanel === "time" ? <>
                            <div className="d-flex justify-content-center" style={{ marginTop: "-12px" }}>
                                <Button className="" variant="transparent" style={{ color: "white", marginTop: "-12px" }} onClick={prevFilter}><i class="fa-solid fa-arrow-left"></i></Button>
                                <p className="text-center" style={{ width: "150px" }}>{currentFilter}</p>
                                <Button className="" variant="transparent" style={{ color: "white", marginTop: "-12px" }} onClick={nextFilter}><i class="fa-solid fa-arrow-right"></i></Button>
                            </div>
                            <Row className="d-flex justify-content-center">
                                <Col xl={8}>
                                    {currentFilter === "Mellan datum" && <>
                                        <Form.Label>Start Datum</Form.Label>
                                        <Form.Control type="date" value={startdate.value} onChange={(e) => setStartDateFunc(e.target.value)} />
                                        <Form.Label className="mt-3">Slut Datum</Form.Label>
                                        <Form.Control type="date" value={enddate.value} onChange={(e) => setEndDateFunc(e.target.value)} />
                                    </>}
                                    {currentFilter === "Månad" && <>
                                        <Dropdown onSelect={(eventKey) => month.set(eventKey)} className="mt-2" style={{ width: "100%", overflow: "visible" }}>
                                            <Dropdown.Toggle variant="light" id="dropdown-basic" style={{ width: "100%", textAlign: "start", height: "35px", padding: "0 0 0 20px" }}>
                                                {generateMonthOptions().firstMonth}
                                            </Dropdown.Toggle>
                                            <Dropdown.Menu>
                                                {generateMonthOptions().months}
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </>}
                                    {currentFilter === "Timmar per dag" && <>
                                        <Form.Label>Date</Form.Label>
                                        <Form.Control type="date" value={startdate.value} onChange={(e) => setStartDateFunc(e.target.value)} />
                                    </>}
                                </Col>
                            </Row>
                        </> : <></>}
                        {currentPanel === "devices" ? <>
                            <p className="text-center" style={{ marginTop: "-12px", height: "200px", pointerEvents: "none" }}>Enheter</p>
                            <Row className="m-0 p-0 mt-3 d-flex justify-content-start" style={{ height: "100%" }}>
                                <Col xxl={4} xl={6} lg={6} md={4} >
                                    {splitFormChecks().firstHalfForms}
                                </Col>
                                <Col xxl={4} xl={6} lg={6} md={4}>
                                    {splitFormChecks().secondHalfForms}
                                </Col>
                                <Col xxl={4} xl={12} lg={12} md={4} className="p-2 mt-xxl-0 mt-lg-4 mt-md-0" style={{ border: "1px solid white", borderRadius: "5px", color: "white" }}>
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
                                            <div className="mt-1" style={{ cursor: "pointer", borderRadius: "4px", background: currentGroup === "Alla" ? "white" : "transparent", color: currentGroup === "Alla" ? "black" : "inherit" }} onClick={() => handleSelect("Alla", groups)}>
                                                Alla
                                            </div>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </> : <></>}
                        {currentPanel === "power" ? <>
                            <p className="text-center" style={{ marginTop: "-12px", height: "200px", pointerEvents: "none" }}>Förbrukning per enhet</p>
                            <Container className="mt-3">
                                {Object.entries(filterData.consumption).map(([deviceName, consumption]) => (
                                    <Row className="justify-content-center">
                                        <Col xl={4}>
                                            {devices.value.find(device => device.deviceName === deviceName)?.displayName}:
                                        </Col>
                                        <Col xl={4} className="text-end">
                                            {consumption.toFixed(2)} kwH
                                        </Col>
                                    </Row>
                                ))}
                            </Container>
                        </> : <></>}
                    </Container>
                </Col>
            </Row>
        </>
    );
};