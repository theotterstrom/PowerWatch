import { Container, Navbar, Nav, NavDropdown, Col, Button, Row } from "react-bootstrap";

export default ({ initData }) => {
    const { logout, togglelogout } = initData;
    const handleLogout = async (event) => {
        event.preventDefault();
        const response = await MakeRequest({}, 'logout', 'post');
        window.location.reload();
    };

    return (<>
        <Container className="container-fluid d-flex justify-content-center align-items-center">
            <Col xl={8} xs={11} className="logOutWindow p-5 text-center">
                <i onClick={() => togglelogout(false)} className="fa fa-times"></i>
                Are you sure you want to log out?
                <Container className="container-fluid d-flex justify-content-around mt-5">
                    <Button onClick={(e) => handleLogout(e)}>Log out</Button>
                    <Button onClick={() => togglelogout(false)}>Cancel</Button>
                </Container>
            </Col>
        </Container>
    </>)
};