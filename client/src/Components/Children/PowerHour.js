import axios from "axios";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
export default ({ initData }) => {
    const { powerhour, togglePowerHour, devices } = initData;
    const powerHourDevices = JSON.parse(JSON.stringify(devices.value)).filter(obj => obj.deviceType === "Relay");

    const setPowerHours = async () => {
        const floatCheckArr = JSON.parse(JSON.stringify(Object.values(powerhour.value)));
        floatCheckArr.pop();

        if (floatCheckArr.some(obj => isNaN(obj))) {
            alert("All values must be integers or decimals")
        } else {
            try {
                const setHourRes = await axios.post(`http://194.180.176.212:3001/setpowerhour`, {
                    data: powerhour.value,
                });
                alert("Hours were set")
                togglePowerHour(false);
                powerhour.value.secret = '';
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

    console.log(powerhour.value)
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
                        name={obj.deviceName}
                        value={powerhour.value[`device-${obj.deviceName}`]}
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
                        name={obj.deviceName}
                        value={powerhour.value[`device-${obj.deviceName}`]}
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
                        <Col lg={6}>
                            {splitPowerHours()[0]}
                        </Col>
                        <Col lg={6}>

                        {splitPowerHours()[1]}
                        </Col>
                    </Row>
                </Form>
                <Container className="container-fluid d-flex justify-content-center mt-5">
                    <Button onClick={() => setPowerHours()}>Set hours</Button>
                </Container>
            </Col>
        </Container>
    )
};