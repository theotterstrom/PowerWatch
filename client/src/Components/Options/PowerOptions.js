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
    const [groupExpanded, setGroupExpanded] = useState(false);
    const [currentGroup, setGroup] = useState("Alla");
    const [currentPanel, setCurrentPanel] = useState("empty");
    const [currentFilter, setCurrentFilter] = useState("Mellan datum");
    const [spanTitle, setSpanTitle] = useState(filterStr.timeStr.interval)
    const filterArr = ["Mellan datum", "Månad", "Timmar per dag"];

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

    useEffect(() => {
        if (currentPanel === "devices") {
            setGroupExpanded(true)
        }
    }, [currentGroup]);

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
        const altButtons = Array.from(document.getElementsByClassName("altButton"))
        const excludeElements = [powerOptionPanel, ...chartTextVals, ...excludeArrow, ...altButtons];

        // Check if event target is inside any of the excluded elements
        if (!excludeElements.some(el => el && el.contains(event.target) || el === event.target)) {
            setExpanded(false);
            setCurrentPanel("empty");
        } else {
            // setExpanded(true);
        }
    });

    console.log(month)
    return (
        <>
            <Row className="my-5 mx-0 p-0 justify-content-center justify-content-lg-start text-lg-start text-center">
                <Col xxl={4} xl={4} lg={4} md={9} sm={10} className="m-0 p-0 mt-lg-0 mt-2">
                    <div style={{ fontSize: "18px", fontWeight: "bold" }}>
                        <i className="fa-solid fa-bolt"></i>&nbsp; Energi & Temperatur
                    </div>
                    <Container className="chartText mt-3">
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
                <Col xxl={expanded ? 6 : 2} xl={expanded ? 6 : 2} lg={expanded ? 8 : 2} md={8} sm={10} className="m-0 p-0 mt-lg-0 mt-2 position-relative" style={{maxWidth: "500px"}}>
                    <Container className="powerOptionPanel py-4" style={{ maxHeight: expanded ? currentPanel === "devices" ? "400px" : "200px" : "0", overflow: expanded && currentPanel == "time" && currentFilter === "Månad" ? "visible" : "hidden" }}>
                        <Container className="mt-4" onClick={() => {
                            if (currentPanel === "empty") {
                                setCurrentPanel(expanded ? "empty" : "time");
                                setExpanded(!expanded);
                            };
                        }} style={{ cursor: currentPanel === "empty" ? "pointer" : "unset" }}>
                            {currentPanel === "empty" ? <>
                                <p className="text-center" style={{ marginTop: "-38px", height: "100px", pointerEvents: "none" }}>Alternativ</p>
                            </> : <></>}
                            {currentPanel === "time" ? <>
                                <div className="d-flex justify-content-center" style={{ marginTop: "-38px" }}>
                                    <Button className="" variant="transparent" style={{ color: "white", marginTop: "-12px" }} onClick={prevFilter}><i className="fa-solid fa-arrow-left"></i></Button>
                                    <p className="text-center" style={{ width: "150px" }}>{currentFilter}</p>
                                    <Button className="" variant="transparent" style={{ color: "white", marginTop: "-12px" }} onClick={nextFilter}><i className="fa-solid fa-arrow-right"></i></Button>
                                </div>
                                <Row className="d-flex justify-content-center">
                                    <Col xl={12}>
                                        {currentFilter === "Mellan datum" && <>
                                            <Row className="justify-content-around mt-1">
                                                <Col xxl={5} lg={5} md={8}>
                                                    <Form.Control type="date" value={startdate.value} onChange={(e) => setStartDateFunc(e.target.value)} />
                                                </Col>
                                                <Col xxl={2} lg={2} md={12} className="d-flex justify-content-center mt-3">
                                                <div style={{ height: "5px", width: "30px", background: "white" }}></div>

                                                </Col>
                                                <Col xxl={5} lg={5} md={8} className="mt-lg-0 mt-3">

                                                    <Form.Control type="date" value={enddate.value} onChange={(e) => setEndDateFunc(e.target.value)} />
                                                </Col>
                                            </Row>
                                        </>}
                                        {currentFilter === "Månad" && <>
                                            <Row className="justify-content-center mt-1" >
                                                <Col xxl={8} className="mt-2" >
                                                    <Dropdown onSelect={(eventKey) => month.set(eventKey)} style={{ width: "100%" }}>
                                                        <Dropdown.Toggle variant="light" id="dropdown-basic" style={{ width: "100%", textAlign: "start", height: "35px", padding: "0 0 0 20px" }}>
                                                            {generateMonthOptions().firstMonth}
                                                        </Dropdown.Toggle>
                                                        <Dropdown.Menu>
                                                            {generateMonthOptions().months}
                                                        </Dropdown.Menu>
                                                    </Dropdown>
                                                </Col>
                                            </Row>

                                        </>}
                                        {currentFilter === "Timmar per dag" && <>
                                            <Row className="justify-content-center mt-1">
                                                <Col xxl={8} className="mt-2" >
                                                    <Form.Control type="date" value={startdate.value} onChange={(e) => setStartDateFunc(e.target.value)} />
                                                </Col>
                                            </Row>
                                        </>}
                                    </Col>
                                </Row>
                            </> : <></>}
                            {currentPanel === "devices" ? <>
                                <p className="text-center" style={{ marginTop: "-38px", height: "10px", pointerEvents: "none" }}>Grupper</p>
                                <Row className="m-0 p-0 mt-3 d-flex justify-content-start" style={{ height: "100%" }}>
                                    <Col xxl={6} xl={12} sm={6}>
                                        {Object.entries(groups).filter((_, index) => index % 2 === 0).map(([groupName]) => (
                                            <>
                                                <div key={groupName} className="mt-1 p-1"
                                                    style={{ cursor: "pointer", borderRadius: "4px", background: currentGroup === groupName ? "white" : "transparent", color: currentGroup === groupName ? "black" : "inherit" }}
                                                    onClick={() => {
                                                        handleSelect(groupName, groups)
                                                        setGroupExpanded(!groupExpanded)
                                                    }}>
                                                    {groupName}
                                                </div>
                                                <div className="p-2 text-start" style={{ border: "1px solid white", fontSize: "12px", display: currentGroup === groupName && groupExpanded ? "block" : "none" }}>
                                                    {groups[groupName].map((member, index) => {
                                                        const deviceName = devices.value.find(device => device.displayName === member)?.deviceName;
                                                        return (<>
                                                            <Form.Check type="checkbox" key={index} label={member} checked={allDataStates[deviceName].value} onChange={() => allDataStates[deviceName].set(!allDataStates[deviceName].value)} />
                                                        </>)
                                                    })}
                                                </div>
                                            </>
                                        ))}
                                    </Col>
                                    <Col xxl={6} xl={12} sm={6}>
                                        {Object.entries(groups).filter((_, index) => index % 2 !== 0).map(([groupName]) => (
                                            <>
                                                <div key={groupName} className="mt-1 p-1"
                                                    style={{
                                                        cursor: "pointer",
                                                        borderRadius: "4px",
                                                        background: currentGroup === groupName ? "white" : "transparent",
                                                        color: currentGroup === groupName ? "black" : "inherit"
                                                    }}
                                                    onClick={() => {
                                                        handleSelect(groupName, groups)
                                                        setGroupExpanded(!groupExpanded)
                                                    }}>
                                                    {groupName}
                                                </div>
                                                <div className="p-2 text-start" style={{ border: "1px solid white", fontSize: "12px", display: currentGroup === groupName && groupExpanded ? "block" : "none" }}>
                                                    {groups[groupName].map((member, index) => {
                                                        const deviceName = devices.value.find(device => device.displayName === member)?.deviceName;
                                                        return (<>
                                                            <Form.Check type="checkbox" key={index} label={member} checked={allDataStates[deviceName].value} onChange={() => allDataStates[deviceName].set(!allDataStates[deviceName].value)} />
                                                        </>)
                                                    })}
                                                </div>
                                            </>
                                        ))}
                                        <div className="mt-1 p-1" style={{ cursor: "pointer", borderRadius: "4px", background: currentGroup === "Alla" ? "white" : "transparent", color: currentGroup === "Alla" ? "black" : "inherit" }} onClick={() => handleSelect("Alla", groups)}>
                                            Alla
                                        </div>
                                    </Col>
                                </Row>
                            </> : <></>}
                            {currentPanel === "power" ? <>
                                <p className="text-center" style={{ marginTop: "-38px", height: "10px", pointerEvents: "none" }}>Förbrukning per enhet</p>
                                <Container className="mt-4">
                                    {Object.entries(filterData.consumption).map(([deviceName, consumption]) => (
                                        <Row className="justify-content-center" style={{ fontSize: "12px" }}>
                                            <Col xxl={5} xl={6} md={6} sm={6} xs={6} className="text-start">
                                                {devices.value.find(device => device.deviceName === deviceName)?.displayName}:
                                            </Col>
                                            <Col xxl={5} xl={6} md={6} sm={6} xs={6} className="text-end">
                                                {consumption.toFixed(2)} kwH
                                            </Col>
                                        </Row>
                                    ))}
                                </Container>
                            </> : <></>}
                        </Container>
                    </Container>
                </Col>
            </Row>
        </>
    );
};