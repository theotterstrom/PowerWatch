import { Container, Row, Col } from "react-bootstrap";

export default ({ initData }) => {

    const { chartStates, page } = initData;
    const { currentdate, datavalues } = chartStates;

    const toolTipStyle = page === "power" ? {
        width: "250px",
        bottom: "220px"
    } : {
        width: "350px",
        bottom: "120px"
    };
    const ipadToolTipStyle = page === "power" ? {
        width: "250px",
        bottom: "600px"
    } : {
        width: "400px",
        bottom: "520px"
    };
    const mobileToolTipStyle = page === "power" ? {
        width: "250px",
        bottom: "150px",
        left: "17.5vw"
    } : {
        width: "340px",
        bottom: "-20px",
        left: "5vw"
    };
    let ultimateStyle;
    if(window.innerWidth <= 768){
        ultimateStyle = mobileToolTipStyle;
    } else if (820 <= window.innerWidth && window.innerWidth <= 1024){
        ultimateStyle = ipadToolTipStyle;
    } else {
        ultimateStyle = toolTipStyle;
    };

    

    return (
        <>
            <Col className="toolTipContainer text-center" style={ultimateStyle}>
                {currentdate.value}
                <Container className="mt-2"></Container>
                {datavalues.value.map((data, index) => (
                    <Row key={index}>
                        <Col xl={8} lg={8} md={8} sm={6} xs={8} className="text-start">
                            <i
                                className="fa fa-square"
                                style={{ fontSize: "8px", color: data.datasetColor }}
                            ></i>
                            &nbsp;
                            {data.datasetLabel}:
                        </Col>
                        <Col xl={2} lg={2} md={4} sm={6} xs={4}  className="text-start">
                            {data.value}
                        </Col>
                    </Row>
                ))}
            </Col>
        </>
    );
};
