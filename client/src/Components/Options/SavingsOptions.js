import { Container, Row, Col, Form, Dropdown, Button } from "react-bootstrap";
import React, { useState, useEffect } from "react";

export default ({ initData }) => {
    const { allDataStates, dateStates, devices, savingsData, filterStr, filterData  } = initData;
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


    const setSavingStartDateFunc = date => {
        if (date > new Date().toISOString()) {
            alert("Date cannot be greater than todays date")
        } else if (new Date(date) > new Date(savingsenddate.value)) {
            alert("Date cannot be earlier than end date")
        } else {
            savingsstartdate.set(date);
        }
    };
    const setSavingEndDateFunc = date => {
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
        if (!excludeElements.some(el => el.contains(event.target) || el === event.target)) {
            setExpanded(false);
            setCurrentPanel("empty");
        } else {
            // setExpanded(true);
        }
    });
    console.log(savingsmonth)
    return (
        <>
            <Row className="my-5 mx-0 p-0 justify-content-center justify-content-lg-between text-lg-start text-center">
                <Col xl={6} lg={6} md={9} sm={10} className="m-0 p-0 mt-lg-0 mt-2 ">
                <div style={{fontSize: "18px", fontWeight:"bold"}}>
                <i className="fa-solid fa-dollar-sign"></i>&nbsp; Ekonomi
                </div>
                    <Container className="chartText mt-3">
                        {`Du har sparat `}
                        <span className="chartTextVals p-1" onClick={() => {
                            setCurrentPanel("power")
                            setExpanded(true)
                        }}>{(totalSaved / 100).toFixed(2)} SEK</span><br></br>
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
                <Col xl={4} lg={4} md={5} sm={10} className="m-0 p-0 mt-lg-0 mt-2 position-relative">
                    <Container className="powerOptionPanel py-4 " style={{ maxHeight: expanded ? "300px" : "0", overflow: expanded && currentPanel == "time" && currentFilter === "Månad" ? "visible" : "hidden" }}>
                        <div onClick={() => {
                            setCurrentPanel(expanded ? "empty" : "time");
                            setExpanded(!expanded);
                        }} className="position-absolute text-end" style={{ right: "20px", top: "10px", cursor: "pointer", width: "90%" }}>
                            <i className={expanded ? "fa fa-arrow-up exludeArrow" : "fa fa-arrow-down exludeArrow"} ></i>
                        </div>
                        <Container className="mt-4">
                            {currentPanel === "empty" ? <>
                                <p className="text-center" style={{ marginTop: "-38px", height: "200px", pointerEvents: "none" }}>Alternativ</p>
                            </> : <></>}
                            {currentPanel === "time" ? <>
                                <div className="d-flex justify-content-center" style={{ marginTop: "-12px" }}>
                                    <Button className="" variant="transparent" style={{ color: "white", marginTop: "-12px" }} onClick={prevFilter}><i className="fa-solid fa-arrow-left"></i></Button>
                                    <p className="text-center" style={{ width: "150px" }}>{currentFilter}</p>
                                    <Button className="" variant="transparent" style={{ color: "white", marginTop: "-12px" }} onClick={nextFilter}><i className="fa-solid fa-arrow-right"></i></Button>
                                </div>
                                <Row className="d-flex justify-content-center">
                                    <Col xl={12}>
                                        {currentFilter === "Mellan datum" && <>
                                            <Form.Label>Start Datum</Form.Label>
                                            <Form.Control type="date" value={savingsstartdate.value} onChange={(e) => setSavingStartDateFunc(e.target.value)} />
                                            <Form.Label className="mt-3">Slut Datum</Form.Label>
                                            <Form.Control type="date" value={savingsenddate.value} onChange={(e) => setSavingEndDateFunc(e.target.value)} />
                                        </>}
                                        {currentFilter === "Månad" && <>
                                            <Dropdown onSelect={(eventKey) => savingsmonth.set(eventKey)} className="mt-2" style={{ width: "100%" }}>
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
                                            <Form.Control type="date" value={savingsstartdate.value} onChange={(e) => setSavingStartDateFunc(e.target.value)} />
                                        </>}
                                    </Col>
                                </Row>
                            </> : <></>}
                            {currentPanel === "devices" ? <>
                                <p className="text-center" style={{ marginTop: "-12px", height: "10px", pointerEvents: "none" }}>Grupper</p>
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
                                <p className="text-center" style={{ marginTop: "-12px", height: "10px", pointerEvents: "none" }}>Förbrukning per enhet</p>
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

            {/*             <Row className="justify-content-center  m-0 p-0 mt-sm-2 mt-md-2 mt-lg-3" style={{ maxWidth: "98vw"}}>
                 <Container className="d-lg-none d-md-block p-0 m-0">
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
                <Col xl={8} lg={7} md={12} sm={10} xs={11} className="p-0 d-lg-block d-none">
                    <Row className="m-2 mt-0 mb-0 mr-0">
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
                
                 <Col xl={4} lg={5} md={12} sm={10} xs={11} className="d-flex flex-column justify-content-between mt-4 mt-lg-0">
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
                    <Container className="justify-content-between d-sm-flex d-block ">
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
                        <Container className="m-0 p-0 d-flex mt-4" style={{whiteSpace: "nowrap"}}>
                            <Form.Check onChange={() => allsavingsdate.set(!allsavingsdate.value)} />
                            &nbsp;<p>Show all dates</p>
                        </Container>
                    </Container>
                </Col> 
            </Row> */}
        </>
    );
}