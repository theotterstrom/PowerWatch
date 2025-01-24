import { Container, Row, Col } from "react-bootstrap";

export default ({ chartStates }) => {
    const { currentdate, datavalues } = chartStates;
    console.log(datavalues)
    return (
        <>
            <Col className="toolTipContainer text-center">
            {currentdate.value}
            <Container className="mt-2"></Container>
                {datavalues.value.map((data, index) => (
                    <Row key={index}>
                        <Col xl={9} lg={9} className="text-start">
                        <i className="fa fa-square" style={{fontSize: "8px", color: data.datasetColor}}></i>
                        &nbsp;
                        {data.datasetLabel}:
                        </Col>
                        <Col xl={2} lg={2} className="text-end">
                        {data.value}
                        </Col>
                    </Row>
                ))}
            </Col>
        </>
    );
}
