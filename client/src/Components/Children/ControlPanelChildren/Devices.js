import { Container, Row, Col } from "react-bootstrap";
export default ({ initData }) => {
    const {
        showPopUp,
        devices
    } = initData;
    return (
        <Container className="p-0 m-0">
            <Row  xl={3} className="p-2">
                <h5
                    style={{ cursor: 'pointer' }}
                    className="mt-4"
                    onClick={() => showPopUp("add-device")}
                >
                    <i className="fa fa-plus"></i>&nbsp;&nbsp;Add device
                </h5>
            </Row>
            {/* Mobile */}
            <Container className="d-md-none d-block">
                {devices.map((device, index) => (
                    <>
                        <Container key={index} className="py-3 mt-3 text-center align-items-center" style={{ color: "white", borderBottom: index === devices.length - 1 ? 0 : "1px solid white", borderTop: index === 0 ? "1px solid white" : 0 }}>
                            <Row className="d-flex justify-content-between">
                                <Col className="text-start p-0">
                                    <div style={{fontSize: "18px"}}><b>{device.displayName}</b></div>
                                </Col>
                                <Col className="text-end">
                                    <i className="fa fa-pencil-square-o" style={{ cursor: "pointer" }} onClick={() => showPopUp("change-device", device.id)}></i>
                                </Col>
                            </Row>
                            <Row className="mt-3">
                                <Col xs={7}>
                                    <Row>Device name:</Row>
                                    <Row>Id:</Row>
                                    <Row>Wattformat:</Row>
                                    <Row>Device type:</Row>
                                </Col>
                                <Col>
                                    <Row>{device.deviceName}</Row>
                                    <Row>{device.id}</Row>
                                    <Row>{device.wattFormat || <br></br>}</Row>
                                    <Row>{device.deviceType}</Row>
                                </Col>
                            </Row>
                        </Container>
                    </>
                ))}
            </Container>
            <Container fluid className="mt-4 d-md-block d-none">
                <Row className="py-2 text-white text-center">
                    <Col xs={2}><b>Device name</b></Col>
                    <Col xs={3}><b>Display name</b></Col>
                    <Col xs={2}><b>Id</b></Col>
                    <Col xs={2}><b>Wattformat</b></Col>
                    <Col xs={2}><b>Device type</b></Col>

                </Row>
                {devices.map((device, index) => (
                    <Row key={index} className="py-3 mt-3 border bg-light text-center align-items-center" style={{ color: "black", border: "1px solid black", boxShadow: "5px 5px 5px", borderRadius: "5px" }}>
                        <Col xs={2}>{device.deviceName}</Col>
                        <Col xs={3}>{device.displayName}</Col>
                        <Col xs={2}>{device.id}</Col>
                        <Col xs={2}>{device.wattFormat}</Col>
                        <Col xs={2}>{device.deviceType}</Col>
                        <Col><i className="fa fa-pencil-square-o" style={{ cursor: "pointer" }} onClick={() => showPopUp("change-device", device.id)}></i></Col>
                    </Row>
                ))}
            </Container>
        </Container>
    );
};