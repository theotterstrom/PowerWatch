import axios from "axios";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { useState } from 'react';
import apiUrl from "../Helpers/APIWrapper";
export default ({ initData }) => {
    const [todaySchedule, setTodayScheduele] = useState(false);
    const { powerhour, togglePowerHour, devices } = initData;
    if(powerhour.value){
        delete powerhour.value._id;
    };

    const powerHourDevices = JSON.parse(JSON.stringify(devices.value)).filter(obj => obj.deviceType === "Relay");

    const setPowerHours = async () => {
        const floatCheckArr = JSON.parse(JSON.stringify(Object.values(powerhour?.value)));
        if (floatCheckArr.some(obj => isNaN(obj))) {
            alert("All values must be integers")
        } else {
            try {
                const setHourRes = await axios.post(`${apiUrl}/setpowerhour`, {
                    data: {...powerhour?.value, today: todaySchedule},
                }, {
                    withCredentials: true
                });
                alert("Hours were set")
                togglePowerHour(false);
            } catch (e) {
                console.log(e)
                alert("Something went wrong when setting hours.")
            };
        };
    };

    const updateText = (e) => {
        const { name, value } = e.target;
        powerhour.set((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const splitPowerHours = () => {
        const firstHalf = powerHourDevices.filter((obj, index) => {
            if (index > powerHourDevices.length / 2 - 1) {
                return false
            }
            return true;
        });
        const secondHalf = powerHourDevices.filter((obj, index) => {
            if (index > powerHourDevices.length / 2 - 1) {
                return true
            }
            return false;
        });
        const firstHalfForms = firstHalf.map((obj, index) =>

            <div className={window.innerWidth <= 768 ? 'mt-3' : " mt-2"}>
                <Col>{obj.displayName}: </Col>
                <Col>
                    <Form.Control
                        onChange={updateText}
                        className="powerHourInput"
                        type="text"
                        placeholder={`Enter powerhour for ${obj.displayName}`}
                        name={`device-${obj.deviceName}`}
                        value={powerhour.value ? powerhour?.value[`device-${obj.deviceName}`] : null}
                    /></Col>
            </div>
            );

        const secondHalfForms = secondHalf.map((obj, index) =>
            <div className={window.innerWidth <= 768 ? 'mt-3' : " mt-2"}>
                <Col>{obj.displayName}: </Col>
                <Col>
                    <Form.Control
                        onChange={updateText}
                        className="powerHourInput"
                        type="text"
                        placeholder={`Enter powerhour for ${obj.displayName}`}
                        name={`device-${obj.deviceName}`}
                        value={powerhour.value ? powerhour?.value[`device-${obj.deviceName}`] : null}
                    /></Col>
            </div>)
        return [firstHalfForms, secondHalfForms];
    };

    return (
        <Container className="container-fluid d-flex justify-content-center align-items-center">
            <Col xl={5} xs={11} className="powerHourWindow p-4 pt-5">
                <i onClick={() => togglePowerHour(false)} className="fa fa-times"></i>
                <Form>
                    <Row className="justify-content-center">
                        <Col lg={6} md={6}>
                            {splitPowerHours()[0]}
                        </Col>
                        <Col lg={6}  md={6}>

                        {splitPowerHours()[1]}
                        </Col>
                        </Row>
                        <Container className="m-0 p-0 d-flex mt-4" style={{whiteSpace: "nowrap"}}>
                            <Form.Check onChange={() => setTodayScheduele(true)} />
                            &nbsp;<p>Set this scheduele for today</p>
                        </Container>
                </Form>
                <Container className="container-fluid d-flex justify-content-center mt-5">
                    <Button onClick={() => setPowerHours()}>Set hours</Button>
                </Container>
            </Col>
        </Container>
    )
};