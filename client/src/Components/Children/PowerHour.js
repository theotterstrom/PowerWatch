import axios from "axios";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
export default ({ initData }) => {
    const { powerhour, togglePowerHour } = initData;
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
    return (
        <Container className="container-fluid d-flex justify-content-center align-items-center">
            <Col xl={8} xs={11} className="powerHourWindow p-5">
                <i onClick={() => togglePowerHour(false)} className="fa fa-times"></i>
                <Form>
                    <Row className="justify-content-center">
                        <Col lg={6}>
                            <Row>
                                <Col>NilleboAT: </Col>
                                <Col>
                                    <Form.Control
                                        onChange={updateText}
                                        className="powerHourInput"
                                        type="text"
                                        placeholder="Enter text for field 1"
                                        name="NilleATtim"
                                        value={powerhour.value.NilleATtim}
                                    /></Col>
                            </Row>
                            <Row className="mt-2">
                                <Col>NilleboVP: </Col>
                                <Col>
                                    <Form.Control
                                        onChange={updateText}
                                        className="powerHourInput"
                                        type="text"
                                        placeholder="Enter text for field 1"
                                        name="NilleVPtim"
                                        value={powerhour.value.NilleVPtim}
                                    /></Col>
                            </Row>
                            <Row className="mt-2">
                                <Col>NilleboVV: </Col>
                                <Col>
                                    <Form.Control
                                        onChange={updateText}
                                        className="powerHourInput"
                                        type="text"
                                        placeholder="Enter text for field 1"
                                        name="NilleVVtim"
                                        value={powerhour.value.NilleVVtim}
                                    /></Col>
                            </Row>
                            <Row className="mt-2">
                                <Col>LoveboAT: </Col>
                                <Col>
                                    <Form.Control
                                        onChange={updateText}
                                        className="powerHourInput"
                                        type="text"
                                        placeholder="Enter text for field 1"
                                        name="LoveATtim"
                                        value={powerhour.value.LoveATtim}
                                    /></Col>
                            </Row>
                            <Row className="mt-2">
                                <Col>LoveboVV: </Col>
                                <Col>
                                    <Form.Control
                                        onChange={updateText}
                                        className="powerHourInput"
                                        type="text"
                                        placeholder="Enter text for field 1"
                                        name="LoveVVtim"
                                        value={powerhour.value.LoveVVtim}
                                    /></Col>
                            </Row>
                            <Row className="mt-2">
                                <Col>Ottebo: </Col>
                                <Col>
                                    <Form.Control
                                        onChange={updateText}
                                        className="powerHourInput"
                                        type="text"
                                        placeholder="Enter text for field 1"
                                        name="Ottebo"
                                        value={powerhour.value.Ottebo}
                                    /></Col>
                            </Row>
                            <Row className="mt-2">
                                <Col>Garage: </Col>
                                <Col>
                                    <Form.Control
                                        onChange={updateText}
                                        className="powerHourInput"
                                        type="text"
                                        placeholder="Enter text for field 1"
                                        name="Garage"
                                        value={powerhour.value.Garage}
                                    /></Col>
                            </Row>
                            <Row className="mt-2">
                                <Col>PoolStart: </Col>
                                <Col>
                                    <Form.Control
                                        onChange={updateText}
                                        className="powerHourInput"
                                        type="text"
                                        placeholder="Enter text for field 1"
                                        name="PoolStart"
                                        value={powerhour.value.PoolStart}
                                    /></Col>
                            </Row>
                        </Col>
                        <Col lg={6}>

                            <Row className="mt-2">
                                <Col>PoolTid: </Col>
                                <Col>
                                    <Form.Control
                                        onChange={updateText}
                                        className="powerHourInput"
                                        type="text"
                                        placeholder="Enter text for field 1"
                                        name="PoolTid"
                                        value={powerhour.value.PoolTid}
                                    /></Col>
                            </Row>
                            <Row className="mt-2">
                                <Col>Maxpris: </Col>
                                <Col>
                                    <Form.Control
                                        onChange={updateText}
                                        className="powerHourInput"
                                        type="text"
                                        placeholder="Enter text for field 1"
                                        name="Maxpris"
                                        value={powerhour.value.Maxpris}
                                    /></Col>
                            </Row>
                            <Row className="mt-2">
                                <Col>Hoglast: </Col>
                                <Col>
                                    <Form.Control
                                        onChange={updateText}
                                        className="powerHourInput"
                                        type="text"
                                        placeholder="Enter text for field 1"
                                        name="Hoglast"
                                        value={powerhour.value.Hoglast}
                                    /></Col>
                            </Row>
                            <Row className="mt-2">
                                <Col>Favgift: </Col>
                                <Col>
                                    <Form.Control
                                        onChange={updateText}
                                        className="powerHourInput"
                                        type="text"
                                        placeholder="Enter text for field 1"
                                        name="Favgift"
                                        value={powerhour.value.Favgift}
                                    /></Col>
                            </Row>
                            <Row className="mt-2">
                                <Col>Laglast: </Col>
                                <Col>
                                    <Form.Control
                                        onChange={updateText}
                                        className="powerHourInput"
                                        type="text"
                                        placeholder="Enter text for field 1"
                                        name="Laglast"
                                        value={powerhour.value.Laglast}
                                    /></Col>
                            </Row>
                            <Row className="mt-2">
                                <Col>Skatt: </Col>
                                <Col>
                                    <Form.Control
                                        onChange={updateText}
                                        className="powerHourInput"
                                        type="text"
                                        placeholder="Enter text for field 1"
                                        name="Skatt"
                                        value={powerhour.value.Skatt}
                                    /></Col>
                            </Row>
                            <Row className="mt-2">
                                <Col>Password: </Col>
                                <Col>
                                    <Form.Control
                                        onChange={updateText}
                                        className="powerHourInput"
                                        type="password"
                                        name="secret"
                                        value={powerhour.value.secret}
                                    /></Col>
                            </Row>
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