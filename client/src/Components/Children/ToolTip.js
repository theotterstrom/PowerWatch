import { Container, Row, Col } from "react-bootstrap";

export default ({ initData }) => {

    const { chartStates, page } = initData;
    const { currentdate, datavalues } = chartStates;

    const desktopToolTipStyle = page === "power" ? {
        width: "250px",
    } : {
        width: "350px",
    };
    const ipadToolTipStyle = page === "power" ? {
        width: "250px",
    } : {
        width: "400px",
    };
    const mobileToolTipStyle = page === "power" ? {
        width: "80vw",
        left: "10vw"
    } : {
        width: "90vw",
        left: "5vw"
    };

    const toolTipStyle = () => {
        if (window.innerWidth <= 768) {
            return mobileToolTipStyle;
        } else if (820 <= window.innerWidth && window.innerWidth <= 1024) {
            return ipadToolTipStyle;
        } else {
            return desktopToolTipStyle;
        };
    };

    const toolTipParentMargin = () => {
        if (window.innerWidth <= 768) {
            return page === "power" ? '90px' : '180px'
        } else if (820 <= window.innerWidth && window.innerWidth <= 1024) {
            return page === "power" ? '110px' : '180px'
        } else {
            return page === "power" ? '50px' : '70px'
        };
    };

    return (
        <>
            <Container className="toolTipParent" style={{ marginTop: toolTipParentMargin() }}>
                <Col className="toolTipContainer text-center" style={toolTipStyle()}>
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
                            <Col xl={2} lg={2} md={4} sm={6} xs={4} className="text-start">
                                {data.value}
                            </Col>
                        </Row>
                    ))}
                </Col>
            </Container>
        </>
    );
};
