import { Container, Row, Col, Form, Button, Dropdown } from "react-bootstrap";
import React, { useState, useEffect } from "react";
import MakeRequest from "../../Helpers/MakeRequest";

export default ({ showWindow, method, devices, setDevices, identifier }) => {

    const [newDevice, setNewDevice] = useState({});
    const [updateDevice, setUpdateDevice] = useState({});
    const [removeDropdown, setRemoveDropdown] = useState("");
    const [chosenGroup, setChosenGroup] = useState(null);
    const [groupDevices, setgroupDevices] = useState([]);
    const [newGroupDevices, setNewGroupDevices] = useState([]);
    const [newGroup, setNewGroup] = useState({});
    const [removeGroup, setRemoveGroup] = useState(null);
    const [isDisabled, setIsDisabled] = useState(false);

    const makeDeviceRequest = async (e, type) => {
        e.preventDefault();
        let data;
        let endpoint;
        let removeId;

        if (type === "add") {
            const requiredLength = newDevice.deviceType === "Thermometer" ? 4 : 5;
            if (Object.keys(newDevice).length !== requiredLength || Object.values(newDevice).some(value => !value || value.trim() === "")) {
                alert("Alla fält måste vara ifyllda")
                return;
            };
            endpoint = "addnewdevice";
            data = newDevice;
        } else if (type === "remove") {
            endpoint = "removedevice"
            data = { id: identifier };
            removeId = identifier;
        } else if (type === "update") {
            const requiredLength = newDevice.deviceType === "Thermometer" ? 5 : 6;
            if (Object.keys(updateDevice).length !== requiredLength || Object.values(newDevice).some(value => !value || value.trim() === "")) {
                alert("Alla fält måste vara ifyllda")
                return;
            };
            endpoint = "updatedevice";
            data = updateDevice;
        };
        const res = await MakeRequest(data, endpoint, 'post');
        if (res.status === 200) {
            let newDeviceArray;
            if (type === "add") {
                newDeviceArray = devices.concat(newDevice);
            } else if (type === "remove") {
                newDeviceArray = devices.filter(device => device.id !== removeId);
            } else if (type === "update") {
                newDeviceArray = devices.filter(device => device["_id"] !== updateDevice.mongoid);
                newDeviceArray.push(updateDevice);
            };
            setDevices(newDeviceArray);
        };
        alert(res.response?.data?.message || res.data.message);
        showWindow(false);
    };

    useEffect(() => {
        if (method === "change-device") {
            const theDevice = devices.find(device => device.id === identifier);
            const classNames = ["deviceNameChange", "displayNameChange", "idChange"];
            const [deviceNameChange, displayNameChange, idChange] = classNames.map(name => document.getElementsByClassName(name)[0]);
            deviceNameChange.value = theDevice.deviceName;
            displayNameChange.value = theDevice.displayName;
            idChange.value = theDevice.id;
            setUpdateDevice({
                deviceName: theDevice.deviceName,
                displayName: theDevice.displayName,
                id: theDevice.id,
                wattFormat: theDevice.wattFormat,
                deviceType: theDevice.deviceType,
                mongoid: theDevice["_id"]
            })
        } else if (method === "change-group") {
            setChosenGroup(identifier)
            setgroupDevices(groups[identifier])
        }
    }, []);

    const handleStateInput = (e, type) => {
        let setter;
        if (type === "update-device") {
            setter = setUpdateDevice;
        } else if (type === "new-device") {
            setter = setNewDevice;
        } else if (type === "new-group") {
            setter = setNewGroup
        };
        const { name, value } = e.target;
        setter((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const removeGroupKey = (eventKey, type) => {
        if (type === "change") {
            const newDevices = groupDevices.filter(obj => obj !== eventKey);
            setgroupDevices(newDevices)
        } else if (type === "add") {
            const newDevices = newGroupDevices.filter(obj => obj !== eventKey);
            setNewGroupDevices(newDevices)
        }
    };

    const handleNewGroupAdd = (deviceName, type) => {
        if (type === "change") {
            if (!groupDevices.some((device) => device === deviceName)) {
                setgroupDevices((prev) => [...prev, deviceName]);
            };
        } else if (type === "add") {
            if (!newGroupDevices.some((device) => device === deviceName)) {
                setNewGroupDevices((prev) => [...prev, deviceName]);
            };
        }
    };

    const makeGroupRequest = async (e, type) => {
        e.preventDefault();
        let endpoint;
        let data;
        if (type === "change") {
            endpoint = 'groupchange';
            data = { groupName: chosenGroup, members: groupDevices };
        } else if (type === "add") {
            endpoint = 'groupadd';
            data = { groupName: newGroup.groupName, members: newGroupDevices };
        } else if (type === "remove") {
            endpoint = 'groupremove';
            data = { groupName: removeGroup };
        };
        const res = await MakeRequest(data, endpoint, 'post');
        if (res.status === 200) {
            setDevices(res.data.newDeviceList)
        };
        alert(res.response?.data?.message || res.data.message)
        showWindow(false)
    };

    const groups = devices.reduce((acc, cur) => {
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
        <Container className="container-fluid d-flex justify-content-center align-items-center">
            {method === "add-device" ? <>
                <Col xl={5} lg={5} md={8} sm={9} xs={11} className="controlPanelPop p-xl-5 p-4">
                    <Row className="text-center text-center">
                        <p style={{ fontSize: "20px" }}>Lägg till ny enhet</p>
                    </Row>
                    <i onClick={() => showWindow(false)} className="fa fa-times"></i>
                    <Form onSubmit={(e) => makeDeviceRequest(e, "add")} className="popUpForm">
                        <Form.Label>Databasnamn</Form.Label>
                        <Form.Control type="text" name="deviceName" onChange={(e) => handleStateInput(e, "new-device")}></Form.Control>
                        <Form.Label className="mt-3">Enhetsnamn</Form.Label>
                        <Form.Control type="text" name="displayName" onChange={(e) => handleStateInput(e, "new-device")}></Form.Control>
                        <Form.Label className="mt-3">Id</Form.Label>
                        <Form.Control type="text" name="id" onChange={(e) => handleStateInput(e, "new-device")}></Form.Control>

                        <Form.Label className="mt-3">Wattformat</Form.Label>

                        <Dropdown className="popDropDown"
                            onSelect={(eventKey) => {
                                setNewDevice({ ...newDevice, wattFormat: eventKey });
                            }}>
                            <Dropdown.Toggle variant="light" className="popDropDownToggle" style={{ textAlign: "start" }} disabled={true}>
                                {newDevice.wattFormat || "Select Format"}
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item eventKey="Watt">Watt</Dropdown.Item>
                                <Dropdown.Item eventKey="Kilowatt">Kilowatt</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>

                        <Form.Label className="mt-3">Enhetstyp</Form.Label>
                        <Dropdown className="popDropDown"
                            onSelect={(eventKey) => {
                                if (eventKey === "Thermometer") {
                                    setIsDisabled(true)
                                    setNewDevice({ ...newDevice, wattFormat: '', deviceType: eventKey })
                                } else {
                                    setIsDisabled(false)
                                    setNewDevice({ ...newDevice, deviceType: eventKey });
                                };

                            }}
                        >
                            <Dropdown.Toggle variant="light" className="popDropDownToggle" style={{ textAlign: "start" }}>
                                {newDevice.deviceType || "Select type"}
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item eventKey="Relay">Relä</Dropdown.Item>
                                <Dropdown.Item eventKey="Thermometer">Termometer</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                        <Button type="submit" className="mt-5">Ny enhet</Button>
                    </Form>
                </Col>
            </> : <></>}
            {method === "change-device" ? <>
                <Col xl={5} lg={5} md={8} sm={9} xs={11} className="controlPanelPop  px-xl-5 p-4">
                    <Row className="text-center text-center">
                        <p style={{ fontSize: "20px" }}>Ändra enhet</p>
                    </Row>
                    <i onClick={() => showWindow(false)} className="fa fa-times"></i>
                    <Form onSubmit={(e) => makeDeviceRequest(e, "update")}>
                        <Form.Label className="mt-xl-4 mt-2">Databasnamn</Form.Label>
                        <Form.Control type="text" name="deviceName" onChange={(e) => handleStateInput(e, "update-device")} className="deviceNameChange" disabled={true}></Form.Control>
                        <Form.Label className="mt-xl-3 mt-2">Enhetsnamn</Form.Label>
                        <Form.Control type="text" name="displayName" onChange={(e) => handleStateInput(e, "update-device")} className="displayNameChange"></Form.Control>
                        <Form.Label className="mt-xl-3 mt-2">Id</Form.Label>
                        <Form.Control type="text" name="id" onChange={(e) => handleStateInput(e, "update-device")} className="idChange"></Form.Control>

                        <Form.Label className="mt-xl-3 mt-2">Wattformat</Form.Label>
                        <Dropdown
                            className="popDropDown"
                            onSelect={(eventKey) => {
                                setUpdateDevice({ ...updateDevice, wattFormat: eventKey });
                            }}
                        >
                            <Dropdown.Toggle variant="light" className="popDropDownToggle" style={{ textAlign: "start" }} disabled={true}>
                                {updateDevice.wattFormat || "Select Format"}
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item eventKey="Watt">Watt</Dropdown.Item>
                                <Dropdown.Item eventKey="Kilowatt">Kilowatt</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>


                        <Form.Label className="mt-xl-3 mt-2">Enhetstyp</Form.Label>
                        <Dropdown
                            className="popDropDown"
                            onSelect={(eventKey) => {
                                if (eventKey === "Thermometer") {
                                    setIsDisabled(true)
                                    setUpdateDevice({ ...updateDevice, wattFormat: '', deviceType: eventKey })
                                } else {
                                    setIsDisabled(false)
                                    setUpdateDevice({ ...updateDevice, deviceType: eventKey });
                                };
                            }}
                        >
                            <Dropdown.Toggle variant="light" className="popDropDownToggle" style={{ textAlign: "start" }}>
                                {updateDevice.deviceType || "Select type"}
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item eventKey="Relay">Relä</Dropdown.Item>
                                <Dropdown.Item eventKey="Thermometer">Termometer</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                        <Row>
                            <Col className="justify-content-start d-flex">
                            <Button type="submit" className="mt-xl-5 mt-5">Spara enhet</Button>
                            </Col>
                            <Col className="justify-content-end d-flex">
                            {!removeDropdown ? <Button onClick={() => setRemoveDropdown(identifier)} className="mt-5" variant="danger">Ta bort enhet</Button> : 
                            <Button onClick={(e) => makeDeviceRequest(e, "remove")} className="mt-5" variant="danger">Är du säker på att du vill ta bort enheten?</Button> 
                            }
                            </Col>
                        </Row>
                        
                    </Form>
                </Col>
            </> : <></>}
            {method === "add-group" ? <>
                <Col  xl={5} lg={5} md={8} sm={9} xs={11}className="controlPanelPop  p-xl-5 p-4">
                    <Row className="text-center text-center">
                        <p style={{ fontSize: "20px" }}>Lägg till ny grupp</p>
                    </Row>
                    <i onClick={() => showWindow(false)} className="fa fa-times"></i>
                    <Form onSubmit={(e) => makeGroupRequest(e, "add")}>
                        <Form.Label>Grouppnamn</Form.Label>
                        <Form.Control type="text" name="groupName" onChange={(e) => handleStateInput(e, "new-group")}></Form.Control>

                        <Form.Label className="mt-4">Medlemmar</Form.Label>
                        <Row className="m-1 mt-0 ml-0 mb-0">
                            <Col xl={9} style={{ backgroundColor: "white", color: "black", borderRadius: "5px", minHeight: "35px", padding: "10px" }}>
                                {newGroupDevices.map(member =>

                                    <Container className="d-flex mt-2" key={member}>
                                        <div>{member}</div>
                                        &nbsp;&nbsp;&nbsp;
                                        <i className="fa-solid fa-xmark mt-1" style={{ cursor: "pointer" }} onClick={() => removeGroupKey(member, "add")}></i>
                                    </Container>
                                )}
                            </Col>
                        </Row>
                        <Row>
                            <Form.Label className="mt-4">Välj nya medlemmar</Form.Label>
                            <Dropdown onSelect={(e => handleNewGroupAdd(e, "add"))} className="m-1 popDropDown" >
                                <Dropdown.Toggle variant="light" id="dropdown-basic" className="popDropDownToggle" style={{ textAlign: "start" }}>
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    {devices.map(device => {
                                        return <Dropdown.Item key={device.id} eventKey={device.displayName}>{device.displayName}</Dropdown.Item>
                                    })}
                                </Dropdown.Menu>
                            </Dropdown>
                        </Row>
                        <Button type="submit" className="mt-5">Skapa grupp</Button>
                    </Form>
                </Col>
            </> : <></>}
            {method === "change-group" ? <>
                <Col xl={5} lg={5} md={8} sm={9} xs={11} className="controlPanelPop  p-xl-5 p-4">
                    <Row className="text-center text-center">
                        <p style={{ fontSize: "20px" }}>Ändra grupp</p>
                    </Row>
                    <i onClick={() => showWindow(false)} className="fa fa-times"></i>
                    <Form onSubmit={(e) => makeGroupRequest(e, 'change')}>
                        <h4>{chosenGroup}</h4>
                        <Form.Label className="mt-1">Medlemmar</Form.Label>
                        <Row className="m-1 mt-0 ml-0 mb-0">
                            <Col xl={12} lg={12} md={12} sm={12} xs={12}  style={{ backgroundColor: "white", color: "black", borderRadius: "5px", minHeight: "35px", padding: "10px" }}>
                                {groupDevices.map(member =>
                                    <Row key={member}>
                                        <Col xs={8} style={{whiteSpace: "nowrap"}}>{member}</Col>
                                        <Col><i className="fa-solid fa-xmark mt-1" style={{ cursor: "pointer" }} onClick={() => removeGroupKey(member, "change")}></i></Col>
                                    </Row>
                                )}
                            </Col>
                        </Row>
                        <Row>
                            <Form.Label className="mt-4">Välj nya medlemmar</Form.Label>
                            <Dropdown onSelect={(e) => handleNewGroupAdd(e, "change")} className="mt-2 popDropDown" >
                                <Dropdown.Toggle variant="light" id="dropdown-basic" className="popDropDownToggle" style={{ textAlign: "start" }}>
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    {devices.map(device => {
                                        return <Dropdown.Item key={device.id} eventKey={device.displayName}>{device.displayName}</Dropdown.Item>
                                    })}
                                </Dropdown.Menu>
                            </Dropdown>
                        </Row>
                        <Row>
                            <Col className="justify-content-start d-flex">
                            <Button type="submit" className="mt-5">Spara grupp</Button>
                            </Col>
                            <Col className="justify-content-end d-flex">
                            {!removeGroup ? <Button onClick={() => setRemoveGroup(chosenGroup)} className="mt-5" variant="danger">Ta bort groupp</Button> : 
                            <Button onClick={(e) => makeGroupRequest(e, "remove")} className="mt-5" variant="danger">Är du säker på att du vill ta bort gruppen?</Button> 
                            }
                            </Col>
                        </Row>
                        
                    </Form>
                </Col>
            </> : <></>}
        </Container>
    )
};