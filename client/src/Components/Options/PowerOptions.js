import { Container, Row, Col, Form, Dropdown, Button, Tabs, Tab } from "react-bootstrap";
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
    const [currentPanel, setCurrentPanel] = useState("time");
    const [currentFilter, setCurrentFilter] = useState("Mellan datum");
    const filterArr = ["Mellan datum", "Månad", "Timmar per dag"];

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

    const filterMap = {
        "Mellan datum": "dates",
        "Månad": "month",
        "Timmar per dag": "day"
    };

    const nextFilter = () => {
        setCurrentFilter((prev) => {
            const currentIndex = filterArr.indexOf(prev);
            const nextIndex = (currentIndex + 1) % filterArr.length;
            const newFilter = filterArr[nextIndex]
            timefilter.set(filterMap[newFilter])
            return newFilter;
        });
    };

    const prevFilter = () => {
        setCurrentFilter((prev) => {
            const currentIndex = filterArr.indexOf(prev);
            const prevIndex = (currentIndex - 1 + filterArr.length) % filterArr.length;
            const newFilter = filterArr[prevIndex];
            timefilter.set(filterMap[newFilter])
            return newFilter
        });
    };
    const setCurrentPanelFunc = (newPanel) => {
        setCurrentPanel(newPanel.target.getAttribute("panel"))
    };

    window.addEventListener('click', (event) => {
        const powerOptionPanel = document.getElementsByClassName("powerOptionPanel")[0];
        const chartTextVals = Array.from(document.getElementsByClassName("chartTextVals"));
        const excludeArrow = Array.from(document.getElementsByClassName("exludeArrow"));
        const altButtons = Array.from(document.getElementsByClassName("altButton"))
        const excludeElements = [powerOptionPanel, ...chartTextVals, ...excludeArrow, ...altButtons];

        if (!excludeElements.some(el => el && el.contains(event.target) || el === event.target)) {
            setExpanded(false);
        } else {
            setExpanded(true);
        }
    });

    const toggledStyle = {
        background: "var(--newBlue2)",
        color: "white",
    };
    const untoggledStyle = {
        background: "transparent",
        color: "white",
    };

    const desktopToggled = {
        borderRadius: "5px",
        borderTopRightRadius: 0,
        borderBottomRightRadius: 0,
        color: "white",
        background: "rgba(171, 171, 171, 0.33)"
    };

    const filterWindowStyle = {
        borderRadius: "5px",
        borderTopLeftRadius: currentPanel === "power" ? 0 : "5px",
        borderBottomLeftRadius: currentPanel === "devices" ? 0 : "5px",
        direction: "ltr",
        color: "white",
        background: "rgba(171, 171, 171, 0.33)",
        zIndex: "0",
 

    };

    const groupStyle = {
        backgroundColor: "rgba(0,0,0,0.8)",
        border: "1px solid white",
        fontSize: "12px",
        borderBottomLeftRadius: "5px",
        borderBottomRightRadius: "5px",
        position: "absolute",
        width: "100%",
        zIndex: "1000"
    };


    let ultTimeStr = currentFilter === "Månad" ? filterStr.timeStr.month : currentFilter === "Timmar per dag" ? filterStr.timeStr.day : filterStr.timeStr.interval;
    return (
        <>
            <Row className="my-5 pb-lg-0 pb-4 mx-0 p-0 justify-content-center justify-content-lg-start text-lg-start text-center">
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
                        }}>{ultTimeStr}</span><br></br>
                        {` fördelat på `}
                        <span className="chartTextVals p-1" onClick={() => {
                            setCurrentPanel("devices")
                            setExpanded(true)
                        }}>{filterStr.deviceNo} enheter.</span>
                    </Container>
                </Col>

                {/* Mobile */}
                <Col md={8} sm={10} className="m-0 p-0 mt-lg-0 mt-2 position-relative d-lg-none d-block" style={{ maxWidth: "400px" }}>
                    <Container className="powerOptionPanel" style={{ maxHeight: expanded ? "300px" : "70px", overflow: expanded && currentPanel == "time" && currentFilter === "Månad" ? "visible" : "hidden" }}>
                        <Container className="d-flex justify-content-between py-3">
                            <Button panel="power" onClick={setCurrentPanelFunc} variant="none" className="popOptionButton" style={currentPanel === "power" ? toggledStyle : untoggledStyle}>Konsumption</Button>
                            <Button panel="time" onClick={setCurrentPanelFunc} variant="none" className="popOptionButton" style={currentPanel === "time" ? toggledStyle : untoggledStyle}>Tid</Button>
                            <Button panel="devices" onClick={setCurrentPanelFunc} variant="none" className="popOptionButton" style={currentPanel === "devices" ? toggledStyle : untoggledStyle}>Enheter</Button>
                        </Container>
                        <Container>
                            {currentPanel === "time" && <Row className="pb-3">
                                <Col md={12}>
                                    <Container className="d-flex justify-content-center">
                                        <div className="d-flex justify-content-center">
                                            <Button className="" variant="transparent" style={{ color: "white", marginTop: "-12px" }} onClick={prevFilter}>
                                                <i className="fa-solid fa-arrow-left"></i>
                                            </Button>
                                            <p className="text-center" style={{ width: "150px" }}>{currentFilter}</p>
                                            <Button className="" variant="transparent" style={{ color: "white", marginTop: "-12px" }} onClick={nextFilter}>
                                                <i className="fa-solid fa-arrow-right"></i>
                                            </Button>
                                        </div>
                                    </Container>
                                    {currentFilter === "Mellan datum" && <>
                                        <Col md={12}>
                                            <Form.Control type="date" value={startdate.value} onChange={(e) => setStartDateFunc(e.target.value)} />
                                        </Col>
                                        <Col md={12} className="d-flex justify-content-center my-3">
                                            <div style={{ height: "5px", width: "30px", background: "white" }}></div>
                                        </Col>
                                        <Col md={12}>
                                            <Form.Control type="date" value={enddate.value} onChange={(e) => setEndDateFunc(e.target.value)} />
                                        </Col>
                                    </>}
                                    {currentFilter === "Månad" && <>
                                        <Row className="justify-content-center mt-1" >
                                            <Col md={12} className="mt-2" >
                                                <Dropdown onSelect={(eventKey) => month.set(eventKey)} style={{ width: "100%" }}>
                                                    <Dropdown.Toggle variant="light" id="dropdown-basic" style={{ width: "100%", textAlign: "start", height: "35px", padding: "0 0 0 20px" }}>
                                                        {month.value}
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
                                            <Col md={12} className="mt-2" >
                                                <Form.Control type="date" value={startdate.value} onChange={(e) => setStartDateFunc(e.target.value)} />
                                            </Col>
                                        </Row>
                                    </>}
                                </Col>
                            </Row>}
                            {currentPanel === "devices" && <Row className="pb-3">
                                <Col>
                                    {Object.entries(groups).filter((_, index) => index % 2 === 0).map(([groupName]) => (
                                        <div key={groupName}>
                                            <div className="mt-1 p-1 text-center"
                                                style={{ cursor: "pointer", borderRadius: "4px", background: currentGroup === groupName ? "white" : "transparent", color: currentGroup === groupName ? "black" : "inherit" }}
                                                onClick={() => {
                                                    handleSelect(groupName, groups)
                                                    if (currentGroup === groupName) {
                                                        setGroupExpanded(!groupExpanded)
                                                    } else {
                                                        setGroupExpanded(true)
                                                    };
                                                }}>
                                                {groupName}
                                            </div>
                                            <div className="p-2 text-start" style={{ border: "1px solid white", fontSize: "12px", display: currentGroup === groupName && groupExpanded ? "block" : "none" }}>
                                                {groups[groupName].map((member, index) => {
                                                    const deviceName = devices.value.find(device => device.displayName === member)?.deviceName;
                                                    return (
                                                        <Form.Check type="checkbox" key={index} label={member} checked={allDataStates[deviceName].value} onChange={() => allDataStates[deviceName].set(!allDataStates[deviceName].value)} />
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    ))}
                                    {Object.entries(groups).length % 2 !== 0 ? <></> :
                                        <div className="mt-1 p-1 text-center" style={{ cursor: "pointer", borderRadius: "4px", background: currentGroup === "Alla" ? "white" : "transparent", color: currentGroup === "Alla" ? "black" : "inherit" }} onClick={() => handleSelect("Alla", groups)}>
                                            Alla
                                        </div>
                                    }
                                </Col>
                                <Col>
                                    {Object.entries(groups).filter((_, index) => index % 2 !== 0).map(([groupName]) => (
                                        <div key={groupName}>
                                            <div className="mt-1 p-1 text-center"
                                                style={{
                                                    cursor: "pointer",
                                                    borderRadius: "4px",
                                                    background: currentGroup === groupName ? "white" : "transparent",
                                                    color: currentGroup === groupName ? "black" : "inherit"
                                                }}
                                                onClick={() => {
                                                    handleSelect(groupName, groups)
                                                    if (currentGroup === groupName) {
                                                        setGroupExpanded(!groupExpanded)
                                                    } else {
                                                        setGroupExpanded(true)
                                                    };
                                                }}>
                                                {groupName}
                                            </div>
                                            <div className="p-2 text-start" style={{ border: "1px solid white", fontSize: "12px", display: currentGroup === groupName && groupExpanded ? "block" : "none" }}>
                                                {groups[groupName].map((member, index) => {
                                                    const deviceName = devices.value.find(device => device.displayName === member)?.deviceName;
                                                    return (<Form.Check type="checkbox" key={index} label={member} checked={allDataStates[deviceName].value} onChange={() => allDataStates[deviceName].set(!allDataStates[deviceName].value)} />)
                                                })}
                                            </div>
                                        </div>
                                    ))}
                                    {Object.entries(groups).length % 2 === 0 ? <></> :
                                        <div className="mt-1 p-1 text-center" style={{ cursor: "pointer", borderRadius: "4px", background: currentGroup === "Alla" ? "white" : "transparent", color: currentGroup === "Alla" ? "black" : "inherit" }} onClick={() => handleSelect("Alla", groups)}>
                                            Alla
                                        </div>
                                    }
                                </Col>
                            </Row>}
                            {currentPanel === "power" && <Row className="pb-3">
                                <Col md={12} className="my-2 m-0 p-0">
                                    {Object.entries(filterData.consumption).map(([deviceName, consumption]) => (
                                        <Row className="justify-content-between m-0 p-0" style={{ fontSize: "10px" }} key={deviceName}>
                                            <Col sm={6} xs={6} className="text-start">
                                                {devices.value.find(device => device.deviceName === deviceName)?.displayName}:
                                            </Col>
                                            <Col sm={6} xs={6} className="text-end">
                                                {consumption.toFixed(2)} kwH
                                            </Col>
                                        </Row>
                                    ))}
                                </Col>
                            </Row>}
                        </Container>
                    </Container>
                </Col>


                {/* Desktop */}
                <Col className="d-lg-block d-none">
                    <Row style={{ direction: "rtl" }}>
                        <Col md={6} style={filterWindowStyle} className="pb-3" >

                            {currentPanel === "time" &&
                                <>
                                    <Container className="d-flex justify-content-center mt-2">
                                        <div className="d-flex justify-content-center">
                                            <Button className="" variant="transparent" style={{ color: "white", marginTop: "-12px" }} onClick={prevFilter}>
                                                <i className="fa-solid fa-arrow-left"></i>
                                            </Button>
                                            <p className="text-center" style={{ width: "150px" }}>{currentFilter}</p>
                                            <Button className="" variant="transparent" style={{ color: "white", marginTop: "-12px" }} onClick={nextFilter}>
                                                <i className="fa-solid fa-arrow-right"></i>
                                            </Button>
                                        </div>
                                    </Container>
                                    {currentFilter === "Mellan datum" && <>
                                        <Col md={12}>
                                            <Form.Control type="date" value={startdate.value} onChange={(e) => setStartDateFunc(e.target.value)} style={{ paddingTop: "2px", paddingBottom: "2px" }} />
                                        </Col>
                                        <Col md={12} className="mt-3">
                                            <Form.Control type="date" value={enddate.value} onChange={(e) => setEndDateFunc(e.target.value)} style={{ paddingTop: "2px", paddingBottom: "2px" }} />
                                        </Col>
                                    </>}
                                    {currentFilter === "Månad" && <>
                                        <Row className="justify-content-center mt-1" >
                                            <Col md={12} className="mt-2" >
                                                <Dropdown onSelect={(eventKey) => month.set(eventKey)} style={{ width: "100%" }}>
                                                    <Dropdown.Toggle variant="light" id="dropdown-basic" style={{ width: "100%", textAlign: "start", height: "35px", padding: "0 0 0 20px" }}>
                                                        {month.value}
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
                                            <Col md={12} className="mt-2" >
                                                <Form.Control type="date" value={startdate.value} onChange={(e) => setStartDateFunc(e.target.value)} />
                                            </Col>
                                        </Row>
                                    </>}
                                </>
                            }
                            {currentPanel === "devices" && <>
                                <Row>
                                    <Col>
                                        {Object.entries(groups).filter((_, index) => index % 2 === 0).map(([groupName]) => (
                                            <div key={groupName} className="position-relative">
                                                <div className="mt-1 p-1 text-center"
                                                    style={{
                                                        cursor: "pointer",
                                                        borderRadius: "4px",
                                                        borderBottomLeftRadius: currentGroup === groupName && groupExpanded ? 0 : "4px",
                                                        borderBottomRightRadius: currentGroup === groupName && groupExpanded ? 0 : "4px",
                                                        background: currentGroup === groupName ? "white" : "transparent",
                                                        color: currentGroup === groupName ? "black" : "inherit"
                                                    }}
                                                    onClick={() => {
                                                        handleSelect(groupName, groups)
                                                        if (currentGroup === groupName) {
                                                            setGroupExpanded(!groupExpanded)
                                                        } else {
                                                            setGroupExpanded(true)
                                                        };
                                                    }}>
                                                    {groupName}
                                                </div>
                                                <div className="p-2 text-start" style={{ ...groupStyle, display: currentGroup === groupName && groupExpanded ? "block" : "none" }}>
                                                    {groups[groupName].map((member, index) => {
                                                        const deviceName = devices.value.find(device => device.displayName === member)?.deviceName;
                                                        return (
                                                            <Form.Check type="checkbox" key={index} label={member} checked={allDataStates[deviceName].value} onChange={() => allDataStates[deviceName].set(!allDataStates[deviceName].value)} />
                                                        )
                                                    })}
                                                </div>
                                            </div>
                                        ))}
                                        {Object.entries(groups).length % 2 !== 0 ? <></> :
                                            <div className="mt-1 p-1 text-center" style={{ cursor: "pointer", borderRadius: "4px", background: currentGroup === "Alla" ? "white" : "transparent", color: currentGroup === "Alla" ? "black" : "inherit" }} onClick={() => handleSelect("Alla", groups)}>
                                                Alla
                                            </div>
                                        }
                                    </Col>
                                    <Col>
                                        {Object.entries(groups).filter((_, index) => index % 2 !== 0).map(([groupName]) => (
                                            <div key={groupName} className="position-relative">
                                                <div className="mt-1 p-1 text-center"
                                                    style={{
                                                        cursor: "pointer",
                                                        borderRadius: "4px",
                                                        borderBottomLeftRadius: currentGroup === groupName && groupExpanded ? 0 : "4px",
                                                        borderBottomRightRadius: currentGroup === groupName && groupExpanded ? 0 : "4px",
                                                        background: currentGroup === groupName ? "white" : "transparent",
                                                        color: currentGroup === groupName ? "black" : "inherit"
                                                    }}
                                                    onClick={() => {
                                                        handleSelect(groupName, groups)
                                                        if (currentGroup === groupName) {
                                                            setGroupExpanded(!groupExpanded)
                                                        } else {
                                                            setGroupExpanded(true)
                                                        };
                                                    }}>
                                                    {groupName}
                                                </div>
                                                <div className="p-2 text-start" style={{ ...groupStyle, display: currentGroup === groupName && groupExpanded ? "block" : "none" }}>
                                                    {groups[groupName].map((member, index) => {
                                                        const deviceName = devices.value.find(device => device.displayName === member)?.deviceName;
                                                        return (<Form.Check type="checkbox" key={index} label={member} checked={allDataStates[deviceName].value} onChange={() => allDataStates[deviceName].set(!allDataStates[deviceName].value)} />)
                                                    })}
                                                </div>
                                            </div>
                                        ))}
                                        {Object.entries(groups).length % 2 === 0 ? <></> :
                                            <div className="mt-1 p-1 text-center" style={{ cursor: "pointer", borderRadius: "4px", background: currentGroup === "Alla" ? "white" : "transparent", color: currentGroup === "Alla" ? "black" : "inherit" }} onClick={() => handleSelect("Alla", groups)}>
                                                Alla
                                            </div>
                                        }
                                    </Col>
                                </Row>
                            </>}
                            {currentPanel === "power" &&
                                <Row className="m-0 p-0">
                                    <Col md={12} className="my-2 m-0 p-0">
                                        {Object.entries(filterData.consumption).map(([deviceName, consumption]) => (
                                            <Row className="justify-content-between m-0 p-0" key={deviceName}>
                                                <Col md={8} className="text-start" style={{ fontSize: "10px" }}>
                                                    {devices.value.find(device => device.deviceName === deviceName)?.displayName}:
                                                </Col>
                                                <Col md={4} className="text-end" style={{ fontSize: "10px" }}>
                                                    {consumption.toFixed(2)} kwH
                                                </Col>
                                            </Row>
                                        ))}
                                    </Col>
                                </Row>
                            }



                        </Col>
                        <Col md={4} className="flex-column justify-content-between d-flex" >
                            <Row>
                                <Button panel="power" className="popOptionButton" onClick={setCurrentPanelFunc} variant="none" style={currentPanel === "power" ? desktopToggled : { color: "white" }}>Konsumption</Button>
                            </Row>
                            <Row>
                                <Button panel="time" className="popOptionButton" onClick={setCurrentPanelFunc} variant="none" style={currentPanel === "time" ? desktopToggled : { color: "white" }}>Tid</Button>
                            </Row>
                            <Row>
                                <Button panel="devices" className="popOptionButton" onClick={setCurrentPanelFunc} variant="none" style={currentPanel === "devices" ? desktopToggled : { color: "white" }}>Enheter</Button>
                            </Row>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </>
    );
};