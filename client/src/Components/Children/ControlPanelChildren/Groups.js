import React from "react";
import { Container, Row, Col } from "react-bootstrap";

export default ({ initData }) => {
    const { showPopUp, groups } = initData;

    return (
        <Container className="p-0 m-0">
            <Row xl={3} className="p-2">
                <h5
                    style={{ cursor: 'pointer' }}
                    className="mt-4"
                    onClick={() => showPopUp("add-group")}
                >
                    <i className="fa fa-plus"></i>&nbsp;&nbsp;Add group
                </h5>
            </Row>

            {/* Mobile View */}
            <Container className="d-md-none d-block">
                {Object.entries(groups).map(([groupName, members]) => (
                    <Container
                        key={groupName} // Unique key for each group
                        className="py-3 mt-3 text-center align-items-center"
                        style={{ color: "white", borderTop: "1px solid white" }}
                    >
                        <Row className="d-flex justify-content-between">
                            <Col className="text-start p-0">
                            <div style={{fontSize: "18px"}}><b>{groupName}</b></div>
                            </Col>
                            <Col className="text-end">
                                <i className="fa fa-pencil-square-o" style={{ cursor: "pointer" }} onClick={() => showPopUp("change-group", groupName)}></i>
                            </Col>
                        </Row>
                        <Row className="mt-3 p-3" style={{border: "2px solid rgb(0, 97, 188)"}}>
                            <Row className="d-flex justify-content-center"><b>Members</b></Row>
                            <Col className="text-center p-0 mt-3">
                                {members.filter((_, i) => i % 2 === 0).map(member => (
                                    <p key={`${groupName}-${member}`} className="m-1">{member}</p>
                                ))}
                            </Col>
                            <Col className="text-center mt-3">
                                {members.filter((_, i) => i % 2 !== 0).map(member => (
                                    <p key={`${groupName}-${member}-alt`} className="m-1">{member}</p>
                                ))}
                            </Col>
                        </Row>
                    </Container>
                ))}
            </Container>

            {/* Desktop View */}
            <Container fluid className="mt-4 d-md-block d-none">
                <Row className="py-2 text-white text-center">
                    <Col xs={3}><b>Group Name</b></Col>
                    <Col xs={3}><b>Members</b></Col>
                </Row>

                {Object.entries(groups).map(([groupName, members]) => (
                    <Row
                        key={groupName} // Unique key for each group
                        className="py-3 mt-3 border bg-light text-center align-items-center"
                        style={{ color: "black", border: "1px solid black", boxShadow: "5px 5px 5px", borderRadius: "5px" }}
                    >
                        <Col xs={3}>{groupName}</Col>
                        <Col>
                            {members.filter((_, i) => i % 2 === 0).map(member => (
                                <p key={`${groupName}-${member}`} className="m-1">{member}</p>
                            ))}
                        </Col>
                        <Col>
                            {members.filter((_, i) => i % 2 !== 0).map(member => (
                                <p key={`${groupName}-${member}-alt`} className="m-1">{member}</p>
                            ))}
                        </Col>
                        <Col>
                            <i className="fa fa-pencil-square-o" style={{ cursor: "pointer" }} onClick={() => showPopUp("change-group", groupName)}></i>
                        </Col>
                    </Row>
                ))}
            </Container>
        </Container>
    );
};
