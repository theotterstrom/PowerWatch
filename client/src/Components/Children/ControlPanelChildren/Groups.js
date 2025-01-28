import React from "react";
import { Container, Row, Col, } from "react-bootstrap";

export default ({ initData }) => {
    const {
        showPopUp,
        groups
    } = initData;
    return (<>
        <h4>Device Groups</h4>
        <Container>
            <Row>
                <Col xl={3}>
                    <h5
                        style={{ cursor: 'pointer' }}
                        className="mt-4"
                        onClick={() => showPopUp("add-group")}
                    >
                        <i className="fa fa-plus"></i>&nbsp;&nbsp;Add group
                    </h5>
                </Col>
                <Col xl={4}>
                    <h5
                        style={{ cursor: 'pointer' }}
                        className="mt-xl-4 mt-3"
                        onClick={() => showPopUp("change-group")}
                    >
                        <i className="fa fa-pencil-square-o"></i>&nbsp;&nbsp;Change group
                    </h5>
                </Col>
                <Col xl={3}>
                    <h5
                        style={{ cursor: 'pointer' }}
                        className="mt-xl-4 mt-3"
                        onClick={() => showPopUp("remove-group")}
                    >
                        <i className="fa-solid fa-xmark"></i>&nbsp;&nbsp;Remove group
                    </h5>
                </Col>
            </Row>
            
                {Object.entries(groups).map(([groupName, members], index) =>
                    window.innerWidth <= 768 ? <>
                      <Col key={index} xs={12} style={{ border: "1px solid white", borderRadius: "5px" }} className="p-3 pt-2 mt-4">
                        <div className="mb-3"><b>{groupName}</b></div>
                        {members.map((member, index) => <p className="p-0 m-0" key={index}>&#183;{member}</p>)}
                    </Col>
                    </> : <>
                    <Row className="p-3">
                    <Col key={index} xl={6} style={{ border: "1px solid white", borderRadius: "5px" }} className="p-3 pt-2">
                        <div className="mb-3"><b>{groupName}</b></div>
                        {members.map((member, index) => <p className="p-0 m-0" key={index}>&#183;{member}</p>)}
                    </Col>
                    </Row>
                    </>
          
                )}
            
        </Container>
    </>)
};