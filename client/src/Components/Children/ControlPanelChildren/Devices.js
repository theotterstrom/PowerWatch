import { Container, Navbar, Nav, NavDropdown, Row, Col, Tab, Tabs } from "react-bootstrap";
export default ({ initData }) => {
    const {
        showPopUp,
        devices
    } = initData;
    return (
        <Container>
            <h4>Devices</h4>
            <Row className="mb-4 mb-xl-0">
                <Col xl={3}>
                    <h5
                        style={{ cursor: 'pointer' }}
                        className="mt-4"
                        onClick={() => showPopUp("add-device")}
                    >
                        <i className="fa fa-plus"></i>&nbsp;&nbsp;Add device
                    </h5>
                </Col>
                <Col xl={4}>
                    <h5
                        style={{ cursor: 'pointer' }}
                        className="mt-xl-4 mt-3"
                        onClick={() => showPopUp("change-device")}
                    >
                        <i className="fa fa-pencil-square-o"></i>&nbsp;&nbsp;Change device
                    </h5>
                </Col>
                <Col xl={3}>
                    <h5
                        style={{ cursor: 'pointer' }}
                        className="mt-xl-4 mt-3"
                        onClick={() => showPopUp("remove-device")}
                    >
                        <i className="fa-solid fa-xmark"></i>&nbsp;&nbsp;Remove device
                    </h5>
                </Col>
            </Row>
            {window.innerWidth <= 768 ? <></> : <>
                <Row className="mt-4 mb-2">
                    <Col><b>Device name</b></Col>
                    <Col><b>Display name</b></Col>
                    <Col><b>Id</b></Col>
                    <Col><b>Wattformat</b></Col>
                    <Col><b>Device type</b></Col>
                </Row>
            </>}
            {devices.map((obj, index) => (
                window.innerWidth <= 768 ? <>
                    <Col key={index} xs={12} style={{ border: "1px solid white", borderRadius: "5px" }} className="p-3 pt-2">
                        <div className="mb-3"><b>{obj.displayName}</b></div>
                        <Row>
                            <Col xs={6}>
                                <p className="m-1 p-0">Device Name:</p>
                                <p className="m-1 p-0">Id:</p>
                                <p className="m-1 p-0">Wattformat:</p>
                                <p className="m-1 p-0">Device Type:</p>
                            </Col>
                            <Col xs={6}>
                                <p className="m-1 p-0">{obj.deviceName}</p>
                                <p className="m-1 p-0">{obj.id}</p>
                                <p className="m-1 p-0">{obj.wattFormat || "None"}</p>
                                <p className="m-1 p-0">{obj.deviceType}</p>
                            </Col>
                        </Row>
                    </Col>
                </> : <>
                    <Row
                        key={obj.id}
                        className="pt-2 pb-2"
                        style={{
                            borderTop: '1px solid white',
                            borderLeft: '1px solid white',
                            borderRight: '1px solid white',
                            borderBottom:
                                index === devices.length - 1 ? '1px solid white' : 0,
                        }}
                    >
                        <Col>{obj.deviceName}</Col>
                        <Col>{obj.displayName}</Col>
                        <Col>{obj.id}</Col>
                        <Col>{obj.wattFormat}</Col>
                        <Col>{obj.deviceType}</Col>
                    </Row>
                </>
            ))}
        </Container>
    )
};