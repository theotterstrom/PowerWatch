import axios from "axios";
import { Container, Row, Col, Form, Button, Dropdown } from "react-bootstrap";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import MakeRequest from "../Helpers/MakeRequest";

export default ({ showWindow, method, devices }) => {

    const [newDevice, setNewDevice] = useState({});
    const [updateDevice, setUpdateDevice] = useState({});
    const [removeDropdown, setRemoveDropdown] = useState("");
    const [chosenDevice, setChosenDevice] = useState(null);

    const newDeviceInput = (e) => {
        const { name, value } = e.target;
        setNewDevice((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const updateDeviceInput = (e) => {
        const { name, value } = e.target;
        setUpdateDevice((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const addDevice = async (e) => {
        e.preventDefault();
        if (Object.keys(newDevice).length !== 5 || Object.values(newDevice).some(value => !value || value.trim() === "")) {
            alert("All fields must be filled out")
            return;
        };
        const res = await MakeRequest(newDevice, 'addnewdevice', 'post');
        alert(res.response?.data?.message || res.data.message)
    };

    const removeDevice = async (e) => {
        e.preventDefault();
        const removeId = Object.entries(devices).find(([key, value]) => value?.displayName === removeDropdown)?.[1].id;
        const res = await MakeRequest({ id: removeId }, 'removedevice', 'post');
        alert(res.response?.data?.message || res.data.message)
    };

    const handleRemoveSelect = (eventKey) => {
        setRemoveDropdown(eventKey)
    };

    const changeDevice = (eventKey) => {

    };

    const handleChangeSelect = (eventKey) => {
        setChosenDevice(eventKey);
        const classNames = ["deviceNameChange", "displayNameChange", "idChange", "wattChange", "deviceTypeChange"];
        const [deviceNameChange, displayNameChange, idChange, wattChange, deviceTypeChange] = classNames.map(name => document.getElementsByClassName(name)[0]);
        const theDevice = Object.entries(devices).find(obj => obj[1].displayName === eventKey)

        deviceNameChange.value = theDevice[0];
        displayNameChange.value = theDevice[1].displayName;
        idChange.value = theDevice[1].id;
        wattChange.value = theDevice[1].wattFormat;
        deviceTypeChange.value = theDevice[1].deviceType;
        setUpdateDevice({
            deviceName: theDevice[0],
            displayName: theDevice[1].displayName,
            id: theDevice[1].id,
            wattFormat: theDevice[1].wattFormat,
            deviceType: theDevice[1].deviceType
        })
    };

console.log(devices)
    return (
        <Container className="container-fluid d-flex justify-content-center align-items-center">
            {method === "add" ? <>
                <Col xl={4} xs={11} className="controlPanelPop p-5">
                <Row className="text-center text-center">
                    <p style={{fontSize: "20px"}}>Add device</p>
                </Row>
                    <i onClick={() => showWindow(false)} className="fa fa-times"></i>
                    <Form onSubmit={addDevice}>
                        <Form.Label>Device name</Form.Label>
                        <Form.Control type="text" name="deviceName" onChange={newDeviceInput}></Form.Control>
                        <Form.Label className="mt-3">Display name</Form.Label>
                        <Form.Control type="text" name="displayName" onChange={newDeviceInput}></Form.Control>
                        <Form.Label className="mt-3">Id</Form.Label>
                        <Form.Control type="text" name="id" onChange={newDeviceInput}></Form.Control>
                        <Form.Label className="mt-3">Wattformat</Form.Label>
                        <Form.Control type="text" name="wattFormat" onChange={newDeviceInput}></Form.Control>
                        <Form.Label className="mt-3">Device type</Form.Label>
                        <Form.Control type="text" name="deviceType" onChange={newDeviceInput}></Form.Control>
                        <Button type="submit" className="mt-5">Add new device</Button>
                    </Form>
                </Col>
            </> : <></>}
            {method === "change" ? <>
                <Col xl={4} xs={11} className="controlPanelPop p-5">
                <Row className="text-center text-center">
                    <p style={{fontSize: "20px"}}>Change device</p>
                </Row>
                    <i onClick={() => showWindow(false)} className="fa fa-times"></i>
                    <Form onSubmit={changeDevice}>
                        <Dropdown onSelect={handleChangeSelect} className="mt-2" >
                            <Dropdown.Toggle variant="light" id="dropdown-basic" style={{ width: "50%", textAlign: "start", height: "35px", padding: "0 0 0 20px" }}>
                                {chosenDevice}
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                {Object.values(devices).map(obj => {
                                    return <Dropdown.Item key={obj.id} eventKey={obj.displayName}>{obj.displayName}</Dropdown.Item>
                                })}
                            </Dropdown.Menu>
                        </Dropdown>

                        <Form.Label className="mt-4">Device name</Form.Label>
                        <Form.Control type="text" name="deviceName" onChange={updateDeviceInput} className="deviceNameChange"></Form.Control>
                        <Form.Label className="mt-3">Display name</Form.Label>
                        <Form.Control type="text" name="displayName" onChange={updateDeviceInput} className="displayNameChange"></Form.Control>
                        <Form.Label className="mt-3">Id</Form.Label>
                        <Form.Control type="text" name="id" onChange={updateDeviceInput} className="idChange"></Form.Control>
                        <Form.Label className="mt-3">Wattformat</Form.Label>
                        <Form.Control type="text" name="wattFormat" onChange={updateDeviceInput} className="wattChange"></Form.Control>
                        <Form.Label className="mt-3">Device type</Form.Label>
                        <Form.Control type="text" name="deviceType" onChange={updateDeviceInput} className="deviceTypeChange"></Form.Control>
                        
                        <Button type="submit" className="mt-5">Add new device</Button>
                    </Form>
                </Col>
            </> : <></>}
            {method === "remove" ? <>
                <Col xl={4} xs={11} className="controlPanelPop p-5">
                <Row className="text-center text-center">
                    <p style={{fontSize: "20px"}}>Remove device</p>
                </Row>
                    <i onClick={() => showWindow(false)} className="fa fa-times"></i>
                    <Form onSubmit={removeDevice}>
                        <Dropdown onSelect={handleRemoveSelect} className="mt-2" >
                            <Dropdown.Toggle variant="light" id="dropdown-basic" style={{ width: "50%", textAlign: "start", height: "35px", padding: "0 0 0 20px" }}>
                                {removeDropdown}
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                {Object.values(devices).map(obj => {
                                    return <Dropdown.Item key={obj.id} eventKey={obj.displayName}>{obj.displayName}</Dropdown.Item>
                                })}
                            </Dropdown.Menu>
                        </Dropdown>
                        <Button type="submit" className="mt-5">Remove device</Button>
                    </Form>
                </Col>
            </> : <></>}

        </Container>
    )
};