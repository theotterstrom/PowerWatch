import { Container, Row, Col, Form, Dropdown, Button } from "react-bootstrap";
import React, { useState } from "react";

export default ({ initData }) => {
    const { allDataStates, dateStates, devices, savingsData, filterStr, filterData } = initData;
    const { totalSpending, totalSaved } = savingsData;

    const savingsDevices = JSON.parse(JSON.stringify(devices))
    savingsDevices.value = savingsDevices.value.filter(obj => obj.deviceType === "Relay");
    const {
        savingsstartdate,
        savingsenddate,
        allsavingsdate,
        savingsmonth,
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
        } else if (new Date(date) > new Date(savingsenddate.value)) {
            alert("Date cannot be earlier than end date")
        } else {
            savingsstartdate.set(date);
        }
    };
    const setEndDateFunc = date => {
        if (date > new Date().toISOString()) {
            alert("Date cannot be greater than todays date")
        } else if (new Date(date) < new Date(savingsstartdate.value)) {
            alert("Date cannot be earlier than start date")
        } else {
            savingsenddate.set(date);
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
            const displayName = savingsDevices.value.find(obj => obj.deviceName === deviceName).displayName;
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
        border: "1px solid white"
    };
    const untoggledStyle = {
        background: "transparent",
        color: "white",
        border: "1px solid transparent"
    };


    return (
        <>
            <Row className="my-5 pb-lg-0 pb-4 mx-0 p-0 justify-content-center justify-content-lg-start text-lg-start text-center">
                <Col xxl={4} xl={4} lg={4} md={9} sm={10} className="m-0 p-0 mt-lg-0 mt-2">
                    <div style={{ fontSize: "18px", fontWeight: "bold" }}>
                        <i className="fa-solid fa-dollar-sign"></i>&nbsp; Ekonomi
                    </div>
                    <Container className="chartText mt-3">
                        {`Du sparade `}
                        <span className="chartTextVals p-1" onClick={() => {
                            setCurrentPanel("savings")
                            setExpanded(true)
                        }}>{(totalSaved / 100).toFixed(2)} SEK</span><br></br>
                        {` ${currentFilter === "Timmar per dag" ? "den" : currentFilter === "Månad" ? "under" : "mellan"} `}
                        <span className="chartTextVals p-1" onClick={() => {
                            setCurrentPanel("time")
                            setExpanded(true)
                        }}>{filterStr.timeStr.interval}</span><br></br>
                        {` fördelat på `}
                        <span className="chartTextVals p-1" onClick={() => {
                            setCurrentPanel("devices")
                            setExpanded(true)
                        }}>{filterStr.deviceNo} enheter.</span>
                    </Container>
                </Col>
                <Col xxl={5} xl={8} lg={8} md={8} sm={10} className="m-0 p-0 mt-lg-0 mt-2 position-relative" style={{ maxWidth: "400px" }}>
                    <Container className="powerOptionPanel" style={{ maxHeight: expanded ? "300px" : "70px", overflow: expanded && currentPanel == "time" && currentFilter === "Månad" ? "visible" : "hidden" }}>
                        <Container className="d-flex justify-content-between py-3">
                            <Button onClick={() => setCurrentPanel("savings")} variant="none" className="popOptionButton" style={currentPanel === "savings" ? toggledStyle : untoggledStyle}>Kostnader</Button>
                            <Button onClick={() => setCurrentPanel("time")} variant="none" className="popOptionButton" style={currentPanel === "time" ? toggledStyle : untoggledStyle}>Tid</Button>
                            <Button onClick={() => setCurrentPanel("devices")} variant="none" className="popOptionButton" style={currentPanel === "devices" ? toggledStyle : untoggledStyle}>Enheter</Button>
                        </Container>
                        <Container>
                            {currentPanel === "time" && <Row className="pb-3">
                                <Col xxl={12}>
                                    <Container className="d-flex justify-content-center">
                                        <div className="d-flex justify-content-center">
                                            <Button className="" variant="transparent" style={{ color: "white", marginTop: "-12px" }} onClick={prevFilter}><i className="fa-solid fa-arrow-left"></i></Button>
                                            <p className="text-center" style={{ width: "150px" }}>{currentFilter}</p>
                                            <Button className="" variant="transparent" style={{ color: "white", marginTop: "-12px" }} onClick={nextFilter}><i className="fa-solid fa-arrow-right"></i></Button>
                                        </div>
                                    </Container>
                                    {currentFilter === "Mellan datum" && <>
                                        <Col xxl={12}>
                                            <Form.Control type="date" value={savingsstartdate.value} onChange={(e) => setStartDateFunc(e.target.value)} />
                                        </Col>
                                        <Col xxl={12} className="d-flex justify-content-center my-3">
                                            <div style={{ height: "5px", width: "30px", background: "white" }}></div>
                                        </Col>
                                        <Col xxl={12}>
                                            <Form.Control type="date" value={savingsenddate.value} onChange={(e) => setEndDateFunc(e.target.value)} />
                                        </Col>
                                    </>}
                                    {currentFilter === "Månad" && <>
                                        <Row className="justify-content-center mt-1" >
                                            <Col xxl={12} className="mt-2" >
                                                <Dropdown onSelect={(eventKey) => savingsmonth.set(eventKey)} style={{ width: "100%" }}>
                                                    <Dropdown.Toggle variant="light" id="dropdown-basic" style={{ width: "100%", textAlign: "start", height: "35px", padding: "0 0 0 20px" }}>
                                                        {savingsmonth.value}
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
                                            <Col xxl={12} className="mt-2" >
                                                <Form.Control type="date" value={savingsstartdate.value} onChange={(e) => setStartDateFunc(e.target.value)} />
                                            </Col>
                                        </Row>
                                    </>}
                                </Col>
                            </Row>}
                            {currentPanel === "devices" && <Row className="pb-3">
                                <Col>
                                    {Object.entries(groups).filter((_, index) => index % 2 === 0).map(([groupName]) => (
                                        <>
                                            <div key={groupName} className="mt-1 p-1 text-center"
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
                                                    return (
                                                        <Form.Check type="checkbox" key={index} label={member} checked={allDataStates[deviceName].value} onChange={() => allDataStates[deviceName].set(!allDataStates[deviceName].value)} />
                                                    )
                                                })}
                                            </div>
                                        </>
                                    ))}
                                    {Object.entries(groups).length % 2 !== 0 ? <></> :
                                        <div className="mt-1 p-1 text-center" style={{ cursor: "pointer", borderRadius: "4px", background: currentGroup === "Alla" ? "white" : "transparent", color: currentGroup === "Alla" ? "black" : "inherit" }} onClick={() => handleSelect("Alla", groups)}>
                                            Alla
                                        </div>
                                    }
                                </Col>
                                <Col>
                                    {Object.entries(groups).filter((_, index) => index % 2 !== 0).map(([groupName]) => (
                                        <>
                                            <div key={groupName} className="mt-1 p-1 text-center"
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
                                                    return (<Form.Check type="checkbox" key={index} label={member} checked={allDataStates[deviceName].value} onChange={() => allDataStates[deviceName].set(!allDataStates[deviceName].value)} />)
                                                })}
                                            </div>
                                        </>
                                    ))}
                                    {Object.entries(groups).length % 2 === 0 ? <></> :
                                        <div className="mt-1 p-1 text-center" style={{ cursor: "pointer", borderRadius: "4px", background: currentGroup === "Alla" ? "white" : "transparent", color: currentGroup === "Alla" ? "black" : "inherit" }} onClick={() => handleSelect("Alla", groups)}>
                                            Alla
                                        </div>
                                    }
                                </Col>
                            </Row>}
                            {currentPanel === "savings" && <Row className="pb-3">
                                <Row>
                                        <Col xxl={6} xl={4} md={4} sm={4} xs={4}></Col>
                                        <Col xxl={3} xl={4} md={4} sm={4} xs={4} className="text-end">
                                            Verklig
                                        </Col>
                                        <Col xxl={3} xl={4} md={4} sm={4} xs={4} className="text-end">
                                            Snitt
                                        </Col>
                                    </Row>
                                    {Object.entries(filterData.devices).map(([deviceName, { realCost, averageCost }]) => (
                                        <Row className="justify-content-center" style={{ fontSize: "12px", whiteSpace: "nowrap" }}>
                                            <Col xxl={6} xl={4} md={4} sm={4} xs={4} className="text-start">
                                                {devices.value.find(device => device.deviceName === deviceName)?.displayName}:
                                            </Col>
                                            <Col xxl={3} xl={4} md={4} sm={4} xs={4} className="text-end">
                                                {realCost.toFixed(2)} SEK
                                            </Col>
                                            <Col xxl={3} xl={4} md={4} sm={4} xs={4} className="text-end">
                                                {averageCost.toFixed(2)} SEK
                                            </Col>
                                        </Row>
                                    ))}
                            </Row>}
                        </Container>
                    </Container>
                </Col>
            </Row>
        </>
    );
}